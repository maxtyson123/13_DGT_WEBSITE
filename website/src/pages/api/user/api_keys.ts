import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the client
    const client = await getClient()

    // Get the tables
    const tables = getTables();

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    let permission = await checkApiPermissions(request, response, session, client, "api:user:api_keys:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    try {

        // Get the session
        const session = await getServerSession(request, response, authOptions)

        // If there is no session then return an error
        if(!session || !session.user) {
            return response.status(401).json({ error: 'User not logged in'});
        }

        // Get the user details
        const user_email = session.user.email;
        const user_name = session.user.name;

        // Get the operation
        const { operation } = request.query;
        if(!operation) {
            return response.status(400).json({ error: 'No operation specified'});
        }

        switch (operation) {

            case "new":
                permission = await checkApiPermissions(request, response, session, client, "api:user:api_keys:add")
                if(!permission) return response.status(401).json({error: "Not Authorized"})
                break

            case "remove":
                permission = await checkApiPermissions(request, response, session, client, "api:user:api_keys:remove")
                if(!permission) return response.status(401).json({error: "Not Authorized"})
                break

            case "edit":
                permission = await checkApiPermissions(request, response, session, client, "api:user:api_keys:edit")
                if(!permission) return response.status(401).json({error: "Not Authorized"})
                break

        }



    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}