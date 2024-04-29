import {NextApiRequest, NextApiResponse} from 'next';
import {USE_POSTGRES} from "@/lib/constants";
import {getClient, makeQuery, PostgresSQL, SQLDatabase} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import {Logger} from "next-axiom";


export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {


    // Get the client
    const client = await getClient()


    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:plants:remove:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

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


        // Create the query
        let query = ``;

        // Define the tables to delete from
        const tablesToDeleteFrom = [ "attachments", "craft", "custom", "edible", "medical", "months_ready_for_use", "source" ];

        // Remove the information
        for (let table of tablesToDeleteFrom) {
            query += `DELETE FROM ${table} WHERE plant_id = ${id};`;
        }

        // Finally Remove the information for the plant data
        query += `DELETE FROM plants WHERE id = ${id};`;

        // Remove the plant
        const data  = await makeQuery(query, client)

        // Get the logger
        const logger = new Logger()
        logger.warn(`Plant removed by ${session?.user?.email} with id ${id}`)

        return response.status(200).json({ message: "Remove sent", id: id });

    } catch (error) {

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}