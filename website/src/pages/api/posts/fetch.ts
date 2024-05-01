import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {RongoaUser} from "@/lib/users";
import {checkApiPermissions} from "@/lib/api_tools";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {


    // Get the client
    const client = await getClient()

    // Get the tables
    const tables = getTables();

    // Get the id
    const { id, operation, min } = request.query;

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:data:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    try {


        // Check if there is no user id
        if(!id) {
            return response.status(400).json({ error: 'No id provided'});
        }

        // Check if there is a operation
        if(!operation) {
            return response.status(400).json({ error: 'No operation provided'});
        }

        let query = '';

        switch (operation) {

            case "list":
                if (min) {
                    query = `SELECT id, ${tables.post_image} FROM posts WHERE ${tables.post_user_id} =`;
                } else {
                    query = `SELECT * FROM posts WHERE ${tables.post_user_id} =`;
                }

                query += ` ${id}`;

                break;

            case "data":
                query = `SELECT * FROM users WHERE id = ${id}`;
                break;

            default:
                return response.status(400).json({error: 'Invalid operation'});

        }

        const user = await makeQuery(query, client)

        if(user.length == 0) {
            return response.status(400).json({ error: 'No Data Found'});
        }

        // Return the user
        return response.status(200).json({ data: user[0], raw: user });


    } catch (error) {

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}