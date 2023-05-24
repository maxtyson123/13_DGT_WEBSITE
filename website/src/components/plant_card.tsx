import styles from "@/styles/plant_card.module.css"
import Link from "next/link";
import {getNamesInPreference, PlantData} from "@/modules/plant_data";
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import {getFromCache, saveToCache} from "@/modules/cache";

// Define the props for the plant card and the types for the plant data
type PlantCardProps = {
    data: PlantData
};

export default function PlantCardData({ data }: PlantCardProps){

    const [names, setNames] = useState(["None", "None", "None"])

    // Run on page start
    useEffect(() => {

        // Update the names
        setNames(getNamesInPreference(data))

    }, [])


    return(
        <>
            {/* Shadowed div that holds the card contents*/}
            <div className={styles.card}>

                {/* Image of the plant, grabbed from the image attacments of the pant data (TODO) */}
                <div className={styles.imageContainer}>
                    <img
                        src={"/media/images/plants/example_transparent.png"}
                        alt={"Loading..."}
                        className={styles.image}
                    />
                </div>

                {/* Title, category, description*/}
                <h1 className={styles.title}>{names[0]}</h1>
                <h3 className={styles.category}>{names[1]} | {names[2]}</h3>
                <p className={styles.description}>{data.small_description}</p>

                {/* Button to go to the plant page, automatically gets the id from the plant data */}
                <Link scroll={false} className={styles.button} href={"/plants/" + data.id}>
                   <p className={styles.button}>More Info</p>
                </Link>

                {/* Container for the tags*/}
                <div className={styles.tagsContainer}>

                    {/* Map through the tags and display them */}
                    {data.use.map((useName, index) => (
                        <p key={index} className={styles.useText}>{
                            convertUseTag(useName)
                        }</p>
                    ))}
                </div>
            </div>
        </>
    )
}

// Define the props for the plant card and their types
type PlantCardApiProps = {
    id: number
};

export function PlantCardApi({id}: PlantCardApiProps) {

    // Define the state for the plant data and the plant card
    const [plantCard, setPlantCard] = useState(<PlantCardLoading/>);

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    // Fetch the plant data from the api for this plant on load
    useEffect(() => {

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        fetchPlant();
    }, []);

    const fetchPlant = async () => {

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
                plantOBJ.id = id

                // Set the plant data in the cache
                saveToCache("plant_" + id, plantOBJ)


            } catch (e) {

                // If there is an error just log it and set the plant card to the loading card
                console.log("Error fetching plant data from api")
                setPlantCard(<PlantCardNull/>)

                //TODO: Should probably do smth abt this but so far no incorrect ids should b passed in because only its only called using data returned from the api
                return;
            }
        }

        // Set the plant data
        setPlantCard(<PlantCardData data={plantOBJ}/>)
    }

    return (
        <>
            {plantCard}
        </>
    );
}

export function PlantCardLoading(){
    return(
        <>
            {/* Shadowed div that holds the card contents, add a pulse effect*/}
            <div className={styles.card + " animate-pulse"}>

              {/* Placeholder loading gif */}
               <div className={styles.imageContainer}>
                   <img
                        src={"/media/images/loading.gif"}
                        alt={"Loading..."}
                        className={styles.image}
                        style={{padding: 100}}  // Make the image smaller
                   />
                </div>

                {/* Title, category, description*/}
                <h1 className={styles.title}>       LOADING... </h1>
                <h3 className={styles.category}>    LOADING... </h3>
                <p className={styles.description}>  LOADING... </p>

                {/* Button to go to the plant page, automatically gets the id from the plant data */}
                <Link scroll={false} className={styles.button} href={"#"}>
                    <p className={styles.button}>More Info</p>
                </Link>

                {/* Container for the tags*/}
                <div className={styles.tagsContainer}>
                    <p className={styles.useText}> TAG </p>
                    <p className={styles.useText}> TAG </p>
                    <p className={styles.useText}> TAG </p>
                </div>
            </div>
        </>
    )
}

export function PlantCardNull(){
    return(
        <>
            {/* Shadowed div that holds the card contents, add a pulse effect*/}
            <div className={styles.card + " opacity-60"}>
                {/* Placeholder loading gif */}
                <div className={styles.imageContainer}>
                   <div className={styles.nullImage}/>
                </div>

                {/* Title, category, description*/}
                <h1 className={styles.title}> None </h1>
                <h3 className={styles.category}> N/A </h3>
                <p className={styles.description}> Short description</p>

                {/* Button to go to the plant page, automatically gets the id from the plant data */}
                <Link scroll={false} className={styles.button} href={"#"}>
                    <p className={styles.button}>More Info</p>
                </Link>

                {/* Container for the tags*/}
                <div className={styles.tagsContainer}>
                    <p className={styles.useText}> TAG </p>
                    <p className={styles.useText}> TAG </p>
                    <p className={styles.useText}> TAG </p>
                </div>
            </div>
        </>
    )
}

function convertUseTag(tag: string | undefined) {

    // If the tag is undefined, return an empty string
    if (tag === undefined) {
        return "";
    }

    // Get the first letter and capitalize it
    const firstLetter = tag.charAt(0).toUpperCase();

    // Combine the first letter with the rest of the word
    const restOfWord = tag.slice(1);
    let word = firstLetter + restOfWord;

    // Remove the underscore and replace with a space
    word = word.replace("_", " ");

    return word;
}