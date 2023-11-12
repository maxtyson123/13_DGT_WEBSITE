import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {checkApiPermissions} from "@/lib/api_tools";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {


    // Get the client
    const client = await getClient()


    // Try uploading the data to the database
    try {
        let { api_key} = request.query;
        
        // Check if the data is being downloaded from the Postgres database
        const tables = getTables();

        // Check if the user has the correct permissions
        const session = await getServerSession(request, response, authOptions)
        const permission = await checkApiPermissions(request, response, session, client, "api:files:backup_database:access")
        if(!permission) return response.status(401).json({error: "Not Authorized"})

        // Create the query
        let query = ``;

        // Get the information for attachment data
        query += `SELECT * FROM attachments;`;

        // Get the information for the craft data
        query += `SELECT * FROM craft;`;

        // Get the information for the custom data
        query += `SELECT * FROM custom;`;

        // Get the information for the edible data
        query += `SELECT * FROM edible;`;

        // Get the information for the medical data
        query += `SELECT * FROM medical;`;

        // Get the information for the months ready for use data
        query += `SELECT * FROM months_ready_for_use;`;

        // Get the information for the source data
        query += `SELECT * FROM source;`;

        // Finally Get the information for the plant data
        query += `SELECT * FROM plants;`;

        // Log the query
        console.log("=====================================")
        console.log(query);
        console.log("=====================================")

        // Get the data
        const data  = await makeQuery(query, client)
        return response.status(200).json({ data: data });

    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}