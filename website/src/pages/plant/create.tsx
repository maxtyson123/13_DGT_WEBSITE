import React, {useEffect, useState} from "react";
import PageHeader from "@/components/page_header";
import styles from "@/styles/create.module.css";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import {AdvandcedTextArea, DateSelector, DropdownInput, SimpleTextArea, SmallInput} from "@/components/input_sections";
import Image from "next/image";

// Constants
const PLANT_PARTS = ["Stem", "Leaf", "Root", "Heart", "Flower", "Petals", "Fruit", "Bark", "Inner Bark", "Seeds", "Shoot", "Pollen", "Whole Plant"];


/// _______________ SECTIONS _______________ ///
class SourceInfo {

    state = {
        type: "",
        data: "",
    };

    valid = {
        type: ["normal", "No Error"],
        data: ["normal", "No Error"]
    }

    section: JSX.Element = <></>;

    handleTypeChange = (value : string) => {this.state.type = value};
    handleDataChange = (value : string) => {this.state.data = value};

    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <SourceSection
                typeHandler={this.handleTypeChange}
                dataHandler={this.handleDataChange}
                valid={this.valid}
                key={Math.random()}
            />
        );
    }

    validate = () => {
        let isValid = true;

        if(this.state.type === ""){
            this.valid.type = ["error", "Please select a source type"];
            isValid = false;
        } else { this.valid.type = ["success", "No Error"] }

        if(this.state.data === ""){
            this.valid.data = ["error", "Please enter data for the source"];
            isValid = false;
        } else { this.valid.data = ["success", "No Error"] }

        // Update section to show errors
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

        return isValid
    }

    constructor() {
        this.updateSection();
    }

}

type SourceSectionProps = {
    typeHandler: (value: string) => void;
    dataHandler: (value: string) => void;
    valid: {
        type: string[];
        data: string[];
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

    state = {
        title: "",
        text: "",
    };

    valid = {
        title: ["normal", "No Error"],
        text: ["normal", "No Error"]
    };

    section: JSX.Element = <></>;

    handleTitleChange = (value : string) => {this.state.title = value};
    handleTextChange = (value : string) => {this.state.text = value};

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

    validate = () => {
        let isValid = true;

        if(this.state.title === ""){
            this.valid.title = ["error", "Please enter a title for the section"];
            isValid = false;
        } else { this.valid.title = ["success", "No Error"] }

        if(this.state.text === ""){
            this.valid.text = ["error", "Please enter some text for the section"];
            isValid = false;
        } else { this.valid.text = ["success", "No Error"] }

        // Update section to show errors
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

        return isValid
    }

    constructor() {
        this.updateSection();
    }

}

type CustomSectionProps = {
    titleHandler: (value: string) => void;
    textHandler: (value: string) => void;
    valid: {
        title: string[];
        text: string[];
    }
}
export function CustomSection({titleHandler, textHandler, valid}: CustomSectionProps){

    return(
        <>
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

    state = {
        partOfPlant: "",
        use: "",
        additionalInfo: "",
        image: "",
    };

    valid = {
        partOfPlant: ["normal", "No Error"],
        use: ["normal", "No Error"],
        additionalInfo: ["normal", "No Error"],
        image: ["normal", "No Error"],
    };

    section: JSX.Element = <></>;

    handleUseValueChange = (value : string) => {this.state.use = value};
    handleAdditionalInfoChange = (value : string) => {this.state.additionalInfo = value};
    handlePartOfPlantChange = (value : string) => { this.state.partOfPlant = value};
    handleImageChange = (value : string) => {this.state.image = value};

    setSection = (section: JSX.Element) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <CraftSection
                useValueHandler={this.handleUseValueChange}
                additionalInfoHandler={this.handleAdditionalInfoChange}
                partOfPlantHandler={this.handlePartOfPlantChange}
                valid={this.valid}
            />
        );
    }

    validate = () => {
        let isValid = true;

        if(this.state.partOfPlant === "") {
            this.valid.partOfPlant = ["error", "Please select a part of the plant"];
            isValid = false;
        }else{ this.valid.partOfPlant = ["success", "No Error"]; }

        if(this.state.use === "") {
            this.valid.use = ["error", "Please enter how this plant is used"];
            isValid = false;
        }else{ this.valid.use = ["success", "No Error"]; }

        if(this.state.additionalInfo !== "") {
            this.valid.additionalInfo = ["success", "No Error"];
            isValid = false;
        }

        if(this.state.image === "") {
            this.valid.image = ["error", "Please select what image is related to the use of this plant"];
            isValid = false;
        }else{ this.valid.image = ["success", "No Error"]; }

        // Update section to show validation
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

        return isValid
    }

    constructor() {
        this.updateSection();
    }

}

