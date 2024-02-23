import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {RongoaUser} from "@/lib/users";
import {checkApiPermissions} from "@/lib/api_tools";
import {Logger} from "next-axiom";

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
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:delete:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    try {

        // Get the session
        const session = await getServerSession(request, response, authOptions)

        // If there is no session then return an error
        if(!session || !session.user) {
            return response.status(401).json({ error: 'User not logged in'});
        }

        // Get the user details
        const user = session.user as RongoaUser;
        const user_email = user.database.user_email;
        const user_name = user.database.user_name;

        // Remove the user
        let query = `DELETE FROM users WHERE ${tables.user_email} = '${user_email}' AND ${tables.user_name} = '${user_name}'`;
        const removed = makeQuery(query, client)

        // Get the logger
        const logger = new Logger()
        logger.warn(`User ${user_name} deleted their account`)

        // Return the user
        return response.status(200).json({data : removed});


    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}