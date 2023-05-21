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
    const { id, table } = request.query;

    // Try downloading the data from the database
    try {

        if(!table){
            return response.status(404).json({ error: 'Table parameter not found' });
        }

        console.log(table);

        // Cover the table to an array if its just one table
        let tableArray = table;
        if(typeof table === 'string'){
            tableArray = [table];
        }

        let selector = '';
        let joiner = '';
        let selectedAlready : string[] = [];

        for(let i = 0; i < tableArray.length; i++) {
            // Ensure that the table requested isn't in the array of tables more than once
            if(selectedAlready.includes(tableArray[i])){
                continue;
            }

            // Add the table to the array of tables
            selectedAlready.push(tableArray[i]);

            // Add the table to the selector
            switch (tableArray[i]) {
                case 'plants':
                    // Select all the plant data
                    selector += ` plants.preferred_name, plants.english_name, plants.maori_name, plants.latin_name, plants.location, plants.small_description, plants.long_description,`;
                    break;

                case 'months_ready_for_use':

                    // Select all the months and make them into an array
                    selector += `months_ready.months_ready_events, months_ready.months_ready_start_months, months_ready.months_ready_end_months,`;

                    // Join the months table
                    joiner += `
                                LEFT JOIN (SELECT
                                plant_id,
                                array_agg(event) AS months_ready_events,
                                array_agg(start_month) AS months_ready_start_months,
                                array_agg(end_month) AS months_ready_end_months
                                FROM months_ready_for_use
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) months_ready ON plants.id = months_ready.plant_id`;
                    break;

                case 'edible':

                    // Select all the edible data and make them into an array
                    selector += `edible.edible_parts, edible.edible_images, edible.edible_nutrition, edible.edible_preparation, edible.edible_preparation_type,`;

                    // Join the edible table
                    joiner += ` 
                                LEFT JOIN (
                                SELECT
                                plant_id,
                                array_agg(part_of_plant) AS edible_parts,
                                array_agg(image_of_part) AS edible_images,
                                array_agg(nutrition) AS edible_nutrition,
                                array_agg(preparation) AS edible_preparation,
                                array_agg(preparation_type) AS edible_preparation_type
                                FROM edible
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) edible ON plants.id = edible.plant_id`;
                    break;

                case 'medical':

                    // Select all the medical data and make them into an array
                    selector += `medical.medical_types, medical.medical_uses, medical.medical_images, medical.medical_preparation,`;

                    // Join the medical table
                    joiner += `
                                LEFT JOIN (
                                SELECT
                                plant_id,
                                array_agg(medical_type) AS medical_types,
                                array_agg(use) AS medical_uses,
                                array_agg(image) AS medical_images,
                                array_agg(preparation) AS medical_preparation
                                FROM medical
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) medical ON plants.id = medical.plant_id`;
                    break;

                case 'craft':

                    // Select all the craft data and make them into an array
                    selector += `craft.craft_parts, craft.craft_uses, craft.craft_images, craft.craft_additional_info,`;

                    // Join the craft table
                    joiner += `
                                LEFT JOIN (
                                SELECT
                                plant_id,
                                array_agg(part_of_plant) AS craft_parts,
                                array_agg(use) AS craft_uses,
                                array_agg(image) AS craft_images,
                                array_agg(additional_info) AS craft_additional_info
                                FROM craft
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) craft ON plants.id = craft.plant_id`;
                    break;

                case 'source':

                    // Select all the source data and make them into an array
                    selector += ` source.source_types, source.source_data,`;

                    // Join the source table
                    joiner += ` 
                                LEFT JOIN (
                                SELECT
                                plant_id,
                                array_agg(source_type) AS source_types,
                                array_agg(data) AS source_data
                                FROM source
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) source ON plants.id = source.plant_id`;
                    break;

                case 'custom':

                    // Select all the custom data and make them into an array
                    selector += `custom.custom_titles, custom.custom_text,`;

                    // Join the custom table
                    joiner += ` LEFT JOIN (
                                SELECT
                                plant_id,
                                array_agg(title) AS custom_titles,
                                array_agg(text) AS custom_text
                                FROM custom
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) custom ON plants.id = custom.plant_id`;

                    break;

                case 'attachments':

                    // Select all the attachments data and make them into an array
                    selector += `attachments.attachment_paths, attachments.attachment_types, attachments.attachment_names, attachments.attachment_downloadable,`;

                    // Join the attachments table
                    joiner += ` LEFT JOIN (
                                SELECT
                                plant_id,
                                array_agg(path) AS attachment_paths,
                                array_agg(type) AS attachment_types,
                                array_agg(name) AS attachment_names,
                                array_agg(downloadable) AS attachment_downloadable
                                FROM attachments
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) attachments ON plants.id = attachments.plant_id`;
                    break

                default:
                    break;
            }

        }

        if(selector === ''){
            return response.status(404).json({ error: 'No tables of requested found' });
        }

        // Remove the last comma from the selector
        selector = selector.slice(0, -1);

        // Add to the joiner
        joiner += ` WHERE plants.id = ${id}`;

        // Create the query
        const query = `
            SELECT
            ${selector}
            FROM public.plants
            ${joiner};
        `;

        console.log("=====================================")
        console.log(query);

        // Get the data from the database
        const data = await client.query(query);

        // If the data is empty, return an error
        if(data.rows.length === 0) {
            return response.status(404).json({ error: 'No data found' });
        }

        // If the data is not empty, return the data
        return response.status(200).json({ data: data.rows[0] });

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }

}