type CraftSectionProps = {
    useValueHandler: (value: string) => void;
    additionalInfoHandler: (value: string) => void;
    partOfPlantHandler: (value: string) => void;
    valid: {
        partOfPlant: string[];
        use: string[];
        additionalInfo: string[];
        image: string[];
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
    state = {
        type: "",
        use: "",
        preparation: "",
        image: "",
    };

    valid = {
        type: ["normal", "No Error"],
        use: ["normal", "No Error"],
        preparation: ["normal", "No Error"],
        image: ["normal", "No Error"],
    }

    section: JSX.Element = <></>;

    handleTypeChange = (value : string) => { this.state.type = value};
    handeUseValueChange = (value : string) => {this.state.use = value};
    handlePreparationChange = (value : string) => {this.state.preparation = value};
    handleImageChange = (value : string) => {this.state.image = value};


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

    validate = () => {
        let isValid = true;

        if(this.state.type === "") {
            this.valid.type = ["error", "Please select if the plant is used internally or externally"];
            isValid = false;
        }else { this.valid.type = ["success", "No Error"]; }

        if(this.state.use === "") {
            this.valid.use = ["error", "Please enter how this plant is used in a medical context"];
            isValid = false;
        }else { this.valid.use = ["success", "No Error"]; }

        if(this.state.preparation === "") {
            this.valid.preparation = ["error", "Please give instructions on how this plant is prepared for medical use"];
            isValid = false;
        }else { this.valid.preparation = ["success", "No Error"]; }

        if(this.state.image === "") {
            this.valid.image = ["error", "Please select what image is related to the medical use of this plant"];
            isValid = false;
        }else { this.valid.image = ["success", "No Error"]; }

        // Update section to show validation
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

        return isValid;
    }

    constructor() {
       this.updateSection();
    }

}


type MedicalUseSectionProps = {
    medicalTypeHandler: (value: string) => void;
    useValueHandler: (value: string) => void;
    preparationHandler: (value: string) => void;
    valid: {
        type: string[];
        use: string[];
        preparation: string[];
        image: string[];
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

    state = {
        partOfPlant: "",
        nutritionalValue: "",
        preparation: "",
        preparationType: "",
        edibleImage: "",
    };

    valid = {
        partOfPlant: ["normal", "No Error"],
        nutritionalValue: ["normal", "No Error"],
        preparation: ["normal", "No Error"],
        preparationType: ["normal", "No Error"],
        image: ["normal", "No Error"],
    }

    section: JSX.Element = <></>;

    handlePartOfPlantChange = (value : string) => { this.state.partOfPlant = value};
    handleNutritionalValueChange = (value : string) => {this.state.nutritionalValue = value};
    handlePreparationChange = (value : string) => {this.state.preparation = value};
    handlePreparationTypeChange = (value : string) => {this.state.preparationType = value};
    handleImageChange = (value : string) => {this.state.edibleImage = value};

    setSection = (section) => {this.section = section};

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

    validate = () => {
        let isValid = true;

        if(this.state.partOfPlant === "") {
            this.valid.partOfPlant = ["error", "Please select what part of the plant is edible"];
            isValid = false;
        }else { this.valid.partOfPlant = ["success", "No Error"]; }

        if (this.state.nutritionalValue !== "") {
            this.valid.nutritionalValue = ["success", "No Error"];
        }

        if(this.state.preparationType === "") {
            this.valid.preparationType = ["error", "Please select how this plant is prepared for consumption"];
            isValid = false;
        } else { this.valid.preparationType = ["success", "No Error"]; }

        if(this.state.preparation === "") {
            this.valid.preparation = ["error", "Please give instructions on how this plant is prepared for consumption"];
            isValid = false;
        } else { this.valid.preparation = ["success", "No Error"]; }

        if(this.state.edibleImage === "") {
            this.valid.image = ["error", "Please select what image is related to the edible use of this plant"];
            isValid = false;
        } else { this.valid.image = ["success", "No Error"]; }

        // Update section to show validation
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

        return isValid;
    }

    constructor() {
        this.updateSection();
    }
}


type EdibleUseSectionProps = {
   partOfPlantHandler: (value: string) => void;
   nutritionalValueHandler: (value: string) => void;
   preparationTypeHandler: (value: string) => void;
   preparationHandler: (value: string) => void;
   valid: {
        partOfPlant: string[];
        nutritionalValue: string[];
        preparation: string[];
        preparationType: string[];
        image: string[];

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
    state = {
        image_url: "",
        image_name: "",
    }

    valid = {
        image_url: ["normal", "No Error"],
        image_name: ["normal", "No Error"],
    }

    section: JSX.Element = <></>;

    handleImageUrlChange = (value : string) => {this.state.image_url = value};
    handleNameChange = (value : string) => {this.state.image_name = value};

    setSection = (section) => {this.section = section};
    updateSection = () => {
        this.setSection(
            <ImageSection
                imageUrl = {this.state.image_url}
                name = {this.state.image_name}
                descriptionHandler={this.handleNameChange}
                valid={this.valid}
            />
        )
    }

    validate = () => {
        let isValid = true;

        if(this.state.image_name === "") {
            this.valid.image_name = ["error", "Please enter a name for the image"];
            isValid = false;
        }else if(this.state.image_name.length > 50) {
            this.valid.image_name = ["error", "Image name must be less than 50 characters"];
            isValid = false;
        }else { this.valid.image_name = ["success", "No Error"]; }

        // Update section to show validation
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

        return isValid;
    }

    constructor() {

        let continueLoop = true;

        // Validate the image url
        while (continueLoop){

            this.handleImageUrlChange(prompt("Enter Image URL: "))
            continueLoop = false;

            // Check if there is an image url
            if (this.state.image_url === null || this.state.image_url === undefined || this.state.image_url === "") {
                continueLoop = true;
                this.state.image_url = ""   // Make sure null/undefined doest cause any errors
                alert("Please enter an image url")
            }

            // Check if the image url is a valid url
            if (this.state.image_url.match(/\.(jpeg|jpg|gif|png)$/) === null) {
                continueLoop = true;
                alert("Please enter a valid image type (jpeg, jpg, gif, png)")
            }

            // Check if the image url starts with / or http or https
            if (this.state.image_url.startsWith("/") || this.state.image_url.startsWith("http") || this.state.image_url.startsWith("https")) {

            }else{
                continueLoop = true;
                alert("URL must start with / or http or https")
            }
        }

        this.updateSection();
    }

}


type ImageSectionProps = {
    imageUrl: string;
    name: string;
    descriptionHandler: (value: string) => void;
    valid: {
        image_url: string[];
        image_name: string[];
    }
}
export function ImageSection({imageUrl, name, descriptionHandler, valid}: ImageSectionProps){

    const [imageName, setImageName] = useState(name)

    function imageNameHandler(value : string){
        descriptionHandler(value)
        setImageName(value)
    }

    return(
        <>
            <div className={styles.formContainer}>
                <Image style={{borderRadius: 8}} src={imageUrl} alt={imageName} width={600} height={600} objectFit={"contain"}/>
            </div>
            <br/>
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
    state = {
        event: "",
        startDate: "",
        endDate: ""
    };

    valid = {
        event: ["normal", "No Error"],
        startDate: ["normal", "No Error"],
        endDate: ["normal", "No Error"]
    }

    section: JSX.Element = <></>;

    handleEventChange = (value : string) => { this.state.event = value};
    handleStartDateChange = (value : string) => {this.state.startDate = value};
    handleEndDateChange = (value : string) => {this.state.endDate = value};

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

    validate = () => {
        let isValid = true;

        if(this.state.event === ""){
            this.valid.event = ["error", "Please enter what is happening during this period"];
            isValid = false;
        }else { this.valid.event = ["success", "No Error"] }

        if(this.state.startDate === ""){
            this.valid.startDate = ["error", "Please enter a start date"];
            isValid = false;
        }else if (this.state.startDate > this.state.endDate) {
            this.valid.startDate = ["error", "Start date must be before end date"];
            isValid = false;
        }else { this.valid.startDate = ["success", "No Error"] }

        if(this.state.endDate === ""){
            this.valid.endDate = ["error", "Please enter an end date"];
            isValid = false;
        }else if (this.state.startDate > this.state.endDate) {
            this.valid.endDate = ["error", "End date must be after start date"];
            isValid = false;
        }else { this.valid.endDate = ["success", "No Error"] }

        // Update section to show validation
        const updatedSection = React.cloneElement(
            this.section,
            { valid: this.valid }
        );
        this.setSection(updatedSection);

        return isValid;
    }

    constructor() {
        this.updateSection();
    }

}


type DateInfoSectionProps = {
    eventHandler: (value: string) => void;
    startDateHandler: (value: string) => void;
    endDateHandler: (value: string) => void;
    valid: {
        event: [string, string];
        startDate: [string, string];
        endDate: [string, string];
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
                <DateSelector
                    placeHolder={"Start Date"}
                    required={true}
                    state={valid.startDate[0]}
                    errorText={valid.startDate[1]}
                    changeEventHandler={startDateHandler}
                />
            </div>

            {/* End Date */}
            <div className={styles.formItem}>
                <DateSelector
                    placeHolder={"End Date"}
                    required={true}
                    state={valid.endDate[0]}
                    errorText={valid.endDate[1]}
                    changeEventHandler={endDateHandler}
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
    const [imageInfo, setImageInfo] = useState([]);
    const [englishName, setEnglishName] = useState("")
    const [moariName, setMoariName] = useState("")
    const [latinName, setLatinName] = useState("")
    const [preferredName, setPreferredName] = useState("")
    const [smallDescription, setSmallDescription] = useState("")
    const [largeDescription, setLargeDescription] = useState("")
    const [location, setLocation] = useState("")
    const [dateInfo, setDateInfo] = useState([]);
    const [edibleInfo, setEdibleInfo] = useState([]);
    const [medicalInfo, setMedicalInfo] = useState([]);
    const [craftInfo, setCraftInfo] = useState([]);
    const [customInfo, setCustomInfo] = useState([]);
    const [sourceInfo, setSourceInfo] = useState([]);

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
    const [englishNameValidationState, setEnglishNameValidationState] = useState(["normal", "No Error"])
    const [moariNameValidationState, setMoariNameValidationState] = useState(["normal", "No Error"])
    const [latinNameValidationState, setLatinNameValidationState] = useState(["normal", "No Error"])
    const [preferredNameValidationState, setPreferredNameValidationState] = useState(["normal", "No Error"])
    const [smallDescriptionValidationState, setSmallDescriptionValidationState] = useState(["normal", "No Error"])
    const [largeDescriptionValidationState, setLargeDescriptionValidationState] = useState(["normal", "No Error"])
    const [locationValidationState, setLocationValidationState] = useState(["normal", "No Error"])


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



    useEffect(() => {
       console.log("Image Info: ", imageInfo)
    }, [imageInfo]);

    useEffect(() => {
        console.log("Edible Info: ", edibleInfo)
    }, [edibleInfo]);

    const validateInput = () => {

        //Allow for multiple invalid inputs
        let isValid = true;

        // English Name
        if(englishName === ""){
            if(preferredName === "English"){
                setEnglishNameValidationState(["error", "Required if preferred name is English"])
                isValid = false;
            }
        } else { setEnglishNameValidationState(["success", "No Error"]) }

        // Moari Name
        if(moariName === ""){
            if(preferredName === "Moari"){
                setMoariNameValidationState(["error", "Required if preferred name is Moari"])
                isValid = false;
            }
        }else { setMoariNameValidationState(["success", "No Error"]) }

        // Latin Name
        if(latinName === ""){
            if(preferredName === "Latin"){
                setLatinNameValidationState(["error", "Required if preferred name is Latin"])
                isValid = false;
            }
        } else { setLatinNameValidationState(["success", "No Error"]) }

        // Preferred Name
        if(preferredName === ""){
            setPreferredNameValidationState(["error", "Please select a preferred name"])
            isValid = false;
        } else { setPreferredNameValidationState(["success", "No Error"]) }

        // Small Description
        if(smallDescription === ""){
            setSmallDescriptionValidationState(["error", "Please enter a small description"])
            isValid = false;
        } else if(smallDescription.length > 100){
            setSmallDescriptionValidationState(["error", "Small description must be less than 100 characters"])
        } else { setSmallDescriptionValidationState(["success", "No Error"]) }

        // Large Description
        if(largeDescription === ""){
            setLargeDescriptionValidationState(["error", "Please enter a large description"])
            isValid = false;
        } else { setLargeDescriptionValidationState(["success", "No Error"]) }

        // Location
        if(location === ""){
            setLocationValidationState(["error", "Please enter a location"])
            isValid = false;
        } else { setLocationValidationState(["success", "No Error"]) }

        // Validate the image info
        for (let i = 0; i < imageInfo.length; i++) {
            isValid = imageInfo[i].validate()
        }

        // Validate the date info
        for (let i = 0; i < dateInfo.length; i++) {
            isValid = dateInfo[i].validate()
        }

        // Validate the edible info
        for (let i = 0; i < edibleInfo.length; i++) {
            isValid = edibleInfo[i].validate()
        }

        // Validate the medicinal info
        for (let i = 0; i < medicalInfo.length; i++) {
            isValid = medicalInfo[i].validate()
        }

        // Validate the craft info
        for (let i = 0; i < craftInfo.length; i++) {
            isValid = craftInfo[i].validate()
        }

        // Validate the source info
        for (let i = 0; i < sourceInfo.length; i++) {
            isValid = sourceInfo[i].validate()
        }

        // Validate the custom info
        for (let i = 0; i < customInfo.length; i++) {
            isValid = customInfo[i].validate()
        }


        return isValid;
    }

    const generateJSON = () => {

        if(!validateInput()){
            // Scroll the page to the top
            window.scrollTo(0, 0);
            return
        }

        let plantOBJ = {
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

            <div className={styles.row}>

                {/* Divide the page into a left and right column*/}
                <div className={styles.column}>

                    {/* Basic plant information */}
                    <div className={styles.formSection}>

                        {/* Section title */}
                        <h1 className={styles.sectionTitle}> Basic Info</h1>

                        {/* Plant name */}
                        <div className={styles.formItem}>
                            <SmallInput
                                placeHolder={"English Name"}
                                required={false}
                                state={englishNameValidationState[0]}
                                errorText={englishNameValidationState[1]}
                                changeEventHandler={handleEnglishNameChange}
                            />
                        </div>
                        <div className={styles.formItem}>
                            <SmallInput
                                placeHolder={"Moari Name"}
                                required={false}
                                state={moariNameValidationState[0]}
                                errorText={moariNameValidationState[1]}
                                changeEventHandler={handleMoariNameChange}
                            />
                        </div>
                        <div className={styles.formItem}>
                            <SmallInput
                                placeHolder={"Latin Name"}
                                required={false}
                                state={latinNameValidationState[0]}
                                errorText={latinNameValidationState[1]}
                                changeEventHandler={handleLatinNameChange}
                            />
                        </div>

                        {/* Preferred plant name */}
                        <div className={styles.formItem}>
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
                        <div className={styles.formItem}>
                            <SimpleTextArea
                                placeHolder={"Small Description"}
                                required={true}
                                state={smallDescriptionValidationState[0]}
                                errorText={smallDescriptionValidationState[1]}
                                changeEventHandler={handleSmallDescriptionChange}
                            />
                        </div>

                        {/* Plant Large Description */}
                        <div className={styles.formItem}>
                            <AdvandcedTextArea
                                placeHolder={"Long Description"}
                                required={true}
                                state={largeDescriptionValidationState[0]}
                                errorText={largeDescriptionValidationState[1]}
                                changeEventHandler={handleLargeDescriptionChange}
                            />
                        </div>

                        {/* Plant Location */}
                        <div className={styles.formItem}>
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
                                <div key={index} className={styles.formItem}>
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
                                <div key={index + renderKey} className={styles.formItem}>
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
                                <div key={index} className={styles.formItem}>
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
                                <div key={index} className={styles.formItem}>
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
                                <div key={index} className={styles.formItem}>
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
                                <div key={index} className={styles.formItem}>
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
                                <div key={index} className={styles.formItem}>
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

        </>
    )

}



//TODO: Submit button, upload images