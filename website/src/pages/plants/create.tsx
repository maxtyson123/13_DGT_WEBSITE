import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import PageHeader from "@/components/page_header";
import styles from "@/styles/create.module.css";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import {
    AdvandcedTextArea,
    DropdownInput,
    SimpleTextArea,
    SmallInput,
    ValidationState
} from "@/components/input_sections";
import Image from "next/image";

import {ConvertPlantDataIntoApi, emptyPlantData, fetchPlant, PlantData, ValidPlantData} from "@/modules/plant_data";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import axios from "axios";

import {MONTHS, PLANT_PARTS} from "@/modules/constants"
import {useRouter} from "next/router";
import {Error} from "@/components/error";
/// _______________ SECTIONS _______________ ///
class SourceInfo {

    // Store the data for the section at its current state
    state = {
        type: "",
        data: "",
    };

    // Store the validation state for each input
    valid = {
        type: ["normal", "No Error"] as [ValidationState, string],
        data: ["normal", "No Error"] as [ValidationState, string]
    }

    // The section to be rendered
    section: JSX.Element = <></>;

    // Change Handlers that update the state
    handleTypeChange = (value : string) => {this.state.type = value};
    handleDataChange = (value : string) => {this.state.data = value};


    // Functions to update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <SourceSection
                typeHandler={this.handleTypeChange}
                dataHandler={this.handleDataChange}
                valid={this.valid}
                state={this.state}
            />
        );
    }

    reRenderSection = () => {
        const updatedSection = React.cloneElement(
            this.section,
            {
                valid: this.valid,
                state: this.state
            }
        );
        this.setSection(updatedSection);
    }

    // Validate each input
    validate = () => {
        let isValid = true;

        // If there is no type selected then show an error otherwise the input is valid
        if(this.state.type === ""){
            this.valid.type = ["error", "Please select a source type"] as [ValidationState, string];
            isValid = false;
        } else { this.valid.type = ["success", "No Error"] as [ValidationState, string] }

        // If there is no data entered then show an error otherwise the input is valid
        if(this.state.data === ""){
            this.valid.data = ["error", "Please enter data for the source"] as [ValidationState, string];
            isValid = false;
        } else { this.valid.data = ["success", "No Error"] as [ValidationState, string]}

        // Update section to show errors
        this.reRenderSection();

        // Return whether the section is valid or not
        return isValid
    }

    constructor() {
        this.updateSection();
    }

}

// Define the types for the props
type SourceSectionProps = {
    typeHandler: (value: string) => void;
    dataHandler: (value: string) => void;
    valid: {
        type: [ValidationState, string];
        data: [ValidationState, string];
    }
    state: {
        type: string;
        data: string;
    }
}
export function SourceSection({typeHandler, dataHandler, valid, state}: SourceSectionProps){

    return(
        <>
            {/* Type */}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Source Type"}
                    defaultValue={state.type}
                    required={true}
                    state={valid.type[0]}
                    errorText={valid.type[1]}
                    allowCustom={true}
                    options={["Book", "Internet", "Person"]}
                    changeEventHandler={typeHandler}
                />
            </div>

            {/* Data */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Name / Link / ISBN"}
                    defaultValue={state.data}
                    required={true}
                    state={valid.data[0]}
                    errorText={valid.data[1]}
                    changeEventHandler={dataHandler}
                />
            </div>

        </>
    )
}

class CustomInfo {

    // Store the data for the section at its current state
    state = {
        title:  "",
        text:   "",
    };

    // Store the validation state for each input
    valid = {
        title:  ["normal", "No Error"] as [ValidationState, string],
        text:   ["normal", "No Error"] as [ValidationState, string]
    };

    section: JSX.Element = <></>;

    // Change Handlers that update the state
    handleTitleChange   = (value : string) => {this.state.title    = value};
    handleTextChange    = (value : string) => {this.state.text     = value};

    // Functions to update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <CustomSection
                titleHandler={this.handleTitleChange}
                textHandler={this.handleTextChange}
                valid={this.valid}
                state={this.state}
            />
        );
    }

    reRenderSection = () => {
        const updatedSection = React.cloneElement(
            this.section,
            {
                valid: this.valid,
                state: this.state
            }
        );
        this.setSection(updatedSection);
    }

    // Validate each input
    validate = () => {
        let isValid = true;

        // If there is no title entered then show an error otherwise the input is valid
        if(this.state.title === ""){
            this.valid.title = ["error", "Please enter a title for the section"] as [ValidationState, string];
            isValid = false;
        } else { this.valid.title = ["success", "No Error"] as [ValidationState, string] }

        // If there is no text entered then show an error otherwise the input is valid
        if(this.state.text === ""){
            this.valid.text = ["error", "Please enter some text for the section"] as [ValidationState, string];
            isValid = false;
        } else { this.valid.text = ["success", "No Error"] as [ValidationState, string] }

        // Update section to show errors
        this.reRenderSection();

        // Return whether the section is valid or not
        return isValid
    }

    constructor() {
        this.updateSection();
    }

}

