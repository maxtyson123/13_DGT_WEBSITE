import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import {getLocalData} from "@/components/plant_card";
import {PlantData} from "@/modules/plant_data";
import Section from "@/components/section";
import Footer from "@/components/footer";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import PageHeader from "@/components/page_header";
import ScrollToTop from "@/components/scroll_to_top";


export default function PlantPage() {

    // Set up the router
    const router = useRouter()

    // Get the id from the url
    let { id } = router.query
    console.log(typeof id)

    // Store the plant data
    const [plantData, setPlantData] = useState<PlantData | null>(null)
    const [isLoading, setLoading] = useState(true)

    // Get the plant data, depend on the id changing
    useEffect(() => {

        // Set the loading state
        setLoading(true)

        // Get the plant data
        getLocalData(id).then((data) => {

            // Set the plant data
            setPlantData(data)

            // Set the loading state
            setLoading(false)
        })

    }, [id, router.query])


    return (
        <>


            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={isLoading ? "Loading..." : plantData?.english_name}/>
            <Navbar currentPage={isLoading ? "Loading..." : plantData?.english_name}/>

            <Section>
                <PageHeader size={"small"}>
                    <h1>Plant ID: {isLoading ? "Loading..." : plantData?.english_name}</h1>
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