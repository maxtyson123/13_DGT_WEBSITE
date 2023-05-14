import styles from "@/styles/plant_card.module.css"
import Image from "next/image";
import Link from "next/link";
import {number} from "prop-types";

type PlantCardProps = {
    data: PlantData | null
};

// Define the data for the plant
export interface PlantData {
    id: number;
    preferred_name: string;
    english_name: string;
    moari_name: string;
    latin_name: string;
    use: string[];
    months_ready_for_use: {
        event: string,
        start_month: string,
        end_month: string,
    }[];
    location: string;
    small_description: string;
    long_description: string;
    attachments: {
        path: string;
        type: string;
        name: string;
        downloadable: boolean;
        flags: string[];
    }[];
    sections: any[];
}


export async function getLocalData(plantId: any) {
    // Get the path of the json file
    const filePath = "/data/plants/" + plantId + ".json";

    // Return the json data
    return await fetch(filePath).then((res) => res.json())
}

export default function PlantCard({ data }: PlantCardProps){
    return(
        <>
            {/* Shadowed div that holds the card contents*/}
            <div className={styles.card}>

                {/* Image of the plant, grabbed from the image attacments of the pant data (TODO) */}
                <Image
                    src={"/media/images/plants/example_transparent.png"}
                    alt={data?.english_name + " Header Image "}
                    width={400}
                    height={400}
                    className={styles.image}
                />

                {/* Title, category, description*/}
                <h1 className={styles.title}>{data?.english_name}</h1>
                <h3 className={styles.category}>{convertUseTag(data?.use[0])}</h3>
                <p className={styles.description}>{data?.small_description}</p>

                {/* Button to go to the plant page, automatically gets the id from the plant data */}
                <Link scroll={false} className={styles.button} href={"/plant/" + data?.id}>
                   <p className={styles.button}>More Info</p>
                </Link>

                {/* Container for the tags*/}
                <div className={styles.tagsContainer}>

                    {/* Map through the tags and display them */}
                    {data?.use.map((useItem, index) => (
                        <p key={index} className={styles.useText}>{
                            convertUseTag(useItem)
                        }</p>
                    ))}
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