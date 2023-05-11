import React, {useEffect, useState} from "react";
import PageHeader from "@/components/page_header";
import styles from "@/styles/create.module.css";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import {AdvandcedTextArea, DateSelector, DropdownInput, SimpleTextArea, SmallInput} from "@/components/input_sections";
import Image from "next/image";


/// _______________ SECTIONS _______________ ///


class CustomInfo {

    state = {
        title: "",
        text: "",
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
            />
        );
    }

    constructor() {
        this.updateSection();
    }

}

type CustomSectionProps = {
    titleHandler: (value: string) => void;
    textHandler: (value: string) => void;
}
export function CustomSection({titleHandler, textHandler}: CustomSectionProps){

    return(
        <>
            {/* Part of Plant */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Custom Section Title"}
                    required={true}
                    state={"normal"}
                    changeEventHandler={titleHandler}
                />
            </div>


            {/* Custom Text */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Custom Section Text"}
                    required={true}
                    state={"normal"}
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
            />
        );
    }

    constructor() {
        this.updateSection();
    }

}

type CraftSectionProps = {
    useValueHandler: (value: string) => void;
    additionalInfoHandler: (value: string) => void;
    partOfPlantHandler: (value: string) => void;
}
export function CraftSection({useValueHandler, additionalInfoHandler, partOfPlantHandler}: CraftSectionProps){

    return(
        <>

            {/* Part of Plant */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Part of Plant"}
                    required={true}
                    state={"normal"}
                    changeEventHandler={partOfPlantHandler}
                />
            </div>


            {/* Use */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Use"}
                    required={true}
                    state={"normal"}
                    changeEventHandler={useValueHandler}
                />
            </div>

            {/* Additional Info */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Additional Info"}
                    required={false}
                    state={"normal"}
                    changeEventHandler={additionalInfoHandler}
                />
            </div>

        </>
    )
}

class MedicalInfo {


    state = {
        partOfPlant: "",
        use: "",
        preparation: "",
        image: "",
    };

    section: JSX.Element = <></>;

    handlePartOfPlantChange = (value : string) => { this.state.partOfPlant = value};
    handeUseValueChange = (value : string) => {this.state.use = value};
    handlePreparationChange = (value : string) => {this.state.preparation = value};
    handleImageChange = (value : string) => {this.state.image = value};


    setSection = (section: JSX.Element) => {this.section = section};

    updateSection = () => {
        this.setSection(
            <MedicalUseSection
                medicalTypeHandler={this.handlePartOfPlantChange}
                useValueHandler={this.handeUseValueChange}
                preparationHandler={this.handlePreparationChange}
            />
        );
    }

    constructor() {
       this.updateSection();
    }

}


type MedicalUseSectionProps = {
    medicalTypeHandler: (value: string) => void;
    useValueHandler: (value: string) => void;
    preparationHandler: (value: string) => void;
}
export function MedicalUseSection({medicalTypeHandler, useValueHandler, preparationHandler}: MedicalUseSectionProps){

    return(
        <>
            {/* Internal Or External*/}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Internal/External"}
                    required={true}
                    state={"normal"}
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
                    state={"normal"}
                    changeEventHandler={useValueHandler}
                />
            </div>

            {/* Preparation */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Preparation"}
                    required={true}
                    state={"normal"}
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

    section: JSX.Element = <></>;

    handlePartOfPlantChange = (value : string) => { this.state.partOfPlant = value};
    handleNutritionalValueChange = (value : string) => {this.state.nutritionalValue = value};
    handlePreparationChange = (value : string) => {this.state.preparation = value};
    handlePreparationTypeChange = (value : string) => {this.state.preparationType = value};
    handleImageChange = (value : string) => {this.state.edibleImage = value};
    setSection = (section) => {this.section = section};

    constructor() {
        this.updateSection();
    }

    updateSection = () => {
        this.setSection(
            <EdibleUseSection
                partOfPlantHandler={this.handlePartOfPlantChange}
                nutritionalValueHandler={this.handleNutritionalValueChange}
                preparationHandler={this.handlePreparationChange}
                preparationTypeHandler={this.handlePreparationTypeChange}
            />
        );
    };
}


type EdibleUseSectionProps = {
   partOfPlantHandler: (value: string) => void;
   nutritionalValueHandler: (value: string) => void;
   preparationTypeHandler: (value: string) => void;
   preparationHandler: (value: string) => void;
}
export function EdibleUseSection({partOfPlantHandler, nutritionalValueHandler, preparationTypeHandler, preparationHandler}: EdibleUseSectionProps){

    return(
        <>
            {/* Part of Plant */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Part of Plant"}
                    required={true}
                    state={"normal"}
                    changeEventHandler={partOfPlantHandler}
                />
            </div>

            {/* Nutritional Value */}
            <div className={styles.formItem}>
                <SimpleTextArea
                    placeHolder={"Nutritional Value"}
                    required={false}
                    state={"normal"}
                    changeEventHandler={nutritionalValueHandler}
                />
            </div>


            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Preparation Type"}
                    required={true}
                    state={"normal"}
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
                    state={"normal"}
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

    section: JSX.Element = <></>;

    setSection = (section) => {this.section = section};

    handleImageUrlChange = (value : string) => {this.state.image_url = value};
    handleNameChange = (value : string) => {this.state.image_name = value};

    updateSection = () => {
        this.setSection(
            <ImageSection
                imageUrl = {this.state.image_url}
                name = {this.state.image_name}
                descriptionHandler={this.handleNameChange}
            />
        )
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
}
export function ImageSection({imageUrl, name, descriptionHandler}: ImageSectionProps){

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
                <SmallInput placeHolder={"Image Name"} required={true} state={"normal"} changeEventHandler={imageNameHandler}/>

        </>
    )
}

class TimeInfo {
    state = {
        use: "",
        startDate: "",
        endDate: ""
    };

    section: JSX.Element = <></>;

    handleUseChange = (value : string) => { this.state.use = value};

    handleStartDateChange = (value : string) => {this.state.startDate = value};

    handleEndDateChange = (value : string) => {this.state.endDate = value};

    setSection = (section: JSX.Element) => {this.section = section};

    updateSection = () => {
        this.setSection(
            <TimeInfoSection
                useHandler={this.handleUseChange}
                startDateHandler={this.handleStartDateChange}
                endDateHandler={this.handleEndDateChange}
            />
        )
    }
    
    constructor() {
        this.updateSection();
    }

}


type TimeInfoSectionProps = {
    useHandler: (value: string) => void;
    startDateHandler: (value: string) => void;
    endDateHandler: (value: string) => void;
}
export function TimeInfoSection({useHandler, startDateHandler, endDateHandler}: TimeInfoSectionProps){

    return(
        <>
            {/* Use */}
            <div className={styles.formItem}>
                <SmallInput
                    placeHolder={"Use"}
                    required={true}
                    state={"normal"}
                    changeEventHandler={useHandler}
                />
            </div>

            {/* Start Date */}
            <div className={styles.formItem}>
                <DateSelector
                    placeHolder={"Start Date"}
                    required={true}
                    state={"normal"}
                    changeEventHandler={startDateHandler}
                />
            </div>

            {/* End Date */}
            <div className={styles.formItem}>
                <DateSelector
                    placeHolder={"End Date"}
                    required={true}
                    state={"normal"}
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


    // Value Setters
    const [imageInfo, setImageInfo] = useState([]);
    const [englishName, setEnglishName] = useState("")
    const [moariName, setMoariName] = useState("")
    const [latinName, setLatinName] = useState("")
    const [preferredName, setPreferredName] = useState("")
    const [smallDescription, setSmallDescription] = useState("")
    const [largeDescription, setLargeDescription] = useState("")
    const [location, setLocation] = useState("")
    const [timeInfo, setTimeInfo] = useState([]);
    const [edibleInfo, setEdibleInfo] = useState([]);
    const [medicalInfo, setMedicalInfo] = useState([]);
    const [craftInfo, setCraftInfo] = useState([]);
    const [customInfo, setCustomInfo] = useState([]);

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
    const newTimeInfo = () => {
        setTimeInfo([...timeInfo, new TimeInfo()])
    }

    const newImage = () => {
        setImageInfo([...imageInfo, new ImageInfo()])
        console.log(imageInfo)
    }

    const newEdibleInfo = () => {
        setEdibleInfo([...edibleInfo, new EdibleInfo()])
        console.log(edibleInfo)
    }

    const newMedicinalInfo = () => {
        setMedicalInfo([...medicalInfo, new MedicalInfo()])
        console.log(medicalInfo)
    }

    const newCraftInfo = () => {
        setCraftInfo([...craftInfo, new CraftInfo()])
        console.log(craftInfo)
    }

    const newCustomInfo = () => {
        setCustomInfo([...customInfo, new CustomInfo()])
        console.log(customInfo)
    }

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

    const generateJSON = () => {
        let plantOBJ = {
            id: "1",
            preferred_name: "eng/maori/latin",
        };
        let plantJSON : JSON = {


            english_name: "*",
            moari_name: "*",
            latin_name: "*",
            use: ["food", "medical_internal", "medical_external", "craft"],
            months_ready_for_use: [*],
            location: "coastal/inland/forest/ground/canopy"
            small_description: "*",
            long_description: "*",
            attachments: **See Attachments**,
            sections: **See Sections**,
            tags: []
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
                                state={"normal"}
                                changeEventHandler={handleEnglishNameChange}
                            />
                        </div>
                        <div className={styles.formItem}>
                            <SmallInput
                                placeHolder={"Moari Name"}
                                required={false}
                                state={"normal"}
                                changeEventHandler={handleMoariNameChange}
                            />
                        </div>
                        <div className={styles.formItem}>
                            <SmallInput
                                placeHolder={"Latin Name"}
                                required={false}
                                state={"normal"}
                                changeEventHandler={handleLatinNameChange}
                            />
                        </div>

                        {/* Preferred plant name */}
                        <div className={styles.formItem}>
                            <DropdownInput
                                placeHolder={"Preferred Name"}
                                required={true}
                                state={"normal"}
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
                                state={"normal"}
                                changeEventHandler={handleSmallDescriptionChange}
                            />
                        </div>

                        {/* Plant Large Description */}
                        <div className={styles.formItem}>
                            <AdvandcedTextArea
                                placeHolder={"Long Description"}
                                required={true}
                                state={"normal"}
                                changeEventHandler={handleLargeDescriptionChange}
                            />
                        </div>

                        {/* Plant Location */}
                        <div className={styles.formItem}>
                            <SmallInput
                                placeHolder={"Location"}
                                required={true}
                                state={"normal"}
                                changeEventHandler={handleLocationChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        {/* Section title */}
                        <h1 className={styles.sectionTitle}> Time Info</h1>

                        {/* Time Infos} */}
                        {timeInfo.map((value, index) => {
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
                        {/* Add time info */}
                        <div className={styles.formItem}>
                            <div className={styles.formContainer}>
                                <button onClick={newTimeInfo} className={styles.addSectionButton}> + </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        {/* Section title */}
                        <h1 className={styles.sectionTitle}> Edible Uses</h1>

                        {/* Uses} */}

                        {edibleInfo.map((value : EdibleInfo, index) => {
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
                                                placeHolder={"Image for Edible"}
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

                        {/* Add Craft info */}
                        <div className={styles.formItem}>
                            <div className={styles.formContainer}>
                                <button onClick={newCraftInfo} className={styles.addSectionButton}> + </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        {/* Section title */}
                        <h1 className={styles.sectionTitle}> Custom Information</h1>

                        {/* Time Infos} */}
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

                        {/* Add time info */}
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