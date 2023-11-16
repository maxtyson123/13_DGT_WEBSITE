import {NextApiRequest, NextApiResponse} from "next";
import {checkPermissions, getUserPermissions, RongoaUser, UserPermissions} from "@/lib/users";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {jwtVerify, SignJWT} from "jose";


export async function checkApiPermissions(request: NextApiRequest, response: NextApiResponse, session: any, client: any, permission: string) {

    let permissions : UserPermissions | null = null

    // Check if there is an API key
    let {api_key} = request.query;
    if(api_key){

        // TODO: Get the api key from the database and check its permissions

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
    console.log(permissionToCheck + ": " + isAllowed)
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
        throw error;
    }
};