// noinspection SpellCheckingInspection

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
            display_images,
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
        const plantData = {
            preferred_name,
            english_name,
            maori_name,
            latin_name,
            location_found,
            small_description,
            long_description,
            author,
            display_images,
            plant_type,
            published: 1,
            last_modified: new Date(),
        };


        query += buildQuery(plantData, 'plants', edit_id);


        // Create a temporary table to hold the new plant id
        query += `DROP TABLE IF EXISTS new_plant; CREATE TEMPORARY TABLE new_plant AS ( SELECT id FROM plants ORDER BY id DESC LIMIT 1 ); ${!USE_POSTGRES ? "SELECT id FROM new_plant;" : ""}`;

        // If there is months ready data, add it to the query
        if (months_ready_events.length > 0) {
            const monthsReadyData = months_ready_events.map((event: any, i: number) => ({
                months_event: event,
                months_start_month: months_ready_start_months[i],
                months_end_month: months_ready_end_months[i]
            }));

            // Build the query to delete existing data and insert new data
            const monthsReadyQuery = buildRelatedQueries(monthsReadyData, 'months_ready_for_use', edit_id);
            query += monthsReadyQuery;
        }

        // If there is edible sections data, add it to the query
        if (edible_parts.length > 0) {
            const edibleData = edible_parts.map((part: any, i: number) => ({
                edible_part_of_plant: part,
                edible_use_identifier: edible_use_identifiers[i],
                edible_images: edible_images[i],
                edible_nutrition: edible_nutrition[i],
                edible_preparation: edible_preparation[i],
                edible_preparation_type: edible_preparation_type[i]
            }));

            // Build the query to delete existing data and insert new data
            const edibleQuery = buildRelatedQueries(edibleData, 'edible', edit_id);
            query += edibleQuery;
        }

        // If there is medical sections data, add it to the query
        if(medical_types.length > 0) {

            const medicalData = medical_types.map((type: any, i: number) => ({
                medical_type: type,
                medical_use_identifier: medical_use_identifiers[i],
                medical_use: medical_uses[i],
                medical_images: medical_images[i],
                medical_preparation: medical_preparation[i],
                medical_restricted: medical_restricteds[i]
            }));

            // Build the query to delete existing data and insert new data
            const medicalQuery = buildRelatedQueries(medicalData, 'medical', edit_id);
            query += medicalQuery;
        }

        // If there is craft section data, add it to the query
        if(craft_parts.length > 0) {

            const craftData = craft_parts.map((part: any, i: number) => ({
                craft_part_of_plant: part,
                craft_use_identifier: craft_use_identifiers[i],
                craft_use: craft_uses[i],
                craft_images: craft_images[i],
                craft_additional_info: craft_additional_info[i]
            }));

            // Build the query to delete existing data and insert new data
            const craftQuery = buildRelatedQueries(craftData, 'craft', edit_id);
            query += craftQuery;
        }


        // If there is source section, add it to the query
        if(source_types.length > 0) {

            const sourceData = source_types.map((type: any, i: number) => ({
                source_type: type,
                source_data: source_data[i]
            }));

            // Build the query to delete existing data and insert new data
            const sourceQuery = buildRelatedQueries(sourceData, 'source', edit_id);
            query += sourceQuery;
        }

        // If there is custom section, add it to the query
        if(custom_titles.length > 0) {

            const customData = custom_titles.map((title: any, i: number) => ({
                custom_title: title,
                custom_text: custom_text[i]
            }));

            // Build the query to delete existing data and insert new data
            const customQuery = buildRelatedQueries(customData, 'custom', edit_id);
            query += customQuery;
        }

        // If there are attachments, add them to the query
        if(attachment_paths.length > 0) {

            const attachmentData = attachment_paths.map((path: any, i: number) => ({
                attachment_path: path,
                attachment_type: attachment_types[i],
                attachment_meta: attachment_metas[i],
                attachment_downloadable: attachment_downloadable[i]
            }));

            // Build the query to delete existing data and insert new data
            const attachmentQuery = buildRelatedQueries(attachmentData, 'attachments', edit_id);
            query += attachmentQuery;
            
        }

        console.log(query);

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
        console.log(error)
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    } finally {

        if(USE_POSTGRES)
            await client.end();

    }
}

function buildQuery(data: Record<string, any>, tableName: string, edit_id: string | undefined) {
    let columns = [];
    let values: any = [];

    for (const [column, value] of Object.entries(data)) {
        if (value !== undefined) { // Only include defined values
            columns.push(column);

            if(typeof value === 'boolean') {
                values.push(value);
                continue;
            }

            if(typeof value === 'object' && value instanceof Date) {
                values.push(`FROM_UNIXTIME(${Math.floor(value.getTime() / 1000)})`);
                continue;
            }

            values.push(`'${value}'`);
        }
    }

    if (edit_id) {
        // Construct an UPDATE query
        const updateFields = columns.map((col, i) => `${col}=${values[i]}`).join(', ');
        return `UPDATE ${tableName} SET ${updateFields} WHERE id=${edit_id};`;
    } else {
        // Construct an INSERT query
        const insertColumns = columns.join(', ');
        const insertValues = values.join(', ');
        return `INSERT INTO ${tableName} (${insertColumns}) VALUES (${insertValues}) ${USE_POSTGRES ? 'RETURNING id;' : ''}`;
    }
}


function buildRelatedQueries(
    relatedData: any[],
    tableName: string,
    edit_id: string | undefined,
) {
    let query = '';

    if (relatedData.length === 0) return query;

    // If we're editing, first delete any existing related data
    if (edit_id) {
        query += `DELETE FROM ${tableName} WHERE plant_id = ${edit_id}; `;
    }


    query += `INSERT INTO ${tableName} (plant_id, ${Object.keys(relatedData[0]).join(', ')}) VALUES `;

    relatedData.forEach((dataRow, index) => {
        const values = Object.values(dataRow)
            .map(val => {
                // Check if the value is a boolean
                if (typeof val === 'boolean')
                    return val;

                // Check if it's a date
                if(typeof val === 'object' && val instanceof Date)
                    return `FROM_UNIXTIME(${Math.floor(val.getTime() / 1000)})`;

                // For other types, wrap them in quotes
                return `'${val}'`;
            })
            .join(', ');

        // Insert the values, handling edit_id or using LAST_INSERT_ID() for MySQL
        query += `(${edit_id || 'LAST_INSERT_ID()'}, ${values})`;

        // Add a comma between rows or a semicolon at the end of the query
        if (index < relatedData.length - 1) {
            query += ', ';
        } else {
            query += ';';
        }
    });

    return query;

}
