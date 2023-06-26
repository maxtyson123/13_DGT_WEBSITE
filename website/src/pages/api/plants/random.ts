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

    // Get the ID and table from the query string
    const { amount } = request.query;

    // Check if the amount param exists
    if (!amount) {
        // If it doesn't exist, return an error
        return response.status(400).json({ error: 'No amount param found' });
    }

    // Try querying the database
    try {

        //TODO: Test mysql then use that if it works

        // Get x random plant ids from the database
        const plantIds = await client.query(`SELECT id FROM plants ORDER BY RANDOM() LIMIT ${amount}`);

        // If there are no plants, return an error
        if (plantIds.rows.length === 0) {
            return response.status(404).json({ error: 'No plants found' });
        }

        // Return the plant ids
        return response.status(200).json({ data: plantIds.rows });

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error:  (error as Error).message });
    }

}