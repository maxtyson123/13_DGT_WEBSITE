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


export default function PlantPage() {

    // Store the plant data
    const [plantData, setPlantData] = React.useState<PlantData | null>(null)
    const [plantNames, setPlantNames] = React.useState(["Loading...", "Loading...", "Loading..."])
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

        fetchPlant(); //TODO: Fetch plant data should probaly be made in a function in the plant_data module


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

                // Typecast the plant data to the PlantData type (this is becuase it is know to return the PlantData type by the api - checking is done there)
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

        // Set the plant data
        setPlantData(plantOBJ)
        setPlantNames(getNamesInPreference(plantOBJ))
    }

    return (
        <>


            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={plantNames[0]}/>
            <Navbar currentPage={plantNames[0]}/>

            <Section>
                <PageHeader size={"small"}>
                    <h1>Plant ID: {plantNames[0]}</h1>
                </PageHeader>
            </Section>


            {/*
                    <Section>
                      - Plant Intro
                    </Section>

                    <Section>
                     - Location
                    </Section>

                    - Auto Generated Sections (map loop into a AutoSection component)

            */}

            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <ScrollToTop/>
                
           
        </>
    );
}