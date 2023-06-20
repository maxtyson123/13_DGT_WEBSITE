import styles from "@/styles/plant_card.module.css"
import Link from "next/link";
import {fetchPlant, getNamesInPreference, ImageMetaData, PlantData} from "@/lib/plant_data";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";

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

    // Store all the images
    const images = data.attachments.filter((attachment) => attachment.type === "image")

    // Get a random image index
    const image_index = Math.floor(Math.random() * images.length)




    return(
        <>
            {/* Shadowed div that holds the card contents*/}
            <div className={styles.card}>

                {/* Image of the plant, grabbed from the image attachments of the pant data*/}
                <div className={styles.imageContainer}>
                    <Image
                         src={images[0] ? images[image_index].path : "/media/images/loading.gif"}
                         alt={images[0] ? (images[image_index].meta as ImageMetaData).name : "Loading"}
                         fill
                         style={{objectFit: "contain"}}
                    />
                </div>

                {/* Title, category, description*/}
                <h1 className={styles.title}>{names[0]}</h1>
                <h3 className={styles.category}>{names[1]} | {names[2]}</h3>
                <p className={styles.description}>{data.small_description}</p>

                {/* Button to go to the plant page, automatically gets the id from the plant data */}
                <Link scroll={false} className={styles.button} href={"/plants/" + data.id}>
                   <p>More Info</p>
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

        setCard();
    }, []);

    const setCard = async () => {

        const plantOBJ = await fetchPlant(id)

        if(!plantOBJ){
            setPlantCard(<PlantCardNull/>)
            return
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
                   <Image
                       src={"/media/images/loading.gif"}
                       alt={"Loading"}
                       fill
                       style={{objectFit: "contain"}}
                   />
                </div>

                {/* Title, category, description*/}
                <h1 className={styles.title}>       LOADING... </h1>
                <h3 className={styles.category}>    LOADING... </h3>
                <p className={styles.description}>  LOADING... </p>

                {/* Button to go to the plant page, automatically gets the id from the plant data */}
                <a className={styles.button} href={"#"}>
                    <p >More Info</p>
                </a>

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
                <a className={styles.button} href={"#"}>
                    <p >More Info</p>
                </a>

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

export function  convertUseTag(tag: string | undefined) {

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