import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';


export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    //return response.status(200).json({ error: 'This part of the API is unavailable until authentication is finished' });

    // If the request is not a POST request, return an error
    if(request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed, please use POST' });
    }

    // Connect to the database
    const client = await db.connect();


    // Try uploading the data to the database
    try {
        let {
            preferred_name,
            english_name,
            maori_name,
            latin_name,
            location,
            small_description,
            long_description,
            months_ready_events,
            months_ready_start_months,
            months_ready_end_months,
            edible_parts,
            edible_images,
            edible_nutrition,
            edible_preparation,
            edible_preparation_type,
            medical_types,
            medical_uses,
            medical_images,
            medical_preparation,
            craft_parts,
            craft_uses,
            craft_images,
            craft_additional_info,
            source_types,
            source_data,
            custom_titles,
            custom_text,
            attachment_paths,
            attachment_types,
            attachment_names,
            attachment_downloadable

        } = request.body;

        console.log(request.body);

        // Return what parameters are missing
        const missingParametersErrorCode = 200;
        if(preferred_name === null)             { return response.status(missingParametersErrorCode).json({ error: 'Preferred name parameter not found' }); }
        if(english_name === null)               { return response.status(missingParametersErrorCode).json({ error: 'English name parameter not found' }); }
        if(maori_name === null)                 { return response.status(missingParametersErrorCode).json({ error: 'Maori name parameter not found' }); }
        if(latin_name === null)                 { return response.status(missingParametersErrorCode).json({ error: 'Latin name parameter not found' }); }
        if(location === null)                   { return response.status(missingParametersErrorCode).json({ error: 'Location parameter not found' }); }
        if(small_description === null)          { return response.status(missingParametersErrorCode).json({ error: 'Small description parameter not found' }); }
        if(long_description === null)           { return response.status(missingParametersErrorCode).json({ error: 'Long description parameter not found' }); }
        if(months_ready_events === null)        { return response.status(missingParametersErrorCode).json({ error: 'Months ready events parameter not found' }); }
        if(months_ready_start_months === null)  { return response.status(missingParametersErrorCode).json({ error: 'Months ready start months parameter not found' }); }
        if(months_ready_end_months === null)    { return response.status(missingParametersErrorCode).json({ error: 'Months ready end months parameter not found' }); }
        if(edible_parts === null)               { return response.status(missingParametersErrorCode).json({ error: 'Edible parts parameter not found' }); }
        if(edible_images === null)              { return response.status(missingParametersErrorCode).json({ error: 'Edible images parameter not found' }); }
        if(edible_nutrition === null)           { return response.status(missingParametersErrorCode).json({ error: 'Edible nutrition parameter not found' }); }
        if(edible_preparation === null)         { return response.status(missingParametersErrorCode).json({ error: 'Edible preparation parameter not found' }); }
        if(edible_preparation_type === null)    { return response.status(missingParametersErrorCode).json({ error: 'Edible preparation type parameter not found' }); }
        if(medical_types === null)              { return response.status(missingParametersErrorCode).json({ error: 'Medical types parameter not found' }); }
        if(medical_uses === null)               { return response.status(missingParametersErrorCode).json({ error: 'Medical uses parameter not found' }); }
        if(medical_images === null)             { return response.status(missingParametersErrorCode).json({ error: 'Medical images parameter not found' }); }
        if(medical_preparation === null)        { return response.status(missingParametersErrorCode).json({ error: 'Medical preparation parameter not found' }); }
        if(craft_parts === null)                { return response.status(missingParametersErrorCode).json({ error: 'Craft parts parameter not found' }); }
        if(craft_uses === null)                 { return response.status(missingParametersErrorCode).json({ error: 'Craft uses parameter not found' }); }
        if(craft_images === null)               { return response.status(missingParametersErrorCode).json({ error: 'Craft images parameter not found' }); }
        if(craft_additional_info === null)      { return response.status(missingParametersErrorCode).json({ error: 'Craft additional info parameter not found' }); }
        if(source_types === null)               { return response.status(missingParametersErrorCode).json({ error: 'Source types parameter not found' }); }
        if(source_data === null)                { return response.status(missingParametersErrorCode).json({ error: 'Source data parameter not found' }); }
        if(custom_titles === null)              { return response.status(missingParametersErrorCode).json({ error: 'Custom titles parameter not found' }); }
        if(custom_text === null)                { return response.status(missingParametersErrorCode).json({ error: 'Custom text parameter not found' }); }
        if(attachment_paths === null)           { return response.status(missingParametersErrorCode).json({ error: 'Attachment paths parameter not found' }); }
        if(attachment_types === null)           { return response.status(missingParametersErrorCode).json({ error: 'Attachment types parameter not found' }); }
        if(attachment_names === null)           { return response.status(missingParametersErrorCode).json({ error: 'Attachment names parameter not found' }); }
        if(attachment_downloadable === null)    { return response.status(missingParametersErrorCode).json({ error: 'Attachment downloadable parameter not found' }); }

        // Create the query
        let query = ``;

        // Add the information for the plant data
        query += `INSERT INTO plants (plants_preferred_name, plants_english_name, plants_maori_name, plants_latin_name, plants_small_description, small_description, plants_long_description) `;
        query += `VALUES ('${preferred_name}', '${english_name}', '${maori_name}', '${latin_name}', '${location}', '${small_description}', '${long_description}') RETURNING id;`;

        // Create a temporary table to hold the new plant id
        query += `DROP TABLE IF EXISTS new_plant; CREATE TEMPORARY TABLE new_plant AS (
          SELECT id
          FROM plants
          ORDER BY id DESC
          LIMIT 1
        );`;

        // If there is months ready data, add it to the query
        if(months_ready_events.length > 0) {
            // Tell the query that we are adding to the months ready for use table
            query += `INSERT INTO months_ready_for_use (plant_id, months_ready_for_use_event, months_ready_for_use_start_month, months_ready_for_use_end_month) VALUES `;

            // Loop through each of the months ready events
            for(let i = 0; i < months_ready_events.length; i++) {
                // Add the data to the query
                query += `((SELECT id FROM new_plant), '${months_ready_events[i]}', '${months_ready_start_months[i]}', '${months_ready_end_months[i]}')`;

                // If this is not the last item, add a comma otherwise add a semicolon
                if(i < months_ready_events.length - 1) {
                    query += `, `;
                }else{
                    query += `;`;
                }
            }
        }

        // If there is edible sections data, add it to the query
        if(edible_parts.length > 0) {

            // Tell the query that we are adding to the edible parts table
            query += `INSERT INTO edible (plant_id, edible_part_of_plant, edible_image_of_part, edible_nutrition, edible_preparation, edible_preparation_type) VALUES `;

            // Loop through each of the edible parts
            for(let i = 0; i < edible_parts.length; i++) {
                // Add the data to the query
                query += `((SELECT id FROM new_plant), '${edible_parts[i]}', '${edible_images[i]}', '${edible_nutrition[i]}', '${edible_preparation[i]}', '${edible_preparation_type[i]}')`;

                // If this is not the last item, add a comma otherwise add a semicolon
                if(i < edible_parts.length - 1) {
                    query += `, `;
                }else{
                    query += `;`;
                }
            }
        }

        // If there is medical sections data, add it to the query
        if(medical_types.length > 0) {

            // Tell the query that we are adding to the medical types table
            query += `INSERT INTO medical (plant_id, medical_medical_type, medical_use, medical_image, medical_preparation) VALUES `;

            // Loop through each of the medical types
            for(let i = 0; i < medical_types.length; i++) {
                // Add the data to the query
                query += `((SELECT id FROM new_plant), '${medical_types[i]}', '${medical_uses[i]}', '${medical_images[i]}', '${medical_preparation[i]}')`;

                // If this is not the last item, add a comma otherwise add a semicolon
                if(i < medical_types.length - 1) {
                    query += `, `;
                }else{
                    query += `;`;
                }
            }
        }

        // If there is craft section data, add it to the query
        if(craft_parts.length > 0) {

            // Tell the query that we are adding to the craft parts table
            query += `INSERT INTO craft (plant_id, craft_part_of_plant, craft_use, craft_image, craft_additional_info) VALUES `;

            // Loop through each of the craft parts
            for(let i = 0; i < craft_parts.length; i++) {
                // Add the data to the query
                query += `((SELECT id FROM new_plant), '${craft_parts[i]}', '${craft_uses[i]}', '${craft_images[i]}', '${craft_additional_info[i]}')`;

                // If this is not the last item, add a comma otherwise add a semicolon
                if(i < craft_parts.length - 1) {
                    query += `, `;
                }else{
                    query += `;`;
                }
            }
        }

        // If there is source section, add it to the query
        if(source_types.length > 0) {
            // Tell the query that we are adding to the source types table

            query += `INSERT INTO source (plant_id, source_type, source_data) VALUES `;

            // Loop through each of the source types
            for(let i = 0; i < source_types.length; i++) {
                // Add the data to the query
                query += `((SELECT id FROM new_plant), '${source_types[i]}', '${source_data[i]}')`;

                // If this is not the last item, add a comma otherwise add a semicolon
                if(i < source_types.length - 1) {
                    query += `, `;
                }else{
                    query += `;`;
                }
            }
        }

        // If there is custom section, add it to the query
        if(custom_titles.length > 0) {
            // Tell the query that we are adding to the custom table
            query += `INSERT INTO custom (plant_id, custom_title, custom_text) VALUES `;

            // Loop through each of the custom titles
            for(let i = 0; i < custom_titles.length; i++) {
                // Add the data to the query
                query += `((SELECT id FROM new_plant), '${custom_titles[i]}', '${custom_text[i]}')`;

                // If this is not the last item, add a comma otherwise add a semicolon
                if(i < custom_titles.length - 1) {
                    query += `, `;
                }else{
                    query += `;`;
                }
            }
        }

        // If there are attachments, add them to the query
        if(attachment_paths.length > 0) {

            // Tell the query that we are adding to the attachments table
            query += `INSERT INTO attachments (plant_id, attachments_path, attachments_type, attachments_name, attachments_downloadable) VALUES `;

            // Loop through each of the attachments
            for(let i = 0; i < attachment_paths.length; i++) {

                // Add the data to the query
                query += `((SELECT id FROM new_plant), '${attachment_paths[i]}', '${attachment_types[i]}', '${attachment_names[i]}', ${attachment_downloadable[i]})`;

                // If this is not the last item, add a comma otherwise add a semicolon
                if(i < attachment_paths.length - 1) {
                    query += `, `;
                } else {
                    query += `;`;
                }

            }
            
        }

        // Log the query
        console.log("=====================================")
        console.log(query);
        console.log("=====================================")

        // Get the data from the database
        const data  = await client.query(query);

        // Get the id of the new plant
        // @ts-ignore (has to be like this data[0] is an object)
        const id = data[0].rows[0].id;

        // If there is no id, return an error
        if(!id) {
            return response.status(500).json({ error: "Error creating plant (id not returned)" });
        }


        return response.status(200).json({ message: "Upload Successful", id: id });
    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error: error });
    } finally {

        // Disconnect from the database
        client.release();
    }
}