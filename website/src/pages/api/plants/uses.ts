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

    // Try downloading the data from the database
    try {
        const tables = getTables();
        const {getValues} = request.query;

        // Create the query to retrieve plant_ids and table names
        const query = `
            SELECT plant_id, ${tables.craft_use_identifier}, 'craft' AS table_name FROM craft
            UNION
            SELECT plant_id, ${tables.edible_use_identifier}, 'edible' AS table_name FROM edible
            UNION
            SELECT plant_id, ${tables.medical_use_identifier}, 'medical' AS table_name FROM medical;
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
            craft_use_identifier: string; // NOTE: all of them get set to this thank god for union
        }



        let values = undefined;

        // If getting the values then get return the identifiers
        if(getValues){
            values = [];
            data.forEach((row: Row) => {
                let rowValues = {
                    id: row.plant_id,
                    type: row.table_name,
                    identifier: row.craft_use_identifier
                }
                values.push(rowValues)
            });
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
        return response.status(200).json({ data: getValues ? values : plantIdTableMap });

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }

}