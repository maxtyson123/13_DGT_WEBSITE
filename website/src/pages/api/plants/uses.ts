import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, makeQuery} from "@/lib/databse";

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

        // Create the query to retrieve plant_ids and table names
        const query = `
            SELECT plant_id, 'craft' AS table_name FROM craft
            UNION
            SELECT plant_id, 'edible' AS table_name FROM edible
            UNION
            SELECT plant_id, 'medical' AS table_name FROM medical;
        `;


        // Get the data from the database
        const data = await makeQuery(query, client)

        // If the data is empty, return an error
        if(!data) {
            return response.status(404).json({ error: 'No data found' });
        }
        interface Row {
            plant_id: string;
            table_name: string;
        }

        // Extract the plant_ids and table names from the query results
        const plantIdTableMap: { [key: string]: string[] } = {};
        data.forEach((row: Row) => {
            const { plant_id, table_name } = row;
            if (plantIdTableMap.hasOwnProperty(plant_id)) {
                plantIdTableMap[plant_id].push(table_name);
            } else {
                plantIdTableMap[plant_id] = [table_name];
            }
        });

        // If the data is not empty, return the data
        return response.status(200).json({ data: plantIdTableMap });

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }

}