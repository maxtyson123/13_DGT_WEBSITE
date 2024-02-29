import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useEffect, useRef, useState} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/components/search.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {PlantCardApi, PlantCardLoading, PlantCardNull} from "@/components/plant_card";
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

    const getSearchResults = async (name: string, mushroons: boolean) => {

        const startTime = Date.now()

        try{
            console.log("Getting search results")

            // Get the search results
            const response = await makeRequestWithToken("get",`/api/plants/search?name=${name}&mushrooms=${mushroons ? "include" : "exclude"}`)
            console.log(mushroons ? "include" : "exclude")
            console.log(mushroons)
            // Get the data from the response
            const data = response.data.data

            // Log the response
            console.log(data)

            // Create the results
            let apiResults: JSX.Element[] = []

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