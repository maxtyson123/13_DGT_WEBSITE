import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useEffect, useRef} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/plant_index.module.css";
import Stats from "@/components/stats";
import {DropdownInput} from "@/components/input_sections";
import {getNamesInPreference, macronCodeToChar, numberDictionary} from "@/lib/plant_data";
import {makeRequestWithToken} from "@/lib/api_tools";

interface plantEntry {
    id: number,
    name: string,
    tag: string
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function PlantIndex(){
    const pageName = "Plant Index"
    const [plantData, setPlantData] = React.useState<any>(null)
    const [plants, setPlants] = React.useState<plantEntry[] | null>(null)
    const [uses, setUses] = React.useState<plantEntry[] | null>(null)
    const [indexItems, setIndexItems] = React.useState<plantEntry[] | null>(null)
    const [renderKey, setRenderKey] = React.useState<number>(0)

    // Filter
    const [currentFilter, setCurrentFilter] = React.useState<string>("Plant Names")
    const filterOptions = ["Plant Names", "English Names", "Maori Names", "Latin Names", "Plant Uses", "Craft Uses", "Medical Uses", "Edible Uses"]

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    // Get the plant ids
    useEffect(() => {

        // Get the filter from the url
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');

        // Set the filter to the url filter if it exists
        if (filter){

            switch (filter) {
                case "plants":
                    setCurrentFilter("Plant Names")
                    break

                case "edible":
                    setCurrentFilter("Edible Uses")
                    break

                case "craft":
                    setCurrentFilter("Craft Uses")
                    break

                case "medical":
                    setCurrentFilter("Medical Uses")
                    break

                default:
                    setCurrentFilter("Plant Names")
            }

        }

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true
        getPlantIDs().then(() => {console.log("Finished getting plant ids")}).catch((error) => {console.log(error)})
        getPlantUses().then(() => {console.log("Finished getting plant uses")}).catch((error) => {console.log(error)})
    }, [])

    const getPlantIDs = async () => {


        try{

            console.log("Getting plant ids")

            // Get the ids from the api
            const response = await makeRequestWithToken("get","/api/plants/search?getNames=true")

            console.log(response)

            // Get the plant ids from the response
            const data = response.data.data

            // Store the data
            setPlantData(data)

            // Create an array to store the plant ids (for each name)
            let ids: plantEntry[] = []
            setPlants(ids)

            // Loop through the data and set the ids
            for (let i = 0; i < data.length; i++) {

                // If there is an english name then add it to the array
                if (data[i].english_name !== null) {
                    ids.push({id: data[i].id, name: macronCodeToChar(data[i].english_name, numberDictionary), tag: "english"})
                }

                // If there is a maori name then add it to the array
                if (data[i].maori_name !== null) {
                    ids.push({id: data[i].id, name: macronCodeToChar(data[i].maori_name, numberDictionary), tag: "maori"})
                }

                // If there is a latin name then add it to the array
                if (data[i].latin_name !== null) {
                    ids.push({id: data[i].id, name: macronCodeToChar(data[i].latin_name, numberDictionary), tag: "latin"})
                }

            }

            // Set the plant ids
            setPlants(ids)


        }catch (e) {
            console.log(e)

            // TODO: Handle error

        }
    }

    const getPlantUses = async () => {
        try{

            console.log("Getting plant uses")

            // Get the ids from the api
            const response = await makeRequestWithToken("get","/api/plants/uses?getValues=true")

            console.log(response)

            // Get the plant ids from the response
            const data = response.data.data

            // Create an array to store the plant uses (for each plant)
            let uses: plantEntry[] = []

            // Loop through the data and set the uses
            for (let i = 0; i < data.length; i++) {

                // Split the item into two if there is a comma
                let split = data[i].identifier.split(",")

                // If there is a comma then add all the items to the array
                for (let j = 0; j < split.length; j++) {

                    // Remove space from the start and end of the string
                    split[j] = split[j].trim()

                    uses.push(
                        {
                            id: data[i].id,
                            name: macronCodeToChar(split[j], numberDictionary),
                            tag: data[i].type
                        })
                }
            }

            // Set the plant uses
            setUses(uses)
            console.log(uses)

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

    useEffect(() => {

        // Ensure that the plants and uses have been fetched
        if(!plants) return;
        if(!uses) return;

        // Filter the plants based on the current filter
        let items : plantEntry[] = []
        setIndexItems(items)

        switch (currentFilter) {
            case "Plant Names":
                items = plants
                break;

            case "English Names":
                items = plants.filter((plant) => {return plant.tag === "english"})
                break;

            case "Maori Names":
                items = plants.filter((plant) => {return plant.tag === "maori"})
                break;

            case "Latin Names":
                items = plants.filter((plant) => {return plant.tag === "latin"})
                break;

            case "Plant Uses":
                if(!uses) break;
                items = uses
                break;

            case "Craft Uses":
                if(!uses) break;
                items = uses.filter((use) => {return use.tag === "craft"})
                break;

            case "Medical Uses":
                if(!uses) break;
                items = uses.filter((use) => {return use.tag === "medical"})
                break;

            case "Edible Uses":
                if(!uses) break;
                items = uses.filter((use) => {return use.tag === "edible"})
                break;

        }

        // If the filter is a use then add the plant name to the use
        if(currentFilter.includes("Uses")) {

            // Loop through the items and the plant data
            for(let i = 0; i < items.length; i++) {
                for(let j = 0; j < plantData.length; j++) {

                    // If the  ID  is the same then add the plant name to the use
                    if(items[i].id === plantData[j].id) {

                        // Get the preffered name
                        items[i].name += (" - " + macronCodeToChar(getNamesInPreference(plantData[j])[0], numberDictionary))
                        break
                    }
                }
            }
        }

        // If the item has "Not Set" in it then remove it
        items = items.filter((item) => {return !item.name.includes("Not Set")})

        // Order the items alphabetically
items.sort((a, b) => {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        })


        // Update the index items
        console.log(items)
        setIndexItems(items)

        // Re render the components
        setRenderKey(prevState => prevState + 1)


    }, [plants, currentFilter, uses])

    return(
        <>
            {/* The header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* The main page header is just the plant index title */}
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

            <Section autoPadding>
                <div className={styles.info}>
                    <p> This page contains a list of all the plants on the website. The plants are sorted alphabetically. </p>
                    <p> Click on a plant to view its page. </p>
                    <p> Use the dropdown below to select what the index should display</p>
                    <DropdownInput
                        placeHolder={"Index Filter"}
                        required={false}
                        state={"normal"}
                        options={filterOptions}
                        defaultValue={currentFilter}
                        changeEventHandler={setCurrentFilter}
                    />
                </div>
            </Section>

            {/* Ids */}
            <Section autoPadding>
                <div className={styles.topBar}>
                    <h1>Contents</h1>

                    <div className={styles.contentsLinks}>
                        {/* Loop through the alphabet and add a link for each letter */}
                        {
                            alphabet.map((letter, index) => {
                                return <p key={index} onClick={() => {scrollID(letter)}}>{letter}</p>
                            })
                        }

                    </div>
                </div>

                {/* Loop through the alphabet and add a section for each letter */}
                <div>
                {
                    alphabet.map((letter) => {
                        return <PlantIndexEntry key={letter + renderKey} letter={letter} plants={indexItems}/>
                    })
                }
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
                    {/* Add a list item for each plant that starts with the specified letter */}
                    {
                        // Check if the plants have been fetched
                        plants ?

                            // Loop through the plants and add a list item for each plant that starts with the specified letter
                            plants.map((plant,   index) => {
                                if(!plant.name)
                                    return <></>
                                if (plant.name[0].toLowerCase() === letter.toLowerCase()) {
                                    return <li key={index} onClick={() => {window.location.href = "/plants/" + plant.id}}>{plant.name}</li>
                                }})
                            :
                            // If the plants haven't been fetched, then display a loading message
                            <li>Loading...</li>
                    }
                </ul>
            </div>
        </>)
}