import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';
import {MEMBER_USER_TYPE} from "@/lib/users";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the logger
    const logger = new Logger()

    // Get the client
    const client = await getClient()

    // Get the tables
    const tables = getTables();

    // Get the variables
    const {
        name,
        email
    } = request.query;


    // If there is a missing variable then return an error
    if(!name || !email)
        return response.status(400).json({ error: 'Missing variables, must have id, name and email', name, email });


    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:new:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    try {


        let query = `INSERT INTO users (${tables.user_email}, ${tables.user_name}, ${tables.user_type}, ${tables.user_last_login}, ${tables.user_image}, ${tables.user_restricted_access}) VALUES ('${email}', '${name}', '${MEMBER_USER_TYPE}', NOW(), 'undefined', 0)`;

        const user = await makeQuery(query, client)


        // Log the update
        logger.info(`User ${email} created`);

        // Return the user
        return response.status(200).json({ user: user[0] });


    } catch (error) {

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}