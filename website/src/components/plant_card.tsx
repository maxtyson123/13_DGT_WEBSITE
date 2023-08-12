import styles from "@/styles/components/plant_card.module.css"
import Link from "next/link";
import {fetchPlant, getNamesInPreference, ImageMetaData, PlantData} from "@/lib/plant_data";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {CreditedImage} from "@/components/credits";

// Define the props for the plant card and the types for the plant data
type PlantCardProps = {
    data: PlantData
};

/**
 * Displays the plant data in the plant card format, this is where there is a main image, plant name and description, a button to go to the plant page and then in the bottom there are the uses of the plant.
 *
 * @param {Object} props - Component props.
 * @param {PlantData} props.data - The plant data to display.
 *
 * @returns {JSX.Element} The rendered plant card component.
 */
export default function PlantCardData({ data }: PlantCardProps){

    const [names, setNames] = useState(["None", "None", "None"])
    const [mainImage, setMainImage] = useState("/media/images/loading.gif")
    const [mainImageAlt, setMainImageAlt] = useState("Loading")
    const [mainImageCredits, setMainImageCredits] = useState("None")

    // Run on page start
    useEffect(() => {

        // Update the names
        setNames(getNamesInPreference(data))

    }, [data])

    useEffect(() => {
        // Get all the attachments with image type
        let images = data?.attachments.filter((attachment) => attachment.type === "image")

        // Set the main image
        switch (data?.display_image){

            case "Default":
                setMainImage("/media/images/default_noImage.png")
                setMainImageAlt("Default Image")
                break;

            case "Random":
                // Get a random index and set the image
                if(images){
                    let image = images[Math.floor(Math.random() * images.length)]
                    setMainImage(image.path)
                    setMainImageAlt((image.meta as ImageMetaData).name)
                }
                break;

            default:
                // Find the image with the same name as the display image
                if(images){
                    let image = images.find((image) => (image.meta as ImageMetaData).name === data?.display_image)
                    if(!image){
                        break;
                    }
                    setMainImage(image.path)
                    setMainImageAlt((image.meta as ImageMetaData).name)
                    setMainImageCredits((image.meta as ImageMetaData).credits)
                }
                break;

        }
    }, [])


    return(
        <>
            {/* Shadowed div that holds the card contents*/}
            <div className={styles.card}>

                {/* Image of the plant, grabbed from the image attachments of the pant data*/}
                <div className={styles.imageContainer}>
                    <CreditedImage url={mainImage} alt={mainImageAlt} credits={mainImageCredits} colour={"white"}/>
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

/**
 * Fetches the plant data from the API and then renders the plant card with the data fetched. Whilst waiting a loading PlantCard is displayed and if the plant is not found a PlantCardNull is displayed.
 *
 * @param {Object} props - Component props.
 * @param {number} props.id - The id of the plant to fetch.
 *
 * @see {@link PlantCardData} - The plant card component.
 * @see {@link PlantCardLoading} - The loading plant card component.
 * @see {@link PlantCardNull} - The null plant card component.
 *
 * @returns {JSX.Element} The rendered plant card component.
 */
export function PlantCardApi({id}: PlantCardApiProps) {

    // Define the state for the plant data and the plant card
    const [plantCard, setPlantCard] = useState(<PlantCardLoading/>);

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    // Fetch the plant data from the api for this plant on load
    const setCard = async () => {

        const plantOBJ = await fetchPlant(id)

        if(!plantOBJ){
            setPlantCard(<PlantCardNull/>)
            return
        }

        // Set the plant data
        setPlantCard(<PlantCardData data={plantOBJ}/>)
    }

    useEffect(() => {

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        setCard().then(() => {console.log("Plant card set")}).catch((err) => {console.log(err)})
    }, [setCard]);

    return (
        <>
            {plantCard}
        </>
    );
}

/**
 * A plant card that is used as a placeholder whilst the plant data is being fetched.
 *
 * @see {@link PlantCardData} - The plant card component (this follows the same format).
 *
 * @returns {JSX.Element} The rendered plant card component.
 */
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

/**
 * A plant card that is used when there is no plant data to render.
 *
 * @see {@link PlantCardData} - The plant card component (this follows the same format).
 */
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

/**
 * Converts a tag from the API to a more readable format.
 *
 * @param tag {string | undefined} - The tag to convert.
 *
 * @returns {string} The converted tag.
 */
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