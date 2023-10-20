import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";

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
    let {
        amount,
        name,
        getNames,
        mushrooms,
        page,
    } = request.query;

    // Try querying the database
    try {

        const tables = getTables()
        const amountPerPage = 3

        // Assemble the query
        let query = ``;
        let selector = "WHERE"

        // If the user specified a name, get the plant id from the plants database
        let shouldGetNames = ``;
        if (getNames) {
            shouldGetNames = `, english_name, maori_name, latin_name, preferred_name`;
        }

        // Get the plant id from the plants database
        query += ` SELECT id ${shouldGetNames} FROM plants`;

        // Select what the user entered
        if (name) {
            query += ` ${selector} (english_name LIKE '%${name}%' OR maori_name LIKE '%${name}%' OR latin_name LIKE '%${name}%')`;
            selector = "AND";
        }

        // Filter mushrooms
        if (!mushrooms){
            mushrooms = "exclude"
        }

        switch (mushrooms) {
                case "include":
                    break;

                case "exclude":
                    query += ` ${selector} ${tables.plant_type} NOT LIKE '%Mushroom%'`;
                    break;

                case "only":
                    query += ` ${selector} ${tables.plant_type} LIKE '%Mushroom%'`;
                    break;

                default:
                    query += ` ${selector} ${tables.plant_type} NOT LIKE '%Mushroom%'`;
                    break;
            }

        // Only get a certain amount
        if (amount) {
            query += ` LIMIT ${amount}`
        }

        // If the user specified a page, get the correct page
        if (page) {

            let currentPage = parseInt(page as string)


            query += ` LIMIT ${amountPerPage} OFFSET ${(currentPage - 1) * amountPerPage}`
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