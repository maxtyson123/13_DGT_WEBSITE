import {NextApiRequest, NextApiResponse} from "next";
import {getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {USE_POSTGRES} from "@/lib/constants";

/**
 * Get the origin of the request from the headers of a next api request
 *
 * @param {NextApiRequest} request - The request of the api cal, if there is no request, the origin will be localhost:3000
 *
 * @see {@link NextApiRequest}
 *
 * @returns {string} - The origin of the request
 */
export function GetOrigin(request: NextApiRequest){
    const LOCAL_HOST_ADDRESS = "localhost:3001";

    let host = request.headers?.host || LOCAL_HOST_ADDRESS;
    let protocol = /^localhost(:\d+)?$/.test(host) ? "http:" : "https:";

    // If server sits behind reverse proxy/load balancer, get the "actual" host ...
    if (
        request.headers["x-forwarded-host"] &&
        typeof request.headers["x-forwarded-host"] === "string"
    ) {
        host = request.headers["x-forwarded-host"];
    }

    // ... and protocol:
    if (
        request.headers["x-forwarded-proto"] &&
        typeof request.headers["x-forwarded-proto"] === "string"
    ) {
        protocol = `${request.headers["x-forwarded-proto"]}:`;
    }

    return protocol + "//" + host;
}

export async function CheckWhitelisted(request: NextApiRequest, response: NextApiResponse, client: any){

    let {api_key} = request.query;

    // Check if the user is allowed to upload
    let auth_query = ""

    const tables = getTables()
    const origin = GetOrigin(request);

    // If it is this site then allow user email to authenticate
    console.log("origin:" + origin)
    let api =  !(origin === process.env.NEXTAUTH_URL)

    // If we are not usin the API key then use the email
    if (!api) {
        console.log("Trying Email");

        // Get the email
        const session = await getServerSession(request, response, authOptions)

        // If there is a user session then get the email otherwise default to the API key
        if(session){
            if(session.user === undefined){
                return null;
            }
            const user_email = session.user.email;

            console.log(user_email);

            // Check if the email is allowed in the database
            auth_query = `SELECT * FROM auth WHERE ${tables.auth_entry} = '${user_email}' AND ${tables.auth_type} = 'email'`;
        }else{
            api = true;
        }

    }

    // If we are using the API key then use the API key
    if(api){
        console.log("Using API key");

        // If there is no API key then return an error
        if(!api_key) {
            return null;
        }

        // Check if the API key is allowed in the database
        auth_query = `SELECT * FROM auth WHERE ${tables.auth_entry} = '${api_key}' AND ${tables.auth_type} = 'api'`;
    }

    // Run the query
    const auth_result = await makeQuery(auth_query, client);

    // Check if the user is allowed to upload
    if(!auth_result) {
        return null;
    }else{
        if(USE_POSTGRES)
            return auth_result[0].permissions;      //TODO: UNTESTED
        else
            return auth_result[0].auth_permissions;
    }
}