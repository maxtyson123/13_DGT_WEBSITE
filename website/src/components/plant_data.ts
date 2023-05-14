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
        flags:          string[];
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
}

export function ConvertApiIntoPlantData(apiData : PlantDataApi){
    
    let plantData : PlantData = {
        id: 1,
        preferred_name: "",
        english_name: "",
        moari_name: "",
        latin_name: "",
        use: [],
        months_ready_for_use: [],
        location: "",
        small_description: "",
        long_description: "",
        attachments: [],
        sections: [],
    };

    // Basic info
    plantData.preferred_name = apiData.preferred_name;
    plantData.english_name = apiData.english_name;
    plantData.moari_name = apiData.maori_name;
    plantData.latin_name = apiData.latin_name;
    plantData.location = apiData.location;
    plantData.small_description = apiData.small_description;
    plantData.long_description = apiData.long_description;

    // Image info
    //TODO: Shit forgot to do attachments

    // Date info
    for(let i = 0; i < apiData.months_ready_events.length; i++) {
        let dateInfoOBJ = {
            event: apiData.months_ready_events[i],
            start_month: apiData.months_ready_start_months[i],
            end_month: apiData.months_ready_end_months[i],
        }

        plantData.months_ready_for_use.push(dateInfoOBJ);
    }

    // Edible info
    for(let i = 0; i < apiData.edible_parts.length; i++) {
        let edibleInfoOBJ = {
            type: "edible",
            part_of_plant: apiData.edible_parts[i],
            image_of_part: apiData.edible_images[i],
            nutrition: apiData.edible_nutrition[i],
            preparation: apiData.edible_preparation[i],
            preparation_type: apiData.edible_preparation_type[i],
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
            medical_type: apiData.medical_types[i],
            use: apiData.medical_uses[i],
            image: apiData.medical_images[i],
            preparation: apiData.medical_preparation[i],
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
            part_of_plant: apiData.craft_parts[i],
            use: apiData.craft_uses[i],
            image: apiData.craft_images[i],
            additonal_info: apiData.craft_additional_info[i],
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
            source_type: apiData.source_types[i],
            data: apiData.source_data[i],
        }

        plantData.sections.push(sourceInfoOBJ);
    }

    // Custom info
    for (let i = 0; i < apiData.custom_titles.length; i++) {
        let customInfoOBJ = {
            type: "custom",
            title: apiData.custom_titles[i],
            text: apiData.custom_text[i],
        }

        plantData.sections.push(customInfoOBJ);
    }



    return plantData;

}