// Define the types for the props
type CustomSectionProps = {
    titleHandler:   (value: string) => void;
    textHandler:    (value: string) => void;
    valid: {
        title: [ValidationState, string];
        text: [ValidationState, string];
    }
    state: {
        title: string;
        text: string;
    }
}
export function CustomSection({titleHandler, textHandler, valid, state}: CustomSectionProps){

    return(
        <>
            {/* Custom Title */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Custom Section Title"}
                    defaultValue={state.title}
                    required={true}
                    state={valid.title[0]}
                    errorText={valid.title[1]}
                    changeEventHandler={titleHandler}
                />
            </div>

            {/* Custom Text */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Custom Section Text"}
                    defaultValue={state.text}
                    required={true}
                    state={valid.text[0]}
                    errorText={valid.text[1]}
                    changeEventHandler={textHandler}
                />
            </div>
        </>
    )
}

class CraftInfo {

    // Store the data for the section at its current state
    state = {
        partOfPlant:    "",
        use:            "",
        additionalInfo: "",
        image:          "",
    };

    // Store the validation state for each input
    valid = {
        partOfPlant:    ["normal", "No Error"] as [ValidationState, string],
        use:            ["normal", "No Error"] as [ValidationState, string],
        additionalInfo: ["normal", "No Error"] as [ValidationState, string],
        image:          ["normal", "No Error"] as [ValidationState, string],
    };

    section: JSX.Element = <></>;

    // Change Handlers that update the state
    handleUseValueChange        = (value : string) => {this.state.use              = value};
    handleAdditionalInfoChange  = (value : string) => {this.state.additionalInfo   = value};
    handlePartOfPlantChange     = (value : string) => { this.state.partOfPlant     = value};
    handleImageChange           = (value : string) => {this.state.image            = value};

    // Functions to update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <CraftSection
                useValueHandler = {this.handleUseValueChange}
                additionalInfoHandler = {this.handleAdditionalInfoChange}
                partOfPlantHandler = {this.handlePartOfPlantChange}
                valid = {this.valid}
                state = {this.state}
            />
        );
    }

    reRenderSection = () => {
        const updatedSection = React.cloneElement(
            this.section,
            {
                valid: this.valid,
                state: this.state
            }
        );
        this.setSection(updatedSection);
    }

    // Validate each input
    validate = () => {
        let isValid = true;

        // If there is no part of plant selected then show an error otherwise the input is valid
        if(this.state.partOfPlant === "") {
            this.valid.partOfPlant = ["error", "Please select a part of the plant"] as [ValidationState, string];
            isValid = false;
        }else{ this.valid.partOfPlant = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no use selected then show an error otherwise the input is valid
        if(this.state.use === "") {
            this.valid.use = ["error", "Please enter how this plant is used"] as [ValidationState, string];
            isValid = false;
        }else{ this.valid.use = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no additional info entered then ignore as not required otherwise the input is valid
        if(this.state.additionalInfo !== "") {
            this.valid.additionalInfo = ["success", "No Error"] as [ValidationState, string];
        }

        // If there is no image selected then show an error otherwise the input is valid
        if(this.state.image === "") {
            this.valid.image = ["error", "Please select what image is related to the use of this plant"] as [ValidationState, string];
            //TODO: FIX IMAGES isValid = false;
        }else{ this.valid.image = ["success", "No Error"] as [ValidationState, string]; }

        // Update section to show validation
        this.reRenderSection()

        // Return whether the section is valid or not
        return isValid
    }

    constructor() {
        this.updateSection();
    }

}

// Define the types for the props
type CraftSectionProps = {
    useValueHandler:        (value: string) => void;
    additionalInfoHandler:  (value: string) => void;
    partOfPlantHandler:     (value: string) => void;
    valid: {
        partOfPlant:    [ValidationState, string];
        use:            [ValidationState, string];
        additionalInfo: [ValidationState, string];
        image:          [ValidationState, string];
    }
    state: {
        partOfPlant:    string;
        use:            string;
        additionalInfo: string;
        image:          string;
    }
}
export function CraftSection({useValueHandler, additionalInfoHandler, partOfPlantHandler, valid, state}: CraftSectionProps){

    return(
        <>

            {/* Part of Plant */}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Part of Plant"}
                    defaultValue={state.partOfPlant}
                    required={true}
                    state={valid.partOfPlant[0]}
                    errorText={valid.partOfPlant[1]}
                    options={PLANT_PARTS}
                    allowCustom={true}
                    changeEventHandler={partOfPlantHandler}
                />
            </div>


            {/* Use */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Use"}
                    defaultValue={state.use}
                    required={true}
                    state={valid.use[0]}
                    errorText={valid.use[1]}
                    changeEventHandler={useValueHandler}
                />
            </div>

            {/* Additional Info */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Additional Info"}
                    defaultValue={state.additionalInfo}
                    required={false}
                    state={valid.additionalInfo[0]}
                    errorText={valid.additionalInfo[1]}
                    changeEventHandler={additionalInfoHandler}
                />
            </div>

        </>
    )
}

class MedicalInfo {
    // Store the data for the section at its current state
    state = {
        type:           "",
        use:            "",
        preparation:    "",
        image:          "",
    };

    // Store the validation state for each input
    valid = {
        type:           ["normal", "No Error"] as [ValidationState, string],
        use:            ["normal", "No Error"] as [ValidationState, string],
        preparation:    ["normal", "No Error"] as [ValidationState, string],
        image:          ["normal", "No Error"] as [ValidationState, string],
    }

    section: JSX.Element = <></>;

    // Change Handlers that update the state
    handleTypeChange            = (value : string) => { this.state.type        = value};
    handeUseValueChange         = (value : string) => {this.state.use          = value};
    handlePreparationChange     = (value : string) => {this.state.preparation  = value};
    handleImageChange           = (value : string) => {this.state.image        = value};

    // Functions to update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <MedicalUseSection
                medicalTypeHandler={this.handleTypeChange}
                useValueHandler={this.handeUseValueChange}
                preparationHandler={this.handlePreparationChange}
                valid={this.valid}
                state={this.state}
            />
        );
    }

    reRenderSection = () => {
        const updatedSection = React.cloneElement(
            this.section,
            {
                valid: this.valid,
                state: this.state
            }
        );
        this.setSection(updatedSection);
    }

    // Validate each input
    validate = () => {
        let isValid = true;

        // If there is no type selected then show an error otherwise the input is valid
        if(this.state.type === "") {
            this.valid.type = ["error", "Please select if the plant is used internally or externally"] as [ValidationState, string];
            isValid = false;
        }else { this.valid.type = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no use selected then show an error otherwise the input is valid
        if(this.state.use === "") {
            this.valid.use = ["error", "Please enter how this plant is used in a medical context"] as [ValidationState, string];
            isValid = false;
        }else { this.valid.use = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no preparation entered then show an error otherwise the input is valid
        if(this.state.preparation === "") {
            this.valid.preparation = ["error", "Please give instructions on how this plant is prepared for medical use"] as [ValidationState, string];
            isValid = false;
        }else { this.valid.preparation = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no image selected then show an error otherwise the input is valid
        if(this.state.image === "") {
            this.valid.image = ["error", "Please select what image is related to the medical use of this plant"] as [ValidationState, string];
            //TODO: FIX IMAGES isValid = false;
        }else { this.valid.image = ["success", "No Error"] as [ValidationState, string]; }

        // Update section to show validation
        this.reRenderSection();

        // Return whether the section is valid or not
        return isValid;
    }

    constructor() {
        this.updateSection();
    }

}

// Define the types for the props
type MedicalUseSectionProps = {
    medicalTypeHandler:     (value: string) => void;
    useValueHandler:        (value: string) => void;
    preparationHandler:     (value: string) => void;
    valid: {
        type:           [ValidationState, string];
        use:            [ValidationState, string];
        preparation:    [ValidationState, string];
        image:          [ValidationState, string];
    }
    state: {
        type:           string;
        use:            string;
        preparation:    string;
        image:          string;
    }
}
export function MedicalUseSection({medicalTypeHandler, useValueHandler, preparationHandler, valid, state}: MedicalUseSectionProps){

    return(
        <>
            {/* Internal Or External*/}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Internal/External"}
                    defaultValue={state.type}
                    required={true}
                    state={valid.type[0]}
                    errorText={valid.type[1]}
                    options={["Internal", "External"]}
                    allowCustom={false}
                    changeEventHandler={medicalTypeHandler}
                />
            </div>

            {/* Use */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Use"}
                    defaultValue={state.use}
                    required={true}
                    state={valid.use[0]}
                    errorText={valid.use[1]}
                    changeEventHandler={useValueHandler}
                />
            </div>

            {/* Preparation */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Preparation"}
                    defaultValue={state.preparation}
                    required={true}
                    state={valid.preparation[0]}
                    errorText={valid.preparation[1]}
                    changeEventHandler={preparationHandler}
                />
            </div>
        </>
    )
}


class EdibleInfo {

    // Store the data for the section at its current state
    state = {
        partOfPlant:        "",
        nutritionalValue:   "",
        preparation:        "",
        preparationType:    "",
        edibleImage:        "",
    };

    // Store the validation state for each input
    valid = {
        partOfPlant:        ["normal", "No Error"] as [ValidationState, string],
        nutritionalValue:   ["normal", "No Error"] as [ValidationState, string],
        preparation:        ["normal", "No Error"] as [ValidationState, string],
        preparationType:    ["normal", "No Error"] as [ValidationState, string],
        image:              ["normal", "No Error"] as [ValidationState, string],
    }

    section: JSX.Element = <></>;

    // Change Handlers that update the state
    handlePartOfPlantChange         = (value : string) => { this.state.partOfPlant     = value};
    handleNutritionalValueChange    = (value : string) => {this.state.nutritionalValue = value};
    handlePreparationChange         = (value : string) => {this.state.preparation      = value};
    handlePreparationTypeChange     = (value : string) => {this.state.preparationType  = value};
    handleImageChange               = (value : string) => {this.state.edibleImage      = value};

    // Update the section to show the current state
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <EdibleUseSection
                partOfPlantHandler={this.handlePartOfPlantChange}
                nutritionalValueHandler={this.handleNutritionalValueChange}
                preparationHandler={this.handlePreparationChange}
                preparationTypeHandler={this.handlePreparationTypeChange}
                valid={this.valid}
                state={this.state}
            />
        );
    };

    reRenderSection = () => {
        const updatedSection = React.cloneElement(
            this.section,
            {
                valid: this.valid,
                state: this.state
            }
        );
        this.setSection(updatedSection);
    }

    // Validate the section
    validate = () => {
        let isValid = true;

        // If there is no part of plant selected then show an error otherwise the input is valid
        if(this.state.partOfPlant === "") {
            this.valid.partOfPlant = ["error", "Please select what part of the plant is edible"];
            isValid = false;
        }else { this.valid.partOfPlant = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no nutritional value entered then ignore as not requried otherwise the input is valid
        if (this.state.nutritionalValue !== "") {
            this.valid.nutritionalValue = ["success", "No Error"] as [ValidationState, string];
        }

        // If there is no preparation type selected then show an error otherwise the input is valid
        if(this.state.preparationType === "") {
            this.valid.preparationType = ["error", "Please select how this plant is prepared for consumption"];
            isValid = false;
        } else { this.valid.preparationType = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no preparation entered then show an error otherwise the input is valid
        if(this.state.preparation === "") {
            this.valid.preparation = ["error", "Please give instructions on how this plant is prepared for consumption"];
            isValid = false;
        } else { this.valid.preparation = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no image selected then show an error otherwise the input is valid
        if(this.state.edibleImage === "") {
            this.valid.image = ["error", "Please select what image is related to the edible use of this plant"];
            //TODO: FIX IMAGES isValid = false;
        } else { this.valid.image = ["success", "No Error"] as [ValidationState, string]; }

        // Update section to show validation
        this.reRenderSection();

        // Return whether the section is valid or not
        return isValid;
    }

    constructor() {
        this.updateSection();
    }
}

// Edible Use Section Props
type EdibleUseSectionProps = {
    partOfPlantHandler:      (value: string) => void;
    nutritionalValueHandler: (value: string) => void;
    preparationTypeHandler:  (value: string) => void;
    preparationHandler:      (value: string) => void;
    valid: {
        partOfPlant:        [ValidationState, string];
        nutritionalValue:   [ValidationState, string];
        preparation:        [ValidationState, string];
        preparationType:    [ValidationState, string];
        image:              [ValidationState, string];

    }
    state: {
        partOfPlant:        string;
        nutritionalValue:   string;
        preparation:        string;
        preparationType:    string;
        edibleImage:        string;

    }
}
export function EdibleUseSection({partOfPlantHandler, nutritionalValueHandler, preparationTypeHandler, preparationHandler, valid, state}: EdibleUseSectionProps){

    return(
        <>
            {/* Part of Plant */}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Part of Plant"}
                    defaultValue={state.partOfPlant}
                    required={true}
                    state={valid.partOfPlant[0]}
                    errorText={valid.partOfPlant[1]}
                    options={PLANT_PARTS}
                    allowCustom={true}
                    changeEventHandler={partOfPlantHandler}
                />
            </div>

            {/* Nutritional Value */}
            <div className={styles.formItem}>
                <SimpleTextArea
                    placeHolder={"Nutritional Value"}
                    defaultValue={state.nutritionalValue}
                    required={false}
                    state={valid.nutritionalValue[0]}
                    errorText={valid.nutritionalValue[1]}
                    changeEventHandler={nutritionalValueHandler}
                />
            </div>


            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Preparation Type"}
                    defaultValue={state.preparationType}
                    required={true}
                    state={valid.preparationType[0]}
                    errorText={valid.preparationType[1]}
                    changeEventHandler={preparationTypeHandler}
                    options={["Raw", "Boiled", "Cooked", "Dried"]}
                    allowCustom={true}
                />
            </div>

            {/* Preparation */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Preparation"}
                    defaultValue={state.preparation}
                    required={true}
                    state={valid.preparation[0]}
                    errorText={valid.preparation[1]}
                    changeEventHandler={preparationHandler}
                />
            </div>
        </>
    )
}

class ImageInfo{

    // Store the state of the section
    state = {
        image_url:  "",
        image_name: "",
    }

    // Store the validation state of the section
    valid = {
        image_url:  ["normal", "No Error"] as [ValidationState, string],
        image_name: ["normal", "No Error"] as [ValidationState, string],
    }

    section: JSX.Element = <></>;

    // Handlers that update the state
    handleImageUrlChange    = (value : string) => {this.state.image_url    = value};
    handleNameChange        = (value : string) => {this.state.image_name   = value};

    // Update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <ImageSection
                imageUrl = {this.state.image_url}
                name = {this.state.image_name}
                descriptionHandler={this.handleNameChange}
                imageURLHandler={this.handleImageUrlChange}
                valid={this.valid}
            />
        )
    }

    // Validate the section
    validate = () => {
        let isValid = true;

        // If there is no image name entered or it is longer than 50 chars then show an error otherwise the input is valid
        if(this.state.image_name === "") {
            this.valid.image_name = ["error", "Please enter a name for the image"];
            isValid = false;
        }else if(this.state.image_name.length > 50) {
            this.valid.image_name = ["error", "Image name must be less than 50 characters"];
            isValid = false;
        }else { this.valid.image_name = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no image uploaded then show an error otherwise the input is valid
        if(this.state.image_url === "") {
            this.valid.image_name = ["error", "Please upload a image"]; // Use name here as upload doesn't have a state
            //TODO: FIX IMAGES isValid = false;
        }

        // Update section to show validation
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

        // Return whether the section is valid or not
        return isValid;
    }

    constructor() {
        this.updateSection();
    }

}

// Define the type of the props for the Image Section
type ImageSectionProps = {
    imageUrl:   string;
    name:       string;
    descriptionHandler:     (value: string) => void;
    imageURLHandler:        (value: string) => void;
    valid: {
        image_url:  [ValidationState, string];
        image_name: [ValidationState, string];
    }
}
export function ImageSection({imageUrl, name, descriptionHandler, imageURLHandler, valid}: ImageSectionProps){

    // States
    const [imageName, setImageName] = useState(name)
    const [imageURL, setImageURL ]  = useState(imageUrl)

    // Update the image alt tag state and also pass it to the handler
    function imageNameHandler(value : string){
        descriptionHandler(value)
        setImageName(value)
    }

    // Upload the image to imgbb and then pass the url to the handler and update the image url state
    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {

        // Prevent the default event and grab the file selected
        event.preventDefault();
        const file = event.target.files?.[0];

        // If there is no file then return
        if(!file) return;

        // Create a new form data object and append the file to it
        const formData = new FormData();
        formData.append('image', file);

        // Upload the image to imgbb
        const response = await fetch(`https://api.imgbb.com/1/upload?key=877ed2f3c890826488e67dfc295668d4`, {
            method: 'POST',
            body: formData,
        });

        // Get the response and update the image url state and pass it to the handler
        const data = await response.json();
        setImageURL(data.data.url);
        imageURLHandler(data.data.url);

        // Debug the data
        console.log(data)
    }

    return(
        <>
            {/* Image / Uploader */}
            <div className={styles.formContainer}>
                {imageURL !== "" ?
                    <Image style={{borderRadius: 8}} src={imageURL} alt={imageName} width={600} height={600} objectFit={"contain"}/>
                    :
                    <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} />
                }
            </div>
            <br/>

            {/* Image Name */}
            <SmallInput
                placeHolder={"Image Name"}
                required={true}
                state={valid.image_name[0]}
                errorText={valid.image_name[1]}
                changeEventHandler={imageNameHandler}
            />
        </>
    )
}

class DateInfo {

    // Store the state of the section
    state = {
        event:      "",
        startDate:  "",
        endDate:    ""
    };

    // Store the validation state of the section
    valid = {
        event:      ["normal", "No Error"] as [ValidationState, string],
        startDate:  ["normal", "No Error"] as [ValidationState, string],
        endDate:    ["normal", "No Error"] as [ValidationState, string]
    }

    section: JSX.Element = <></>;

    // Handlers that update the state
    handleEventChange       = (value : string) => { this.state.event = value};
    handleStartDateChange   = (value : string) => {this.state.startDate = value};
    handleEndDateChange     = (value : string) => {this.state.endDate = value};

    // Update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <DateInfoSection
                eventHandler={this.handleEventChange}
                startDateHandler={this.handleStartDateChange}
                endDateHandler={this.handleEndDateChange}
                valid={this.valid}
                state={this.state}
            />
        )
    }

    reRenderSection = () => {
        const updatedSection = React.cloneElement(
            this.section,
            {
                valid: this.valid,
                state: this.state
            }
        );
        this.setSection(updatedSection);
    }

    // Function to validate the section
    validate = () => {
        let isValid = true;

        // If there is no event entered then show an error otherwise the input is valid
        if(this.state.event === ""){
            this.valid.event = ["error", "Please enter what is happening during this period"];
            isValid = false;
        }else { this.valid.event = ["success", "No Error"] as [ValidationState, string] }

        // If there is no start date entered then show an error otherwise the input is valid
        if(this.state.startDate === ""){
            this.valid.startDate = ["error", "Please enter a start date"];
            isValid = false;
        }else { this.valid.startDate = ["success", "No Error"] as [ValidationState, string] }

        // If there is no end date entered then show an error otherwise the input is valid
        if(this.state.endDate === ""){
            this.valid.endDate = ["error", "Please enter an end date"];
            isValid = false;
        }else { this.valid.endDate = ["success", "No Error"] as [ValidationState, string] }

        // Update section to show validation
        this.reRenderSection();

        // Return whether the section is valid or not
        return isValid;
    }

    constructor() {
        this.updateSection();
    }

}

// Define the type of the props for the Date Info Section
type DateInfoSectionProps = {
    eventHandler:       (value: string) => void;
    startDateHandler:   (value: string) => void;
    endDateHandler:     (value: string) => void;
    valid: {
        event:      [ValidationState, string];
        startDate:  [ValidationState, string];
        endDate:    [ValidationState, string];
    }
    state: {
        event:      string;
        startDate:  string;
        endDate:    string;
    }
}
export function DateInfoSection({eventHandler, startDateHandler, endDateHandler, valid, state}: DateInfoSectionProps){

    return(
        <>
            {/* Event */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Event"}
                    defaultValue={state.event}
                    required={true}
                    state={valid.event[0]}
                    errorText={valid.event[1]}
                    changeEventHandler={eventHandler}
                />
            </div>

            {/* Start Date */}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Start Date"}
                    defaultValue={state.startDate}
                    required={true}
                    state={valid.startDate[0]}
                    errorText={valid.startDate[1]}
                    changeEventHandler={startDateHandler}
                    allowCustom={false}
                    options={MONTHS}
                />
            </div>

            {/* End Date */}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"End Date"}
                    defaultValue={state.endDate}
                    required={true}
                    state={valid.endDate[0]}
                    errorText={valid.endDate[1]}
                    changeEventHandler={endDateHandler}
                    allowCustom={false}
                    options={MONTHS}
                />
            </div>
        </>
    )
}

interface infoDisplayerProps{
    infoRef         : React.MutableRefObject<DateInfo[]>
        | React.MutableRefObject<EdibleInfo[]>
        | React.MutableRefObject<MedicalInfo[]>
        | React.MutableRefObject<CraftInfo[]>
        | React.MutableRefObject<SourceInfo[]>
        | React.MutableRefObject<CustomInfo[]>
        | React.MutableRefObject<ImageInfo[]>
    newInfo         : () => void
    name            : string
    setRenderKey    : React.Dispatch<React.SetStateAction<number>>
}
function InfoDisplayer({infoRef, newInfo, name, setRenderKey} : infoDisplayerProps){

    // Calculate the id of the info
    let id = name.toLowerCase().replace(" ", "-");

    const rm = (id: number) => {
        infoRef.current.splice(id, 1);
        setRenderKey(prevState => prevState + 1)
    }

    return(
        <>
            {/* Section title */}
            <h1 className={styles.sectionTitle}> {name}s </h1>

            {/* Infos} */}
            {infoRef.current.map((value, index) => (
                <div key={index} className={styles.formItem} id={`${id}-${index}`}>
                    <div className={styles.formContainer}>
                        {/* Remove Button */}
                        <button onClick={() => {rm(index);}} className={styles.deleteSectionButton}> X </button>

                        {/* Add some space */}
                        <br />

                        {/* Add the section */}
                        {value.section}
                    </div>
                </div>
            ))}

            {/* Add date info */}
            <div className={styles.formItem}>
                <div className={styles.formContainer}>
                    <button onClick={newInfo} className={styles.addSectionButton}> + </button>
                </div>
            </div>
        </>)
}

/// _______________ PAGE _______________ ///

export default function CreatePlant() {

    // Set up the router
    const router = useRouter();

    // Page Constants
    const pageName = "Create Plant"
    const [plantName, setPlantName] = useState("...")
    const [plantID, setPlantID] = useState(-1)
    const [error, setError] = useState("")

    // Imported DATA
    const [importedJSON, setImportedJSON] = useState<PlantData>(emptyPlantData())

    // Value Setters
    const [englishName, setEnglishName]             = useState("")
    const [moariName, setMoariName]                 = useState("")
    const [latinName, setLatinName]                 = useState("")
    const [preferredName, setPreferredName]         = useState("")
    const [smallDescription, setSmallDescription]   = useState("")
    const [largeDescription, setLargeDescription]   = useState("")
    const [location, setLocation]                   = useState("")

    // Section Refs
    const imageInfoRef                 = useRef<ImageInfo[]>([]);
    const dateInfoRef                   = useRef<DateInfo[]>([]);
    const edibleInfoRef               = useRef<EdibleInfo[]>([]);
    const medicalInfoRef             = useRef<MedicalInfo[]>([]);
    const craftInfoRef                 = useRef<CraftInfo[]>([]);
    const customInfoRef               = useRef<CustomInfo[]>([]);
    const sourceInfoRef               = useRef<SourceInfo[]>([]);

    // Section Render Keys
    const [renderKeyDate, setRenderKeyDate] = useState(0);
    const [renderKeyImage, setRenderKeyImage] = useState(0);
    const [renderKeyEdible, setRenderKeyEdible] = useState(0);
    const [renderKeyMedical, setRenderKeyMedical] = useState(0);
    const [renderKeyCraft, setRenderKeyCraft] = useState(0);
    const [renderKeyCustom, setRenderKeyCustom] = useState(0);
    const [renderKeySource, setRenderKeySource] = useState(0);



    // Value Handlers
    const handleEnglishNameChange = (value : string) => { setEnglishName(value);
        console.log(value) };
    const handleMoariNameChange = (value : string) => { setMoariName(value); };
    const handleLatinNameChange = (value : string) => { setLatinName(value); };
    const handleDropDownChange = (value : string) => { setPreferredName(value) };
    const handleSmallDescriptionChange = (value : string) => { setSmallDescription(value) };
    const handleLargeDescriptionChange = (value : string) => { setLargeDescription(value) };
    const handleLocationChange = (value : string) => { setLocation(value) };

    // New Section Setters
    const newDateInfo = () => {dateInfoRef.current = [...dateInfoRef.current, new DateInfo()]; setRenderKeyDate(prevState => prevState + 1)}
    const newImage = () => { imageInfoRef.current = [...imageInfoRef.current, new ImageInfo()]; setRenderKeyImage(prevState => prevState + 1)}
    const newEdibleInfo = () => { edibleInfoRef.current = [...edibleInfoRef.current, new EdibleInfo()]; setRenderKeyEdible(prevState => prevState + 1)}
    const newMedicalInfo = () => { medicalInfoRef.current = [...medicalInfoRef.current, new MedicalInfo()]; setRenderKeyMedical(prevState => prevState + 1)}
    const newCraftInfo = () => { craftInfoRef.current = [...craftInfoRef.current, new CraftInfo()]; setRenderKeyCraft(prevState => prevState + 1)}
    const newCustomInfo = () => { customInfoRef.current = [...customInfoRef.current, new CustomInfo()]; setRenderKeyCustom(prevState => prevState + 1)}
    const newSourceInfo = () => { sourceInfoRef.current = [...sourceInfoRef.current, new SourceInfo()]; setRenderKeySource(prevState => prevState + 1)}

    // Section States
    const [englishNameValidationState, setEnglishNameValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [moariNameValidationState, setMoariNameValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [latinNameValidationState, setLatinNameValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [preferredNameValidationState, setPreferredNameValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [smallDescriptionValidationState, setSmallDescriptionValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [largeDescriptionValidationState, setLargeDescriptionValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [locationValidationState, setLocationValidationState] = useState(["normal", "No Error"] as [ValidationState, string])


    // Update the page title when name changes
    useEffect(() => {
        switch (preferredName) {
            case "English":
                setPlantName(englishName);
                break;

            case "Moari":
                setPlantName(moariName);
                break;

            case "Latin":
                setPlantName(latinName);
                break
        }
    }, [englishName, moariName, latinName, preferredName]);

    // Validate the input
    const validateInput = () => {

        //Allow for multiple invalid inputs
        let isValid = true;
        let elementThatNeedsFocus = null;

        // English Name
        if(englishName === ""){
            if(preferredName === "English"){
                setEnglishNameValidationState(["error", "Required if preferred name is English"])
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "english-name";
            }
        } else { setEnglishNameValidationState(["success", "No Error"] as [ValidationState, string]) }

        // Moari Name
        if(moariName === ""){
            if(preferredName === "Moari"){
                setMoariNameValidationState(["error", "Required if preferred name is Moari"])
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "moari-name";
            }
        }else { setMoariNameValidationState(["success", "No Error"] as [ValidationState, string]) }

        // Latin Name
        if(latinName === ""){
            if(preferredName === "Latin"){
                setLatinNameValidationState(["error", "Required if preferred name is Latin"])
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "latin-name";
            }
        } else { setLatinNameValidationState(["success", "No Error"] as [ValidationState, string]) }

        // Preferred Name
        if(preferredName === ""){
            setPreferredNameValidationState(["error", "Please select a preferred name"])
            isValid = false;
            if(elementThatNeedsFocus === null) elementThatNeedsFocus = "preferred-name";
        } else { setPreferredNameValidationState(["success", "No Error"] as [ValidationState, string]) }

        // Small Description
        if(smallDescription === ""){
            setSmallDescriptionValidationState(["error", "Please enter a small description"])
            isValid = false;
            if(elementThatNeedsFocus === null) elementThatNeedsFocus = "small-description";
        } else if(smallDescription.length > 100){
            setSmallDescriptionValidationState(["error", "Small description must be less than 100 characters"])
        } else { setSmallDescriptionValidationState(["success", "No Error"] as [ValidationState, string]) }

        // Large Description
        if(largeDescription === ""){
            setLargeDescriptionValidationState(["error", "Please enter a large description"])
            isValid = false;
            if(elementThatNeedsFocus === null) elementThatNeedsFocus = "large-description";
        } else { setLargeDescriptionValidationState(["success", "No Error"] as [ValidationState, string]) }

        // Location
        if(location === ""){
            setLocationValidationState(["error", "Please enter a location"])
            isValid = false;
            if(elementThatNeedsFocus === null) elementThatNeedsFocus = "location";
        } else { setLocationValidationState(["success", "No Error"] as [ValidationState, string]) }

        // Validate the image info
        for (let i = 0; i < imageInfoRef.current.length; i++) {

            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!imageInfoRef.current[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "image-" + i;
            }
        }

        // Validate the date info
        for (let i = 0; i < dateInfoRef.current.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!dateInfoRef.current[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "date-" + i;
            }
        }

        // Validate the edible info
        for (let i = 0; i < edibleInfoRef.current.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!edibleInfoRef.current[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "edible-use-" + i;
            }
        }

        // Validate the medical info
        for (let i = 0; i < medicalInfoRef.current.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!medicalInfoRef.current[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "medical-use-" + i;
            }
        }

        // Validate the craft info
        for (let i = 0; i < craftInfoRef.current.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!craftInfoRef.current[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "craft-use-" + i;
                console.log("Error in craft info: ")
                console.log(craftInfoRef.current[i])

            }
        }

        // Validate the source info
        for (let i = 0; i < sourceInfoRef.current.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!sourceInfoRef.current[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "source-" + i;
            }
        }

        // Validate the custom info
        for (let i = 0; i < customInfoRef.current.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!customInfoRef.current[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "custom-section-" + i;
            }
        }

        // Scroll to the element with an error:
        if(elementThatNeedsFocus !== null){
            scrollToElement(elementThatNeedsFocus)
        }

        return isValid;
    }

    const generateJSON = () => {

        // Create the JSON object
        let plantOBJ = emptyPlantData()

        // Basic info
        plantOBJ.preferred_name = preferredName;
        plantOBJ.english_name = englishName;
        plantOBJ.moari_name = moariName;
        plantOBJ.latin_name = latinName;
        plantOBJ.location_found = location;
        plantOBJ.small_description = smallDescription;
        plantOBJ.long_description = largeDescription;

        // Image info
        for(let i = 0; i < imageInfoRef.current.length; i++) {
            const thisImageInfo = imageInfoRef.current[i].state;

            let imageInfoOBJ = {
                path: "",
                type: "image",
                name: "",
                downloadable: false,
            }

            imageInfoOBJ.path = thisImageInfo.image_url;
            imageInfoOBJ.name = thisImageInfo.image_name;

            plantOBJ.attachments.push(imageInfoOBJ);
        }

        // Date info
        for(let i = 0; i < dateInfoRef.current.length; i++) {
            const thisDateInfo = dateInfoRef.current[i].state;

            let dateInfoOBJ = {
                event: "",
                start_month: "",
                end_month: "",
            }

            dateInfoOBJ.event = thisDateInfo.event;
            dateInfoOBJ.start_month = thisDateInfo.startDate;
            dateInfoOBJ.end_month = thisDateInfo.endDate;

            plantOBJ.months_ready_for_use.push(dateInfoOBJ);
        }

        // Edible info
        for(let i = 0; i < edibleInfoRef.current.length; i++) {
            const thisEdibleInfo = edibleInfoRef.current[i].state;

            let edibleInfoOBJ = {
                type: "edible",
                part_of_plant: "",
                image_of_part: "",
                nutrition: "",
                preparation: "",
                preparation_type: "",
            }

            edibleInfoOBJ.part_of_plant = thisEdibleInfo.partOfPlant;
            edibleInfoOBJ.image_of_part = thisEdibleInfo.edibleImage;
            edibleInfoOBJ.nutrition = thisEdibleInfo.nutritionalValue;
            edibleInfoOBJ.preparation = thisEdibleInfo.preparation;
            edibleInfoOBJ.preparation_type = thisEdibleInfo.preparationType;

            // If it isn't already in the use array, add it
            if(!plantOBJ.use.includes("edible")){
                plantOBJ.use.push("edible");
            }

            plantOBJ.sections.push(edibleInfoOBJ);
        }

        // Medical info
        for(let i = 0; i < medicalInfoRef.current.length; i++) {
            const thisMedicalInfo = medicalInfoRef.current[i].state;

            let medicalInfoOBJ = {
                type: "medical",
                medical_type: "",
                use: "",
                image: "",
                preparation: "",
            }

            medicalInfoOBJ.medical_type = thisMedicalInfo.type;
            medicalInfoOBJ.use = thisMedicalInfo.use;
            medicalInfoOBJ.image = thisMedicalInfo.image;
            medicalInfoOBJ.preparation = thisMedicalInfo.preparation;

            // If it isn't already in the use array, add it
            if(!plantOBJ.use.includes("medical_"+medicalInfoOBJ.medical_type)){
                plantOBJ.use.push("medical_"+medicalInfoOBJ.medical_type);
            }

            plantOBJ.sections.push(medicalInfoOBJ);
        }

        // Craft info
        for(let i = 0; i < craftInfoRef.current.length; i++) {
            const thisCraftInfo = craftInfoRef.current[i].state;

            let craftInfoOBJ = {
                type: "craft",
                part_of_plant: "",
                use: "",
                image: "",
                additonal_info: "",
            }

            craftInfoOBJ.part_of_plant = thisCraftInfo.partOfPlant;
            craftInfoOBJ.use = thisCraftInfo.use;
            craftInfoOBJ.image = thisCraftInfo.image;
            craftInfoOBJ.additonal_info = thisCraftInfo.additionalInfo;

            // If it isn't already in the use array, add it
            if(!plantOBJ.use.includes("craft")){
                plantOBJ.use.push("craft");
            }

            plantOBJ.sections.push(craftInfoOBJ);
        }

        // Source info
        for(let i = 0; i < sourceInfoRef.current.length; i++) {
            const thisSourceInfo = sourceInfoRef.current[i].state;

            let sourceInfoOBJ = {
                type: "source",
                source_type: "",
                data: "",
            }

            sourceInfoOBJ.source_type = thisSourceInfo.type;
            sourceInfoOBJ.data = thisSourceInfo.data;

            plantOBJ.sections.push(sourceInfoOBJ);
        }

        // Custom info
        for (let i = 0; i < customInfoRef.current.length; i++) {
            const thisCustomInfo = customInfoRef.current[i].state;

            let customInfoOBJ = {
                type: "custom",
                title: "",
                text: "",
            }

            customInfoOBJ.title = thisCustomInfo.title;
            customInfoOBJ.text = thisCustomInfo.text;

            plantOBJ.sections.push(customInfoOBJ);
        }

        return plantOBJ;
    }

    const loadJson = (jsonContents: PlantData) => {
        // Set the imported JSON (updates the basic info)
        setImportedJSON(jsonContents)

        // Clear the current sections
        dateInfoRef.current     = [];
        edibleInfoRef.current   = [];
        medicalInfoRef.current  = [];
        craftInfoRef.current    = [];
        sourceInfoRef.current   = [];
        customInfoRef.current   = [];


        // Create the months ready for ues
        for (let i = 0; i < jsonContents.months_ready_for_use.length; i++) {
            // Create the new section
            newDateInfo()

            // Get the new section
            const dateSection = dateInfoRef.current[dateInfoRef.current.length-1];

            // Update the values
            dateSection.handleStartDateChange(jsonContents.months_ready_for_use[i].start_month)
            dateSection.handleEventChange(jsonContents.months_ready_for_use[i].event)
            dateSection.handleEndDateChange(jsonContents.months_ready_for_use[i].end_month)

            // Re-render the section
            dateSection.reRenderSection()
        }



        // Create the other sections from the imported JSON
        for(let i = 0; i < jsonContents.sections.length; i++){

            // Create the section based on the type
            switch (jsonContents.sections[i].type) {
                case "edible":

                    // Create the new section
                    newEdibleInfo();

                    // Get the new section
                    const edibleSection = edibleInfoRef.current[edibleInfoRef.current.length-1];

                    // Update the values
                    edibleSection.handlePartOfPlantChange(jsonContents.sections[i].part_of_plant)
                    edibleSection.handleNutritionalValueChange(jsonContents.sections[i].nutritional_value)
                    edibleSection.handlePreparationChange(jsonContents.sections[i].preparation)
                    edibleSection.handlePreparationTypeChange(jsonContents.sections[i].preparation_type)

                    // Re-render the section
                    edibleSection.reRenderSection()

                    break

                case "medical":
                    // Create the new section
                    newMedicalInfo();

                    // Get the new section
                    const medicalSection = medicalInfoRef.current[medicalInfoRef.current.length-1];

                    // Update the values
                    medicalSection.handleTypeChange(jsonContents.sections[i].medical_type)
                    medicalSection.handlePreparationChange(jsonContents.sections[i].preparation)
                    medicalSection.handeUseValueChange(jsonContents.sections[i].use)

                    // Re-render the section
                    medicalSection.reRenderSection()

                    break

                case "craft":
                    // Create the new section
                    newCraftInfo();

                    // Get the new section
                    const craftSection = craftInfoRef.current[craftInfoRef.current.length-1];

                    // Update the values
                    craftSection.handlePartOfPlantChange(jsonContents.sections[i].part_of_plant)
                    craftSection.handleUseValueChange(jsonContents.sections[i].use)
                    craftSection.handleAdditionalInfoChange(jsonContents.sections[i].additonal_info)

                    // Re-render the section
                    craftSection.reRenderSection()

                    break

                case "source":
                    // Create the new section
                    newSourceInfo();

                    // Get the new section
                    const sourceSection = sourceInfoRef.current[sourceInfoRef.current.length-1];

                    // Update the values
                    sourceSection.handleDataChange(jsonContents.sections[i].data)
                    sourceSection.handleTypeChange(jsonContents.sections[i].source_type)

                    // Re-render the section
                    sourceSection.reRenderSection()

                    break

                case "custom":
                    // Create the new section
                    newCustomInfo();

                    // Get the new section
                    const customSection = customInfoRef.current[customInfoRef.current.length-1];

                    // Update the values
                    customSection.handleTextChange(jsonContents.sections[i].text)
                    customSection.handleTitleChange(jsonContents.sections[i].title)

                    // Re-render the section
                    customSection.reRenderSection()

                    break


            }
        }
    }

    const importPlant = () =>
    {
        // Create a file upload input
        let fileUploadInput = document.createElement("input") as HTMLInputElement;
        fileUploadInput.type = "file";
        fileUploadInput.accept = "application/json";

        // When the file upload input changes (ie a file is selected, note canceling doesn't trigger this)
        fileUploadInput.addEventListener('change', function(ev2) {

            // If there are files uploaded
            if (!fileUploadInput.files) {
                return;
            }

            // Get the first file
            const file = fileUploadInput.files[0];
            const reader = new FileReader();

            // When the file is loaded
            reader.onload = (event) => {

                // Check if there is a result
                if (!event.target || !event.target.result) {
                    return;
                }

                // Make sure it is a string
                if (typeof event.target.result !== "string") {
                    return;
                }

                // Convert the file contents to JSON
                const jsonContents = JSON.parse(event.target.result);

                // Check if it is the valid type of JSON
                if (!ValidPlantData(jsonContents)) {

                    setError("The file you uploaded is not a valid plant file")
                    scrollToElement("errorSection")
                    console.log("ERROR NOT RIGHT TYPE")
                    return;
                }

                // Scroll to the top of the page
                scrollToElement("english-name")

                loadJson(jsonContents)

            };
            reader.readAsText(file);
        });

        // Click the file upload input
        fileUploadInput.click();
    }



    const downloadPlant = () => {

        // Make sure all the required fields are filled in
        if(!validateInput()){
            return
        }

        // Generate the JSON file
        const plantOBJ = generateJSON();

        // Download the JSON file
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(plantOBJ)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = plantName + ".json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();

        // Remove the element
        document.body.removeChild(element);
    }

    const uploadPlant = async () => {

        // Make sure all the required fields are filled in
        if(!validateInput()){
            return
        }

        // Generate the JSON file
        const jsonData = generateJSON();

        // Convert the JSON file to API format
        let uploadApiData = ConvertPlantDataIntoApi(jsonData) as any

        //TODO: Show a loading screen

        let result;

        // Get the id
        const {id} = router.query;

        // Check if the id is valid
        if(id){

            // Convert to a number
            let idNum = parseInt(id);

            // Check if the id is valid
            if(isNaN(idNum)){
                idNum = -1
            }

            const isEdit = idNum !== -1
            console.log(isEdit)

            // Check if this plant is being edited
            if(isEdit){
                console.log("EDITING PLANT")

                // Remove the plant from the database
                try{

                   // Remove the plant from the database
                    console.log("REMOVING PLANT")
                    result = await axios.get(`/api/plants/remove?id=${idNum}`)
                    console.log(result)

                } catch (err) {
                    console.log(err);

                    setError("Unable to remove previous plant data whilst editing")
                    scrollToElement("errorSection")
                    return;
                }

                // Remove the plant from the local storage
                localStorage.removeItem("plant_" + idNum)

                // Add the id to the upload data
                console.log("SETTING ID")
                uploadApiData.edit_id = idNum;
                console.log(uploadApiData)
            }
        }

        try{

            console.log("UPLOADING PLANT")
            // Upload the data to the database using the upload API by passing each json key as params
            result = await axios.post(`/api/plants/upload`, uploadApiData);

        } catch (err) {
            console.log(err);

            setError("Unable to upload plant data")
            scrollToElement("errorSection")
            return;
        }

        // Redirect to the plant page
        if(result.data.id !== undefined){
            const url = "/plants/" + result.data.id
            console.log(url);
            window.location.href = url;
        }

        // Debug the result (this is for if the redirect doesn't work or smth else goes wrong)
        console.log(result);
    }

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    useEffect(() => {
        // Get the id
        const {id} = router.query;

        // Check if the id is valid
        if(!id){
            return;
        }

        // Convert to a number
        const idNum = parseInt(id);

        // Check if the id is valid
        if(isNaN(idNum)){
            setError("The id of the plant you are trying to edit is not a valid id")
            console.log("ERROR WRONG ID")
            scrollToElement("errorSection")
            return;
        }

        setPlantID(idNum)

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        getEditData(idNum)


    }, [router.query]);

    const getEditData = async (idNum: number) => {
        // Download the plant data
        const plantOBJ = await fetchPlant(idNum);

        // Check if the plant data is valid
        if(!plantOBJ){
            setError("The plant you are trying to edit is not a valid plant (was unable to fetch it's data from the database)")
            console.log("ERROR WRONG ID")
            scrollToElement("errorSection")
            return;
        }

        console.log("Plant OBJ:")
        console.log(plantOBJ)

        // Load the plant data
        loadJson(plantOBJ)

        // Scroll to the top of the page
        scrollToElement("english-name")

    }

    const scrollToElement = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            let dims = element.getBoundingClientRect();
            window.scrollTo({ top: dims.top - 150 + window.scrollY, behavior: 'smooth' });
        }
    }

    return (
        <>
            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Set up the page header */}
            <PageHeader size={"medium"}>
                <h1 className={styles.title}>Creating plant: {plantName}</h1>
            </PageHeader>

            <Section autoPadding>
                <div className={"row"}>

                    <div id={"errorSection"}>
                        { error === "" ? null : <Error error={error}/>}
                    </div>

                    {/* Divide the page into a left and right column*/}
                    <div className={"column"}>

                        {/* Basic plant information */}
                        <div className={styles.formSection}>

                            {/* Section title */}
                            <h1 className={styles.sectionTitle}>Basic Info</h1>

                            {/* Plant name */}
                            <div className={styles.formItem} id={"english-name"}>
                                <SmallInput
                                    placeHolder={"English Name"}
                                    defaultValue={importedJSON.english_name}
                                    required={false}
                                    state={englishNameValidationState[0]}
                                    errorText={englishNameValidationState[1]}
                                    changeEventHandler={handleEnglishNameChange}
                                />
                            </div>
                            <div className={styles.formItem} id={"moari-name"}>
                                <SmallInput
                                    placeHolder={"Moari Name"}
                                    defaultValue={importedJSON.moari_name}
                                    required={false}
                                    state={moariNameValidationState[0]}
                                    errorText={moariNameValidationState[1]}
                                    changeEventHandler={handleMoariNameChange}
                                />
                            </div>
                            <div className={styles.formItem} id={"latin-name"}>
                                <SmallInput
                                    placeHolder={"Latin Name"}
                                    defaultValue={importedJSON.latin_name}
                                    required={false}
                                    state={latinNameValidationState[0]}
                                    errorText={latinNameValidationState[1]}
                                    changeEventHandler={handleLatinNameChange}
                                />
                            </div>

                            {/* Preferred plant name */}
                            <div className={styles.formItem} id={"preferred-name"}>
                                <DropdownInput
                                    placeHolder={"Preferred Name"}
                                    defaultValue={importedJSON.preferred_name}
                                    required={true}
                                    state={preferredNameValidationState[0]}
                                    errorText={preferredNameValidationState[1]}
                                    options={["English", 'Moari', "Latin"]}
                                    changeEventHandler={handleDropDownChange}
                                    allowCustom={false}
                                />
                            </div>

                            {/* Plant Small Description */}
                            <div className={styles.formItem} id={"small-description"}>
                                <SimpleTextArea
                                    placeHolder={"Small Description"}
                                    defaultValue={importedJSON.small_description}
                                    required={true}
                                    state={smallDescriptionValidationState[0]}
                                    errorText={smallDescriptionValidationState[1]}
                                    changeEventHandler={handleSmallDescriptionChange}
                                />
                            </div>

                            {/* Plant Large Description */}
                            <div className={styles.formItem} id={"large-description"}>
                                <AdvandcedTextArea
                                    placeHolder={"Long Description"}
                                    defaultValue={importedJSON.long_description}
                                    required={true}
                                    state={largeDescriptionValidationState[0]}
                                    errorText={largeDescriptionValidationState[1]}
                                    changeEventHandler={handleLargeDescriptionChange}
                                />
                            </div>

                            {/* Plant Location */}
                            <div className={styles.formItem} id={"location"}>
                                <DropdownInput
                                    placeHolder={"Location"}
                                    defaultValue={importedJSON.location_found}
                                    required={true}
                                    state={locationValidationState[0]}
                                    errorText={locationValidationState[1]}
                                    options={["Coastal", "Inland", "Forest", "Ground", "Canopy", "Everywhere", "Marsh"]}
                                    allowCustom={true}
                                    changeEventHandler={handleLocationChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <InfoDisplayer
                                name={"Date"}
                                infoRef={dateInfoRef}
                                newInfo={newDateInfo}
                                key={renderKeyDate}
                                setRenderKey={setRenderKeyDate}
                            />
                        </div>

                        <div className={styles.formSection}>
                            <InfoDisplayer
                                name={"Edible Use"}
                                infoRef={edibleInfoRef}
                                newInfo={newEdibleInfo}
                                key={renderKeyEdible}
                                setRenderKey={setRenderKeyEdible}
                            />
                        </div>

                        <div className={styles.formSection}>
                            <InfoDisplayer
                                name={"Medical Use"}
                                infoRef={medicalInfoRef}
                                newInfo={newMedicalInfo}
                                key={renderKeyMedical}
                                setRenderKey={setRenderKeyMedical}
                            />
                        </div>

                        <div className={styles.formSection}>
                            <InfoDisplayer
                                name={"Craft Use"}
                                infoRef={craftInfoRef}
                                newInfo={newCraftInfo}
                                key={renderKeyCraft}
                                setRenderKey={setRenderKeyCraft}
                            />
                        </div>

                        <div className={styles.formSection}>
                            <InfoDisplayer
                                name={"Source"}
                                infoRef={sourceInfoRef}
                                newInfo={newSourceInfo}
                                key={renderKeySource}
                                setRenderKey={setRenderKeySource}
                            />
                        </div>

                        <div className={styles.formSection}>
                            <InfoDisplayer
                                name={"Custom Section"}
                                infoRef={customInfoRef}
                                newInfo={newCustomInfo}
                                key={renderKeyCustom}
                                setRenderKey={setRenderKeyCustom}
                            />
                        </div>
                    </div>

                    {/* Right Hand Column */}
                    <div className={"column"} >

                        {/*Images Section */}
                        <InfoDisplayer
                            name={"Image"}
                            infoRef={imageInfoRef}
                            newInfo={newImage}
                            key={renderKeyImage}
                            setRenderKey={setRenderKeyImage}
                        />
                    </div>
                </div>


                <div className={"row"}>

                    <div className={styles.submitButtonsContainer}>

                        {/* Upload to DB */}
                        <div className={styles.formItem}>
                            <button onClick={importPlant} className={styles.submitDataButton}> Import JSON File </button>
                        </div>

                        {/* Generate JSON Button */}
                        <div className={styles.formItem}>
                            <button onClick={downloadPlant} className={styles.submitDataButton}> Generate JSON File </button>
                        </div>

                        {/* Upload to DB */}
                        <div className={styles.formItem}>
                            <button onClick={uploadPlant} className={styles.submitDataButton}> Upload to database </button>
                        </div>

                    </div>
                </div>
            </Section>

            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <ScrollToTop/>


        </>
    )

}
