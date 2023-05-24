//set PATH=%PATH%;C:\Users\max.tyson\Downloads\node-v14.16.0-win-x64\node-v14.16.0-win-x64

// TODO: Plant page for the plants
// TODO: Calendar page to show all the plants that are in season
// TODO: Redo the images for the plants - Make it use a main image for the default
// TODO: Grid that shit
// TODO: Responsive design
// TODO: Authentication
// TODO: Edit page
// TODO: Accessibility Settings (Dark mode)
// TODO: Comment Code
// TODO: Testing
// TODO: Code cleanup
// TODO: Code Validation
// TODO: Documentation

import React, {useEffect, useRef} from "react";

import styles from "@/styles/index.module.css"
import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import Section from "@/components/section";
import PageHeader from "@/components/page_header";
import SearchBox from "@/components/search_box";
import ScrollingPlant from "@/components/scrolling_plant";
import {PlantCardApi, PlantCardLoading} from "@/components/plant_card";
import Image from "next/image";
import Stats from "@/components/stats";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import {getFromCache, saveToCache} from "@/modules/cache";
import axios from "axios";

type HomeRef = React.ForwardedRef<HTMLDivElement>
export default function Home(ref: HomeRef) {
    const pageName = "Home"

    // Stats for the featured plants
    const [isLoading, setIsLoading] = React.useState(true)
    const [plantIds, setPlantIds] = React.useState([0,0,0])

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    // Get the plant ids when the page loads
    useEffect(() => {

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        getPlantIDs();
    }, [])

    const getPlantIDs = async () => {

        // Check if the plant ids have been cached
        const ids = getFromCache("plantIds")

        // If the plant ids have been cached
        if (ids !== null) {
            setPlantIds(ids)
            setIsLoading(false)
        }else{

            // Use the api to get the plant ids
            try{
                // Make the api call
                const response = await axios.get("/api/plants/random?amount=3")

                // API returns the data as "data" which axios also uses, so we need to use response.data.data
                const data = response.data.data

                // Create an array to store the ids
                let ids = [0,0,0]

                // Loop through the data and set the ids
                for (let i = 0; i < data.length; i++) {
                    ids[i] = data[i].id
                }

                // Set the plant ids
                setPlantIds(ids)
                setIsLoading(false)

                // Save the plant ids to the cache
                saveToCache("plantIds", ids)


            } catch (error) {

                console.log(error)

            }

        }

    }


    return (
        <>
            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Section for the welcome message and search box */}
            <Section>
                {/* Use the page header component to display the welcome message (See: components/page_header.tsx) */}
                <PageHeader size={"large"}>

                  {/* Container for the welcome message and search box */}
                   <div className={styles.welcomeContainer}>

                       {/* Place the title and description on the left */}
                       <div className={styles.titleContainer}>
                           <h1 className={styles.title}> Rongoa </h1>
                           <p className={styles.description}>Site description ... ... ... ... ... ... ... ... ... ... ... ...
                               ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...
                               ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...
                               ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...  </p>
                       </div>

                      {/* Place the plant model on the right */}
                       <div className={styles.plantContainer}>
                           <ScrollingPlant/>
                       </div>
                   </div>

                    {/* Search is to be below the welcome message so don't include it in the flex div*/}
                    <SearchBox/>
                </PageHeader>
            </Section>

            {/* Section for the featured plants */}
            <Section autoPadding>
                {/* Section title */}
                <h1 className={styles.sectionTitle}>Featured Plants</h1>

                {/* Container that centers the cards */}
                <div className={styles.cardsContainer}>
                    {
                        isLoading ?
                        <>
                            {/* While the data is being fetched, display the loading cards */}
                            <PlantCardLoading/>
                            <PlantCardLoading/>
                            <PlantCardLoading/>
                        </>
                        :
                        <>
                            {/* Once the data has been fetched, load the individual card's data */}
                            <PlantCardApi id={plantIds[0]}/>
                            <PlantCardApi id={plantIds[1]}/>
                            <PlantCardApi id={plantIds[2]}/>
                        </>

                    }
                </div>
            </Section>


            <Section autoPadding>
                {/* A page break to give the user a break from the content */}
                <div className={styles.pageBreakContainer}>
                    <div className={styles.pageBreak}>
                        <Image
                            src={"/media/images/fern.png"}
                            alt={"fern"}
                            width={400}
                            height={400}
                            className={styles.image}
                        />
                        <Image
                            src={"/media/images/kowhai.png"}
                            alt={"kowhai"}
                            width={400}
                            height={400}
                            className={styles.image}
                        />
                    </div>
                </div>
            </Section>

            {/* Section for the plant stats */}
            <Section autoPadding>

                {/* Container for the stats */}
                <div className={styles.pageBreakContainer}>

                    {/* Display the stats */}
                    <Stats/>
                </div>
            </Section>

            {/* Page footer */}
            <Section>
                    <Footer/>
            </Section>

            {/* Allow the user to scroll to the top of the page easily*/}
            <ScrollToTop/>
        </>
    );
}
