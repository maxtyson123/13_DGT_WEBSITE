import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // If the request is not a GET request, return an error
    if(request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed, please use GET' });
    }

    // Connect to the database
    const client = await db.connect();

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
        const data = await client.query(query);

        // If the data is empty, return an error
        if(data.rows.length === 0) {
            return response.status(404).json({ error: 'No data found' });
        }


        // Extract the plant_ids and table names from the query results
        const plantIdTableMap: { [key: string]: string[] } = {};
        data.rows.forEach(row => {
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
        return response.status(500).json({ error });
    }

}