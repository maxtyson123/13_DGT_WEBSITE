import styles from "@/styles/components/stats.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookMedical, faBowlFood, faSeedling, faTools} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import {getFromCache, saveToCache} from "@/lib/cache";
import axios from "axios";
import {useRouter} from "next/router";
import {makeRequestWithToken} from "@/lib/api_tools";

/**
 * Stats component. Shows the number of plants in the database, and the number of plants for each use.
 *
 * @returns {JSX.Element} The rendered stats component.
 */
export default function Stats(){


    // Store the values for the stats
    const [numberOfPlants, setNumberOfPlants] = useState(0)
    const [numberOfEdiblePlants, setNumberOfEdiblePlants] = useState(0)
    const [numberOfMedicalPlants, setNumberOfMedicalPlants] = useState(0)
    const [numberOfCraftPlants, setNumberOfCraftPlants] = useState(0)

    // Store the start time of the request
    const startTime = Date.now()
    const [duration, setDuration] = useState(0);

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    // Page routing
    const router = useRouter()

    async function fetchData() {
        try {

            let res = null;

            const storedData = getFromCache("plant_stats");

            // Check if the data is already in the session storage (this is to prevent the data from being fetched multiple times)
            if (storedData !== null) {
                // Get the data from the session storage
                res = storedData;

            }else{

                // Get the data from the API
                res = await makeRequestWithToken("get", "/api/plants/uses")

                // Get the contents of the response
                res = res.data;

                // Store in the cache
                saveToCache("plant_stats", res)
            }

            // Set the duration it took to fetch the data
            setDuration(Date.now() - startTime);


            const data = res.data;

            // Variables to store the number of plants for each use
            let plants = 0;
            let edible = 0;
            let medical = 0;
            let craft = 0;

            for (let key in data) {

                // Update the number of plants
                plants += 1;

                // Update the number of plants for each use
                for (let i = 0; i < data[key].length; i++) {
                    switch (data[key][i]) {
                        case "craft":
                            craft += 1
                            break
                        case "medical":
                            medical += 1
                            break
                        case "edible":
                            edible += 1
                            break

                    }
                }
            }

            // Set the stats
            setNumberOfPlants(plants)
            setNumberOfEdiblePlants(edible)
            setNumberOfMedicalPlants(medical)
            setNumberOfCraftPlants(craft)

        } catch (err) {
            console.log(err);
        }

    }

    useEffect( () => {

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        fetchData().then();
    }, []);

    const goToIndex = (filter: string) => {
        router.push("/plants/plant_index?filter=" + filter)
    }


    return(
        <>
            <div className={styles.statsSection}>
                {/* Title and time */}
                <h1> Stats </h1>
                <p> Request time: {duration} ms </p>

                {/* Put the stats in a row */}
                <div className={styles.statsRowContainer}>

                    {/* Each stat is a div with the number central and the icon and value inline */}
                    <div className={styles.stat} onClick={() => {goToIndex("plants")}}>
                        <h2> {numberOfPlants} </h2>
                        <FontAwesomeIcon icon={faSeedling} className={styles.inline}/>
                        <p className={styles.inline}> Plants </p>
                    </div>

                    {/* Each stat is a div with the number central and the icon and value inline */}
                    <div className={styles.stat} onClick={() => {goToIndex("edible")}}>
                        <h2> {numberOfEdiblePlants} </h2>
                        <FontAwesomeIcon icon={faBowlFood} className={styles.inline}/>
                        <p className={styles.inline}> Edible </p>
                    </div>

                    {/* Each stat is a div with the number central and the icon and value inline */}
                    <div className={styles.stat} onClick={() => {goToIndex("medical")}}>
                        <h2> {numberOfMedicalPlants} </h2>
                        <FontAwesomeIcon icon={faBookMedical} className={styles.inline}/>
                        <p className={styles.inline}> Medical </p>
                    </div>

                    {/* Each stat is a div with the number central and the icon and value inline */}
                    <div className={styles.stat} onClick={() => {goToIndex("craft")}}>
                        <h2> {numberOfCraftPlants} </h2>
                        <FontAwesomeIcon icon={faTools} className={styles.inline}/>
                        <p className={styles.inline}> Craft </p>
                    </div>
                </div>
            </div>

        </>
    )
}



