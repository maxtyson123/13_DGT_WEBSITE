import {getFromCache, saveToCache} from "@/lib/cache";
import axios from "axios";
import {USE_POSTGRES} from "@/lib/constants";

/**
 * The data for the plant in a more readable format and easier to use programmatically with a lot of the data from the api moved into arrays of objects
 */
export interface PlantData {
    id:                 number;
    preferred_name:     string;
    english_name:       string;
    moari_name:         string;
    latin_name:         string;
    use:                string[];
    months_ready_for_use: MonthsReadyData[];
    location_found:     string;
    small_description:  string;
    long_description:   string;
    author:             string;
    last_modified:      string;
    attachments:        AttachmentData[];
    sections:           any[];
}

/**
 * Raw column data from the database
 */
export interface PlantDataApi {
    preferred_name:             string;
    english_name:               string;
    maori_name:                 string;
    latin_name:                 string;
    location_found:             string;
    small_description:          string;
    long_description:           string;
    author:                     string;
    last_modified:              string;
    months_ready_events:        string[];
    months_ready_start_months:  string[];
    months_ready_end_months:    string[];
    edible_parts:               string[];
    edible_images:              string[];
    edible_nutrition:           string[];
    edible_preparation:         string[];
    edible_preparation_type:    string[];
    medical_types:              string[];
    medical_uses:               string[];
    medical_images:             string[];
    medical_preparation:        string[];
    craft_parts:                string[];
    craft_uses:                 string[];
    craft_images:               string[];
    craft_additional_info:      string[];
    source_types:               string[];
    source_data:                string[];
    custom_titles:              string[];
    custom_text:                string[];
    attachment_paths:           string[];
    attachment_types:           string[];
    attachment_metas:           string[];
    attachment_downloadable:    boolean[];

}

/**
 * Meta data for an image, (attachment.meta)
 *
 * @see {@link AttachmentSectionData}
 */
export interface ImageMetaData {
    name:       string;
    credits:    string;
    tags:       string[];
}

/**
 * Meta data for a file, (attachment.meta)
 *
 * @see {@link AttachmentSectionData}
 */
export interface FileMetaData{
    name:       string;
    credits:    string;
    size:       number;
}

/**
 * The format of an edible section
 *
 * @see {@link PlantData.sections}
 */
export interface EdibleSectionData{
    type:               string;
    part_of_plant:      string;
    image_of_part:      string;
    nutrition:          string;
    preparation:        string;
    preparation_type:   string;
}

/**
 * The format of a medical section
 *
 * @see {@link PlantData.sections}
 */
export interface MedicalSectionData{
    type:               string;
    medical_type:       string;
    use:                string;
    image:              string;
    preparation:        string;
}

/**
 * The format of a craft section
 *
 * @see {@link PlantData.sections}
 */
export interface CraftSectionData{
    type:               string;
    part_of_plant:      string;
    use:                string;
    image:              string;
    additonal_info:     string;
}

/**
 * The format of a source section
 *
 * @see {@link PlantData.sections}
 */
export interface SourceSectionData{
    type:           string;
    source_type:    string;
    data:           string;
}

/**
 * The format of a custom section
 *
 * @see {@link PlantData.sections}
 */
export interface CustomSectionData{
    type:           string;
    title:          string;
    text:           string;
}

/**
 * The format of an attachment
 *
 * @see {@link PlantData.attachments}
 */
export interface AttachmentData {
    type:           string;
    path:           string;
    meta:           object;
    downloadable:   boolean;
}

/**
 * The format of an event in the months ready for use section
 *
 * @see {@link PlantData.months_ready_for_use}
 */
export interface MonthsReadyData {
    event:          string;
    start_month:    string;
    end_month:      string;
}

/**
 * Formats the size of a file in bytes to a more readable format
 *
 * @param {number} bytes - The size of the file in bytes
 *
 * @returns {string} - The size of the file in a more readable format (e.g. 1.23 MB)
 */
