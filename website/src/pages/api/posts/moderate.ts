import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';
import {MEMBER_USER_TYPE, RongoaUser} from "@/lib/users";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the logger
    const logger = new Logger()

    // If the request is not a POST request, return an error
    if(request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed, please use POST' });
    }

    // Get the client
    const client =  await getClient()

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:admin:moderate:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})


    // Try uploading the data to the database
    try {
        let {
            operation,
            id,

        } = request.query;


        // Check if the data is being downloaded from the Postgres database
        const tables = getTables()
        let query = ""

        switch (operation) {
            case "list":


                // List all the posts that need to be moderated
                query = `SELECT * FROM posts WHERE ${tables.post_approved} = false;`;

                break;

            case "approve":

                // Approve the post
                query = `UPDATE posts SET ${tables.post_approved} = true WHERE ${tables.id} = ${id};`;

                break;

            case "deny":

                // Deny the post
                query = `DELETE FROM posts WHERE ${tables.id} = ${id};`;

                break;

            default:
                return response.status(400).json({error: "Invalid operation"});
        }

        // Run the query
        const data = await makeQuery(query, client)

        return response.status(200).json({message: "Success", data: data});

    } catch (error) {
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    } finally {

        if(USE_POSTGRES)
            await client.end();

    }
}

