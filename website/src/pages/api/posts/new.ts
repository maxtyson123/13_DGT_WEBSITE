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
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:posts:new:access")
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
            title,
            plant,
            image,
            inUse,
            description
        } = request.query;

        let post_in_use = false;
        if(inUse === "true") post_in_use = true;

        // Check if the data is being downloaded from the Postgres database
        const tables = getTables()

        const timeFunction = USE_POSTGRES ? "to_timestamp" : "FROM_UNIXTIME";

        // Check if missing data
        if (!title || !plant || !image || !description) {
            return response.status(400).json({ error: "Missing data" });
        }

        // Run the query
        const query = `INSERT INTO posts (${tables.post_title}, ${tables.post_plant_id}, ${tables.post_user_id}, ${tables.post_image}, ${tables.post_date}, ${tables.post_approved}, ${tables.post_in_use}, ${tables.post_description}) VALUES ('${title}', ${plant}, ${user_id}, '${image}', ${timeFunction}(${Date.now()} / 1000.0), ${!user_is_member}, ${post_in_use}, '${description}' ) ${process.env.USING_MYSQL == "true" ? '' : 'RETURNING id;'}`;
        const data = await makeQuery(query, client, true);

        let id;
        if (process.env.USING_MYSQL == "true") {
            // Workaround for MySQL to get the last inserted ID
            const lastInsertIdQuery = 'SELECT LAST_INSERT_ID() as id;';
            const lastInsertIdData = await makeQuery(lastInsertIdQuery, client, true);
            id = lastInsertIdData[0].id;
        } else {
            if(USE_POSTGRES){
                id = data[0].rows[0].id;
            }else{

                // Loop through the data
                data.forEach((item: any) => {

                    // If there is an id, set it
                    if (item && item.id) {
                        id = item.id;
                    }
                });
            }
        }


        // If there is no id, return an error
        if(!id) {
            return response.status(500).json({ error: "Error creating plant (id not returned)" });
        }


        // Log the upload
        logger.info(`New post ${id} by ${session?.user?.email}`);

        return response.status(200).json({ message: "Upload Successful", id: id });
    } catch (error) {
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    } finally {

        if(USE_POSTGRES)
            await client.end();

    }
}

