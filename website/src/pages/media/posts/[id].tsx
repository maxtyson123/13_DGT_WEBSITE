import Wrapper from "@/pages/media/components/wrapper";
import {Loading} from "@/components/loading";
import styles from "@/styles/media/new.module.css";
import {PlantSelector, SimpleTextArea, SmallInput} from "@/components/input_sections";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import {makeCachedRequest} from "@/lib/api_tools";
import {PostData} from "@/lib/plant_data";
import {getPostImage} from "@/lib/data";

export default function Page() {

    const router = useRouter();
    const [data, setData] = useState<PostData>()

    useEffect(() => {

        if(!router.query.id) return;
        fetchData(router.query.id as string);
    }, [router.query.id]);

    const fetchData = async (id: string) => {
        const response = await makeCachedRequest("post_data_" + id, `/api/posts/fetch?id=${id}&operation=data`);
        setData(response[0]);
    }


    return(
        <Wrapper>
            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {
                        window.history.back();
                    }} className={styles.backButton}>
                        <img src={"/media/images/back.svg"} alt={"back"}/>
                    </button>

                    <h1>{data?.post_title}</h1>

                </div>


                {/* Data */}
                <div className={styles.data}>

                    {/* Image */}
                    <div className={styles.image}>
                        <img src={getPostImage(data)} alt={"post"}/>
                    </div>

                    {/* Title */}
                    <div className={styles.title}>
                        <h1>{data?.post_title}</h1>
                    </div>

                    {/* Date */}
                    <div className={styles.date}>
                        <h2>{new Date(data?.post_date as string).toDateString()}</h2>
                    </div>

                    {/* TODO: Add details */}

                    {/* Description */}
                    <div className={styles.text}>
                        <p>{data?.post_description}</p>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}