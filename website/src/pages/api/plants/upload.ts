import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the logger
    const logger = new Logger()

    // If the request is not a POST request, return an error
    if(request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed, please use POST' });
    }

    // Get the client
    const client =  await getClient()

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:plants:upload:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    // Try uploading the data to the database
    try {
        let {
            edit_id,
            preferred_name,
            english_name,
            maori_name,
            latin_name,
            location_found,
            small_description,
            long_description,
            author,
            display_image,
            plant_type,
            months_ready_events,
            months_ready_start_months,
            months_ready_end_months,
            edible_parts,
            edible_use_identifiers,
            edible_images,
            edible_nutrition,
            edible_preparation,
            edible_preparation_type,
            medical_types,
            medical_use_identifiers,
            medical_uses,
            medical_images,
            medical_preparation,
            medical_restricteds,
            craft_parts,
            craft_use_identifiers,
            craft_uses,
            craft_images,
            craft_additional_info,
            source_types,
            source_data,
            custom_titles,
            custom_text,
            attachment_paths,
            attachment_types,
            attachment_metas,
            attachment_downloadable,
            api_key,

        } = request.body;

        // Check if the data is being downloaded from the Postgres database
        const tables = getTables()

        let insertQuery = "";
        let insetQueryValues = "";
        let getIDQuery = "(SELECT id FROM new_plant)";
        const timeFunction = USE_POSTGRES ? "to_timestamp" : "FROM_UNIXTIME";

        // If the attachment paths have / in them then get the last part of the path
        for(let i = 0; i < attachment_paths.length; i++){
            if(attachment_paths[i].includes("/")){
                attachment_paths[i] = attachment_paths[i].split("/").pop();
            }
        }

        // If it is editing then insert at the id instead of generating a new one
        if(edit_id){
            insertQuery += `${tables.id}, `;
            insetQueryValues += `${edit_id}, `;
            getIDQuery = `${edit_id}`;
        }

        // Create the query
        let query = ``;

        // Add the information for the plant data
        query += `INSERT INTO plants (${insertQuery} ${tables.preferred_name}, ${tables.english_name}, ${tables.maori_name}, ${tables.latin_name}, ${tables.location_found}, ${tables.small_description}, ${tables.long_description}, ${tables.author}, ${tables.last_modified}, ${tables.display_image}, ${tables.plant_type}) `;
        query += `VALUES (${insetQueryValues} '${preferred_name}', '${english_name}', '${maori_name}', '${latin_name}', '${location_found}', '${small_description}', '${long_description}', '${author}', ${timeFunction}(${Date.now()} / 1000.0), '${display_image}', '${plant_type}') ${USE_POSTGRES ? "RETURNING id" : ""};`;

        // Create a temporary table to hold the new plant id
        query += `DROP TABLE IF EXISTS new_plant; CREATE TEMPORARY TABLE new_plant AS ( SELECT id FROM plants ORDER BY id DESC LIMIT 1 ); ${!USE_POSTGRES ? "SELECT id FROM new_plant;" : ""}`;

        // If there is months ready data, add it to the query
        if(months_ready_events.length > 0) {
            // Tell the query that we are adding to the months ready for use table
            query += `INSERT INTO months_ready_for_use (plant_id, ${tables.months_event}, ${tables.months_start_month}, ${tables.months_end_month}) VALUES `;

            // Loop through each of the months ready events
            for(let i = 0; i < months_ready_events.length; i++) {
                // Add the data to the query
                query += `(${getIDQuery}, '${months_ready_events[i]}', '${months_ready_start_months[i]}', '${months_ready_end_months[i]}')`;

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
            query += `INSERT INTO edible (plant_id, ${tables.edible_part_of_plant}, ${tables.edible_use_identifier}, ${tables.edible_image_of_part}, ${tables.edible_nutrition}, ${tables.edible_preparation}, ${tables.edible_preparation_type}) VALUES `;

            // Loop through each of the edible parts
            for(let i = 0; i < edible_parts.length; i++) {
                // Add the data to the query
                query += `(${getIDQuery}, '${edible_parts[i]}', '${edible_use_identifiers[i]}', '${edible_images[i]}', '${edible_nutrition[i]}', '${edible_preparation[i]}', '${edible_preparation_type[i]}')`;

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
            query += `INSERT INTO medical (plant_id, ${tables.medical_type}, ${tables.medical_use_identifier}, ${tables.medical_use}, ${tables.medical_image}, ${tables.medical_preparation}, ${tables.medical_restricted}) VALUES `;

            // Loop through each of the medical types
            for(let i = 0; i < medical_types.length; i++) {
                // Add the data to the query
                query += `(${getIDQuery}, '${medical_types[i]}', '${medical_use_identifiers[i]}', '${medical_uses[i]}', '${medical_images[i]}', '${medical_preparation[i]}', '${medical_restricteds[i]}')`;

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
            query += `INSERT INTO craft (plant_id, ${tables.craft_part_of_plant}, ${tables.craft_use_identifier}, ${tables.craft_use}, ${tables.craft_image}, ${tables.craft_additional_info}) VALUES `;


            // Loop through each of the craft parts
            for(let i = 0; i < craft_parts.length; i++) {
                // Add the data to the query
                query += `(${getIDQuery}, '${craft_parts[i]}', '${craft_use_identifiers[i]}', '${craft_uses[i]}', '${craft_images[i]}', '${craft_additional_info[i]}')`;

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

            query += `INSERT INTO source (plant_id, ${tables.source_type}, ${tables.source_data}) VALUES `;

            // Loop through each of the source types
            for(let i = 0; i < source_types.length; i++) {
                // Add the data to the query
                query += `(${getIDQuery}, '${source_types[i]}', '${source_data[i]}')`;

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
            query += `INSERT INTO custom (plant_id, ${tables.custom_title}, ${tables.custom_text}) VALUES `;

            // Loop through each of the custom titles
            for(let i = 0; i < custom_titles.length; i++) {
                // Add the data to the query
                query += `(${getIDQuery}, '${custom_titles[i]}', '${custom_text[i]}')`;

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
            query += `INSERT INTO attachments (plant_id, ${tables.attachment_path}, ${tables.attachment_type}, ${tables.attachment_meta}, ${tables.attachment_downloadable}) VALUES `;

            // Loop through each of the attachments
            for(let i = 0; i < attachment_paths.length; i++) {

                // Add the data to the query
                query += `(${getIDQuery}, '${attachment_paths[i]}', '${attachment_types[i]}', '${attachment_metas[i]}', ${attachment_downloadable[i]})`;

                // If this is not the last item, add a comma otherwise add a semicolon
                if(i < attachment_paths.length - 1) {
                    query += `, `;
                } else {
                    query += `;`;
                }

            }
            
        }

        // Run the query
        const data = await makeQuery(query, client, true)

        if(!data)
            return response.status(500).json({ error: "No data returned" });

        // Get the id of the new plant
        // @ts-ignore (has to be like this data[0] is an object)
        let id = undefined

        if(USE_POSTGRES){
            id = data[0].rows[0].id;
        }else{

            // Loop through the data
            data.forEach((item: any) => {

                // If there is an id, set it
                if (item[0] && item[0].id) {
                    id = item[0].id;
                }
            });
        }


        // If there is no id, return an error
        if(!id) {
            return response.status(500).json({ error: "Error creating plant (id not returned)" });
        }

        if(edit_id){
            // Log the edit
            logger.info(`Plant ${id} edited by ${session?.user?.email}`);

            return response.status(200).json({ message: "Upload Successful", id: edit_id });
        }

        // Log the upload
        logger.info(`Plant ${id} created by ${session?.user?.email}`);

        return response.status(200).json({ message: "Upload Successful", id: id });
    } catch (error) {
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    } finally {

        if(USE_POSTGRES)
            await client.end();

    }
}