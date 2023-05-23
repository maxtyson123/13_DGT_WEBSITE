// Define the data for the plant
export interface PlantData {
    id:                 number;
    preferred_name:     string;
    english_name:       string;
    moari_name:         string;
    latin_name:         string;
    use:                string[];
    months_ready_for_use: {
        event:          string,
        start_month:    string,
        end_month:      string,
    }[];
    location:           string;
    small_description:  string;
    long_description:   string;
    attachments: {
        path:           string;
        type:           string;
        name:           string;
        downloadable:   boolean;
    }[];
    sections:           any[];
}

export interface PlantDataApi {
    preferred_name:             string;
    english_name:               string;
    maori_name:                 string;
    latin_name:                 string;
    location:                   string;
    small_description:          string;
    long_description:           string;
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
    attachment_names:           string[];
    attachment_downloadable:    boolean[];

}

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
        apiData.attachment_names        = [];
        apiData.attachment_downloadable = [];
    }

    return apiData;
}

export function ValidPlantDataApi(apiData : PlantDataApi) : boolean {
    // Check that the data is valid
    return !(apiData.preferred_name             == null
        || apiData.english_name                 == null
        || apiData.maori_name                   == null
        || apiData.latin_name                   == null
        || apiData.location                     == null
        || apiData.small_description            == null
        || apiData.long_description             == null
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
        || apiData.attachment_names             == null
        || apiData.attachment_downloadable      == null
    );
}

export function ValidPlantData(plantData : PlantData) : boolean {

    return !(plantData.preferred_name       == null
        || plantData.english_name           == null
        || plantData.moari_name             == null
        || plantData.latin_name             == null
        || plantData.location               == null
        || plantData.small_description      == null
        || plantData.long_description       == null
        || plantData.months_ready_for_use   == null
        || plantData.use                    == null
        || plantData.attachments            == null
        || plantData.sections               == null
    );

}

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
    plantData.location          = apiData.location;
    plantData.small_description = apiData.small_description;
    plantData.long_description  = apiData.long_description;

    // Image info
    for(let i = 0; i < apiData.attachment_paths.length; i++) {
        let imageInfoOBJ = {
            path: "",
            type: "image",
            name: "",
            downloadable: false,
        }

        imageInfoOBJ.path           = apiData.attachment_paths[i];
        imageInfoOBJ.type           = apiData.attachment_types[i];
        imageInfoOBJ.name           = apiData.attachment_names[i];
        imageInfoOBJ.downloadable   = apiData.attachment_downloadable[i];
    }

    // Date info
    for(let i = 0; i < apiData.months_ready_events.length; i++) {
        let dateInfoOBJ = {
            event:          apiData.months_ready_events[i],
            start_month:    apiData.months_ready_start_months[i],
            end_month:      apiData.months_ready_end_months[i],
        }

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
        }

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
        }

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
        }

        // If it isn't already in the use array, add it
        if(!plantData.use.includes("craft")){
            plantData.use.push("craft");
        }

        plantData.sections.push(craftInfoOBJ);
    }

    // Source info
    for(let i = 0; i < apiData.source_types.length; i++) {
         let sourceInfoOBJ = {
            type: "source",
            source_type:    apiData.source_types[i],
            data:           apiData.source_data[i],
        }

        plantData.sections.push(sourceInfoOBJ);
    }

    // Custom info
    for (let i = 0; i < apiData.custom_titles.length; i++) {
        let customInfoOBJ = {
            type: "custom",
            title:  apiData.custom_titles[i],
            text:   apiData.custom_text[i],
        }

        plantData.sections.push(customInfoOBJ);
    }

    return plantData;

}

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
    apiData.location          = plantData.location;
    apiData.small_description = plantData.small_description;
    apiData.long_description  = plantData.long_description;

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
        apiData.attachment_names.push(plantData.attachments[i].name);
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

            case "source":
                apiData.source_types.push(plantData.sections[i].source_type);
                apiData.source_data.push(plantData.sections[i].data);
                break;

            case "custom":
                apiData.custom_titles.push(plantData.sections[i].title);
                apiData.custom_text.push(plantData.sections[i].text);
                break;

            default:
                break;
        }
    }

    // Return the data
    return apiData;

}

export function emptyPlantData(){
    const plantData : PlantData = {
        id:                     1,
        preferred_name:         "",
        english_name:           "",
        moari_name:             "",
        latin_name:             "",
        use:                    [],
        months_ready_for_use:   [],
        location:               "",
        small_description:      "",
        long_description:       "",
        attachments:            [],
        sections:               [],
    };

    return plantData;
}

export function emptyPlantApiData(){
    // Create the api data object
    let apiData : PlantDataApi = {
        preferred_name:             "",
        english_name:               "",
        maori_name:                 "",
        latin_name:                 "",
        location:                   "",
        small_description:          "",
        long_description:           "",
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
        attachment_names:           [],
        attachment_downloadable:    [],
    };

    return apiData;
}