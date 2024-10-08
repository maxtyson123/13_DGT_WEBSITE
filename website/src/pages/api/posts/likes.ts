import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import {getStrings, RongoaUser} from "@/lib/users";
import { Logger } from 'next-axiom';
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the client
    const client = await getClient()

    // Get the logger
    const logger = new Logger()

    // Get the tables
    const tables = getTables();

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    let permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:follow:access")
    if (!permission) return response.status(401).json({error: "Not Authorized"})

    let query = ''

    const {id, publicUserID} = request.query;

    try {

        // Get the session
        const session = await getServerSession(request, response, authOptions)

        // If there is no session then return an error
        if (!session || !session.user) {
            return response.status(401).json({error: 'User not logged in'});
        }

        // Get the user details
        const user = session.user as RongoaUser;
        const userId = user.database.id;

        // Get the operation
        const {operation, id} = request.query;
        if (!operation) {
            return response.status(400).json({error: 'No operation specified'});
        }

        switch (operation) {

            case "likes":
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:likes:likes")
                if (!permission) return response.status(401).json({error: "Not Authorized"})
                query = `SELECT COUNT(*) FROM likes WHERE ${tables.like_post_id} = ${id}`;
                break;

            case "like":
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:likes:like")
                if (!permission) return response.status(401).json({error: "Not Authorized"})
                query = `INSERT INTO likes (${tables.like_user_id}, ${tables.like_post_id}) VALUES (${userId}, ${id})`;
                break;

            case "unlike":
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:likes:unlike")
                if (!permission) return response.status(401).json({error: "Not Authorized"})
                query = `DELETE FROM likes WHERE ${tables.like_user_id} = ${userId} AND ${tables.like_post_id} = ${id}`;
                break;

            case "check":
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:likes:check")
                if (!permission) return response.status(401).json({error: "Not Authorized"})
                query = `SELECT COUNT(*) FROM likes WHERE ${tables.like_user_id} = ${userId} AND ${tables.like_post_id} = ${id}`;
                break;

            case "list":
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:likes:list")
                if (!permission) return response.status(401).json({error: "Not Authorized"})
                query = `SELECT * FROM likes WHERE ${tables.like_user_id} = ${id ? id : userId}`;
                break;

            default:
                return response.status(400).json({error: 'Invalid operation'});

        }

        const follow = await makeQuery(query, client)
        return response.status(200).json({data: follow});

        // Execute the query


    } catch (e : any) {
        logger.error(e)
        return response.status(500).json({error: 'Internal Server Error'})
    }
}
