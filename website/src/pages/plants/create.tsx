import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import PageHeader from "@/components/page_header";
import styles from "@/styles/create.module.css";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import {
    AdvancedTextArea,
    DropdownInput,
    SimpleTextArea,
    SmallInput,
    ValidationState
} from "@/components/input_sections";
import Image from "next/image";

import {
    AttachmentData,
    ConvertPlantDataIntoApi,
    CraftSectionData,
    CustomSectionData,
    EdibleSectionData,
    emptyPlantData,
    fetchPlant,
    FileMetaData,
    fixAttachmentsPaths,
    ImageMetaData,
    MedicalSectionData,
    MonthsReadyData,
    PlantData,
    SourceSectionData,
    ValidPlantData
} from "@/lib/plant_data";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import axios from "axios";

import {MONTHS, PLANT_PARTS} from "@/lib/constants"
import {useRouter} from "next/router";
import {Error} from "@/components/error";
import {signIn, signOut, useSession} from "next-auth/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCloudArrowUp, faDoorOpen, faFile, faPerson} from "@fortawesome/free-solid-svg-icons";
import {globalStyles} from "@/lib/global_css";


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
                <AdvancedTextArea
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
        useIdentifier: "",
        use:            "",
        additionalInfo: "",
        image:          "",
    };

    // Store the validation state for each input
    valid = {
        partOfPlant:    ["normal", "No Error"] as [ValidationState, string],
        useIdentifier: ["normal", "No Error"] as [ValidationState, string],
        use:            ["normal", "No Error"] as [ValidationState, string],
        additionalInfo: ["normal", "No Error"] as [ValidationState, string],
        image:          ["normal", "No Error"] as [ValidationState, string],
    };

    section: JSX.Element = <></>;

    // Change Handlers that update the state
    handUseIdentifierChange     = (value : string) => {this.state.useIdentifier  = value};
    handleUseValueChange        = (value : string) => {this.state.use              = value};
    handleAdditionalInfoChange  = (value : string) => {this.state.additionalInfo   = value};
    handlePartOfPlantChange     = (value : string) => { this.state.partOfPlant     = value};
    handleImageChange           = (value : string) => {this.state.image            = value};

    // Functions to update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <CraftSection
                useIdentifierHandler = {this.handUseIdentifierChange}
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

        // If there is no use identifier selected then show an error otherwise the input is valid
        if(this.state.useIdentifier === "") {
            this.valid.useIdentifier = ["error", "Please select a use identifier"] as [ValidationState, string];
            isValid = false;
        }else{ this.valid.useIdentifier = ["success", "No Error"] as [ValidationState, string]; }

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
    useIdentifierHandler:   (value: string) => void;
    useValueHandler:        (value: string) => void;
    additionalInfoHandler:  (value: string) => void;
    partOfPlantHandler:     (value: string) => void;
    valid: {
        partOfPlant:    [ValidationState, string];
        useIdentifier: [ValidationState, string];
        use:            [ValidationState, string];
        additionalInfo: [ValidationState, string];
        image:          [ValidationState, string];
    }
    state: {
        partOfPlant:    string;
        useIdentifier: string;
        use:            string;
        additionalInfo: string;
        image:          string;
    }
}
export function CraftSection({useIdentifierHandler, useValueHandler, additionalInfoHandler, partOfPlantHandler, valid, state}: CraftSectionProps){

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
                    changeEventHandler={partOfPlantHandler}
                />
            </div>

            {/* Use Identifier */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Use Identifier"}
                    defaultValue={state.useIdentifier}
                    required={true}
                    state={valid.useIdentifier[0]}
                    errorText={valid.useIdentifier[1]}
                    changeEventHandler={useIdentifierHandler}
                />
            </div>

            {/* Use */}
            <div className={styles.formItem}>
                <AdvancedTextArea
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
                <AdvancedTextArea
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
        useIdentifier: "",
        use:            "",
        preparation:    "",
        image:          "",
    };

    // Store the validation state for each input
    valid = {
        type:           ["normal", "No Error"] as [ValidationState, string],
        useIdentifier: ["normal", "No Error"] as [ValidationState, string],
        use:            ["normal", "No Error"] as [ValidationState, string],
        preparation:    ["normal", "No Error"] as [ValidationState, string],
        image:          ["normal", "No Error"] as [ValidationState, string],
    }

    section: JSX.Element = <></>;

    // Change Handlers that update the state
    handleTypeChange            = (value : string) => { this.state.type        = value};
    handleUseIdentifierChange   = (value : string) => {this.state.useIdentifier = value};
    handeUseValueChange         = (value : string) => {this.state.use          = value};
    handlePreparationChange     = (value : string) => {this.state.preparation  = value};
    handleImageChange           = (value : string) => {this.state.image        = value};

    // Functions to update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <MedicalUseSection
                medicalTypeHandler={this.handleTypeChange}
                medicalUseIdentifierHandler={this.handleUseIdentifierChange}
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

        // If there is no use identifier entered then show an error otherwise the input is valid
        if(this.state.useIdentifier === "") {
            this.valid.useIdentifier = ["error", "Please identify how this plant is used in a medical context"] as [ValidationState, string];
            isValid = false;
        }else { this.valid.useIdentifier = ["success", "No Error"] as [ValidationState, string]; }

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
    medicalUseIdentifierHandler: (value: string) => void;
    useValueHandler:        (value: string) => void;
    preparationHandler:     (value: string) => void;
    valid: {
        type:           [ValidationState, string];
        useIdentifier: [ValidationState, string];
        use:            [ValidationState, string];
        preparation:    [ValidationState, string];
        image:          [ValidationState, string];
    }
    state: {
        type:           string;
        useIdentifier: string;
        use:            string;
        preparation:    string;
        image:          string;
    }
}
export function MedicalUseSection({medicalTypeHandler, medicalUseIdentifierHandler, useValueHandler, preparationHandler, valid, state}: MedicalUseSectionProps){

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
                    changeEventHandler={medicalTypeHandler}
                />
            </div>

            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Use Identifier"}
                    defaultValue={state.useIdentifier}
                    required={true}
                    state={valid.useIdentifier[0]}
                    errorText={valid.useIdentifier[1]}
                    changeEventHandler={medicalUseIdentifierHandler}
                />
            </div>

            {/* Use */}
            <div className={styles.formItem}>
                <AdvancedTextArea
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
                <AdvancedTextArea
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
        useIdentifier:     "",
        nutritionalValue:   "",
        preparation:        "",
        preparationType:    "",
        image:              "",
    };

    // Store the validation state for each input
    valid = {
        partOfPlant:        ["normal", "No Error"] as [ValidationState, string],
        useIdentifier:     ["normal", "No Error"] as [ValidationState, string],
        nutritionalValue:   ["normal", "No Error"] as [ValidationState, string],
        preparation:        ["normal", "No Error"] as [ValidationState, string],
        preparationType:    ["normal", "No Error"] as [ValidationState, string],
        image:              ["normal", "No Error"] as [ValidationState, string],
    }

    section: JSX.Element = <></>;

    // Change Handlers that update the state
    handlePartOfPlantChange         = (value : string) => { this.state.partOfPlant     = value};
    handleUseIdentifierChange       = (value : string) => {this.state.useIdentifier  = value};
    handleNutritionalValueChange    = (value : string) => {this.state.nutritionalValue = value};
    handlePreparationChange         = (value : string) => {this.state.preparation      = value};
    handlePreparationTypeChange     = (value : string) => {this.state.preparationType  = value};
    handleImageChange               = (value : string) => {this.state.image            = value};

    // Update the section to show the current state
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <EdibleUseSection
                partOfPlantHandler={this.handlePartOfPlantChange}
                useIdentifierHandler={this.handleUseIdentifierChange}
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

    showErrorInImage = () => {

    }

    // Validate the section
    validate = () => {
        let isValid = true;

        // If there is no part of plant selected then show an error otherwise the input is valid
        if(this.state.partOfPlant === "") {
            this.valid.partOfPlant = ["error", "Please select what part of the plant is edible"];
            isValid = false;
        }else { this.valid.partOfPlant = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no use identifier entered then show an error otherwise the input is valid
        if(this.state.useIdentifier === "") {
            this.valid.useIdentifier = ["error", "Please enter a use identifier"];
            isValid = false;
        } else { this.valid.useIdentifier = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no nutritional value entered then ignore as not required otherwise the input is valid
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
        if(this.state.image === "") {
            this.valid.image = ["error", "Please select what image is related to the edible use of this plant"];
            isValid = false;
            this.showErrorInImage();
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
    useIdentifierHandler:    (value: string) => void;
    nutritionalValueHandler: (value: string) => void;
    preparationTypeHandler:  (value: string) => void;
    preparationHandler:      (value: string) => void;
    valid: {
        partOfPlant:        [ValidationState, string];
        useIdentifier:     [ValidationState, string];
        nutritionalValue:   [ValidationState, string];
        preparation:        [ValidationState, string];
        preparationType:    [ValidationState, string];
        image:              [ValidationState, string];

    }
    state: {
        partOfPlant:        string;
        useIdentifier:     string;
        nutritionalValue:   string;
        preparation:        string;
        preparationType:    string;
        image:        string;
    }
}
export function EdibleUseSection({partOfPlantHandler, useIdentifierHandler, nutritionalValueHandler, preparationTypeHandler, preparationHandler, valid, state}: EdibleUseSectionProps){

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
                    changeEventHandler={partOfPlantHandler}
                />
            </div>

            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Use Identifier"}
                    defaultValue={state.useIdentifier}
                    required={true}
                    state={valid.useIdentifier[0]}
                    errorText={valid.useIdentifier[1]}
                    changeEventHandler={useIdentifierHandler}
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
                />
            </div>

            {/* Preparation */}
            <div className={styles.formItem}>
                <AdvancedTextArea
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
    state: {
        image_url:      string;
        image_data:     string;
        image_name:     string;
        image_credit:   string;
        image_description:     string;
        image_file:     File | null;
    } = {
        image_url:      "",
        image_data:     "",
        image_name:     "",
        image_credit:   "",
        image_description:     "",
        image_file:     null,
    }

    // Store the validation state of the section
    valid = {
        image_url:      ["normal", "No Error"] as [ValidationState, string],
        image_name:     ["normal", "No Error"] as [ValidationState, string],
        image_credit:   ["normal", "No Error"] as [ValidationState, string],
        image_description:     ["normal", "No Error"] as [ValidationState, string],
    }

    section: JSX.Element = <></>;

    updateNames = () => {}

    // Handlers that update the state
    handleImageChange       = (file : File)    => {this.state.image_file = file};
    handeURLChange          = (value : string) => {this.state.image_url   = value};
    handleDataChange        = (value : string) => {this.state.image_data  = value};
    handleNameChange        = (value : string) => {this.state.image_name   = value; this.updateNames()};
    handleCreditChange      = (value : string) => {this.state.image_credit = value};
    handleDescriptionChange        = (value : string) => {this.state.image_description   = value};

    // Update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <ImageSection
                nameHandler={this.handleNameChange}
                imageFileHandler={this.handleImageChange}
                imageURLHandler={this.handeURLChange}
                imageDataURLHandler={this.handleDataChange}
                creditHandler={this.handleCreditChange}
                descriptionHandler={this.handleDescriptionChange}
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


    // Validate the section
    validate = () => {
        let isValid = true;

        // If there is no image name entered, or it is longer than 50 chars then show an error otherwise the input is valid
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

        this.reRenderSection();

        // Return whether the section is valid or not
        return isValid;
    }

    constructor() {
        this.updateSection();
    }

}

// Define the type of the props for the Image Section
type ImageSectionProps = {
    nameHandler:     (value: string) => void;
    imageURLHandler:       (value: string) => void;
    imageDataURLHandler:   (value: string) => void;
    imageFileHandler:       (file: File)    => void;
    creditHandler:          (value: string) => void;
    descriptionHandler:            (value: string) => void;
    valid: {
        image_url:  [ValidationState, string];
        image_name: [ValidationState, string];
        image_credit: [ValidationState, string];
        image_description: [ValidationState, string];
    }
    state: {
        image_url:  string;
        image_data: string;
        image_name: string;
        image_credit: string;
        image_description: string;
    }
}
export function ImageSection({nameHandler, imageFileHandler, imageURLHandler, imageDataURLHandler, creditHandler, descriptionHandler, state, valid}: ImageSectionProps){

    const [localURL, setLocalURL] = useState(1);

    useEffect(() => {
        setLocalURL(prevState => prevState + 1);

    }, [state])

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {

        // Prevent the default behaviour
        event.preventDefault();

        // Get the file from the event
        const selectedFile = event.target.files;

        // If there is no file selected, then return
        if (!selectedFile) {
            console.log('Please select a file.');
            return;
        }

        const file = selectedFile[0];

        // Handle the change of the file
        imageFileHandler(file);
        imageURLHandler(file.name);
        imageDataURLHandler(URL.createObjectURL(file));

        // re-render
        setLocalURL(prevState => prevState + 1);
    }


    return(
        <>
            {/* Image / Uploader */}
            <div className={styles.formItem} key={localURL}>
                <div className={styles.fileUploader + " " + globalStyles.gridCentre}>

                    {/* If there is an image then display that, otherwise show an upload button */}
                    {state.image_url !== "" ?
                        <>
                            {/* Load the image from the website or use the blob data from the file */}
                            <Image style={{borderRadius: 8}} src={state.image_url.startsWith("http") ? state.image_url : state.image_data} alt={state.image_url} width={600} height={600} objectFit={"contain"}/>
                        </>
                        :
                        <>
                            <div className={styles.uploadButton}>
                                <label htmlFor="files"><FontAwesomeIcon icon={faCloudArrowUp}/> Select Image</label>
                                <input id="files" type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} />
                            </div>
                        </>
                    }
                </div>
            </div>

            {/* Image Name */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Image Name"}
                    defaultValue={state.image_name}
                    required={true}
                    state={valid.image_name[0]}
                    errorText={valid.image_name[1]}
                    changeEventHandler={nameHandler}
                />
            </div>

            {/* Image Credit */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Image Credits"}
                    defaultValue={state.image_credit}
                    required={false}
                    state={valid.image_credit[0]}
                    errorText={valid.image_credit[1]}
                    changeEventHandler={creditHandler}
                />
            </div>

            {/* Image description */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Short Image Description"}
                    defaultValue={state.image_description}
                    required={false}
                    state={valid.image_description[0]}
                    errorText={valid.image_description[1]}
                    changeEventHandler={descriptionHandler}
                />
            </div>
        </>
    )
}


class FileInfo{

    // Store the state of the section
    state: {
        file_url:      string;
        file_name:     string;
        file_credit:   string;
        file_size:     number;
        file:     File | null;
    } = {
        file_url:      "",
        file_name:     "",
        file_credit:   "",
        file_size:     0,
        file:     null,
    }

    // Store the validation state of the section
    valid = {
        file_url:      ["normal", "No Error"] as [ValidationState, string],
        file_name:     ["normal", "No Error"] as [ValidationState, string],
        file_credit:   ["normal", "No Error"] as [ValidationState, string],
    }

    section: JSX.Element = <></>;

    // Handlers that update the state
    handleNameChange = (value: string) => {this.state.file_name = value; this.validate(); this.reRenderSection()};
    handleFileChange = (file: File) => {this.state.file = file; this.validate(); this.reRenderSection()};
    handeURLChange = (value: string) => {this.state.file_url = value; this.validate(); this.reRenderSection()};
    handleCreditChange = (value: string) => {this.state.file_credit = value; this.validate(); this.reRenderSection()};
    handleSizeChange = (value: number) => {this.state.file_size = value; this.validate(); this.reRenderSection()};

    // Update the section
    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <FileSection
                nameHandler={this.handleNameChange}
                fileHandler={this.handleFileChange}
                URLHandler={this.handeURLChange}
                creditHandler={this.handleCreditChange}
                sizeHandler={this.handleSizeChange}
                state={this.state}
                valid={this.valid}
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


    // Validate the section
    validate = () => {
        let isValid = true;

        // If there is no file name entered, or it is longer than 50 chars then show an error otherwise the input is valid
        if(this.state.file_name === "") {
            this.valid.file_name = ["error", "Please enter a name for the file"];
            isValid = false;
        }else if(this.state.file_name.length > 50) {
            this.valid.file_name = ["error", "File name must be less than 50 characters"];
            isValid = false;
        }else { this.valid.file_name = ["success", "No Error"] as [ValidationState, string]; }

        // If there is no file uploaded then show an error otherwise the input is valid
        if(this.state.file_url === "") {
            this.valid.file_name = ["error", "Please upload a file"]; // Use name here as upload doesn't have a state
            isValid = false;
        }

        // If there is credit then make it valid
        if(this.state.file_credit !== "") { this.valid.file_credit = ["success", "No Error"] as [ValidationState, string]; }

        this.reRenderSection();

        // Return whether the section is valid or not
        return isValid;
    }

    constructor() {
        this.updateSection();
    }

}

// Define the type of the props for the File Section
type FileSectionProps = {
    nameHandler: (value: string) => void;
    fileHandler: (file: File) => void;
    URLHandler: (value: string) => void;
    creditHandler: (value: string) => void;
    sizeHandler: (value: number) => void;
    state: {
        file_url:      string;
        file_name:     string;
        file_credit:   string;
        file:     File | null;
    };
    valid: {
        file_url:      [ValidationState, string];
        file_name:     [ValidationState, string];
        file_credit:   [ValidationState, string];
    };


}
export function FileSection({nameHandler, fileHandler, URLHandler, creditHandler, sizeHandler, state, valid}: FileSectionProps){

    // States
    const [fileLocalURL, setFileLocalURL ]  = useState(state.file_url)


    const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
        // Prevent the default behaviour
        event.preventDefault();

        // Get the file from the event
        const selectedFile = event.target.files;

        // If there is no file selected then return
        if (!selectedFile) {
            console.log('Please select a file.');
            return;
        }

        const file = selectedFile[0];

        // Handle the change of the file
        fileHandler(file);
        URLHandler(file.name);
        sizeHandler(file.size);
        setFileLocalURL(URL.createObjectURL(file));

    }


    return(
        <>
            {/* File / Uploader */}
            <div className={styles.formItem}>
                <div className={styles.fileUploader + " " + globalStyles.gridCentre}>

                    {/* If there is a file uploaded then show the file otherwise show the upload button */}
                    {fileLocalURL !== "" ?
                        <>
                            <a href={fileLocalURL} target={"_blank"}>
                                <FontAwesomeIcon icon={faFile} size={"3x"} className={styles.fileDisplayItem}/>
                                <p className={styles.fileDisplayItem}>{state.file_url}</p>
                            </a>
                        </>
                        :
                        <>
                            <div className={styles.uploadButton}>
                                <label htmlFor="files"><FontAwesomeIcon icon={faCloudArrowUp}/> Select File</label>
                                <input id="files" type="file" onChange={handleFileSelection} />
                            </div>
                        </>
                    }
                </div>
            </div>

            {/* Image Name */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"File Name"}
                    defaultValue={state.file_name}
                    required={true}
                    state={valid.file_name[0]}
                    errorText={valid.file_name[1]}
                    changeEventHandler={nameHandler}
                />
            </div>

            {/* Image Credit */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"File Credits"}
                    defaultValue={state.file_credit}
                    required={false}
                    state={valid.file_credit[0]}
                    errorText={valid.file_credit[1]}
                    changeEventHandler={creditHandler}
                />
            </div>
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
                    options={MONTHS}
                />
            </div>
        </>
    )
}

interface infoDisplayedProps{
    infoRef         : React.MutableRefObject<DateInfo[]>
        | React.MutableRefObject<EdibleInfo[]>
        | React.MutableRefObject<MedicalInfo[]>
        | React.MutableRefObject<CraftInfo[]>
        | React.MutableRefObject<SourceInfo[]>
        | React.MutableRefObject<CustomInfo[]>
        | React.MutableRefObject<ImageInfo[]>
        | React.MutableRefObject<FileInfo[]>
    newInfo         : () => void
    name            : string
    setRenderKey    : React.Dispatch<React.SetStateAction<number>>
    imageRef?       : React.MutableRefObject<ImageInfo[]>
}
function InfoDisplayed({infoRef, newInfo, name, setRenderKey, imageRef} : infoDisplayedProps){

    // Calculate the id of the info
    let id = name.toLowerCase().replace(" ", "-");

    const removeInfo = (id: number) => {
        // Remove the info displayed
        infoRef.current.splice(id, 1);

        // Re-render the entire div with this update
        setRenderKey(prevState => prevState + 1)
    }

    let images: string[] = [];

    if(imageRef){
        if(imageRef.current.length > 0) {
            images = imageRef.current.map((value, index) => {
                return value.state.image_name
            });
        }
    }

    images.unshift("Default")

    return(
        <>
            {/* Section title */}
            <h1 className={styles.sectionTitle}> {name}s </h1>

            {/* Infos} */}
            {infoRef.current.map((value, index) => (
                <div key={index} className={styles.formItem} id={`${id}-${index}`}>
                    <div className={styles.formContainer}>
                        {/* Remove Button */}
                        <button onClick={() => {removeInfo(index);}} className={styles.deleteSectionButton}> X </button>

                        {/* Add some space */}
                        <br />

                        {/* Add the section */}
                        {value.section}

                        {/* Image selector has to be here as the sections themselves cant see each other */}
                        {imageRef ?
                        <div className={styles.formItem}>
                            <DropdownInput
                                placeHolder={"Image"}
                                defaultValue={value.state && 'image' in value.state ? value.state.image : ""}
                                required={true}
                                state={value.valid && 'image' in value.valid ? value.valid.image[0] : "normal"}
                                errorText={value.valid && 'image' in value.valid ? value.valid.image[1] : "No Error"}
                                options={images}
                                changeEventHandler={
                                    value instanceof EdibleInfo ||
                                    value instanceof MedicalInfo ||
                                    value instanceof CraftInfo
                                    // Any other classes that use images here...
                                    ? value.handleImageChange : undefined}
                            />
                        </div>
                            :
                        <></>
                        }
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

    // Get the logged-in user
    const { data: session } = useSession()

    // Page States
    const pageName = "Create Plant"
    const [plantName, setPlantName] = useState("...")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [progressMessage, setProgressMessage] = useState("")

    // Imported DATA
    const [importedJSON, setImportedJSON] = useState<PlantData>(emptyPlantData())

    // Value Setters
    const [englishName, setEnglishName]             = useState("")
    const [maoriName, setMaoriName]                 = useState("")
    const [latinName, setLatinName]                 = useState("")
    const [preferredName, setPreferredName]         = useState("")
    const [smallDescription, setSmallDescription]   = useState("")
    const [largeDescription, setLargeDescription]   = useState("")
    const [location, setLocation]                   = useState("")
    const [displayImage, setDisplayImage]           = useState("")
    const [plantType, setPlantType]                 = useState("")

    // Section Refs
    const imageInfoRef                 = useRef<ImageInfo[]>([]);
    const dateInfoRef                   = useRef<DateInfo[]>([]);
    const edibleInfoRef               = useRef<EdibleInfo[]>([]);
    const medicalInfoRef             = useRef<MedicalInfo[]>([]);
    const craftInfoRef                 = useRef<CraftInfo[]>([]);
    const customInfoRef               = useRef<CustomInfo[]>([]);
    const sourceInfoRef               = useRef<SourceInfo[]>([]);
    const fileInfoRef                   = useRef<FileInfo[]>([]);

    // Section Render Keys
    const [renderKeyDate, setRenderKeyDate] = useState(0);
    const [renderKeyImage, setRenderKeyImage] = useState(0);
    const [renderKeyEdible, setRenderKeyEdible] = useState(0);
    const [renderKeyMedical, setRenderKeyMedical] = useState(0);
    const [renderKeyCraft, setRenderKeyCraft] = useState(0);
    const [renderKeyCustom, setRenderKeyCustom] = useState(0);
    const [renderKeySource, setRenderKeySource] = useState(0);
    const [renderKeyFile, setRenderKeyFile] = useState(0);
    const [renderKeyDisplayImage, setRenderKeyDisplayImage] = useState(0);

    // Value Handlers
    const handleEnglishNameChange = (value : string) => { setEnglishName(value); };
    const handleMaoriNameChange = (value : string) => { setMaoriName(value); };
    const handleLatinNameChange = (value : string) => { setLatinName(value); };
    const handleDropDownChange = (value : string) => { setPreferredName(value) };
    const handleSmallDescriptionChange = (value : string) => { setSmallDescription(value) };
    const handleLargeDescriptionChange = (value : string) => { setLargeDescription(value) };
    const handleLocationChange = (value : string) => { setLocation(value) };
    const handleDisplayImageChange = (value : string) => { setDisplayImage(value) };
    const handlePlantTypeChange = (value : string) => { setPlantType(value) };

    // New Section Setters
    const newDateInfo = () => {dateInfoRef.current = [...dateInfoRef.current, new DateInfo()]; setRenderKeyDate(prevState => prevState + 1)}
    const newImage = () => { imageInfoRef.current = [...imageInfoRef.current, new ImageInfo()]; setRenderKeyImage(prevState => prevState + 1)}
    const newEdibleInfo = () => { edibleInfoRef.current = [...edibleInfoRef.current, new EdibleInfo()]; setRenderKeyEdible(prevState => prevState + 1)}
    const newMedicalInfo = () => { medicalInfoRef.current = [...medicalInfoRef.current, new MedicalInfo()]; setRenderKeyMedical(prevState => prevState + 1)}
    const newCraftInfo = () => { craftInfoRef.current = [...craftInfoRef.current, new CraftInfo()]; setRenderKeyCraft(prevState => prevState + 1)}
    const newCustomInfo = () => { customInfoRef.current = [...customInfoRef.current, new CustomInfo()]; setRenderKeyCustom(prevState => prevState + 1)}
    const newSourceInfo = () => { sourceInfoRef.current = [...sourceInfoRef.current, new SourceInfo()]; setRenderKeySource(prevState => prevState + 1)}
    const newFileInfo = () => { fileInfoRef.current = [...fileInfoRef.current, new FileInfo()]; setRenderKeyFile(prevState => prevState + 1)}

    // Section States
    const [englishNameValidationState, setEnglishNameValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [maoriNameValidationState, setMaoriNameValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [latinNameValidationState, setLatinNameValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [preferredNameValidationState, setPreferredNameValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [smallDescriptionValidationState, setSmallDescriptionValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [largeDescriptionValidationState, setLargeDescriptionValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [locationValidationState, setLocationValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [displayImageValidationState, setDisplayImageValidationState] = useState(["normal", "No Error"] as [ValidationState, string])
    const [plantTypeValidationState, setPlantTypeValidationState] = useState(["normal", "No Error"] as [ValidationState, string])

    // Update the page title when name changes
    useEffect(() => {
        switch (preferredName) {
            case "English":
                setPlantName(englishName);
                break;

            case "Maori":
                setPlantName(maoriName);
                break;

            case "Latin":
                setPlantName(latinName);
                break
        }
    }, [englishName, maoriName, latinName, preferredName]);

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

                // Dont need to check if null here as there is nothing before it 
                elementThatNeedsFocus = "english-name";
            }
        } else { setEnglishNameValidationState(["success", "No Error"] as [ValidationState, string]);  }

        // Maori Name
        if(maoriName === ""){
            if(preferredName === "Maori"){
                setMaoriNameValidationState(["error", "Required if preferred name is Maori"])
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "maori-name";
            }
        }else { setMaoriNameValidationState(["success", "No Error"] as [ValidationState, string]) }

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

        // Display Image
        if(displayImage === ""){
            setDisplayImageValidationState(["error", "Please select a display image"])
            isValid = false;
            if(elementThatNeedsFocus === null) elementThatNeedsFocus = "display-image";
        }else { setDisplayImageValidationState(["success", "No Error"] as [ValidationState, string]) }

        // Plant Type
        if(plantType === ""){
            setPlantTypeValidationState(["error", "Please select a plant type"])
            isValid = false;
            if(elementThatNeedsFocus === null) elementThatNeedsFocus = "plant-type";
        } else { setPlantTypeValidationState(["success", "No Error"] as [ValidationState, string]) }

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

        // Validate the file info
        for (let i = 0; i < fileInfoRef.current.length; i++) {
            // Only change the valid state if it is false to prevent previous falses being overridden to be true
            if(!fileInfoRef.current[i].validate()){
                isValid = false;
                if(elementThatNeedsFocus === null) elementThatNeedsFocus = "file-" + i;
            }
        }

        // If the previous error message is this on then remove it
        if(error === "Please fix the fields below" || error === "Please add at least one image"){
            setError("")
        }

        // Set the top error message
        if(!isValid){
            setError("Please fix the fields below")
        }

        // Scroll to the element with an error:
        if(elementThatNeedsFocus !== null){
            scrollToElement(elementThatNeedsFocus)
        }

        return isValid;
    }


    const cleanInput = (input: string) => {

        if(!input)
            return input;

        let clean = input;

        // Replace ' with slanted '
        clean = input.replaceAll("'", "’");

        return clean;

    }

    const generateJSON = () => {

        // Create the JSON object
        let plantOBJ = emptyPlantData()

        // Basic info
        plantOBJ.preferred_name = cleanInput(preferredName);
        plantOBJ.english_name = cleanInput(englishName);
        plantOBJ.maori_name =   cleanInput(maoriName);
        plantOBJ.latin_name =   cleanInput(latinName);
        plantOBJ.location_found = cleanInput(location);
        plantOBJ.small_description = cleanInput(smallDescription)
        plantOBJ.long_description = cleanInput(largeDescription)
        plantOBJ.author = "Unknown";
        plantOBJ.last_modified = new Date().toISOString()
        plantOBJ.display_image = cleanInput(displayImage);
        plantOBJ.plant_type = cleanInput(plantType);

        // Get the plant author
        if(session && session.user){

            // If there is a user then set the author to the user's name
            if (session.user.name)
                plantOBJ.author = session.user.name;

            // Get the previous author
            let prevAuthors = importedJSON.author;

            // If there is a previous author then add it to the list
            if(prevAuthors){
                // Split at the comma
                let prevAuthorsList = prevAuthors.split(",");

                // Check if the current author is already in the list and remove it if it is
                if(prevAuthorsList.includes(plantOBJ.author)) {
                    prevAuthorsList.splice(prevAuthorsList.indexOf(plantOBJ.author), 1);
                }

                // Add the prev authors to the author list
                plantOBJ.author = plantOBJ.author + "," + prevAuthorsList.join(",");
            }
        }


        // Image info
        for(let i = 0; i < imageInfoRef.current.length; i++) {
            const thisImageInfo = imageInfoRef.current[i].state;

            let imageInfoOBJ = {
                path: cleanInput(thisImageInfo.image_url),
                type: "image",
                meta: {
                    "name": cleanInput(thisImageInfo.image_name),
                    "credits": cleanInput(thisImageInfo.image_credit),
                    "description": cleanInput(thisImageInfo.image_description),
                },
                downloadable: false,
            } as AttachmentData;

            plantOBJ.attachments.push(imageInfoOBJ);
        }

        // File info
        for(let i = 0; i < fileInfoRef.current.length; i++) {
            const thisFileInfo = fileInfoRef.current[i].state;

            let fileInfoOBJ = {
                path: cleanInput(thisFileInfo.file_url),
                type: "file",
                meta: {
                    "name": cleanInput(thisFileInfo.file_name),
                    "credits": cleanInput(thisFileInfo.file_credit),
                    "size": thisFileInfo.file_size,
                },
                downloadable: true,
            } as AttachmentData;

            // Set the type to the file type
            if(thisFileInfo.file)
                fileInfoOBJ.type = thisFileInfo.file.type.split("/")[1];

            plantOBJ.attachments.push(fileInfoOBJ);
        }

        // Date info
        for(let i = 0; i < dateInfoRef.current.length; i++) {
            const thisDateInfo = dateInfoRef.current[i].state;

            let dateInfoOBJ = {
                event: "",
                start_month: "",
                end_month: "",
            } as MonthsReadyData;

            dateInfoOBJ.event = cleanInput(thisDateInfo.event);
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
                use_identifier: "",
                image_of_part: "",
                nutrition: "",
                preparation: "",
                preparation_type: "",
            } as EdibleSectionData;

            edibleInfoOBJ.part_of_plant = cleanInput(thisEdibleInfo.partOfPlant);
            edibleInfoOBJ.use_identifier = cleanInput(thisEdibleInfo.useIdentifier);
            edibleInfoOBJ.image_of_part = cleanInput(thisEdibleInfo.image);
            edibleInfoOBJ.nutrition = cleanInput(thisEdibleInfo.nutritionalValue);
            edibleInfoOBJ.preparation = cleanInput(thisEdibleInfo.preparation);
            edibleInfoOBJ.preparation_type = cleanInput(thisEdibleInfo.preparationType);

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
                use_identifier: "",
                use: "",
                image: "",
                preparation: "",
            } as MedicalSectionData;

            medicalInfoOBJ.medical_type = cleanInput(thisMedicalInfo.type);
            medicalInfoOBJ.use_identifier = cleanInput(thisMedicalInfo.useIdentifier);
            medicalInfoOBJ.use = cleanInput(thisMedicalInfo.use);
            medicalInfoOBJ.image = cleanInput(thisMedicalInfo.image);
            medicalInfoOBJ.preparation = cleanInput(thisMedicalInfo.preparation);

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
                use_identifier: "",
                use: "",
                image: "",
                additonal_info: "",
            } as CraftSectionData;

            craftInfoOBJ.part_of_plant = cleanInput(thisCraftInfo.partOfPlant);
            craftInfoOBJ.use_identifier = cleanInput(thisCraftInfo.useIdentifier);
            craftInfoOBJ.use = cleanInput(thisCraftInfo.use);
            craftInfoOBJ.image = cleanInput(thisCraftInfo.image);
            craftInfoOBJ.additonal_info = cleanInput(thisCraftInfo.additionalInfo);

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
            } as SourceSectionData;

            sourceInfoOBJ.source_type = cleanInput(thisSourceInfo.type);
            sourceInfoOBJ.data = cleanInput(thisSourceInfo.data);

            plantOBJ.sections.push(sourceInfoOBJ);
        }

        // Custom info
        for (let i = 0; i < customInfoRef.current.length; i++) {
            const thisCustomInfo = customInfoRef.current[i].state;

            let customInfoOBJ = {
                type: "custom",
                title: "",
                text: "",
            } as CustomSectionData;

            customInfoOBJ.title = cleanInput(thisCustomInfo.title);
            customInfoOBJ.text = cleanInput(thisCustomInfo.text);

            plantOBJ.sections.push(customInfoOBJ);
        }

        return plantOBJ;
    }

    const loadJson = (jsonContents: PlantData) => {

        // Set the imported JSON (also updates the basic info)
        setImportedJSON(jsonContents)

        // Clear the current sections
        dateInfoRef.current     = [];
        edibleInfoRef.current   = [];
        medicalInfoRef.current  = [];
        craftInfoRef.current    = [];
        sourceInfoRef.current   = [];
        customInfoRef.current   = [];
        imageInfoRef.current    = [];
        fileInfoRef.current     = [];

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

        // Create the images and files
        for (let i = 0; i < jsonContents.attachments.length; i++) {

            // If this is an image
            if(jsonContents.attachments[i].type === "image"){
                // Create the new section
                newImage()

                // Get the new section
                const imageSection = imageInfoRef.current[imageInfoRef.current.length-1];

                // Update the values
                if(jsonContents.id !== 1) { // If it is not an import from local
                    imageSection.handeURLChange(jsonContents.attachments[i].path)
                }
                const metaData = jsonContents.attachments[i].meta as ImageMetaData
                imageSection.handleNameChange(metaData.name)
                imageSection.handleCreditChange(metaData.credits)
                imageSection.handleDescriptionChange(metaData.description)

                // Re-render the section
                imageSection.reRenderSection()
                continue;
            }

            // Otherwise it is a file

            // Create the new section
            newFileInfo()

            // Get the new section
            const fileSection = fileInfoRef.current[fileInfoRef.current.length-1];

            // Update the values
            if(jsonContents.id !== 1) {     // If it is not an import from local
                fileSection.handeURLChange(jsonContents.attachments[i].path)
            }
            const metaData = jsonContents.attachments[i].meta as FileMetaData
            fileSection.handleNameChange(metaData.name)
            fileSection.handleCreditChange(metaData.credits)
            fileSection.handleSizeChange(metaData.size)

            // Re-render the section
            fileSection.reRenderSection()

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
                    edibleSection.handleUseIdentifierChange(jsonContents.sections[i].use_identifier)
                    edibleSection.handleNutritionalValueChange(jsonContents.sections[i].nutritional_value)
                    edibleSection.handlePreparationChange(jsonContents.sections[i].preparation)
                    edibleSection.handlePreparationTypeChange(jsonContents.sections[i].preparation_type)
                    edibleSection.handleImageChange(jsonContents.sections[i].image_of_part)

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
                    medicalSection.handleUseIdentifierChange(jsonContents.sections[i].use_identifier)
                    medicalSection.handeUseValueChange(jsonContents.sections[i].use)
                    medicalSection.handleImageChange(jsonContents.sections[i].image)

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
                    craftSection.handUseIdentifierChange(jsonContents.sections[i].use_identifier)
                    craftSection.handleUseValueChange(jsonContents.sections[i].use)
                    craftSection.handleAdditionalInfoChange(jsonContents.sections[i].additonal_info)
                    craftSection.handleImageChange(jsonContents.sections[i].image)
                    console.log(craftSection)

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

        // Update the image names in the image sections
        updateNames()
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
                let jsonContents = JSON.parse(event.target.result);
                jsonContents = fixAttachmentsPaths(jsonContents)
                console.log(fixAttachmentsPaths(jsonContents))

                // Check if it is the valid type of JSON
                if (!ValidPlantData(jsonContents)) {

                    setError("The file you uploaded is not a valid plant file")
                    scrollToElement("errorSection")
                    console.log("ERROR NOT RIGHT TYPE")
                    return;
                }

                // Scroll to the top of the page
                scrollToElement("english-name")

                // Load the JSON
                loadJson(jsonContents)

            };

            // Read the file as text
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

        setIsLoading(true);
        setProgressMessage("Uploading plant to database")

        let result;

        // Get the id
        let {id} = router.query;

        // Check if the id is valid
        if(id){

            // If it is an array, get the first element
            if(Array.isArray(id)){
                id = id[0]
            }

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
                setProgressMessage("Removing previous plant data")

                // Remove the plant from the database
                try{

                   // Remove the plant from the database
                    console.log("REMOVING PLANT")
                    result = await axios.get(`/api/plants/remove?id=${idNum}`)
                    console.log(result)

                } catch (err: any) {
                    console.log(err);

                    // Update the error text
                    let errorText = "Unable to remove previous plant data whilst editing"

                    // Check if the error is a 401 error
                    if(err.response && err.response.status === 401){
                        errorText = "You are not authorized to edit plant data"
                    }

                    // Set these changes in the state and scroll to the error div so that the user can see that
                    setError(errorText)
                    scrollToElement("errorSection")
                    setIsLoading(false);
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
            setProgressMessage("Uploading plant data")

            // Upload the data to the database using the upload API by passing each json key as params
            result = await axios.post(`/api/plants/upload`, uploadApiData);

        } catch (err: any) {
            console.log(err);

            // Set the error text
            let errorText = "Unable to upload plant data"

            // Check if the error is a 401 error
            if(err.response && err.response.status === 401){
                errorText = "You are not authorized to upload plant data"
            }

            // Scroll to the section to show the user and update the states
            setError(errorText)
            scrollToElement("errorSection")
            setIsLoading(false);
            return;
        }

        // Get the id of the new plant
        const newId = result.data.id

        // If there is no id, return
        if(newId === undefined){
            return}

        // Loop through each image info and upload the image
        for(let i = 0; i < imageInfoRef.current.length; i++){

            setProgressMessage(`Uploading image ${i + 1} of ${imageInfoRef.current.length}`)
            // If the image url is already set to have a url, skip it
            if(imageInfoRef.current[i].state.image_url.startsWith("http")) {
                continue;
            }

            // Get the file
            const file = imageInfoRef.current[i].state.image_file

            // Check if there is a file
            if(!file){
                continue;
            }

            // Upload the image
            await uploadFile(file, newId)

        }

        // Loop through each file info and upload the file
        for(let i = 0; i < fileInfoRef.current.length; i++){

            setProgressMessage(`Uploading file ${i + 1} of ${fileInfoRef.current.length}`)

            // If the file url is already set to have an url, skip it
            if(fileInfoRef.current[i].state.file_url.startsWith("http")) {
                continue;
            }

            // Get the file
            const file = fileInfoRef.current[i].state.file

            // Check if there is a file
            if(!file){
                continue;
            }

            // Upload the file
            await uploadFile(file, newId)
        }

        // Redirect to the plant page
        const url = "/plants/" + newId
        console.log(url);
        window.location.href = url;

        // Debug the result (this is for if the redirect doesn't work or smth else goes wrong)
        console.log(result);
    }

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    const getEditData = async (idNum: number) => {
        setIsLoading(true);
        setProgressMessage("Fetching plant data to edit")

        // Download the plant data
        const plantOBJ = await fetchPlant(idNum);

        // Check if the plant data is valid
        if(!plantOBJ){
            setError("The plant you are trying to edit is not a valid plant (was unable to fetch it's data from the database)")
            console.log("ERROR WRONG ID")
            scrollToElement("errorSection")
            setIsLoading(false);
            return;
        }

        console.log("Plant OBJ:")
        console.log(plantOBJ)

        // Load the plant data
        loadJson(plantOBJ)

        // Scroll to the top of the page
        scrollToElement("english-name")
        setIsLoading(false);
    }

    useEffect(() => {
        // Get the id
        let {id} = router.query;

        // Check if the id is valid
        if(!id){
            return;
        }

        // If it is an array, get the first element
        if(Array.isArray(id)){
            id = id[0]
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

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        getEditData(idNum).then(() => {console.log("DONE")}).catch((err) => {console.log(err)})


    }, [getEditData, router.query]);

    const scrollToElement = (elementId: string) => {
        // Get the element to scroll to
        const element = document.getElementById(elementId);

        // If it doesn't exist return
        if (!element) {
            return;
        }

        // Get its position on the page
        let dims = element.getBoundingClientRect();

        // Scroll to it, add 150px spacing so that the nav bar has space, ensure that it is smooth and doesn't just jump
        window.scrollTo({ top: dims.top - 150 + window.scrollY, behavior: 'smooth' });

    }

    const uploadFile = async (file: File, id: number) => {

        // Create a new form data object and append the file to it
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', id.toString());

        try {
            // Send the form data to the server
            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData,
            });

            // If the response is ok then get the json data and set the image url
            if (response.ok) {
                console.log('File uploaded successfully.');
            } else {
                const data = await response.json();
                console.log(data);
            }
        } catch (error) {
            console.log('An error occurred.');
        }
    }

    // Images used to select the display image
    const displayImageRef = useRef(["Default"]);

    // When the names are updated re-render the sections that use images
    const updateNames = () => {
        setRenderKeyEdible(prevState => prevState + 1)
        setRenderKeyMedical(prevState => prevState + 1)
        setRenderKeyCraft(prevState => prevState + 1)
        setRenderKeyDisplayImage(prevState => prevState + 1)

        displayImageRef.current = []

        if(imageInfoRef.current.length > 0) {
            displayImageRef.current = imageInfoRef.current.map((value, index) => {
                return value.state.image_name
            });
            displayImageRef.current.unshift("Random")
        }
        displayImageRef.current.unshift("Default")
    }

    useEffect(() => {

        // Register the updateNames names function to the image info object as it doest have a reference to the render keys of the other sections
        for (let i = 0; i < imageInfoRef.current.length; i++) {
            imageInfoRef.current[i].updateNames = updateNames;
        }

    }, [imageInfoRef.current])

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

                {/* If something is set to be loading on the page then show the loading screen */}
                { isLoading ?
                    <div className={styles.loadingContainer}>
                        <Image src={"/media/images/old_loading.gif"} alt={"Loading.."} width={100} height={100}/>
                        <h1>Uploading...</h1>
                        <h2>{progressMessage}...</h2>
                    </div>
                    : null}

                {/* If the user is not signed in then show the sign-in button */}
                { !session ?
                    <>
                        <div className={styles.userDetails}>
                            <p> Please sign in to edit plants  </p>
                            <button onClick={() => signIn()}><FontAwesomeIcon icon={faPerson}/> Sign in</button>
                        </div>
                    </>
                    :
                    <>
                        {/* If the user is signed in then show the user details and sign out button */}
                        <div className={styles.userDetails}>
                            <p> Signed in as <span className={styles.email}> {session.user ? session.user.email : "No Email"} </span> </p>
                            <button onClick={() => signOut()}><FontAwesomeIcon icon={faDoorOpen}/> Sign out</button>
                        </div>

                        <div className={"row"}>

                            {/* If there is an error then show it */}
                            <div id={"errorSection"}>
                                { error === "" ? null : <Error error={error}/>}
                            </div>

                            {/* Divide the page into a left and right column*/}
                            <div className={"column"}>

                                {/* Basic plant information */}
                                <div className={styles.formSection + " " + globalStyles.gridCentre}>

                                    {/* Section title */}
                                    <h1 className={styles.sectionTitle}>Basic Info</h1>

                                    {/* Plant name */}
                                    <div className={styles.formItem} id={"english-name"} >
                                        <SmallInput
                                            placeHolder={"English Name"}
                                            defaultValue={importedJSON.english_name}
                                            required={false}
                                            state={englishNameValidationState[0]}
                                            errorText={englishNameValidationState[1]}
                                            changeEventHandler={handleEnglishNameChange}
                                        />
                                    </div>
                                    <div className={styles.formItem} id={"maori-name"}>
                                        <SmallInput
                                            placeHolder={"Maori Name"}
                                            defaultValue={importedJSON.maori_name}
                                            required={false}
                                            state={maoriNameValidationState[0]}
                                            errorText={maoriNameValidationState[1]}
                                            changeEventHandler={handleMaoriNameChange}
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
                                            options={["English", 'Maori', "Latin"]}
                                            changeEventHandler={handleDropDownChange}
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
                                        <AdvancedTextArea
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
                                            changeEventHandler={handleLocationChange}
                                        />
                                    </div>

                                    {/* Plant Display Image */}
                                    <div className={styles.formItem} id={"display-image"} >
                                        <DropdownInput
                                            key={renderKeyDisplayImage}
                                            placeHolder={"Display Image"}
                                            defaultValue={importedJSON.display_image}
                                            required={true}
                                            state={displayImageValidationState[0]}
                                            errorText={displayImageValidationState[1]}
                                            options={displayImageRef.current}
                                            changeEventHandler={handleDisplayImageChange}
                                        />
                                    </div>

                                    {/* Plant Type */}
                                    <div className={styles.formItem} id={"plant-type"}>
                                        <DropdownInput
                                            placeHolder={"Plant Type"}
                                            defaultValue={importedJSON.plant_type}
                                            required={true}
                                            state={plantTypeValidationState[0]}
                                            errorText={plantTypeValidationState[1]}
                                            options={["Plant", "Mushroom"]}
                                            changeEventHandler={handlePlantTypeChange}
                                        />
                                    </div>

                                </div>

                                {/* Months ready for use */}
                                <div className={styles.formSection + " " + globalStyles.gridCentre}>
                                    <InfoDisplayed
                                        name={"Date"}
                                        infoRef={dateInfoRef}
                                        newInfo={newDateInfo}
                                        key={renderKeyDate}
                                        setRenderKey={setRenderKeyDate}
                                    />
                                </div>

                                {/* Edible use */}
                                <div className={styles.formSection + " " + globalStyles.gridCentre}>
                                    <InfoDisplayed
                                        name={"Edible Use"}
                                        infoRef={edibleInfoRef}
                                        newInfo={newEdibleInfo}
                                        key={renderKeyEdible}
                                        setRenderKey={setRenderKeyEdible}
                                        imageRef={imageInfoRef}
                                    />
                                </div>

                                {/* Medical use */}
                                <div className={styles.formSection + " " + globalStyles.gridCentre}>
                                    <InfoDisplayed
                                        name={"Medical Use"}
                                        infoRef={medicalInfoRef}
                                        newInfo={newMedicalInfo}
                                        key={renderKeyMedical}
                                        setRenderKey={setRenderKeyMedical}
                                        imageRef={imageInfoRef}
                                    />
                                </div>

                                {/* Craft use */}
                                <div className={styles.formSection + " " + globalStyles.gridCentre}>
                                    <InfoDisplayed
                                        name={"Craft Use"}
                                        infoRef={craftInfoRef}
                                        newInfo={newCraftInfo}
                                        key={renderKeyCraft}
                                        setRenderKey={setRenderKeyCraft}
                                        imageRef={imageInfoRef}
                                    />
                                </div>

                                {/* Source */}
                                <div className={styles.formSection + " " + globalStyles.gridCentre}>
                                    <InfoDisplayed
                                        name={"Source"}
                                        infoRef={sourceInfoRef}
                                        newInfo={newSourceInfo}
                                        key={renderKeySource}
                                        setRenderKey={setRenderKeySource}
                                    />
                                </div>

                                {/* Custom Section */}
                                <div className={styles.formSection + " " + globalStyles.gridCentre}>
                                    <InfoDisplayed
                                        name={"Custom Section"}
                                        infoRef={customInfoRef}
                                        newInfo={newCustomInfo}
                                        key={renderKeyCustom}
                                        setRenderKey={setRenderKeyCustom}
                                    />
                                </div>
                            </div>

                            {/* Right Hand Column */}
                            <div className={"column"}>

                                {/* Images */}
                                <div className={styles.formSection + " " + globalStyles.gridCentre}>
                                    <InfoDisplayed
                                        name={"Image"}
                                        infoRef={imageInfoRef}
                                        newInfo={newImage}
                                        key={renderKeyImage}
                                        setRenderKey={setRenderKeyImage}
                                    />
                                </div>

                                {/* File */}
                                <div className={styles.formSection + " " + globalStyles.gridCentre}>
                                    <InfoDisplayed
                                        name={"File"}
                                        infoRef={fileInfoRef}
                                        newInfo={newFileInfo}
                                        key={renderKeyFile}
                                        setRenderKey={setRenderKeyFile}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"row"}>

                            <div className={globalStyles.gridCentre}>

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
                    </>
                }
            </Section>

            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <ScrollToTop/>


        </>
    )

}