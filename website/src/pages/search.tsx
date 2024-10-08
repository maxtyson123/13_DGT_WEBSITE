import React, {useEffect, useRef, useState} from "react";
import Section from "@/components/section";
import styles from "@/styles/components/search.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import PlantCardData, {PlantCardApi, PlantCardLoading, PlantCardNull} from "@/components/plant_card";
import {Error} from "@/components/error";
import {makeRequestWithToken} from "@/lib/api_tools";
import {Layout} from "@/components/layout";

export default function Search(){
    const pageName = "Search"

    // Stats
    const [query, setQuery] = useState<string | null>(null)
    const [includeMushrooms, setIncludeMushrooms] = useState<boolean>(true)
    const [duration, setDuration] = useState(0)
    const [amount, setAmount] = useState(0)

    // Results
    const [results, setResults] = useState<JSX.Element[]>([])

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)


    // Run on page start
    useEffect(() => {

        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const userInput = (document.getElementById("searchBox") as HTMLInputElement).value
                const includeMushrooms = (document.getElementById("plant_type") as HTMLInputElement).checked
                window.location.href = `/search?query=${userInput}&include_mushrooms=${includeMushrooms}`
            }
        })

        let initialResults: JSX.Element[] = []

        // Set the results to null
        for (let i = 0; i < 4; i++){

            initialResults.push(
                <div className={styles.searchResult}>
                    <PlantCardNull/>
                </div>
            )

        }
        setResults(initialResults)


        // Get the query from the url
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');

        const includeMushrooms = urlParams.get('include_mushrooms');
        setIncludeMushrooms(includeMushrooms == "true")

        // Check if the query is null
        if (query === null || query === "")
            return

        // Set the query
        setQuery(query)

        // Show that we are searching
        initialResults = []
        for (let i = 0; i < 4; i++){

            initialResults.push(
                <div className={styles.searchResult}>
                    <PlantCardLoading/>
                </div>
            )

        }
        setResults(initialResults)

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        // Begin getting the search results
        getSearchResults(query, includeMushrooms == "true").then()


    }, [])

    const getSearchResults = async (name: string, mushrooms: boolean) => {

        const startTime = Date.now()
        let apiResults: JSX.Element[] = []

        const seedSweeperVariants = ["seedsweeper", "sweed", "seed-sweeper", "seed_sweeper", "seed sweeper", "mine sweeper", "minesweeper", "mine-sweeper", "mine sweeper", "sweeper", "seed"]
        if (seedSweeperVariants.includes(name.toLowerCase())){


            // Add the result to the results
            apiResults.push(
                <div className={styles.searchResult}>
                    <PlantCardData data={
                        {   id: "seedsweeper" as any,
                            published: true,
                            preferred_name: "English",
                            english_name: "Seed Sweeper",
                            latin_name: "Max Tyson",
                            maori_name: "Easter Egg-plant",
                            small_description: "A fun game made by Max Tyson",
                            display_images: [{
                                post_title: "Main",
                                post_image: "/media/images/sw.png",
                                post_approved: true,
                                post_date: new Date().toISOString(),
                                post_in_use: true,
                                post_user_id: 2,
                                post_plant_id: 0,
                                post_description: "seedsweeper",
                                id: 0,
                            }],
                            authorIDs: [2],
                            use: [],
                            sections: [],
                            months_ready_for_use: [],
                            last_modified: new Date().toISOString(),
                            attachments: [{type: "image", path: "/media/images/sw.png", meta: {name: "main", credits: "Max Tyson", description: "Yes"}, downloadable: false}],
                            location_found: "NPM",
                            plant_type: "Game",
                            long_description: "click me",
                            authors: [],
                        }}/>
                </div>
            )

            // Set the results
            setResults(apiResults)

            // Set the time and amount
            setDuration(Date.now() - startTime)
            setAmount(1)
            console.log("SeedSweeper")

        }


        try{
            console.log("Getting search results")

            // Get the search results
            const response = await makeRequestWithToken("get",`/api/plants/search?name=${name}&mushrooms=${mushrooms ? "include" : "exclude"}`)
            console.log(mushrooms ? "include" : "exclude")
            console.log(mushrooms)
            // Get the data from the response
            const data = response.data.data

            // Log the response
            console.log(data)

            // Loop through the results
            for (let i = 0; i < data.length; i++){

                    // Add the result to the results
                    apiResults.push(
                        <div className={styles.searchResult}>
                            <PlantCardApi id={data[i].id}/>
                        </div>
                    )

            }

            // Set the results
            setResults(apiResults)

            // Set the time and amount
            setDuration(Date.now() - startTime)
            setAmount(data.length)


        } catch (e) {

            // Set the results to an error div
            setResults([
                <Error key={"error"} error={"Sorry, we couldn't find any plants with that name."}/>
            ])

            // Set the time and amount
            setDuration(Date.now() - startTime)
            setAmount(0)

        }

    }

    const header = () => {
        return (
            <div className={styles.searchHeaderContainer}>

                {/* Search Title */}
                <h1>Search</h1>

                {/* Search Stats */}
                <div className={styles.statsContainer}>

                    {/* What the user searched for */}
                    <div className={styles.statContainer}>
                        <p> Query: </p>
                        <p>{query ? query : "None"}</p>
                    </div>

                    {/* How long the search took */}
                    <div className={styles.statContainer}>
                        <p> Duration: </p>
                        <p>{duration}ms</p>
                    </div>

                    {/* How many results were found */}
                    <div className={styles.statContainer}>
                        <p> Amount: </p>
                        <p>{amount}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>

           <Layout pageName={pageName} header={header()}>

                {/* Search box */}
                <Section autoPadding>
                    <div className={styles.searchBoxContainer}>

                        {/* Search box */}
                        <input
                            type={"text"}
                            id={"searchBox"}
                            placeholder={"Search for a plant..."}
                            value={query ? query : ""}
                            className={styles.searchBox}
                            onChange={(e) => {
                                setQuery(e.target.value)
                            }}
                        />

                        {/* Search button */}
                        <button
                            className={styles.searchButton}
                            onClick={() => {
                                const userInput = (document.getElementById("searchBox") as HTMLInputElement).value
                                const includeMushrooms = (document.getElementById("plant_type") as HTMLInputElement).checked
                                window.location.href = `/search?query=${userInput}&include_mushrooms=${includeMushrooms}`
                            }}>
                            <FontAwesomeIcon icon={faSearch}/>
                        </button>
                    </div>
                    <div className={styles.searchBoxContainer}>
                        <div className={styles.searchFilterContainer}>
                            <h3>Filter by:</h3>

                            <div className={styles.searchFilter}>
                                <input type="checkbox" id="plant_type" name="plant_type" defaultChecked={includeMushrooms}/>
                                <label htmlFor="plant_type"> Include Mushrooms in search? </label>
                            </div>
                        </div>
                    </div>

                </Section>

                {/* Search results */}
                <Section autoPadding>
                    <div className={styles.searchResultsContainer}>
                        {results}

                    </div>
                </Section>
           </Layout>
        </>
    )
}