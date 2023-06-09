import React, {useEffect, useRef} from "react";

import styles from "@/styles/index.module.css"
import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import Section from "@/components/section";
import PageHeader from "@/components/page_header";
import SearchBox from "@/components/search_box";
import {PlantCardApi, PlantCardLoading} from "@/components/plant_card";
import Image from "next/image";
import Stats from "@/components/stats";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import {getFromCache, saveToCache} from "@/lib/cache";
import axios from "axios";
import ScrollingPlant from "@/components/scrolling_plant";
import Link from "next/link";
import {globalStyles} from "@/lib/global_css";

export default function Home() {
    const pageName = "Home"

    // Stats for the featured plants
    const [isLoading, setIsLoading] = React.useState(true)
    const [plantIds, setPlantIds] = React.useState([0,0,0])
    const [location, setLocation] = React.useState("13-dgt-website.vercel.app")

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    // Get the plant ids when the page loads
    useEffect(() => {

        setLocation(window.location.host)

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        getPlantIDs().then(() => {console.log("Plant IDs fetched")} ).catch((error) => {console.log(error)});
    }, [])

    /**
     * Gets 3 random IDs from the database to be used for the featured plants
     */
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

                       {/* Place the plant model on the right */}
                       <div className={styles.plantContainer}>
                           <ScrollingPlant/>
                       </div>

                       {/* Place the title and description on the left */}
                       <div className={styles.title}>
                           <h1 > Rongoa </h1>
                       </div>


                       <p className={styles.description}>
                           Welcome to {location}, here you will find a database full of rich information about rongoa. You can <Link href={"/search"}> search </Link> for a specific plant or see a index of all the plants in our database <Link href={"/plant_index"}> here</Link>.
                           <br/> <br/>
                           Each plant has its own page full with content, where you can discover information such as the plants craft uses, medical uses, edible uses and much more!
                       </p>

                       <div className={styles.searchBox}>
                        <SearchBox/>
                       </div>

                   </div>
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
                <div className={globalStyles.gridCentre}>
                    <div className={styles.pageBreak}>
                        <Image
                            src={"/media/images/fern.png"}
                            alt={"fern"}
                            width={400}
                            height={400}
                        />
                        <Image
                            src={"/media/images/kowhai.png"}
                            alt={"kowhai"}
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            </Section>

            {/* Section for the plant stats */}
            <Section autoPadding>

                {/* Container for the stats */}
                <div className={globalStyles.gridCentre}>

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
