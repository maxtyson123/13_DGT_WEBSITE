import {NextApiRequest, NextApiResponse} from "next";
import {checkPermissions, getUserPermissions, RongoaUser, UserPermissions} from "@/lib/users";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {jwtVerify, SignJWT} from "jose";
import {getFromCache, saveToCache} from "@/lib/cache";

export async function checkApiPermissions(request: NextApiRequest, response: NextApiResponse, session: any, client: any, makeQuery: any, permission: string) {

    let permissions : UserPermissions | null = null

    let api_key_data = null

    // Check if there is an API key
    let {api_key} = request.query;
    if(api_key){

        console.log("API key: " + api_key)

        // Make the query
        const query = `SELECT api_key_permissions, api_key_logs FROM api_key WHERE api_key_value = '${api_key}'`
        const result = await makeQuery(query, client)

        // Check if the API key exists
        if(result.length == 0) return false

        // Get the permissions
        permissions = JSON.parse(result[0].api_key_permissions)

        // Get the api key data
        api_key_data = result[0]

    }else{

            // Get the permissions of the user
            permissions = getUserPermissions(session?.user as RongoaUser)

    }

    let permissionToCheck = permission;
    const authorization = request.headers.authorization
    let token: any = authorization?.split(" ")[1]
    token = await verifyToken(token as string)

    // Replace access with the correct internal/public
    if(!token){
        permissionToCheck = permissionToCheck.replace("access", "publicAccess")
    }else{

        token = token.data
        let requestURL = request.url

        // Remove any query parameters
        token = token.split("?")[0]
        requestURL = request.url?.split("?")[0]

        // Remove the trailing slash
        token = token.replace(/\/$/, "")
        requestURL = requestURL?.replace(/\/$/, "")

        // Check if the token is the same as the request url
        if(token != requestURL){
            console.log("Invalid token: " + token + " != " + requestURL)
            return false
        }
        permissionToCheck = permissionToCheck.replace("access", "internalAccess")
    }

    // Check the permissions
    if(permissions == null)
        return false

    // Get the permissions of the user
    const isAllowed = checkPermissions(permissions, permissionToCheck)

    // If the api key was used then store the action in the log
    if(api_key && api_key_data) {

        // Parse the log
        let log = JSON.parse(api_key_data.api_key_logs)

        // Check if the log is at its limit
        if(log.length >= 100 && !checkPermissions(permissions, "data:logs:unlimitedApiLogEntries")){

            // Remove the item at 1 because don't want to remove the first item as its the creation data
            log.splice(1, 1)

            // Overwrite the new item to state that the log is at its limit
            log[1] = {time: new Date().toISOString(), action: "Previous log entries have been removed as the log is at its limit of 100 entries"}

        }

        // Add the action to the log
        log.push({time: new Date().toISOString(), action: "Attempt to access " + permissionToCheck + " on " + request.url?.replace(`api_key=${api_key}`, '') + ": " + (isAllowed ? "Allowed" : "Denied")})

        // Update the log
        const query = `UPDATE api_key SET api_key_logs = '${JSON.stringify(log)}', api_key_last_used = NOW() WHERE api_key_value = '${api_key}'`
        await makeQuery(query, client)
    }

    return isAllowed

}

export function getJwtSecretKey() {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT Secret key is not matched");
    }
    return new TextEncoder().encode(secret);
}

// Function to generate a token
export const createToken =  async (data: string) => {
    return await new SignJWT({
        data: data,
    })
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("30s")
        .sign(getJwtSecretKey())

};

const verifyToken =  async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey());
        return payload;
    } catch (error) {
        return null;
    }
};

export async function makeRequestWithToken (
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
): Promise<AxiosResponse>{
    // Create a token based on your authentication logic
    const token = await createToken(url);
    const baseURL = '/';

    // Configure Axios request
    const axiosConfig: AxiosRequestConfig = {
        method,
        url,
        baseURL,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Adjust content type as needed
        },
        data,
    };

    try {
        // Make the request
        const response = await axios(axiosConfig);
        return response;
    } catch (error : any) {
        // Handle errors
        console.error('Request failed:', error.message);

        let data = {data: {error: error.message}}
        return data as any;
    }
}


export async function makeCachedRequest(key: string, url: string){

    let cache = getFromCache(key)
    if(cache){
        return cache
    }
    cache = await makeRequestWithToken("get",url)
    if(!cache.data.error){

        saveToCache(key, cache.data.data)
    }
    return cache.data.data
}