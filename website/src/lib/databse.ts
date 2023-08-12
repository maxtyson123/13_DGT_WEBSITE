// Class for the names of the database tables depending  on SQL or  postgresSQL
import {USE_POSTGRES} from "@/lib/constants";
import {db, VercelPoolClient} from "@vercel/postgres";

const sqlDb = require('mysql2-async').default;

/**
 * Class for the names of the columns in the database
 */
export class SQLDatabase {

    database: string;

    // Generic
    id: string;
    plant_id: string;

    // Plants Table
    preferred_name: string;
    english_name: string;
    maori_name: string;
    latin_name: string;
    location_found: string;
    small_description: string;
    long_description: string;
    author: string;
    last_modified: string;
    display_image: string;
    plant_type: string;

    // Attachments Table
    attachment_path: string;
    attachment_type: string;
    attachment_meta: string;
    attachment_downloadable: string;

    // Craft Table
    craft_part_of_plant: string;
    craft_use_identifier: string;
    craft_use: string;
    craft_additional_info: string;
    craft_image: string;

    // Custom Table
    custom_title: string;
    custom_text: string;

    // Edible Table
    edible_part_of_plant: string;
    edible_use_identifier: string;
    edible_image_of_part: string;
    edible_nutrition: string;
    edible_preparation: string;
    edible_preparation_type: string;

    // Medical Table
    medical_type: string;
    medical_use_identifier: string;
    medical_use: string;
    medical_image: string;
    medical_preparation: string;

    // Source Table
    source_type: string;
    source_data: string;

    // Months For Use Table
    months_event: string;
    months_start_month: string;
    months_end_month: string;

    // Auth Table
    auth_entry: string;
    auth_type: string;
    auth_nickname: string;
    auth_permissions: string;

    constructor() {
        this.database = "rongoa8jwons3_rongoadb"

        // Generic
        this.id = "id";
        this.plant_id = "plant_id";

        // Plants Table
        this.preferred_name             = "preferred_name";
        this.english_name               = "english_name";
        this.maori_name                 = "maori_name";
        this.latin_name                 = "latin_name";
        this.location_found             = "location_found";
        this.small_description          = "small_description";
        this.long_description           = "long_description";
        this.author                     = "author";
        this.last_modified              = "last_modified";
        this.display_image              = "display_image";
        this.plant_type                 = "plant_type";

        // Attachments Table
        this.attachment_path            = "attachments_path";
        this.attachment_type            = "attachments_type";
        this.attachment_meta            = "attachments_meta";
        this.attachment_downloadable    = "attachments_downloadable";

        // Craft Table
        this.craft_part_of_plant        = "craft_part_of_plant";
        this.craft_use_identifier       = "craft_use_identifier";
        this.craft_use                  = "craft_use";
        this.craft_additional_info      = "craft_additional_info";
        this.craft_image                = "craft_image";

        // Custom Table
        this.custom_title               = "custom_title";
        this.custom_text                = "custom_text";

        // Edible Table
        this.edible_part_of_plant       = "edible_part_of_plant";
        this.edible_use_identifier      = "edible_use_identifier";
        this.edible_image_of_part       = "edible_image";
        this.edible_nutrition           = "edible_nutrition";
        this.edible_preparation         = "edible_preparation";
        this.edible_preparation_type    = "edible_preparation_type";

        // Medical Table
        this.medical_type               = "medical_type";
        this.medical_use_identifier     = "medical_use_identifier";
        this.medical_use                = "medical_use";
        this.medical_image              = "medical_image";
        this.medical_preparation        = "medical_preparation";

        // Source Table
        this.source_type                = "source_type";
        this.source_data                = "source_data";

        // Months For Use Table
        this.months_event               = "months_event";
        this.months_start_month         = "months_start_month";
        this.months_end_month           = "months_end_month";

        // Auth Table
        this.auth_entry                 = "auth_entry";
        this.auth_type                  = "auth_type";
        this.auth_nickname              = "auth_nickname";
        this.auth_permissions           = "auth_permissions";

    }
}

