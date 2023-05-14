import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    // If the request is not a POST request, return an error
    if(request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed, please use POST' });
    }

    // Connect to the database
    const client = await db.connect();

    // Try uploading the data to the database
    try {

            // Get the data from the request body
            const { name, description, image } = request.body;



    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error });
    } finally {

        // Disconnect from the database
        client.release();
    }
}