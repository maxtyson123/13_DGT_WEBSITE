import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';
import {PostgresSQL, SQLDatabase} from "@/modules/databse";
import mysql from 'serverless-mysql';
import{USE_POSTGRES} from "@/modules/constants";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {


    // Select what database is being used
    let dataBase : any = mysql({
        config: {
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 1234,
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }
    });

    // If postgres use that
    if(USE_POSTGRES){
        dataBase = db
    }

    // Connect to the database
    const client = await dataBase.connect();


    // Try uploading the data to the database
    try {
        let {id} = request.query;

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

        // Get the data from the database
        const data  = await client.query(query);

        // Check for errors
        if(data.error){
            return response.status(500).json({ error: data.error });
        }

        return response.status(200).json({ message: "Remove Successful", id: id });
    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error: error });
    } finally {
        client.end();

    }
}