import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';

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
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:plants:upload:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    // Try uploading the data to the database
    try {
        let {
            post_title,
            post_plant_id,
            plant_image,

        } = request.body;

        // Check if the data is being downloaded from the Postgres database
        const tables = getTables()

        let insertQuery = "";
        let insetQueryValues = "";
        let getIDQuery = "(SELECT id FROM new_plant)";
        const timeFunction = USE_POSTGRES ? "to_timestamp" : "FROM_UNIXTIME";



        // Run the query
        const query = ''
        const data = await makeQuery(query, client, true)

        if(!data)
            return response.status(500).json({ error: "No data returned" });

        // Get the id of the new plant
        // @ts-ignore (has to be like this data[0] is an object)
        let id = undefined

        if(USE_POSTGRES){
            id = data[0].rows[0].id;
        }else{

            // Loop through the data
            data.forEach((item: any) => {

                // If there is an id, set it
                if (item[0] && item[0].id) {
                    id = item[0].id;
                }
            });
        }


        // If there is no id, return an error
        if(!id) {
            return response.status(500).json({ error: "Error creating plant (id not returned)" });
        }


        // Log the upload
        logger.info(`Plant ${id} created by ${session?.user?.email}`);

        return response.status(200).json({ message: "Upload Successful", id: id });
    } catch (error) {
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    } finally {

        if(USE_POSTGRES)
            await client.end();

    }
}