import styles from "@/styles/stats.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookMedical, faBowlFood, faSeedling, faTools} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {getFromCache, saveToCache} from "@/modules/cache";

export default function Stats(){


    // Store the values for the stats
    const [numberOfPlants, setNumberOfPlants] = useState(0)
    const [numberOfEdiblePlants, setNumberOfEdiblePlants] = useState(0)
    const [numberOfMedicalPlants, setNumberOfMedicalPlants] = useState(0)
    const [numberOfCraftPlants, setNumberOfCraftPlants] = useState(0)

    const startTime = Date.now()
    const [duration, setDuration] = useState(0);

    useEffect( () => {
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
                    res = await axios.get('/api/plants/uses');

                    // Get the contents of the response
                    res = res.data;

                    // Store in the cache
                    saveToCache("plant_stats", res)
                }

                // Set the duration it took to fetch the data
                setDuration(Date.now() - startTime);


                const data = res.data;

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

        fetchData();
    }, []);

    return(
        <>
            <div className={styles.statsSection}>
                <h1> Stats </h1>
                <p> Request time: {duration} ms </p>
                <div className={styles.statsRowContainer}>
                    <div className={styles.stat}>
                        <h2> {numberOfPlants} </h2>
                        <FontAwesomeIcon icon={faSeedling} className={styles.inline}/>
                        <p className={styles.inline}> Plants </p>
                    </div>

                    <div className={styles.stat}>
                        <h2> {numberOfEdiblePlants} </h2>
                        <FontAwesomeIcon icon={faBowlFood} className={styles.inline}/>
                        <p className={styles.inline}> Edible </p>
                    </div>

                    <div className={styles.stat}>
                        <h2> {numberOfMedicalPlants} </h2>
                        <FontAwesomeIcon icon={faBookMedical} className={styles.inline}/>
                        <p className={styles.inline}> Medical </p>
                    </div>

                    <div className={styles.stat}>
                        <h2> {numberOfCraftPlants} </h2>
                        <FontAwesomeIcon icon={faTools} className={styles.inline}/>
                        <p className={styles.inline}> Craft </p>
                    </div>
                </div>
            </div>

        </>
    )
}



