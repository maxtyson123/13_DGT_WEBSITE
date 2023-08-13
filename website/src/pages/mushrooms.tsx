import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useEffect, useRef} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/mushrooms.module.css";
import axios from "axios";
import {PlantCardApi} from "@/components/plant_card";

export default function PlantIndex(){
    const pageName = "Mushrooms"
    const [plantData, setPlantData] = React.useState<any>(null)

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    // Get the plant ids
    useEffect(() => {
        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true
        getPlantIDs().then(() => {console.log("Finished getting plant ids")}).catch((error) => {console.log(error)})
    }, [])

    const getPlantIDs = async () => {

        try{

            console.log("Getting plant ids")

            // Get the ids from the api
            const response = await axios.get("/api/plants/search?mushrooms=only")

            console.log(response)

            // Get the plant ids from the response
            const data = response.data.data

            // Store the data
            setPlantData(data)



        }catch (e) {
            console.log(e)

            // TODO: Handle error

        }
    }


    return(
        <>
            {/* The header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* The main page header is just the plant index title */}
            <PageHeader size={"small"}>
                <div className={styles.header}>
                    <h1>Mushrooms</h1>
                </div>
            </PageHeader>

            {/* TODO: Sort by */}

            {/* Ids */}
            <Section autoPadding>
                <div className={styles.mushroomContainer}>
                    {plantData === null ? <></> : plantData.map((plant: any, index: number) => {
                        return(
                            <PlantCardApi key={index} id={plant.id}/>
                        )
                    })}

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