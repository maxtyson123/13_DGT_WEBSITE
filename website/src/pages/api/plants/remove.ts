import {NextApiRequest, NextApiResponse} from 'next';
import {USE_POSTGRES} from "@/lib/constants";
import {getClient, makeQuery, PostgresSQL, SQLDatabase} from "@/lib/databse";
import {CheckWhitelisted, GetOrigin} from "@/lib/api_tools";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the origin of the request
    const origin = GetOrigin(request);

    // Get the client
    const client = await getClient()


    // Try uploading the data to the database
    try {
        let {id, api_key} = request.query;

        // IF there is no id, return an error
        if(!id){
            return response.status(400).json({ error: 'No ID' });
        }

        // If it is an array, get the first element
        if(Array.isArray(id)){
            id = id[0];
        }

        let idNumber = parseInt(id);


        // If the id is not a number, return an error
        if(isNaN(idNumber)){
            return response.status(400).json({ error: 'Invalid ID' });
        }

        // Check if the data is being downloaded from the Postgres database
        const tables = USE_POSTGRES ?  new PostgresSQL() : new SQLDatabase();

        // Check if the user is allowed to upload
        if(!await CheckWhitelisted(request, response, client)) {
            return response.status(401).json({ error: 'User not authorised to remove data' });
        }

        // Create the query
        let query = ``;

        // Remove the information for attachment data
        query += `DELETE FROM attachments WHERE plant_id = ${id};`;

        // Remove the information for the craft data
        query += `DELETE FROM craft WHERE plant_id = ${id};`;

        // Remove the information for the custom data
        query += `DELETE FROM custom WHERE plant_id = ${id};`;

        // Remove the information for the edible data
        query += `DELETE FROM edible WHERE plant_id = ${id};`;

        // Remove the information for the medical data
        query += `DELETE FROM medical WHERE plant_id = ${id};`;

        // Remove the information for the months ready for use data
        query += `DELETE FROM months_ready_for_use WHERE plant_id = ${id};`;

        // Remove the information for the source data
        query += `DELETE FROM source WHERE plant_id = ${id};`;

        // Finally Remove the information for the plant data
        query += `DELETE FROM plants WHERE id = ${id};`;

        // Log the query
        console.log("=====================================")
        console.log(query);
        console.log("=====================================")

        // Remove the plant
        const data  = await makeQuery(query, client)
        return response.status(200).json({ message: "Remove sent", id: id });

    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}