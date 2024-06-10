// noinspection SpellCheckingInspection

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


    // Try uploading the data to the database
    try {
        let {
            preferred_name,
            english_name,
            maori_name,
            latin_name,

        } = request.body;

        // Check if the data is being downloaded from the Postgres database
        const tables = getTables()

        let insertQuery = "";
        let insetQueryValues = "";
        let getIDQuery = "(SELECT id FROM new_plant)";
        const timeFunction = USE_POSTGRES ? "to_timestamp" : "FROM_UNIXTIME";

        // Remove any ' from the strings
        preferred_name = preferred_name.replace(/'/g, "");
        english_name = english_name.replace(/'/g, "");
        maori_name = maori_name.replace(/'/g, "");
        latin_name = latin_name.replace(/'/g, "");

        // Create the query
        let query = ``;

        // Add the information for the plant data
        query += `INSERT INTO plants (${insertQuery} ${tables.preferred_name}, ${tables.english_name}, ${tables.maori_name}, ${tables.latin_name}, ${tables.location_found}, ${tables.small_description}, ${tables.long_description}, ${tables.author}, ${tables.last_modified}, ${tables.display_image}, ${tables.plant_type}, ${tables.published}) `;
        query += `VALUES (${insetQueryValues} '${preferred_name}', '${english_name}', '${maori_name}', '${latin_name}', 'Forest', 'Not Published - Change This', 'Not Published - Change This', '2', ${timeFunction}(${Date.now()} / 1000.0), 'Deafult', 'Plant', 1) ${USE_POSTGRES ? "RETURNING id" : ""};`;

        // Create a temporary table to hold the new plant id
        query += `DROP TABLE IF EXISTS new_plant; CREATE TEMPORARY TABLE new_plant AS ( SELECT id FROM plants ORDER BY id DESC LIMIT 1 ); ${!USE_POSTGRES ? "SELECT id FROM new_plant;" : ""}`;


        console.log(query);

        // Run the query
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