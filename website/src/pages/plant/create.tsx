import React, {useEffect, useState} from "react";
import PageHeader from "@/components/page_header";
import styles from "@/styles/create.module.css";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import {AdvandcedTextArea, DateSelector, DropdownInput, SimpleTextArea, SmallInput} from "@/components/input_sections";
import Image from "next/image";


/// _______________ SECTIONS _______________ ///



class EdibleInfo {

    images: ImageInfo[] = [];

    state = {
        partOfPlant: "",
        nutritionalValue: "",
        preparation: "",
        image: "",
    };

    section: JSX.Element = <></>;

    handlePartOfPlantChange = (value) => { this.state.partOfPlant = value};
    handleNutritionalValueChange = (value) => {this.state.nutritionalValue = value};
    handlePreparationChange = (value) => {this.state.preparation = value};
    handleImageChange = (value) => {this.state.image = value};


    setSection = (section) => {this.section = section};

    constructor(images: ImageInfo[]) {
        this.images = images;

        this.setSection(
            <EdibleUseSection
                partOfPlantHandler={this.handlePartOfPlantChange}
                nutritionalValueHandler={this.handleNutritionalValueChange}
                preparationHandler={this.handlePreparationChange}
                imageHandler={this.handleImageChange}
                images={ this.images.map((value, index) => {
                    let imageNames = value.state.image_name

                    if(imageNames === ""){
                        imageNames = "Loading..."
                    }

                    return imageNames
                })}
            />
        )
    }

}


type EdibleUseSectionProps = {
   partOfPlantHandler: (value: string) => void;
   nutritionalValueHandler: (value: string) => void;
   preparationHandler: (value: string) => void;
   imageHandler: (value: string) => void;
   images: string[];
}
export function EdibleUseSection({partOfPlantHandler, nutritionalValueHandler, preparationHandler, imageHandler, images}: EdibleUseSectionProps){

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

            {/* Preparation */}
            <div className={styles.formItem}>
                <AdvandcedTextArea
                    placeHolder={"Preparation"}
                    required={true}
                    state={"normal"}
                    changeEventHandler={preparationHandler}
                />
            </div>

            {/* Image Selector */}
            <div className={styles.formItem}>
                <DropdownInput
                    placeHolder={"Image Showing Plant Part"}
                    required={true}
                    state={"normal"}
                    options={images}
                    changeEventHandler={imageHandler}
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

    handleImageUrlChange = (value) => {this.state.image_url = value};
    handleNameChange = (value) => {this.state.image_name = value};

    constructor() {

        let continueLoop = true;

        // Validate the image url
        while (continueLoop){

            this.handleImageUrlChange(prompt("Enter Image URL: "))
            continueLoop = false;


            // Check if there is an image url
            if (this.state.image_url === null || this.state.image_url === undefined || this.state.image_url === "") {
                continueLoop = true;
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


        this.setSection(
                <ImageSection
                    imageUrl = {this.state.image_url}
                    name = {this.state.image_name}
                    descriptionHandler={this.handleNameChange}
                />
            )

    }

}


type ImageSectionProps = {
    imageUrl: string;
    name: string;
    descriptionHandler: (value: string) => void;
}
export function ImageSection({imageUrl, name, descriptionHandler}: ImageSectionProps){

    const [imageName, setImageName] = useState(name)

    function imageNameHandler(value){
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
        startDate: undefined,
        endDate: undefined
    };

    section: JSX.Element = <></>;

    handleUseChange = (value) => { this.state.use = value};

    handleStartDateChange = (value) => {this.state.startDate = value};

    handleEndDateChange = (value) => {this.state.endDate = value};

    setSection = (section) => {this.section = section};

    constructor() {
        this.setSection(
            <TimeInfoSection
                useHandler={this.handleUseChange}
                startDateHandler={this.handleStartDateChange}
                endDateHandler={this.handleEndDateChange}
            />
        )
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

    // Value Handlers
    const handleEnglishNameChange = (value) => { setEnglishName(value); };
    const handleMoariNameChange = (value) => { setMoariName(value); };
    const handleLatinNameChange = (value) => { setLatinName(value); };
    const handleDropDownChange = (value) => { setPreferredName(value) };
    const handleSmallDescriptionChange = (value) => { setSmallDescription(value) };
    const handleLargeDescriptionChange = (value) => { setLargeDescription(value) };
    const handleLocationChange = (value) => { setLocation(value) };

    const newTimeInfo = () => {
        setTimeInfo([...timeInfo, new TimeInfo()])
    }

    const newImage = () => {
        setImageInfo([...imageInfo, new ImageInfo()])
        console.log(imageInfo)
    }

    const newEdibleInfo = () => {
        setEdibleInfo([...edibleInfo, new EdibleInfo(imageInfo)])
        console.log(edibleInfo)
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


    return (
        <>
            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Set up the page header */}
            <PageHeader size={"medium"}>
                <h1 className={styles.title}>Creating plant: {plantName}</h1>
            </PageHeader>

            {/* Divide the page into a left and right collum*/}
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

                    {edibleInfo.map((value, index) => {
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


                    {/* Add Edible info */}
                    <div className={styles.formItem}>
                        <div className={styles.formContainer}>
                            <button onClick={newEdibleInfo} className={styles.addSectionButton}> + </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className={styles.column}>
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
        </>
    )


}


//TODO: Submit button, upload images, fix image selection.