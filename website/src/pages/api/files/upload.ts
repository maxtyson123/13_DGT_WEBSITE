import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery, PostgresSQL, SQLDatabase} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";
import {Form} from "multiparty";
import fs from "fs";
import Client from "ftp";
import {checkApiPermissions} from "@/lib/api_tools";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import { Logger } from 'next-axiom';

function createUpSertQuery(table: string, columns: string[], data: any[])
{
    // Create the upsert query
    let upsert_query = `INSERT INTO ${table} (`

    // Add the columns
    upsert_query += columns.join(", ")

    // Add the values
    upsert_query += `) VALUES (`

    // Loop through the data
    for(let i = 0; i < data.length; i++){
        upsert_query += `'${data[i]}'`
        if(i < data.length - 1){
            upsert_query += ", "
        }
    }

    // Add the ON DUPLICATE KEY UPDATE
    upsert_query += `) ON DUPLICATE KEY UPDATE `

    // Loop through the columns
    for(let i = 0; i < columns.length; i++){
        upsert_query += `${columns[i]} = VALUES(${columns[i]})`
        if(i < columns.length - 1){
            upsert_query += ", "
        }
    }

    // Add the end of the query
    upsert_query += ";"

    return upsert_query

}

function createBackUpQuery(json: any) {

    const tables = getTables();

    if(!json || !json.data)
        return

    let query = ""



    // Loop through the data
    for(let i = 0; i < json.data.length; i++){

        // Get the data
        const data = json.data[i][0]

        // Check if there is the id
        if(!data.id){
            continue
        }

        // Get the table names
        let tableNames = Object.keys(data)

        // Check if it is plant data
        if(tableNames.includes("preferred_name")) {
            let plantTable = json.data[i];
            for (let j = 0; j < plantTable.length; j++){
                // Has to be set at the start due to constraints
                let old = query

                query = createUpSertQuery("plants",
                    [tables.id, tables.preferred_name, tables.english_name, tables.maori_name, tables.latin_name, tables.location_found, tables.small_description, tables.long_description, tables.author, tables.last_modified, tables.display_images, tables.plant_type, tables.published],
                    [plantTable[j].id, plantTable[j].preferred_name, plantTable[j].english_name, plantTable[j].maori_name, plantTable[j].latin_name, plantTable[j].location_found, plantTable[j].small_description, plantTable[j].long_description, plantTable[j].author, plantTable[j].last_modified, plantTable[j].display_images, plantTable[j].plant_type, plantTable[j].published]
                )

                // Add the old query
                query += old
            }
            continue;
        }

        // Check if it is attachment data
        if(tableNames.includes("attachments_path")){

            let attachmentTable = json.data[i];
            for (let j = 0; j < attachmentTable.length; j++)
                query += createUpSertQuery("attachments",
                    [tables.id, tables.plant_id, tables.attachment_path, tables.attachment_type, tables.attachment_downloadable, tables.attachment_meta],
                    [attachmentTable[j].id, attachmentTable[j].plant_id, attachmentTable[j].attachments_path, attachmentTable[j].attachments_type, attachmentTable[j].attachments_downloadable, attachmentTable[j].attachments_meta]
                )
            continue;
        }

        // Check if it is craft data
        if(tableNames.includes("craft_part_of_plant")){
            let craftTable = json.data[i];
            for (let j = 0; j < craftTable.length; j++)
                query += createUpSertQuery("craft",
                    [tables.id, tables.plant_id, tables.craft_part_of_plant, tables.craft_use_identifier, tables.craft_use, tables.craft_images, tables.craft_additional_info],
                    [craftTable[j].id, craftTable[j].plant_id, craftTable[j].craft_part_of_plant, craftTable[j].craft_use_identifier, craftTable[j].craft_use, craftTable[j].craft_image, craftTable[j].craft_additional_info]
                )

            continue;
        }

        // Check if it is custom data
        if(tableNames.includes("custom_title")){
            let customTable = json.data[i];
            for (let j = 0; j < customTable.length; j++)
                query += createUpSertQuery("custom",
                    [tables.id, tables.plant_id, tables.custom_title, tables.custom_text],
                    [customTable[j].id, customTable[j].plant_id, customTable[j].custom_title, customTable[j].custom_text]
                )
            continue;
        }

        // Check if it is edible data
        if(tableNames.includes("edible_part_of_plant")){

            let edibleTable = json.data[i];
            for (let j = 0; j < edibleTable.length; j++)
                query += createUpSertQuery("edible",
                    [tables.id, tables.plant_id, tables.edible_part_of_plant, tables.edible_use_identifier, tables.edible_images, tables.edible_nutrition, tables.edible_preparation, tables.edible_preparation_type],
                    [edibleTable[j].id, edibleTable[j].plant_id, edibleTable[j].edible_part_of_plant, edibleTable[j].edible_use_identifier, edibleTable[j].edible_image, edibleTable[j].edible_nutrition, edibleTable[j].edible_preparation, edibleTable[j].edible_preparation_type]
                )
            continue;
        }

        // Check if it is medicinal data
        if(tableNames.includes("medical_use")){

            let medicalTable = json.data[i];
            for (let j = 0; j < medicalTable.length; j++)
                query += createUpSertQuery("medical",
                    [tables.id, tables.plant_id, tables.medical_type, tables.medical_use_identifier, tables.medical_use, tables.medical_images, tables.medical_preparation, tables.medical_restricted],
                    [medicalTable[j].id, medicalTable[j].plant_id, medicalTable[j].medical_type, medicalTable[j].medical_use_identifier, medicalTable[j].medical_use, medicalTable[j].medical_image, medicalTable[j].medical_preparation, medicalTable[j].medical_restricted]
                )
            continue;
        }

        // Check if it is months data
        if(tableNames.includes("months_event")){

            let monthsTable = json.data[i];
            for (let j = 0; j < monthsTable.length; j++)
                query += createUpSertQuery("months_ready_for_use",
                    [tables.id, tables.plant_id, tables.months_event, tables.months_start_month, tables.months_end_month],
                    [monthsTable[j].id, monthsTable[j].plant_id, monthsTable[j].months_event, monthsTable[j].months_start_month, monthsTable[j].months_end_month]
                )
            continue;
        }

        // Check if it is source data
        if(tableNames.includes("source_data")){
            let sourceTable = json.data[i];
            for (let j = 0; j < sourceTable.length; j++)
                query += createUpSertQuery("source",
                    [tables.id, tables.plant_id, tables.source_type, tables.source_data],
                    [sourceTable[j].id, sourceTable[j].plant_id, sourceTable[j].source_type, sourceTable[j].source_data]
                )
            continue;
        }

        // Check if it is user data
        if(tableNames.includes("user_email")) {
            let userTable = json.data[i];
            for (let j = 0; j < userTable.length; j++)
                query += createUpSertQuery("users",
                    [tables.id, tables.user_name, tables.user_email, tables.user_type, tables.user_last_login, tables.user_image, tables.user_restricted_access],
                    [userTable[j].id, userTable[j].user_name, userTable[j].user_email, userTable[j].user_type, userTable[j].user_last_login, userTable[j].user_image, userTable[j].user_restricted_access]
                )
            continue;
        }

        // Check if it is api key data
        if(tableNames.includes("api_key_name")) {
            let apiKeyTable = json.data[i];
            for (let j = 0; j < apiKeyTable.length; j++)
                query += createUpSertQuery("api_key",
                    [tables.id, tables.user_id, tables.api_key_name, tables.api_key_value, tables.api_key_last_used, tables.api_key_permissions, tables.api_key_logs],
                    [apiKeyTable[j].id, apiKeyTable[j].user_id, apiKeyTable[j].api_key_name, apiKeyTable[j].api_key_value, apiKeyTable[j].api_key_last_used, apiKeyTable[j].api_key_permissions, apiKeyTable[j].api_key_logs]
                )
            continue;
        }

        // Check if it is follows data
        if(tableNames.includes("follower_id")) {
            let followsTable = json.data[i];
            for (let j = 0; j < followsTable.length; j++)
                query += createUpSertQuery("follows",
                    [tables.id, tables.follower_id, tables.following_id],
                    [followsTable[j].id, followsTable[j].follower_id, followsTable[j].following_id]
                )
            continue;
        }

        // Check if it is posts data
        if(tableNames.includes("post_title")) {
            let postsTable = json.data[i];
            for (let j = 0; j < postsTable.length; j++)
                query += createUpSertQuery("posts",
                    [tables.id, tables.post_title, tables.post_plant_id, tables.post_user_id, tables.post_date, tables.post_image],
                    [postsTable[j].id, postsTable[j].post_title, postsTable[j].post_plant_id, postsTable[j].post_user_id, postsTable[j].post_date, postsTable[j].post_image]

                )
            continue;
        }

        // Check ifi ts likes data
        if(tableNames.includes("like_post_id")) {
            let likesTable = json.data[i];
            for (let j = 0; j < likesTable.length; j++)
                query += createUpSertQuery("likes",
                    [tables.id, tables.like_post_id, tables.like_user_id],
                    [likesTable[j].id, likesTable[j].like_post_id, likesTable[j].like_user_id]
                )
            continue;
        }


        // Check if it is conversations data
        if(tableNames.includes("conversation_user_one")) {
            let conversationsTable = json.data[i];
            for (let j = 0; j < conversationsTable.length; j++)
                query += createUpSertQuery("conversations",
                    [tables.id, tables.conversation_user_one, tables.conversation_user_two],
                    [conversationsTable[j].id, conversationsTable[j].conversation_user_one, conversationsTable[j].conversation_user_two]
                )
            continue;
        }

        // Check if it is messages data
        if(tableNames.includes("message_conversation_id")) {
            let messagesTable = json.data[i];
            for (let j = 0; j < messagesTable.length; j++)
                query += createUpSertQuery("messages",
                    [tables.id, tables.message_conversation_id, tables.message_user_id, tables.message_text, tables.message_date],
                    [messagesTable[j].id, messagesTable[j].message_conversation_id, messagesTable[j].message_user_id, messagesTable[j].message_text, messagesTable[j].message_date]
                )
            continue;
        }
    }

    console.log(query)
    return query;
}

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
    const client = await getClient()
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:files:upload:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    // Try uploading the data to the database
    try {
        try {

            // FTP config
            const ftpConfig = {
                host: process.env.FTP_HOST,
                port: 21,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD,
            };

            // Upload the file to the FTP server
            const form = new Form();

            // Parse the form
            form.parse(request, async (err, fields, files) => {

                // Get the fields
                let { id, api_key, path, backup } = fields;

                // Get the file
                const { file } = files;

                // If the backup is true, import the backup
                if(backup)
                if(backup[0] === "true"){

                    // Read the file from the file system into a JSON object
                    const query = createBackUpQuery(JSON.parse(fs.readFileSync(file[0].path, 'utf8')))

                    // Check if the query is null
                    if(!query){
                        return response.status(500).json({ error: 'Error creating backup query.' });
                    }

                    // Make the query
                    await makeQuery(query, client);
                    return response.status(200).json({ message: 'Backup imported successfully.' });
                }


                // Check if id is null
                if(!id){
                    return response.status(400).json({ error: 'No ID' });
                }

                // Check if path is null
                if(!path){
                    path = "plants";
                }

                // Check if there is an error
                if (err) {
                    return response.status(500).json({ error: 'Error parsing form data.', data: err });
                }

                // Check if there is a file
                if (!file) {
                    return response.status(400).json({ error: 'No file provided.' });
                }

                // Connect to the FTP server
                const ftp = new Client();
                ftp.on('ready', () => {

                    // Get the path to upload to
                    let folder = `/${path}/`

                    // If adding id
                    if(id != "ignore")
                        folder += `${id}/`

                    const remotePath = `${folder}/${file[0].originalFilename}`

                    const directories = folder.split('/').filter(Boolean);
                    let currentDir = '';

                    directories.forEach((directory) => {
                        currentDir += `/${directory}`;
                        ftp.mkdir(currentDir, (ftpErr) => {
                            if (ftpErr && (ftpErr as any).code !== 550) {
                                // 550 error code means the directory already exists,
                                // so ignore it and continue creating subdirectories
                                return response.status(500).json({ error: 'Error creating directory.' });
                            }
                        });
                    });

                    // Upload the file
                    ftp.put(file[0].path, remotePath, (ftpErr) => {

                        // Once done end the connection
                        ftp.end();

                        // If there is an error return it
                        if (ftpErr) {
                            return response.status(500).json({ error: 'Error uploading file.', data: ftpErr });
                        }

                        // Delete the file locally
                        fs.unlinkSync(file[0].path);

                        // Log the upload
                        const logger = new Logger()
                        logger.info(`File uploaded to ${remotePath} by ${session?.user?.email}`);

                        // Return that the file was uploaded
                        return response.status(200).json({ message: 'File uploaded successfully.', path: remotePath });
                    });
                });

                // If there is an error return it
                ftp.on('error', (ftpErr) => {
                    return response.status(500).json({ error: 'FTP connection error.' });
                });

                // Initiate the connection
                ftp.connect(ftpConfig);
            });
        }
        catch(err) {
            return response.status(500).json({message: "ERROR IN SERVER", error: err });
        }
    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
