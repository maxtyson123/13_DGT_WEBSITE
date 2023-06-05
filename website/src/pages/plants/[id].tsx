import React, {useEffect, useRef} from "react";
import {useRouter} from 'next/router'
import Section from "@/components/section";
import Footer from "@/components/footer";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import PageHeader from "@/components/page_header";
import ScrollToTop from "@/components/scroll_to_top";
import {getFromCache, saveToCache} from "@/modules/cache";
import {getNamesInPreference, PlantData} from "@/modules/plant_data";
import axios from "axios";
import styles from "@/styles/id.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {convertUseTag} from "@/components/plant_card";
import Image from "next/image";
import {AutoSection} from "@/components/plant_sections";

export default function PlantPage() {

    // Store the plant data
    const [plantData, setPlantData] = React.useState<PlantData | null>(null)
    const [plantNames, setPlantNames] = React.useState(["Loading...", "Loading...", "Loading..."])

    // States for the images
    const [currentImage, setCurrentImage] = React.useState(0)
    const [mainImage, setMainImage] = React.useState("/media/images/loading.gif")

    // States for the months
    const [currentMonth, setCurrentMonth] = React.useState(0)

    // Set up the router
    const router = useRouter()

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    // Fetch the plant data from the api for this plant on load
    useEffect(() => {

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        fetchPlant(); //TODO: Fetch plant data should probably be made in a function in the plant_data module


    }, []);

    const fetchPlant = async () => {

        console.log("Fetching plant data")

        let { id } = router.query

        // If there is no id then there is a problem
        if(!id){

            console.log("No id")

            //TODO: ERROR PAGE
            return;
        }

        // Try converting the id to a number
        let localId = parseInt(id as string)

        // If it is not a number then there is a problem
        if(isNaN(localId)){

            console.log("Not a number")

            //TODO: ERROR PAGE
            return
        }


        console.log(localId)


        // Check if the plant data has already been fetched
        let plantOBJ = getFromCache("plant_" + id) as PlantData | null

        if(plantOBJ === null) {

            try {
                // Get the plant data from the api
                const res = await axios.get(`/api/plants/json?id=${id}&operation=download`);
                const plantData = res.data.data

                // Typecast the plant data to the PlantData type (this is because it is know to return the PlantData type by the api - checking is done there)
                plantOBJ = plantData as PlantData

                // Update the id of the object because the api doesnt return it (TODO: Should probably fix this)
                plantOBJ.id = localId

                // Set the plant data in the cache
                saveToCache("plant_" + id, plantOBJ)


            } catch (e) {

                // If there is an error just log it and set the plant card to the loading card
                console.log("Error fetching plant data from api")
                setPlantData(null)

                //TODO: ERORR PAGE
                return;
            }
        }


        console.log(plantOBJ)

        // Set the plant data
        setPlantData(plantOBJ)
        setPlantNames(getNamesInPreference(plantOBJ))
    }

    // Update content when the plant data changes
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

    return (
        <>


            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={plantNames[0]}/>
            <Navbar currentPage={plantNames[0]}/>

            <Section>
                <PageHeader size={"small"}>
                    <div className={styles.plantHeader}>
                        <div  className={styles.headerItem}>
                            <p className={styles.plantId}>ID : {plantData  ? plantData.id : "0000"}</p>
                        </div>


                        <div  className={styles.headerItem}>
                            <p>{plantNames[1]}</p>
                            <p>{plantNames[2]}</p>

                        </div>

                        <div  className={styles.headerItem}>
                            <p className={styles.headerTitle}>{plantNames[0]}</p>
                        </div>

                        <div  className={styles.headerItem}>
                            <div className={styles.usesContianer}>

                                {plantData && plantData.use.map((use, index) => (
                                    <div key={index} className={styles.use}>
                                        <p>{convertUseTag(use)}</p>
                                    </div>
                                ))}

                            </div>
                        </div>

                        <div  className={styles.headerItem}>
                            <p className={styles.plantId}>{plantData  ? plantData.location_found : "location_found"}</p>
                        </div>

                    </div>
                </PageHeader>
            </Section>

            <Section autoPadding>
               <div className={styles.plantMainInfo}>
                      <div className={"row"}>

                          <div className={"column"}>
                              <h1> {plantNames[0]} </h1>
                              <h2> {plantNames[1]} | {plantNames[2]} </h2>

                             <div className={styles.description} id={"large_description"}> </div>
                          </div>

                          <div className={"column"}>

                              <div className={styles.plantImageContainer}>
                                  <div className={styles.mainImage}>
                                      <Image src={mainImage} alt={`${plantNames[0]} Header Image`} fill style={{objectFit: "contain"}}/>
                                  </div>

                                  <div className={styles.bottomImages}>
                                      <button onClick={() => { changeImage(currentImage - 1) }}> <FontAwesomeIcon icon={faArrowLeft}/> </button>

                                      {/* Map 5 images in the range of the current image - 2 to the current image + 2 */}
                                      {plantData && plantData.attachments.filter((attachment, index) => index <= 4 && attachment.type === "image").map((attachment, index) => (
                                          <button key={index} onClick={() =>  {setMainImageFromIndex(currentImage + index)}}>
                                                <Image
                                                    src={plantData?.attachments[currentImage + index] ? plantData?.attachments[currentImage + index].path : "/media/images/loading.gif"}
                                                    alt={plantData?.attachments[currentImage + index] ? plantData?.attachments[currentImage + index].name : "Loading"}
                                                    fill
                                                    style={{objectFit: "contain"}}

                                                />
                                            </button>
                                        ))}

                                      <button onClick={() => { changeImage(currentImage + 1) }}> <FontAwesomeIcon icon={faArrowRight}/> </button>
                                  </div>
                              </div>

                          </div>
                      </div>

               </div>
            </Section>

            <Section autoPadding>
                <div className={styles.monthsContainer}>

                    {/* If there are no events then there shouldn't be a title */}
                    {plantData?.months_ready_for_use.length > 0 &&
                    <h1 className={styles.title}> Events </h1>
                    }

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
                    {plantData?.sections.map((section, index) => (
                        <AutoSection section={section} images={plantData?.attachments} isLeft={index % 2 === 0} key={index}/>
                    ))}
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