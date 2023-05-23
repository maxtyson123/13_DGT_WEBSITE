import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useEffect, useRef, useState} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/search.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {PlantCardApi, PlantCardLoading, PlantCardNull} from "@/components/plant_card";
import axios from "axios";

type SearchRef = ForwardedRef<HTMLDivElement>
export default function Search(ref: SearchRef){
    const pageName = "Search"

    // Stats
    const [query, setQuery] = useState<string | null>(null)
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
        getSearchResults(query)

    }, [])

    const getSearchResults = async (name: string) => {

        try{
            console.log("Getting search results")

            // Get the search results
            const response = await axios.get(`/api/plants/search?name=${name}`)

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



        } catch (e) {

            // Set the results to an error div
            setResults([
                <div className={styles.errorContainer}>
                    <h1>Something went wrong</h1>
                    <p>Sorry, we couldnt find any plants with that name.</p>
                </div>
            ])

        }

    }

    return(
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Page header */}
            <Section>
                <PageHeader size={"medium"}>
                    <div className={styles.searchHeaderContainer}>

                        {/* Search Title */}
                        <h1>Search</h1>

                        {/* Search Stats */}
                        <div className={styles.statsContainer}>

                            {/* What the user searched for */}
                            <div className={styles.statContainer}>
                                <p> Query:  </p>
                                <p>{ query ? query : "None"}</p>
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
                </PageHeader>
            </Section>

            {/* Search box */}
            <Section autoPadding>
                <div className={styles.searchBoxContainer}>

                    {/* Search box */}
                    <input
                        type={"text"}
                        id={"searchBox"}
                        placeholder={"Search for a plant..."}
                        value={query ? query : "" }
                        className={styles.searchBox}
                        onChange={(e) => {
                            setQuery(e.target.value)
                        }}
                    />

                    {/* Search button */}
                    <button
                        className={styles.searchButton}
                        onClick={(e) => {
                            window.location.href = `/search?query=${document.getElementById("searchBox")?.value}`
                        }}>
                        <FontAwesomeIcon icon={faSearch}/>
                    </button>
                </div>

            </Section>

            {/* Search results */}
            <Section autoPadding>
                <div className={styles.searchResultsContainer}>
                    {results}

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