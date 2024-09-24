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


    // Get the client
    const client =  await getClient()

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:plants:upload:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    // If there is no session then return an error
    if(!session || !session.user) {
        return response.status(401).json({ error: 'User not logged in'});
    }

    // Get the user details
    const user = session.user as RongoaUser;
    const user_id = user.database.id;
    const user_is_member = user.database.user_type === MEMBER_USER_TYPE;

    // Try uploading the data to the database
    try {
        let {
            id,
        } = request.query;


        let ids = [];

        // If no id is provided, return an error
        if(!id) {
            return response.status(400).json({error: "No ID provided"});
        }

        // If ids is an array, set it to the array
        if(Array.isArray(id)) {
            ids = id;
        } else {
            ids.push(id);
        }

        // Check if the data is being downloaded from the Postgres database
        const tables = getTables()

        // Update the posts in_use status
        let query= "";
        for (let i = 0; i < ids.length; i++) {
            query = `UPDATE posts SET ${tables.post_in_use} = NOT ${tables.post_in_use} WHERE id = ${ids[i]};`;
        }

        // Make the query
        await makeQuery(query, client, true);


        // Log the upload
        logger.info(`Move post ${id} by ${session?.user?.email}`);

        return response.status(200).json({ message: "Upload Successful", id: id });
    } catch (error) {
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    } finally {

        if(USE_POSTGRES)
            await client.end();

    }
}

