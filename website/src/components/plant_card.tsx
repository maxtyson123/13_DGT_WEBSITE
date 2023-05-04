import styles from "@/styles/plant_card.module.css"
import Image from "next/image";

type PlantCardProps = {
    data: PlantData | null
};

// Define the data for the plant
export interface PlantData {
    english_name: string;
    use: string[];
    small_description: string;

    // Add other fields here
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
            <div className={styles.card}>
                <Image
                    src={"/media/images/plants/example_transparent.png"}
                    alt={"Test Image"}
                    width={250}
                    height={250}
                    className={styles.image}
                />
                <h1 className={styles.title}>{data?.english_name}</h1>
                <h3 className={styles.category}>{data?.use[0].charAt(0).toUpperCase() + data?.use[0].slice(1)}</h3>
                <p className={styles.description}>{data?.small_description}</p>
            </div>
        </>
    )
}