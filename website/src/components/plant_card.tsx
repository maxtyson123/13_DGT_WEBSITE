import styles from "@/styles/plant_card.module.css"
import Link from "next/link";
import {PlantData} from "@/modules/plant_data";
import axios from "axios";
import {useEffect, useState} from "react";
import {getFromCache, saveToCache} from "@/modules/cache";

type PlantCardProps = {
    data: PlantData | null
};


export async function getLocalData(plantId: any) {
    // Get the path of the json file
    const filePath = "/data/plants/" + plantId + ".json";

    // Return the json data
    return await fetch(filePath).then((res) => res.json())
}

export default function PlantCardData({ data }: PlantCardProps){
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
                <h1 className={styles.title}>{data?.english_name}</h1>
                <h3 className={styles.category}>{convertUseTag(data?.location)}</h3>
                <p className={styles.description}>{data?.small_description}</p>

                {/* Button to go to the plant page, automatically gets the id from the plant data */}
                <Link scroll={false} className={styles.button} href={"/plants/" + data?.id}>
                   <p className={styles.button}>More Info</p>
                </Link>

                {/* Container for the tags*/}
                <div className={styles.tagsContainer}>

                    {/* Map through the tags and display them */}
                    {data?.use.map((useName, index) => (
                        <p key={index} className={styles.useText}>{
                            convertUseTag(useName)
                        }</p>
                    ))}
                </div>
            </div>
        </>
    )
}


type PlantCardApiProps = {
    id: number
};

export function PlantCardApi({id}: PlantCardApiProps) {

    const [plantData, setPlantData] = useState<PlantData | null>(null);
    const [plantCard, setPlantCard] = useState(<PlantCardLoading/>);

    useEffect(() => {
        fetchPlant();
    }, []);

    const fetchPlant = async () => {

        // Check if the plant data has already been fetched
        let plantOBJ = getFromCache("plant_" + id) as PlantData | null

        if(plantOBJ === null) {

            try {

                console.log("Fetching plant data from api")
                // Get the plant data from the api
                const res = await axios.get(`/api/plants/json?id=${id}&operation=download`);
                console.log(res)
                const plantData = res.data.data

                plantOBJ = plantData as PlantData
                plantOBJ.id = id

                console.log("Saving plant data to cache")
                console.log(plantOBJ)

                // Set the plant data in the cache
                saveToCache("plant_" + id, plantOBJ)


            } catch (e) {
                console.log("Error fetching plant data from api")
                setPlantData("error")
                setPlantCard(<PlantCardLoading/>)
                return;
            }
        }

        // Set the plant data
        setPlantData(plantOBJ)
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
            {/* Shadowed div that holds the card contents*/}
            <div className={styles.card + " animate-pulse"}>

                {/* Image of the plant, grabbed from the image attacments of the pant data (TODO) */}
               <div className={styles.imageContainer}>
                   <img
                        src={"/media/images/loading.gif"}
                        alt={"Loading..."}
                        className={styles.image}
                        style={{padding: 100}}  // Make the image smaller
                   />
                </div>

                {/* Title, category, description*/}
                <h1 className={styles.title}> LOADING... </h1>
                <h3 className={styles.category}> LOADING... </h3>
                <p className={styles.description}> LOADING... </p>

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