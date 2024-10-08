import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, makeQuery, PostgresSQL, SQLDatabase} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";
import {checkApiPermissions} from "@/lib/api_tools";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

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
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:plants:download:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    // Get the ID and table from the query string
    const { id, table } = request.query;

    // If there is no table parameter, return an error
    if(!table){
        return response.status(404).json({ error: 'Table parameter not found' });
    }

    // If there is no ID parameter, return an error
    if(!id){
        return response.status(404).json({ error: 'ID parameter not found' });
    }

    const restrictedData = await checkApiPermissions(request, response, session, client, makeQuery, "data:plants:viewRestrictedSections")
    const data = await downloadPlantData(table, id, client, restrictedData);

    if(data[0] === "error"){
        return response.status(404).json({ error: data[1] });
    }

    // Return the data
    return response.status(200).json({data: data[1][0]})

}



export async function downloadPlantData(table: any, id: any, client: any, restrictedData: boolean) {
    const tables = USE_POSTGRES ?  new PostgresSQL() : new SQLDatabase();


    // Try downloading the data from the database
    try {

        // Convert the table to an array if it's just one table
        let tableArray = table;
        if(typeof table === 'string'){
            tableArray = [table];
        }

        // Create the selector and joiner
        let selector = '';
        let joiner = '';

        // Create an array of tables that have already been selected
        let selectedAlready : string[] = [];

        const joinCommand = USE_POSTGRES ? 'array_agg' : 'JSON_ARRAYAGG';

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
                    selector += ` 
                                    plants.${tables.preferred_name}, 
                                    plants.${tables.english_name}, 
                                    plants.${tables.maori_name}, 
                                    plants.${tables.latin_name}, 
                                    plants.${tables.location_found}, 
                                    plants.${tables.small_description}, 
                                    plants.${tables.long_description}, 
                                    plants.${tables.author}, 
                                    plants.${tables.last_modified}, 
                                    plants.${tables.display_images},
                                    plants.${tables.plant_type},
                                    plants.${tables.published},`;
                    break;

                case 'months_ready_for_use':

                    // Select all the months and make them into an array
                    selector += `months_ready.months_ready_events, months_ready.months_ready_start_months, months_ready.months_ready_end_months,`;

                    // Join the months table
                    joiner += `
                                LEFT JOIN (SELECT
                                plant_id,
                                ${joinCommand}(${tables.months_event}) AS months_ready_events,
                                ${joinCommand}(${tables.months_start_month}) AS months_ready_start_months,
                                ${joinCommand}(${tables.months_end_month}) AS months_ready_end_months
                                FROM months_ready_for_use
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) months_ready ON plants.id = months_ready.plant_id`;
                    break;

                case 'edible':

                    // Select all the edible data and make them into an array
                    selector += `edible.edible_parts, edible.edible_use_identifiers, edible.edible_images, edible.edible_nutrition, edible.edible_preparation, edible.edible_preparation_type,`;

                    // Join the edible table
                    joiner += ` 
                                LEFT JOIN (
                                SELECT
                                plant_id,
                                ${joinCommand}(${tables.edible_part_of_plant}) AS edible_parts,
                                ${joinCommand}(${tables.edible_use_identifier}) AS edible_use_identifiers,
                                ${joinCommand}(${tables.edible_images}) AS edible_images,
                                ${joinCommand}(${tables.edible_nutrition}) AS edible_nutrition,
                                ${joinCommand}(${tables.edible_preparation}) AS edible_preparation,
                                ${joinCommand}(${tables.edible_preparation_type}) AS edible_preparation_type
                                FROM edible
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) edible ON plants.id = edible.plant_id`;
                    break;

                case 'medical':

                    // Select all the medical data and make them into an array
                    selector += `medical.medical_types, medical.medical_use_identifiers, medical.medical_uses, medical.medical_images, medical.medical_preparation,${restrictedData ? "medical.medical_restricteds," : ""}`;

                    // Join the medical table
                    joiner += `
                                LEFT JOIN (
                                SELECT
                                plant_id,
                                ${joinCommand}(${tables.medical_type}) AS medical_types,
                                ${joinCommand}(${tables.medical_use_identifier}) AS medical_use_identifiers,
                                ${joinCommand}(${tables.medical_use}) AS medical_uses,
                                ${joinCommand}(${tables.medical_images}) AS medical_images,
                                ${joinCommand}(${tables.medical_preparation}) AS medical_preparation
                                ${restrictedData ? ("," + joinCommand + "(" + tables.medical_restricted + ") AS medical_restricteds") : ""}
                                FROM medical
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) medical ON plants.id = medical.plant_id`;
                    break;

                case 'craft':

                    // Select all the craft data and make them into an array
                    selector += `craft.craft_parts, craft.craft_use_identifiers, craft.craft_uses, craft.craft_images, craft.craft_additional_info,`;

                    // Join the craft table
                    joiner += `
                                LEFT JOIN (
                                SELECT
                                plant_id,
                                ${joinCommand}(${tables.craft_part_of_plant}) AS craft_parts,
                                ${joinCommand}(${tables.craft_use_identifier}) AS craft_use_identifiers,
                                ${joinCommand}(${tables.craft_use}) AS craft_uses,
                                ${joinCommand}(${tables.craft_images}) AS craft_images,
                                ${joinCommand}(${tables.craft_additional_info}) AS craft_additional_info
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
                                ${joinCommand}(${tables.source_type}) AS source_types,
                                ${joinCommand}(${tables.source_data}) AS source_data
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
                                ${joinCommand}(${tables.custom_title}) AS custom_titles,
                                ${joinCommand}(${tables.custom_text}) AS custom_text
                                FROM custom
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) custom ON plants.id = custom.plant_id`;

                    break;

                case 'attachments':

                    // Select all the attachments data and make them into an array
                    selector += `attachments.attachment_path, attachments.attachment_type, attachments.attachment_meta, attachments.attachment_downloadable,`;

                    // Join the attachments table
                    joiner += ` LEFT JOIN (
                                SELECT
                                plant_id,
                                ${joinCommand}(${tables.attachment_path}) AS attachment_path,
                                ${joinCommand}(${tables.attachment_type}) AS attachment_type,
                                ${joinCommand}(${tables.attachment_meta}) AS attachment_meta,
                                ${joinCommand}(${tables.attachment_downloadable}) AS attachment_downloadable
                                FROM attachments
                                WHERE plant_id = ${id}
                                GROUP BY plant_id
                                ) attachments ON plants.id = attachments.plant_id`;
                    break

                default:
                    break;
            }

        }

        // If the selector is empty, return an error
        if(selector === ''){
            return ["error", "No tables of that type exist"]
        }

        // Remove the last comma from the selector
        selector = selector.slice(0, -1);

        // Add to the joiner
        joiner += ` WHERE plants.id = ${id}`;

        // Create the query
        let query = `
            SELECT
            ${selector}
            FROM ${process.env.MYSQL_DATABASE}.plants
            ${joiner};
        `;

        console.log(query);

        // Make the query
        const data = await makeQuery(query, client)

        // If the data is empty, return an error
        if(!data || data.length === 0)
            return ["error", "No data found"];

        // Get the post ids
        data[0].medical_images = parseImageIds(data[0].medical_images);
        data[0].edible_images = parseImageIds(data[0].edible_images);
        data[0].craft_images = parseImageIds(data[0].craft_images);
        data[0].display_images = parseImageId(data[0].display_images);

        // Remove duplicates
        let allPostIds: any = [];
        for (let i = 0; i < data[0].medical_images.length; i++) { allPostIds = allPostIds.concat(data[0].medical_images[i]); }
        for (let i = 0; i < data[0].edible_images.length; i++) { allPostIds = allPostIds.concat(data[0].edible_images[i]); }
        for (let i = 0; i < data[0].craft_images.length; i++) { allPostIds = allPostIds.concat(data[0].craft_images[i]); }
        allPostIds = allPostIds.concat(data[0].display_images);
        allPostIds = allPostIds.filter((id: any, index: any) => allPostIds.indexOf(id) === index);

        console.log(allPostIds);

        // Make sure that allPostIds is not empty
        if(allPostIds.length === 0) return ["success", data];

        // Get the post data
        query = `SELECT * FROM posts WHERE id IN (${allPostIds.join(",")})`;
        const postData = await makeQuery(query, client);

        // Add the post data to the data
        for (let i = 0; i < data[0].medical_images.length; i++) { data[0].medical_images[i] = data[0].medical_images[i].map((id: any) => postData.find((post: any) => post.id === id)); }
        for (let i = 0; i < data[0].edible_images.length; i++) { data[0].edible_images[i] = data[0].edible_images[i].map((id: any) => postData.find((post: any) => post.id === id)); }
        for (let i = 0; i < data[0].craft_images.length; i++) { data[0].craft_images[i] = data[0].craft_images[i].map((id: any) => postData.find((post: any) => post.id === id)); }
        data[0].display_images = data[0].display_images.map((id: any) => postData.find((post: any) => post.id === id));

        // If the data is not empty, return the data
        return ["success", data];

    } catch (error) {
        // If there is an error, return the error
        console.error(error);
        return ["error", error];
    }
}

const parseImageIds = (imageData: string) => {
    if(imageData === null) return [[]];
    return JSON.parse(imageData).map((imageIds: string) => {
            if(imageIds === null || imageIds == "") return [];
            return imageIds.split(",").map((id: string) => {
                return parseInt(id.trim().split("\n")[0])
            })
        }
    )
}

const parseImageId = (imageData: string) => {
    if(imageData === null || imageData == "") return [];
    return imageData.split(",").map((id: string) => {
        return parseInt(id.trim().split("\n")[0])
    })
}