import styles from "@/styles/components/postfeed.module.css";
import Link from "next/link";
import {getFilePath} from "@/lib/data";
import {useEffect, useState} from "react";
import {makeCachedRequest} from "@/lib/api_tools";
import {ADMIN_USER_TYPE, EDITOR_USER_TYPE, MEMBER_USER_TYPE} from "@/lib/users";
import {getNamesInPreference, macronCodeToChar, numberDictionary} from "@/lib/plant_data";
import {InfiniteLoading} from "@/components/infinteLoading";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Image from "next/image";

interface PostCardProps {
    post_title: string,
    post_image: string,
    post_user_id: number,
    post_plant_id: number,
    post_date: string,
    id: number,
}

export function PostFeedCard(props: PostCardProps) {

    const [plantName, setPlantName] = useState<string>("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        // Get the plant information
        const plants = await makeCachedRequest('plants_names_all', '/api/plants/search?getNames=true&getUnpublished=true');
        const plant = plants.find((plant: any) => plant.id === props.post_plant_id);
        if(plant != null) {
            let name = macronCodeToChar(getNamesInPreference(plant)[0], numberDictionary);

            // Check if the name is too long
            if(name.length > 15) {
                name = name.substring(0, 15) + "..";
            }

            setPlantName(name);
        }

    }

    return (
        <div onClick={
            () => {
                window.location.href = `/plants/${props.post_plant_id}`;
            }
        } className={styles.postCard}>
            <Image fill src={getFilePath(props.post_user_id, props.id, props.post_image)} alt={props.post_title}/>
            <div className={styles.postCardText}>
                <h1>{props.post_title}</h1>
                <p>{plantName}</p>
            </div>
        </div>
    )
}

export default function PostFeed() {
    const queryClient = new QueryClient()

    return (
        <>
            <div className={styles.postFeed}>
                <div className={styles.postFeedHeader}>
                    <h1>Post Feed</h1>
                </div>
                <div className={styles.postGrid}>
                    <QueryClientProvider client={queryClient}>
                       <InfiniteLoading
                           searchQuery={"/api/posts/fetch?operation=siteFeed"}
                           display={"PostFeedCard"}
                       />
                    </QueryClientProvider>
                </div>
            </div>
        </>
    )
}