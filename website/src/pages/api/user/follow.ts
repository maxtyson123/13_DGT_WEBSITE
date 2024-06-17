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
        const {operation, keyName, permissions} = request.query;
        if (!operation) {
            return response.status(400).json({error: 'No operation specified'});
        }

        switch (operation) {

            case "followingCount":

                if(!await checkApiPermissions(request, response, session, client, makeQuery, "api:user:follow:followingCount")) return response.status(401).json({error: "Not Authorized"})
                query = `SELECT COUNT(*) FROM follows WHERE ${tables.follower_id} = ${id ? id : userId}`
                break;

            case "followersCount":
                if(!await checkApiPermissions(request, response, session, client, makeQuery, "api:user:follow:followersCount")) return response.status(401).json({error: "Not Authorized"})
                query = `SELECT COUNT(*) FROM follows WHERE ${tables.following_id} = ${id ? id : userId}`
                break;

            case "follow":

                if(!await checkApiPermissions(request, response, session, client, makeQuery, "api:user:follow:follow")) return response.status(401).json({error: "Not Authorized"})

                // If there is no id then return an error
                if (!id) {
                    return response.status(400).json({error: 'No id specified'});
                }

                query = `INSERT INTO follows (${tables.follower_id}, ${tables.following_id}) VALUES (${userId}, ${id})`
                break;

            case "unfollow":
                if(!await checkApiPermissions(request, response, session, client, makeQuery, "api:user:follow:unfollow")) return response.status(401).json({error: "Not Authorized"})

                // If there is no id then return an error
                if (!id) {
                    return response.status(400).json({error: 'No id specified'});
                }

                query = `DELETE FROM follows WHERE ${tables.follower_id} = ${userId} AND ${tables.following_id} = ${id}`
                break;

            case "checkFollowing":

                if(!await checkApiPermissions(request, response, session, client, makeQuery, "api:user:follow:checkFollowing")) return response.status(401).json({error: "Not Authorized"})

                // If there is no id then return an error
                if (!id) {
                    return response.status(400).json({error: 'No id specified'});
                }

                query = `SELECT * FROM follows WHERE ${tables.follower_id} = ${userId} AND ${tables.following_id} = ${id}`
                break;

            case "listFollowing":

                if(!await checkApiPermissions(request, response, session, client, makeQuery, "api:user:follow:list")) return response.status(401).json({error: "Not Authorized"})

                query = `SELECT ${tables.following_id} FROM follows WHERE ${tables.follower_id} = ${userId}`
                break;

            case "listFollowers":

                    if(!await checkApiPermissions(request, response, session, client, makeQuery, "api:user:follow:list")) return response.status(401).json({error: "Not Authorized"})

                    query = `SELECT ${tables.follower_id} FROM follows WHERE ${tables.following_id} = ${userId}`
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