export function formatFileSize(bytes: number) {
    const suffixes = ['B', 'kB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`;
}

/**
 * Will clean the data from the api, this makes sure any null values are set to empty arrays.
 *
 * @param apiData {PlantDataApi} - The data from the api
 */
export function CleanAPIData(apiData : PlantDataApi) : PlantDataApi {

    // If this plant has no months section, set the months ready to an empty array
    if (apiData.months_ready_events == null) {
        apiData.months_ready_events         = [];
        apiData.months_ready_start_months   = [];
        apiData.months_ready_end_months     = [];
    }

    // If this plant has no edible section, set the edible parts to an empty array
    if (apiData.edible_parts == null) {
        apiData.edible_parts                = [];
        apiData.edible_images               = [];
        apiData.edible_nutrition            = [];
        apiData.edible_preparation          = [];
        apiData.edible_preparation_type     = [];
    }

    // If this plant has no medical section, set the medical types to an empty array
    if (apiData.medical_types == null) {
        apiData.medical_types           = [];
        apiData.medical_uses            = [];
        apiData.medical_images          = [];
        apiData.medical_preparation     = [];
    }

    // If this plant has no craft section, set the craft parts to an empty array
    if (apiData.craft_parts == null) {
        apiData.craft_parts             = [];
        apiData.craft_uses              = [];
        apiData.craft_images            = [];
        apiData.craft_additional_info   = [];
    }

    // If this plant has no source section, set the source types to an empty array
    if (apiData.source_types == null) {
        apiData.source_types    = [];
        apiData.source_data     = [];
    }

    // If this plant has no custom section, set the custom titles to an empty array
    if (apiData.custom_titles == null) {
        apiData.custom_titles   = [];
        apiData.custom_text     = [];
    }

    // If this plant has no attachment section, set the attachment paths to an empty array
    if (apiData.attachment_paths == null) {
        apiData.attachment_paths        = [];
        apiData.attachment_types        = [];
        apiData.attachment_metas        = [];
        apiData.attachment_downloadable = [];
    }

    // On non postgres some double parse is needed
    if(!USE_POSTGRES) {

        // Main data is clean

        // Craft data needs to be parsed
        apiData.craft_parts             = tryParse(apiData.craft_parts)
        apiData.craft_uses              = tryParse(apiData.craft_uses)
        apiData.craft_images            = tryParse(apiData.craft_images)


        // Custom data needs to be parsed
        apiData.custom_titles   = tryParse(apiData.custom_titles)
        apiData.custom_text     = tryParse(apiData.custom_text)

        // Edible data needs to be parsed
        apiData.edible_parts                = tryParse(apiData.edible_parts)
        apiData.edible_images               = tryParse(apiData.edible_images)
        apiData.edible_nutrition            = tryParse(apiData.edible_nutrition)
        apiData.edible_preparation          = tryParse(apiData.edible_preparation)
        apiData.edible_preparation_type     = tryParse(apiData.edible_preparation_type)

        // Medical data needs to be parsed
        apiData.medical_types           = tryParse(apiData.medical_types)
        apiData.medical_uses            = tryParse(apiData.medical_uses)
        apiData.medical_images          = tryParse(apiData.medical_images)
        apiData.medical_preparation     = tryParse(apiData.medical_preparation)

        // Months data needs to be parsed
        apiData.months_ready_events         = tryParse(apiData.months_ready_events)
        apiData.months_ready_start_months   = tryParse(apiData.months_ready_start_months)
        apiData.months_ready_end_months     = tryParse(apiData.months_ready_end_months)

        // Source data needs to be parsed
        apiData.source_types    = tryParse(apiData.source_types)
        apiData.source_data     = tryParse(apiData.source_data)

        // Attachment data needs to be parsed
        apiData.attachment_paths = tryParse(apiData.attachment_paths)
        apiData.attachment_types = tryParse(apiData.attachment_types)
        apiData.attachment_metas = tryParse(apiData.attachment_metas)
        apiData.attachment_downloadable = tryParse(apiData.attachment_downloadable)
    }

    return apiData;
}

function tryParse(data : any) : any {
    try {
        return JSON.parse(data as any);
    } catch (e) {
        return data;
    }
}

/**
 * Will validate the data from the api, this makes sure no null values are present.
 *
 * @param {PlantDataApi} apiData - The data from the api
 *
 * @returns {boolean} - True if the data is valid, false otherwise
 */
export function ValidPlantDataApi(apiData : PlantDataApi) : boolean {
    // Check that the data is valid
    return !(apiData.preferred_name             == null
        || apiData.english_name                 == null
        || apiData.maori_name                   == null
        || apiData.latin_name                   == null
        || apiData.location_found               == null
        || apiData.small_description            == null
        || apiData.long_description             == null
        || apiData.author                       == null
        || apiData.last_modified                == null
        || apiData.months_ready_events          == null
        || apiData.months_ready_start_months    == null
        || apiData.months_ready_end_months      == null
        || apiData.edible_parts                 == null
        || apiData.edible_images                == null
        || apiData.edible_nutrition             == null
        || apiData.edible_preparation           == null
        || apiData.edible_preparation_type      == null
        || apiData.medical_types                == null
        || apiData.medical_uses                 == null
        || apiData.medical_images               == null
        || apiData.medical_preparation          == null
        || apiData.craft_parts                  == null
        || apiData.craft_uses                   == null
        || apiData.craft_images                 == null
        || apiData.craft_additional_info        == null
        || apiData.source_types                 == null
        || apiData.source_data                  == null
        || apiData.custom_titles                == null
        || apiData.custom_text                  == null
        || apiData.attachment_paths             == null
        || apiData.attachment_types             == null
        || apiData.attachment_metas             == null
        || apiData.attachment_downloadable      == null
    );
}

/**
 * Will validate the plant data, this makes sure no null values are present.
 *
 * @param {PlantData} plantData - The data from the api
 *
 * @returns {boolean} - True if the data is valid, false otherwise
 */
export function ValidPlantData(plantData : PlantData) : boolean {

    return !(plantData.preferred_name       == null
        || plantData.english_name           == null
        || plantData.moari_name             == null
        || plantData.latin_name             == null
        || plantData.location_found         == null
        || plantData.small_description      == null
        || plantData.long_description       == null
        || plantData.author                 == null
        || plantData.last_modified          == null
        || plantData.months_ready_for_use   == null
        || plantData.use                    == null
        || plantData.attachments            == null
        || plantData.sections               == null
    );

}

/**
 * Will convert the api data into the plant data object, if the data is invalid null will be returned.
 *
 * @param {PlantDataApi} apiData - The data from the api
 *
 * @returns {PlantData} - The plant data object
 */
export function ConvertApiIntoPlantData(apiData : PlantDataApi){

    // Check that the data is valid
    if (!ValidPlantDataApi(apiData)) {
        return null;
    }

    // Create the plant data object
    let plantData = emptyPlantData()

    // Basic info
    plantData.preferred_name    = apiData.preferred_name;
    plantData.english_name      = apiData.english_name;
    plantData.moari_name        = apiData.maori_name;
    plantData.latin_name        = apiData.latin_name;
    plantData.location_found    = apiData.location_found;
    plantData.small_description = apiData.small_description;
    plantData.long_description  = apiData.long_description;
    plantData.author            = apiData.author;
    plantData.last_modified     = apiData.last_modified;

    // Image info
    for(let i = 0; i < apiData.attachment_paths.length; i++) {
        let imageInfoOBJ = {
            path: "",
            type: "",
            meta: {},
            downloadable: false
        }

        imageInfoOBJ.path           = apiData.attachment_paths[i];
        imageInfoOBJ.type           = apiData.attachment_types[i];
        imageInfoOBJ.meta           = apiData.attachment_metas[i];
        imageInfoOBJ.downloadable   = apiData.attachment_downloadable[i];

        plantData.attachments.push(imageInfoOBJ);
    }

    // Date info
    for(let i = 0; i < apiData.months_ready_events.length; i++) {
        let dateInfoOBJ = {
            event:          apiData.months_ready_events[i],
            start_month:    apiData.months_ready_start_months[i],
            end_month:      apiData.months_ready_end_months[i],
        } as MonthsReadyData;

        plantData.months_ready_for_use.push(dateInfoOBJ);
    }

    // Edible info
    for(let i = 0; i < apiData.edible_parts.length; i++) {
        let edibleInfoOBJ = {
            type: "edible",
            part_of_plant:      apiData.edible_parts[i],
            image_of_part:      apiData.edible_images[i],
            nutrition:          apiData.edible_nutrition[i],
            preparation:        apiData.edible_preparation[i],
            preparation_type:   apiData.edible_preparation_type[i],
        } as EdibleSectionData;

        // If it isn't already in the use array, add it
        if(!plantData.use.includes("edible")){
            plantData.use.push("edible");
        }

        plantData.sections.push(edibleInfoOBJ);
    }

    // Medicinal info
    for(let i = 0; i < apiData.medical_uses.length; i++) {
        let medicalInfoOBJ = {
            type: "medical",
            medical_type:   apiData.medical_types[i],
            use:            apiData.medical_uses[i],
            image:          apiData.medical_images[i],
            preparation:    apiData.medical_preparation[i],
        } as MedicalSectionData;

        // If it isn't already in the use array, add it
        if(!plantData.use.includes("medical_"+medicalInfoOBJ.medical_type)){
            plantData.use.push("medical_"+medicalInfoOBJ.medical_type);
        }

        plantData.sections.push(medicalInfoOBJ);
    }

    // Craft info
    for(let i = 0; i < apiData.craft_uses.length; i++) {
        let craftInfoOBJ = {
            type: "craft",
            part_of_plant:      apiData.craft_parts[i],
            use:                apiData.craft_uses[i],
            image:              apiData.craft_images[i],
            additonal_info:     apiData.craft_additional_info[i],
        } as CraftSectionData;

        // If it isn't already in the use array, add it
        if(!plantData.use.includes("craft")){
            plantData.use.push("craft");
        }

        plantData.sections.push(craftInfoOBJ);
    }

    // Custom info
    for (let i = 0; i < apiData.custom_titles.length; i++) {
        let customInfoOBJ = {
            type: "custom",
            title:  apiData.custom_titles[i],
            text:   apiData.custom_text[i],
        } as CustomSectionData;

        plantData.sections.push(customInfoOBJ);
    }

    // Source info
    for(let i = 0; i < apiData.source_types.length; i++) {
        let sourceInfoOBJ = {
            type: "source",
            source_type:    apiData.source_types[i],
            data:           apiData.source_data[i],
        } as SourceSectionData

        plantData.sections.push(sourceInfoOBJ);
    }

    return plantData;

}

/**
 * Convert the plant data object into the api data object, if it not valid return null
 *
 * @param {PlantData} plantData - The plant data object
 *
 * @returns {PlantDataApi} - The api data object
 */
export function ConvertPlantDataIntoApi(plantData : PlantData){

    // Check that the data is valid
    if (!ValidPlantData(plantData)) {
        return null;
    }

    // Create the api data object
    let apiData = emptyPlantApiData()

    // Basic info
    apiData.preferred_name    = plantData.preferred_name;
    apiData.english_name      = plantData.english_name;
    apiData.maori_name        = plantData.moari_name;
    apiData.latin_name        = plantData.latin_name;
    apiData.location_found    = plantData.location_found;
    apiData.small_description = plantData.small_description;
    apiData.long_description  = plantData.long_description;
    apiData.author            = plantData.author;
    apiData.last_modified     = plantData.last_modified;

    // Date info
    for(let i = 0; i < plantData.months_ready_for_use.length; i++) {
        apiData.months_ready_events.push(plantData.months_ready_for_use[i].event);
        apiData.months_ready_start_months.push(plantData.months_ready_for_use[i].start_month);
        apiData.months_ready_end_months.push(plantData.months_ready_for_use[i].end_month);
    }

    // Attachment info
    for(let i = 0; i < plantData.attachments.length; i++) {
        apiData.attachment_paths.push(plantData.attachments[i].path);
        apiData.attachment_types.push(plantData.attachments[i].type);
        apiData.attachment_metas.push(JSON.stringify(plantData.attachments[i].meta));
        apiData.attachment_downloadable.push(plantData.attachments[i].downloadable);
    }

    // Loop through the sections
    for(let i = 0; i < plantData.sections.length; i++) {

        switch (plantData.sections[i].type) {
            case "edible":
                apiData.edible_parts.push(plantData.sections[i].part_of_plant);
                apiData.edible_images.push(plantData.sections[i].image_of_part);
                apiData.edible_nutrition.push(plantData.sections[i].nutrition);
                apiData.edible_preparation.push(plantData.sections[i].preparation);
                apiData.edible_preparation_type.push(plantData.sections[i].preparation_type);
                break;

            case "medical":
                apiData.medical_types.push(plantData.sections[i].medical_type);
                apiData.medical_uses.push(plantData.sections[i].use);
                apiData.medical_images.push(plantData.sections[i].image);
                apiData.medical_preparation.push(plantData.sections[i].preparation);
                break;

            case "craft":
                apiData.craft_parts.push(plantData.sections[i].part_of_plant);
                apiData.craft_uses.push(plantData.sections[i].use);
                apiData.craft_images.push(plantData.sections[i].image);
                apiData.craft_additional_info.push(plantData.sections[i].additonal_info);
                break;

            case "custom":
                apiData.custom_titles.push(plantData.sections[i].title);
                apiData.custom_text.push(plantData.sections[i].text);
                break;

            case "source":
                apiData.source_types.push(plantData.sections[i].source_type);
                apiData.source_data.push(plantData.sections[i].data);
                break;

            default:
                break;
        }
    }

    // Return the data
    return apiData;

}

/**
 * Will make an empty plant data object. The id will be set to 1
 */
export function emptyPlantData(){
    const plantData : PlantData = {
        id:                     1,
        preferred_name:         "",
        english_name:           "",
        moari_name:             "",
        latin_name:             "",
        use:                    [],
        months_ready_for_use:   [],
        location_found:         "",
        small_description:      "",
        long_description:       "",
        author:                 "",
        last_modified:          "",
        attachments:            [],
        sections:               [],
    };

    return plantData;
}

/**
 * Will make an empty plant api data object. The date will be set to the current date
 */
export function emptyPlantApiData(){
    // Create the api data object
    let apiData : PlantDataApi = {
        preferred_name:             "",
        english_name:               "",
        maori_name:                 "",
        latin_name:                 "",
        location_found:             "",
        small_description:          "",
        long_description:           "",
        author:                     "",
        last_modified:              new Date().toISOString(),
        months_ready_events:        [],
        months_ready_start_months:  [],
        months_ready_end_months:    [],
        edible_parts:               [],
        edible_images:              [],
        edible_nutrition:           [],
        edible_preparation:         [],
        edible_preparation_type:    [],
        medical_types:              [],
        medical_uses:               [],
        medical_images:             [],
        medical_preparation:        [],
        craft_parts:                [],
        craft_uses:                 [],
        craft_images:               [],
        craft_additional_info:      [],
        source_types:               [],
        source_data:                [],
        custom_titles:              [],
        custom_text:                [],
        attachment_paths:           [],
        attachment_types:           [],
        attachment_metas:           [],
        attachment_downloadable:    [],
    };

    return apiData;
}

/**
 * Will return the names in the order of the preference, this is an easier way to display the preferred name without having to do a switch statement
 *
 * @param {PlantData} data - The plant data to get the names from
 *
 * @returns {string[]} - The names in the order of the preference
 */
export function getNamesInPreference(data: PlantData){
    let localNames = ["None", "None", "None"]

    // Set the names based on the preferred name
    switch (data.preferred_name){
        case "English":
            localNames[0] = data.english_name
            localNames[1] = data.moari_name
            localNames[2] = data.latin_name
            break

        case "Moari":
            localNames[0] = data.moari_name
            localNames[1] = data.english_name
            localNames[2] = data.latin_name
            break

        case "Latin":
            localNames[0] = data.latin_name
            localNames[1] = data.english_name
            localNames[2] = data.moari_name
            break
    }

    return localNames;
}

/**
 * Using an ID it will fetch the plant data from the api and return it. First it will check the cache to see if the data has already been fetched, if it has not then the API will be called to get the data and then saved to a cache entry of that id. If the data could not be fetched then null will be returned
 *
 * @param {number} id - The id of the plant to fetch
 *
 * @returns {PlantData | null} - The plant data or null if it could not be fetched
 */
export async function fetchPlant (id: number) {

    // Check if the plant data has already been fetched
    let plantOBJ = getFromCache("plant_" + id) as PlantData | null

    if(plantOBJ === null) {

        try {
            // Get the plant data from the api
            const res = await axios.get(`/api/plants/json?id=${id}&operation=download`);
            const plantData = res.data.data

            // Typecast the plant data to the PlantData type (this is because it is know to return the PlantData type by the api - checking is done there)
            plantOBJ = plantData as PlantData

            // Set the plant data in the cache
            saveToCache("plant_" + id, plantOBJ)


        } catch (e) {

            // If there is an error just log it and set the plant card to the loading card
            console.log("Error fetching plant data from api")
            return null;
        }
    }

    // Set the plant data
    return plantOBJ;
}

/**
 * Will fix the paths of the attachments to be the proper path, this is because when uploading the attachments the path is set to the local path on the server, this will change it to the public path. The local path is used as the plant has no way of knowing its ID until it is saved to the database, it will ignore any attachments that start with http as they are already using the public path.
 *
 * @param {PlantData} plant - The plant data to fix the paths of
 *
 * @returns {PlantData} - The plant data with the fixed paths
 */
export function fixAttachmentsPaths (plant: PlantData) {
    // Check if the plant has any attachments
    if(plant.attachments.length === 0) {
        return plant;
    }

    // Loop through the attachments and set the proper path
    for(let i = 0; i < plant.attachments.length; i++) {

        // If the attachment doesn't start with a website url then it is using this server
        if(plant.attachments[i].path.startsWith("http")) {
            continue;
        }

        plant.attachments[i].path = `${process.env.NEXT_PUBLIC_FTP_PUBLIC_URL}/plants/${plant.id}/${plant.attachments[i].path}`;
    }

    return plant;
}