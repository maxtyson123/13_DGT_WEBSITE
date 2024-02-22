'use client'

import {useInfiniteQuery} from "@tanstack/react-query";
import styles from "@/styles/components/infiniteloading.module.css"
import {PlantCardApi} from "@/components/plant_card";
import React, {useEffect, useRef, useState} from "react";
import {useIntersection} from "@mantine/hooks";
import {makeRequestWithToken} from "@/lib/api_tools";

interface InfiniteLoadingProps {
    searchQuery: string
}

export function InfiniteLoading({searchQuery} : InfiniteLoadingProps) {
    const [allLoaded, setAllLoaded] = useState(false)
    const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
       ['plants'],
        async ({pageParam = 1}) => {
           console.log("Fetching page " + pageParam + " of " + searchQuery)
                    const data = await makeRequestWithToken("get", `${searchQuery}&page=${pageParam}`)
                    return data.data;
        },
        {
            getNextPageParam: (_, pages) => {
                return pages.length + 1;
            },
        }
    );

    useEffect(() => {

        // Check if there is no data for this page this means the end of the results has been reached
        if (data?.pages.length === 0)
            return

        if(data?.pages[data?.pages.length - 1].data.length === 0)
            setAllLoaded(true)

    }, [data])


    const lastPostRef = useRef<HTMLElement>(null);
    const {ref, entry} = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    })

    useEffect(() => {
        if(entry?.isIntersecting){
            fetchNextPage()
        }
    }, [entry])

    const plants = data?.pages.flatMap(page => page.data)

    return (
        <>
            <div className={styles.plantCardContainer}>
                {plants?.map((plant: any, index) => (
                    <div key={plant.id} ref={index === plants.length - 1 ? ref : null}>
                        <PlantCardApi id={plant.id} />
                    </div>
                ))}

            </div>
            <div className={"gridCentre"}>
                <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage || allLoaded} className={styles.loadMore}>
                    {isFetchingNextPage
                        ? 'Loading more...'
                        : allLoaded
                            ? 'No more results'
                            : 'Load More'
                    }
                </button>
            </div>
        </>
    )
};