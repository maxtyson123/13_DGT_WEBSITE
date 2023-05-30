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
            SELECT plants.id, plants.english_name, plants.latin_name, plants.maori_name as moari_name, plants.preferred_name, months_ready_for_use.start_month, months_ready_for_use.end_month, months_ready_for_use.event
            FROM months_ready_for_use
            JOIN plants ON plants.id = months_ready_for_use.plant_id;
        `;

        // Get the data from the database
        const data = await client.query(query);

        // If the data is empty, return an error
        if(data.rows.length === 0) {
            return response.status(404).json({ error: 'No data found' });
        }



        // If the data is not empty, return the data
        return response.status(200).json({ data: data.rows });

    } catch (error) {
        //TODO:  Error handling

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }

}