/**
 * Class for the names of the columns in the database, POSTGRES SQL names allow for the use of reserved words
 *
 * @see {@link SQLDatabase}
 * @see {@link [Reserved](https://www.postgresql.org/docs/9.2/sql-keywords-appendix.html)}
 */
export class PostgresSQL extends SQLDatabase{

    constructor() {
        super();

        this.database = "public"

        // Generic
        this.id = "id";
        this.plant_id = "plant_id";

        // Plants Table
        // -- DOESN'T  CHANGE

        // Attachments Table
        this.attachment_path            = "path";
        this.attachment_type            = "type";
        this.attachment_meta            = "meta";
        this.attachment_downloadable    = "downloadable";

        // Craft Table
        this.craft_part_of_plant        = "part_of_plant";
        this.craft_use_identifier       = "use_identifier";
        this.craft_use                  = "use";
        this.craft_additional_info      = "additional_info";
        this.craft_image                = "image";

        // Custom Table
        this.custom_title               = "title";
        this.custom_text                = "text";

        // Edible Table
        this.edible_part_of_plant       = "part_of_plant";
        this.edible_use_identifier      = "use_identifier";
        this.edible_image_of_part       = "image_of_part";
        this.edible_nutrition           = "nutrition";
        this.edible_preparation         = "preparation";
        this.edible_preparation_type    = "preparation_type";

        // Medical Table
        this.medical_type               = "medical_type";
        this.medical_use_identifier     = "use_identifier";
        this.medical_use                = "use";
        this.medical_image              = "image";
        this.medical_preparation        = "preparation";

        // Source Table
        this.source_type                = "source_type";
        this.source_data                = "data";

        // Months For Use Table
        this.months_event               = "event";
        this.months_start_month         = "start_month";
        this.months_end_month           = "end_month";

        // Auth Table
        this.auth_entry                 = "entry";
        this.auth_type                  = "type";
        this.auth_nickname              = "nickname";
        this.auth_permissions           = "permissions";
    }
}

/**
 * Checks what database to use and returns the correct column name class
 *
 * @see {@link SQLDatabase}
 * @see {@link PostgresSQL}
 * @see {@link USE_POSTGRES}
 *
 * @returns {SQLDatabase} - The correct column name class
 */
export function getTables(){
    let tables = new SQLDatabase();

    // Set the tables to use
    if(USE_POSTGRES) {
        tables = new PostgresSQL();
    }

    return tables
}


/**
 * Checks what database to use and then returns the correct database connection
 *
 * @see {@link mysql_db}
 * @see {@link db}
 * @see {@link USE_POSTGRES}
 *
 * @returns {VercelPoolClient} - The correct database connection
 */
export async function getClient(){

    const dataBase = USE_POSTGRES ? db : new sqlDb({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 1234,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        skiptzfix: true,
        multipleStatements: true,
    });

    let client: any = dataBase

    // Vercel POSTGRES requires a client to be created
    if(USE_POSTGRES)
        client = await dataBase.connect();

    return client
}

/**
 * Makes a query to the database and returns the data. Query and response is different depending on the database used, this is handled by this function depending on the USE_POSTGRES variable meaning to get the client getClient() should be used
 *
 * @param {string} query - The query to make to the database
 * @param client - The database connection to use
 * @param {boolean} rawData - If the data returned should be raw data or not
 *
 * @see {@link getClient}
 *
 * @returns {JSON | null} - The data returned from the database in JSON format, null if there was an error or no data was returned
 */
export async function makeQuery(query: string, client: any, rawData : boolean = false){
    let data;

    try{

        if(USE_POSTGRES){
            // Get the data from the database
            data  = await client.query(query);


            // If the data is not to be raw the process it
            if(!rawData)
                data = data.rows

        }else{
            // Get the data from the database
            data  = await client.getall(query);
        }

        return data

    } catch (e) {
        console.log("ERROR")
        console.log(e)
        return null
    }
}