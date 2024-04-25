import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, makeQuery, PostgresSQL, SQLDatabase} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // If the request is not a GET request, return an error
    if(request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed, please use GET' });
    }

    // Get the client
    const client = await getClient()

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:plants:months:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    // Try downloading the data from the database
    try {

        const tables = USE_POSTGRES ?  new PostgresSQL() : new SQLDatabase();

        // Create the query to retrieve plant_ids and table names
        const query = `
            SELECT 
                plants.${tables.id}, 
                plants.${tables.english_name}, 
                plants.${tables.latin_name}, 
                plants.${tables.maori_name} as maori_name, 
                plants.${tables.preferred_name}, 
                months_ready_for_use.${tables.months_start_month}, 
                months_ready_for_use.${tables.months_end_month}, 
                months_ready_for_use.${tables.months_event}
            FROM months_ready_for_use
            JOIN plants ON plants.id = months_ready_for_use.plant_id;
        `;

        // Get the data from the database
        const data = await makeQuery(query, client);

        // If the data is empty, return an error
        if(!data) {
            return response.status(404).json({ error: 'No data found' });
        }

        // If the data is not empty, return the data
        return response.status(200).json({ data: data });

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }

}