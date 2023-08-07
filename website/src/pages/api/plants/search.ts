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

    // Get the ID and table from the query string
    const {
        amount,
        name,
        getNames
    } = request.query;

    // Try querying the database
    try {

        // Assemble the query
        let query = ``;

        // If the user specified a name, get the plant id from the plants database
        let shouldGetNames = ``;
        if(getNames){
            shouldGetNames = `, english_name, maori_name, latin_name, preferred_name`;
        }

        // Get the plant id from the plants database
        query += ` SELECT id ${shouldGetNames} FROM plants`;

        // Select what the user entered
        if(name){
            query += ` WHERE english_name LIKE '%${name}%' OR maori_name LIKE '%${name}%' OR latin_name LIKE '%${name}%'`;
        }

        // Only get a certain amount
        if(amount){
            query += ` LIMIT ${amount}`
        }

        // Return the plants that match the query
        const plantIds = await makeQuery(query, client)

        // If there are no plants, return an error
        if (!plantIds) {
            return response.status(404).json({ error: 'No plants found' });
        }

        // Return the plant ids
        return response.status(200).json({ data: plantIds });

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error:  (error as Error).message });
    }

}