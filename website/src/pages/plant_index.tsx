import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useEffect, useRef} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/plant_index.module.css";
import axios from "axios";
import Stats from "@/components/stats";

type IndexRef = React.ForwardedRef<HTMLDivElement>

interface plantEntry {
    id: number,
    name: string,
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const numbers = "0123456789".split("")
const symbols = "!@#$%^&*()_+-=[]{};':\",./<>?".split("")

export default function PlantIndex(ref: IndexRef){
    const pageName = "Plant Index"
    const [plants, setPlants] = React.useState<plantEntry[] | null>(null)

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)


    // Get the plant ids
    useEffect(() => {
        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        getPlantIDs()
    }, [])

    const getPlantIDs = async () => {


        try{

            console.log("Getting plant ids")

            // Get the ids from the api
            const response = await axios.get("/api/plants/search?getNames=true")

            console.log(response)

            // Get the plant ids from the response
            const data = response.data.data

            // Example Data: [{"id":10,"english_name":"Christmas Tree","maori_name":"Pohutukawa","latin_name":"Metrosideros excelsa"},{"id":12,"english_name":"Christmas Tree","maori_name":"Pohutukawa","latin_name":"Metrosideros excelsa"},{"id":13,"english_name":"Christmas Tree","maori_name":"Pohutukawa","latin_name":"Metrosideros excelsa"},{"id":54,"english_name":"Wineberry","maori_name":"Makomako","latin_name":"Aristotelia serrata"},{"id":61,"english_name":"asd","maori_name":"asd","latin_name":"asd"},{"id":64,"english_name":"asd","maori_name":"asd","latin_name":"asd"}]

            // Create an array to store the plant ids (for each name)
            let ids: plantEntry[] = []
            setPlants(ids)

            // Loop through the data and set the ids
            for (let i = 0; i < data.length; i++) {

                // If there is a english name then add it to the array
                if (data[i].english_name !== null) {
                    ids.push({id: data[i].id, name: data[i].english_name})
                }

                // If there is a maori name then add it to the array
                if (data[i].maori_name !== null) {
                    ids.push({id: data[i].id, name: data[i].maori_name})
                }

                // If there is a latin name then add it to the array
                if (data[i].latin_name !== null) {
                    ids.push({id: data[i].id, name: data[i].latin_name})
                }

            }

            // Set the plant ids
            setPlants(ids)


        }catch (e) {
            console.log(e)

            // TODO: Handle error

        }
    }

    // Instead of using a link to scroll to the element, use this function as it gives space for the navbar and scrolls smoothly
    const scrollID = (id: string) => {

        // Get the element and scroll to it
        const element = document.getElementById(id);

        // IF the element exists then scroll to it
        if (element) {

            // Get the dimensions of the element
            let dims = element.getBoundingClientRect();

            // Scroll to it but give space for the navbar
            window.scrollTo({ top: dims.top - 150 + window.scrollY, behavior: 'smooth' });
        }
    }

    return(
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            <PageHeader size={"small"}>
                <div className={styles.header}>
                    <h1>Plant Index</h1>
                </div>

            </PageHeader>

            {/* Stats */}
            <Section autoPadding>
                <div className={styles.statsContainer}>
                    <Stats/>
                </div>
            </Section>

            {/* Ids */}
            <Section autoPadding>
                <div className={styles.topBar}>
                    <h1>Contents</h1>

                    <div className={styles.contentsLinks}>
                        {/* Loop through the alphabet and add a link for each letter */}
                        {
                            alphabet.map((letter) => {
                                return <p key={letter} onClick={() => {scrollID(letter)}}>{letter}</p>
                            })
                        }

                        {/* Loop through the numbers and add a link for each number */}
                        {
                            numbers.map((number) => {
                                return <p key={number} onClick={() => {scrollID(number)}}>{number}</p>
                            })
                        }

                        {/* Loop through the symbols and add a link for each symbol */}
                        {
                            symbols.map((symbol) => {
                                return <p key={symbol} onClick={() => {scrollID(symbol)}}>{symbol}</p>
                            })
                        }



                    </div>

                </div>

                {/* Loop through the alphabet and add a section for each letter */}
                {
                    alphabet.map((letter) => {
                        return <PlantIndexEntry key={letter} letter={letter} plants={plants}/>
                    })
                }

                {/* Loop through the numbers and add a section for each number */}
                {
                    numbers.map((number) => {
                        return <PlantIndexEntry key={number} letter={number} plants={plants}/>
                    })
                }

                {/* Loop through the symbols and add a section for each symbol */}
                {
                    symbols.map((symbol) => {
                        return <PlantIndexEntry key={symbol} letter={symbol} plants={plants}/>
                    })

                }




            </Section>

            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <ScrollToTop/>

           
        </>
    )
}

interface PlantIndexEntryProps {
    letter: string,
    plants: plantEntry[] | null
}
function PlantIndexEntry({letter, plants}: PlantIndexEntryProps){
    return(
        <>

            <div className={styles.letterContainer} id={letter}>
                <h2>{letter}</h2>
                <ul>
                    {/* Add a list item for each plant that starts with A */}
                    {
                        // Check if the plants have been fetched
                        plants ?

                            // Loop through the plants and add a list item for each plant that starts with A
                            plants.map((plant) => {
                                if (plant.name[0].toLowerCase() === letter.toLowerCase()) {
                                    return <li key={plant.id} onClick={() => {window.location.href = "/plants/" + plant.id}}>{plant.name}</li>
                                }})
                            :
                            // If the plants haven't been fetched then display a loading message
                            <li>Loading...</li>
                    }
                </ul>
            </div>
        </>)
}