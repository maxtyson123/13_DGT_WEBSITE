import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, makeQuery, PostgresSQL, SQLDatabase} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";

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

        console.log("=====================================")
        console.log(query);
        console.log("=====================================")

        // Get the data from the database
        const data = await makeQuery(query, client);
        console.log(data);

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