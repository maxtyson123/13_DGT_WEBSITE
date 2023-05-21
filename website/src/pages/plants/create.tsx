import React, {ChangeEvent, useEffect, useState} from "react";
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

import {PlantData} from "@/modules/plant_data";
import Section from "@/components/section";
import Footer from "@/components/footer";
import Credits from "@/components/credits";

// Constants
const PLANT_PARTS   = ["Stem", "Leaf", "Root", "Heart", "Flower", "Petals", "Fruit", "Bark", "Inner Bark", "Seeds", "Shoot", "Pollen", "Whole Plant"];
const MONTHS        = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];


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
            />
        );
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
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

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
}
export function SourceSection({typeHandler, dataHandler, valid}: SourceSectionProps){

    return(
        <>
            {/* Type */}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Source Type"}
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
            />
        );
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
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

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
}
export function CustomSection({titleHandler, textHandler, valid}: CustomSectionProps){

    return(
        <>
            {/* Custom Title */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Custom Section Title"}
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
            />
        );
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
            isValid = false;
        }else{ this.valid.image = ["success", "No Error"] as [ValidationState, string]; }

        // Update section to show validation
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

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
}
export function CraftSection({useValueHandler, additionalInfoHandler, partOfPlantHandler, valid}: CraftSectionProps){

    return(
        <>

            {/* Part of Plant */}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Part of Plant"}
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
            />
        );
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
            isValid = false;
        }else { this.valid.image = ["success", "No Error"] as [ValidationState, string]; }

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
}
export function MedicalUseSection({medicalTypeHandler, useValueHandler, preparationHandler, valid}: MedicalUseSectionProps){

    return(
        <>
            {/* Internal Or External*/}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Internal/External"}
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
            />
        );
    };

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
            isValid = false;
        } else { this.valid.image = ["success", "No Error"] as [ValidationState, string]; }

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
}
export function EdibleUseSection({partOfPlantHandler, nutritionalValueHandler, preparationTypeHandler, preparationHandler, valid}: EdibleUseSectionProps){

    return(
        <>
            {/* Part of Plant */}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Part of Plant"}
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
                    required={false}
                    state={valid.nutritionalValue[0]}
                    errorText={valid.nutritionalValue[1]}
                    changeEventHandler={nutritionalValueHandler}
                />
            </div>


            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Preparation Type"}
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
            isValid = false;
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
            />
        )
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


type DateInfoSectionProps = {
    eventHandler:       (value: string) => void;
    startDateHandler:   (value: string) => void;
    endDateHandler:     (value: string) => void;
    valid: {
        event:      [ValidationState, string];
        startDate:  [ValidationState, string];
        endDate:    [ValidationState, string];
    }
}
export function DateInfoSection({eventHandler, startDateHandler, endDateHandler, valid}: DateInfoSectionProps){

    return(
        <>
            {/* Event */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Event"}
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


/// _______________ PAGE _______________ ///

export default function CreatePlant() {

    // Page Constants
    const pageName = "Create Plant"
    const [plantName, setPlantName] = useState("...")

    // Add a state variable to trigger a re-render
    const [renderKey, setRenderKey] = useState(0);

    // Value Setters
    const [imageInfo, setImageInfo]                 = useState<ImageInfo[]>([]);
    const [englishName, setEnglishName]             = useState("")
    const [moariName, setMoariName]                 = useState("")
    const [latinName, setLatinName]                 = useState("")
    const [preferredName, setPreferredName]         = useState("")
    const [smallDescription, setSmallDescription]   = useState("")
    const [largeDescription, setLargeDescription]   = useState("")
    const [location, setLocation]                   = useState("")
    const [dateInfo, setDateInfo]                   = useState<DateInfo[]>([]);
    const [edibleInfo, setEdibleInfo]               = useState<EdibleInfo[]>([]);
    const [medicalInfo, setMedicalInfo]             = useState<MedicalInfo[]>([]);
    const [craftInfo, setCraftInfo]                 = useState<CraftInfo[]>([]);
    const [customInfo, setCustomInfo]               = useState<CustomInfo[]>([]);
    const [sourceInfo, setSourceInfo]               = useState<SourceInfo[]>([]);

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
    const newDateInfo = () => { setDateInfo([...dateInfo, new DateInfo()]) }
    const newImage = () => { setImageInfo([...imageInfo, new ImageInfo()]) }
    const newEdibleInfo = () => { setEdibleInfo([...edibleInfo, new EdibleInfo()])}
    const newMedicinalInfo = () => { setMedicalInfo([...medicalInfo, new MedicalInfo()]) }
    const newCraftInfo = () => { setCraftInfo([...craftInfo, new CraftInfo()]) }
    const newCustomInfo = () => { setCustomInfo([...customInfo, new CustomInfo()]) }
    const newSourceInfo = () => { setSourceInfo([...sourceInfo, new SourceInfo()]) }

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
        for (let i = 0; i < imageInfo.length; i++) {

            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!imageInfo[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "image-info-" + i;
            }
        }

        // Validate the date info
        for (let i = 0; i < dateInfo.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!dateInfo[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "date-info-" + i;
            }
        }

        // Validate the edible info
        for (let i = 0; i < edibleInfo.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!edibleInfo[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "edible-info-" + i;
            }
        }

        // Validate the medicinal info
        for (let i = 0; i < medicalInfo.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!medicalInfo[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "medical-info-" + i;
            }
        }

        // Validate the craft info
        for (let i = 0; i < craftInfo.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!craftInfo[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "craft-info-" + i;
                console.log("Error in craft info: ")
                console.log(craftInfo[i])

            }
        }

        // Validate the source info
        for (let i = 0; i < sourceInfo.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!sourceInfo[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "source-info-" + i;
            }
        }

        // Validate the custom info
        for (let i = 0; i < customInfo.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!customInfo[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "custom-info-" + i;
            }
        }

        // Scroll to the element with an error:
        if(elementThatNeedsFocus !== null){
            const element = document.getElementById(elementThatNeedsFocus);
            if (element) {
                let dims = element.getBoundingClientRect();
                window.scrollTo({ top: dims.top - 150 + window.scrollY, behavior: 'smooth' });
            }
        }

        return isValid;
    }

    const generateJSON = () => {
        if(!validateInput()){
            return
        }

        let plantOBJ : PlantData = {
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
        plantOBJ.preferred_name = preferredName;
        plantOBJ.english_name = englishName;
        plantOBJ.moari_name = moariName;
        plantOBJ.latin_name = latinName;
        plantOBJ.location = location;
        plantOBJ.small_description = smallDescription;
        plantOBJ.long_description = largeDescription;

        // Image info
        for(let i = 0; i < imageInfo.length; i++) {
            const thisImageInfo = imageInfo[i].state;

            let imageInfoOBJ = {
                path: "",
                type: "image",
                name: "",
                downloadable: false,
                flags: [],
            }

            imageInfoOBJ.path = thisImageInfo.image_url;
            imageInfoOBJ.name = thisImageInfo.image_name;

            plantOBJ.attachments.push(imageInfoOBJ);
        }

        // Date info
        for(let i = 0; i < dateInfo.length; i++) {
            const thisDateInfo = dateInfo[i].state;

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
        for(let i = 0; i < edibleInfo.length; i++) {
            const thisEdibleInfo = edibleInfo[i].state;

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

        // Medicinal info
        for(let i = 0; i < medicalInfo.length; i++) {
            const thisMedicalInfo = medicalInfo[i].state;

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
        for(let i = 0; i < craftInfo.length; i++) {
            const thisCraftInfo = craftInfo[i].state;

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
        for(let i = 0; i < sourceInfo.length; i++) {
            const thisSourceInfo = sourceInfo[i].state;

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
        for (let i = 0; i < customInfo.length; i++) {
            const thisCustomInfo = customInfo[i].state;

            let customInfoOBJ = {
                type: "custom",
                title: "",
                text: "",
            }

            customInfoOBJ.title = thisCustomInfo.title;
            customInfoOBJ.text = thisCustomInfo.text;

            plantOBJ.sections.push(customInfoOBJ);
        }

        // Log for debugging as well
        console.log(plantOBJ);

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

    return (
        <>
            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Set up the page header */}
            <PageHeader size={"medium"}>
                <h1 className={styles.title}>Creating plant: {plantName}</h1>
            </PageHeader>

            <Section>
                <div className={styles.row}>

                    {/* Divide the page into a left and right column*/}
                    <div className={styles.column}>

                        {/* Basic plant information */}
                        <div className={styles.formSection}>

                            {/* Section title */}
                            <h1 className={styles.sectionTitle}> Basic Info</h1>

                            {/* Plant name */}
                            <div className={styles.formItem} id={"english-name"}>
                                <SmallInput
                                    placeHolder={"English Name"}
                                    required={false}
                                    state={englishNameValidationState[0]}
                                    errorText={englishNameValidationState[1]}
                                    changeEventHandler={handleEnglishNameChange}
                                />
                            </div>
                            <div className={styles.formItem} id={"moari-name"}>
                                <SmallInput
                                    placeHolder={"Moari Name"}
                                    required={false}
                                    state={moariNameValidationState[0]}
                                    errorText={moariNameValidationState[1]}
                                    changeEventHandler={handleMoariNameChange}
                                />
                            </div>
                            <div className={styles.formItem} id={"latin-name"}>
                                <SmallInput
                                    placeHolder={"Latin Name"}
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
                            {/* Section title */}
                            <h1 className={styles.sectionTitle}> Dates </h1>

                            {/* Date Infos} */}
                            {dateInfo.map((value, index) => {
                                return (
                                    <div key={index} className={styles.formItem} id={`date-info-${index}`}>
                                        <div className={styles.formContainer}>
                                            {/* Add some space */}
                                            <br/>

                                            {/* Add the section */}
                                            {value.section}
                                        </div>
                                    </div>
                                )
                            })}
                            {/* Add date info */}
                            <div className={styles.formItem}>
                                <div className={styles.formContainer}>
                                    <button onClick={newDateInfo} className={styles.addSectionButton}> + </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            {/* Section title */}
                            <h1 className={styles.sectionTitle}> Edible Uses</h1>

                            {/* Uses} */}

                            {edibleInfo.map((value : EdibleInfo, index) => {

                                return (
                                    <div key={index + renderKey} className={styles.formItem} id={`edible-info-${index}`}>
                                        <div className={styles.formContainer}>
                                            {/* Add some space */}
                                            <br/>

                                            {/* Add the section */}
                                            {value.section}

                                            {/* Image Reference has to be here or it won't update*/}
                                            <div className={styles.formItem}>
                                                <DropdownInput
                                                    placeHolder={"Image for Edible"}
                                                    required={true}
                                                    state={value.valid.image[0]}
                                                    errorText={value.valid.image[1]}
                                                    options={
                                                        imageInfo.map((value, index) => {
                                                              // Use index as name cant be updated properly
                                                            return("Image " + (index +1).toString())
                                                        })
                                                    }
                                                    allowCustom={false}
                                                    changeEventHandler={value.handleImageChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Add Edible info */}
                            <div className={styles.formItem}>
                                <div className={styles.formContainer}>
                                    <button onClick={newEdibleInfo} className={styles.addSectionButton}> + </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            {/* Section title */}
                            <h1 className={styles.sectionTitle}> Medical Uses</h1>

                            {/* Uses} */}

                            {medicalInfo.map((value : MedicalInfo, index) => {
                                return (
                                    <div key={index} className={styles.formItem} id={`medical-info-${index}`}>
                                        <div className={styles.formContainer}>
                                            {/* Add some space */}
                                            <br/>

                                            {/* Add the section */}
                                            {value.section}

                                            {/* Image Reference has to be here or it won't update*/}
                                            <div className={styles.formItem}>
                                                <DropdownInput
                                                    placeHolder={"Image for Medical Use"}
                                                    required={true}
                                                    state={"normal"}
                                                    options={
                                                        imageInfo.map((value, index) => {
                                                              // Use index as name cant be updated properly
                                                            return("Image " + (index +1).toString())
                                                        })
                                                    }
                                                    allowCustom={false}
                                                    changeEventHandler={value.handleImageChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Add Medical info */}
                            <div className={styles.formItem}>
                                <div className={styles.formContainer}>
                                    <button onClick={newMedicinalInfo} className={styles.addSectionButton}> + </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            {/* Section title */}
                            <h1 className={styles.sectionTitle}> Craft Uses</h1>

                            {/* Uses} */}

                            {craftInfo.map((value : CraftInfo, index) => {
                                return (
                                    <div key={index} className={styles.formItem} id={`craft-info-${index}`}>
                                        <div className={styles.formContainer}>
                                            {/* Add some space */}
                                            <br/>

                                            {/* Add the section */}
                                            {value.section}

                                            {/* Image Reference has to be here or it won't update*/}
                                            <div className={styles.formItem}>
                                                <DropdownInput
                                                    placeHolder={"Image for Craft Use"}
                                                    required={true}
                                                    state={value.valid.image[0]}
                                                    errorText={value.valid.image[1]}
                                                    options={
                                                        imageInfo.map((value, index) => {

                                                            // Use index as name cant be updated properly
                                                            return("Image " + (index +1).toString())
                                                        })
                                                    }
                                                    allowCustom={false}
                                                    changeEventHandler={value.handleImageChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Add Craft info */}
                            <div className={styles.formItem}>
                                <div className={styles.formContainer}>
                                    <button onClick={newCraftInfo} className={styles.addSectionButton}> + </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            {/* Section title */}
                            <h1 className={styles.sectionTitle}> Sources</h1>

                            {/* Date Infos} */}
                            {sourceInfo.map((value, index) => {
                                return (
                                    <div key={index} className={styles.formItem} id={`source-info-${index}`}>
                                        <div className={styles.formContainer}>
                                            {/* Add some space */}
                                            <br/>

                                            {/* Add the section */}
                                            {value.section}
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Add date info */}
                            <div className={styles.formItem}>
                                <div className={styles.formContainer}>
                                    <button onClick={newSourceInfo} className={styles.addSectionButton}> + </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            {/* Section title */}
                            <h1 className={styles.sectionTitle}> Custom Info</h1>

                            {/* Custom Info */}
                            {customInfo.map((value, index) => {
                                return (
                                    <div key={index} className={styles.formItem} id={`custom-info-${index}`}>
                                        <div className={styles.formContainer}>
                                            {/* Add some space */}
                                            <br/>

                                            {/* Add the section */}
                                            {value.section}
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Add date info */}
                            <div className={styles.formItem}>
                                <div className={styles.formContainer}>
                                    <button onClick={newCustomInfo} className={styles.addSectionButton}> + </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Hand Collumn */}
                    <div className={styles.column}>

                        {/*Images Section */}

                        {/* Section title */}
                        <h1 className={styles.sectionTitle}> Images</h1>

                        {/* Image Section */}
                        <div className={styles.formSection}>

                            {/* Add Image */}
                            <div className={styles.formItem}>
                                <div className={styles.formContainer}>
                                    <button onClick={newImage} className={styles.addSectionButton}>
                                        <div>
                                            <p> + </p>
                                            <p style={{fontSize: "44px"}}> Add Image </p>
                                        </div>

                                    </button>
                                </div>
                            </div>

                            {/* Images */}
                            {imageInfo.map((value, index) => {
                                return (
                                    <div key={index} className={styles.formItem} id={`image-info-${index}`}>
                                        {value.section}
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </div>


                <div className={styles.row}>

                    <div className={styles.submitButtonsContainer}>
                        {/* Generate JSON Button */}
                        <div className={styles.formItem}>
                            <button onClick={generateJSON} className={styles.submitDataButton}> Generate JSON File </button>
                        </div>

                        {/* Upload to DB */}
                        <div className={styles.formItem}>
                            <button className={styles.submitDataButton}> Upload to database </button>
                        </div>

                    </div>
                </div>
            </Section>

            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <Credits/>
        </>
    )

}



//TODO: Upload to server, New API to upload image that hides the API key