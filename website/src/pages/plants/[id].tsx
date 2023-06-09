import React, {useEffect, useRef} from "react";
import {useRouter} from 'next/router'
import Section from "@/components/section";
import Footer from "@/components/footer";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import PageHeader from "@/components/page_header";
import ScrollToTop from "@/components/scroll_to_top";
import {fetchPlant, getNamesInPreference, ImageMetaData, PlantData} from "@/lib/plant_data";
import styles from "@/styles/id.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {convertUseTag} from "@/components/plant_card";
import Image from "next/image";
import {AttachmentSection, AutoSection, SourceSection} from "@/components/plant_sections";
import {Error} from "@/components/error";

export default function PlantPage() {

    // Store the plant data
    const [plantData, setPlantData] = React.useState<PlantData | null>(null)
    const [plantNames, setPlantNames] = React.useState(["Loading...", "Loading...", "Loading..."])

    // States for the images
    const [currentImage, setCurrentImage] = React.useState(0)
    const [mainImage, setMainImage] = React.useState("/media/images/loading.gif")

    // Error state
    const [error, setError] = React.useState("")

    // Set up the router
    const router = useRouter()

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    const getData = async () => {

        console.log("Fetching plant data")

        let { id } = router.query

        // If there is no id then there is a problem
        if(!id){

            console.log("No id")

            setError("Invalid plant id")
            return;
        }

        // Try converting the id to a number
        let localId = parseInt(id as string)

        // If it is not a number then there is a problem
        if(isNaN(localId)){

            console.log("Not a number")

            setError("Invalid plant id")
            return
        }

        // Fetch the plant data
        const plantOBJ = await fetchPlant(localId)
        console.log(plantOBJ)

        // If the plant data is null then there is a problem
        if(!plantOBJ){
            setError("Plant not found")
            return
        }

        // Set the plant data
        setPlantData(plantOBJ)
        setPlantNames(getNamesInPreference(plantOBJ))
    }
    
    // Fetch the plant data from the api for this plant on load
    useEffect(() => {

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        getData().then(() => {console.log("Plant data fetched")} ).catch((error) => {console.log(error)});


    }, []);

    // Update content when the plant data changes
    const setMainImageFromIndex = (index: number) => {

        // Get all the attachments with image type
        let images = plantData?.attachments.filter((attachment) => attachment.type === "image")

        // If there are no images then return
        if(!images)
            return

        // If the index is out of bounds then return
        if(index < 0 || index >= images.length)
            return;

        // Set the current image
        setMainImage(images[index].path)

    }

    useEffect(() => {

        // Set the description
        const div = document.getElementById("large_description");
        if (div) {
            div.innerHTML = plantData ? plantData.long_description : "Loading...";
        }

        // Set the main image
        setMainImageFromIndex(0)

    }, [plantData]);

    const changeImage = (index: number) => {

            // Get all the attachments with image type
            let images = plantData?.attachments.filter((attachment) => attachment.type === "image")

            // If there are no images then return
            if(!images)
                return

            // If the index is out of bounds then return
            if(index < 0 || index + currentImage >= images.length - 2)
                return;

            // Set the current image
            setCurrentImage(index)

    }

    return (
        <>


            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={plantNames[0]}/>
            <Navbar currentPage={plantNames[0]}/>

            <Section>
                <PageHeader size={"small"}>
                    <div className={styles.plantHeader}>

                        {/* ID of the plant if it exists*/}
                        <div  className={styles.headerItem}>
                            <p className={styles.plantId}>ID : {plantData  ? plantData.id : "0000"}</p>
                        </div>


                        {/* Author and last modified date. Convert the date into the right format */}
                        <div  className={styles.headerItem}>
                            <p className={styles.smallInline}>Author: {plantData ? plantData.author : "Author..."}</p>
                            <p className={styles.smallInline}>Last Modified: {plantData ? (plantData.last_modified).slice(0,10).replaceAll("-", "/") : "00/00/00"}</p>

                        </div>

                        {/* Plant name */}
                        <div  className={styles.headerItem}>
                            <p className={styles.headerTitle}>{plantNames[0]}</p>
                        </div>

                        {/* Plant uses, loop through them creating an item for each one but make sure it's in the right format first */}
                        <div  className={styles.headerItem}>
                            <div className={styles.usesContianer}>

                                {plantData && plantData.use.map((use, index) => (
                                        <p key={index} className={styles.smallInline}>{convertUseTag(use)}</p>
                                ))}

                            </div>
                        </div>

                        {/* Plant location found */}
                        <div  className={styles.headerItem}>
                            <p className={styles.plantId}>{plantData  ? plantData.location_found : "Lost :("}</p>
                        </div>

                    </div>
                </PageHeader>
            </Section>

            <Section autoPadding>
               <div className={styles.plantMainInfo}>

                   {/* If there is an error then display it */}
                   { error === "" ? null : <Error error={error}/>}

                      <div className={"row"}>

                          {/* Show the preferred name as the title and the others as the subtitle */}
                          <div className={"column"}>
                              <h1> {plantNames[0]} </h1>
                              <h2> {plantNames[1]} | {plantNames[2]} </h2>

                              {/* The contents of this is set by JS as the description is in html format and that won't work as plaintext*/}
                             <div className={styles.description} id={"large_description"}> </div>
                          </div>

                          <div className={"column"}>


                              <div className={styles.plantImageContainer}>

                                  {/* The main image, will be set to the first image until the users scrolls below to another one */}
                                  <div className={styles.mainImage}>
                                      <Image src={mainImage} alt={`${plantNames[0]} Header Image`} fill style={{objectFit: "contain"}}/>
                                  </div>

                                  {/* The bottom images, will be set to the first 5 images, on click they will change the main image */}
                                  <div className={styles.bottomImages}>

                                      {/* Decrement the current image by 1 */}
                                      <button onClick={() => { changeImage(currentImage - 1) }}> <FontAwesomeIcon icon={faArrowLeft} className={styles.arrow}/> </button>

                                      {/* Loop through 5 creating 5 images */}
                                      {plantData && plantData.attachments.filter((attachment, index) => index <= 4 && attachment.type === "image").map((attachment, index) => (
                                            <>
                                              {/* On click set the main image to the image clicked */}
                                              <button key={index} onClick={() =>  {setMainImageFromIndex(currentImage + index)}}>

                                                   {/* The image, use the current shown image plus the index to get the correct 5 */}
                                                    <Image
                                                        src={plantData?.attachments[currentImage + index] ? plantData?.attachments[currentImage + index].path : "/media/images/loading.gif"}
                                                        alt={plantData?.attachments[currentImage + index] ? (plantData?.attachments[currentImage + index].meta as ImageMetaData).name : "Loading"}
                                                        fill
                                                        style={{objectFit: "contain"}}
                                                    />
                                                </button>
                                              </>
                                      ))}

                                      {/* Decrement the current image by 1 */}
                                      <button onClick={() => { changeImage(currentImage + 1) }}> <FontAwesomeIcon icon={faArrowRight} className={styles.arrow}/> </button>
                                  </div>
                              </div>
                          </div>
                      </div>
               </div>
            </Section>

            <Section autoPadding>
                <div className={styles.monthsContainer}>

                    {/* If there are no events then there shouldn't be a title */}
                    {plantData?.months_ready_for_use && plantData.months_ready_for_use.length > 0 &&
                        <h1 className={styles.title}> Events </h1>
                    }

                    {/* Loop through the events and display them */}
                    {plantData?.months_ready_for_use.map((month, index) => (
                        <div key={index} className={styles.month}>
                            <h1>{month.event}</h1>
                            <p>{month.start_month} - {month.end_month}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section autoPadding>
                <div className={styles.sectionsContainer}>

                    {/* Load all the big sections */}
                    {plantData?.sections.map((section, index) => (
                        <AutoSection
                            section={section}
                            images={plantData?.attachments.filter((attachment) => attachment.type === "image")}
                            isLeft={index % 2 === 0}
                            key={index}
                        />
                    ))}

                    {/* Attachments section */}
                    {
                        plantData?.attachments && plantData?.attachments.filter((attachment) => attachment.type !== "image").length > 0 ?
                            <>
                                <br/>
                                <div className={styles.attachmentsSection}>
                                    <h1> Attachments </h1>
                                    <div className={styles.attachmentsContainer}>
                                        {plantData?.attachments.filter((attachment) => attachment.type !== "image").map((attachment, index) => (
                                            <AttachmentSection attachment={attachment} key={index}/>
                                        ))}
                                    </div>
                                </div>
                            </>
                        :
                            <>
                            </>
                    }

                    {/* Load all the sources sections */}
                    {
                        plantData?.sections && plantData?.sections.filter((section) => section.type === "source").length > 0 ?
                            <div className={styles.sourceSection}>
                                <br/>
                                <br/>
                                <h1> Sources </h1>
                                {plantData?.sections.filter((section) => section.type === "source").map((source, index) => (
                                    <SourceSection section={source} key={index}/>
                                ))}

                            </div>
                            :
                            <></>
                    }


                </div>
            </Section>

            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <ScrollToTop/>
                
           
        </>
    );
}