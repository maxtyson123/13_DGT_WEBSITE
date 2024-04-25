import styles from "@/styles/components/loading.module.css";
import Image from "next/image";
import React from "react";


interface LoadingProps {
    loadingMessage?: string;
    progressMessage: string;
}
export function Loading({loadingMessage = "Loading...", progressMessage}: LoadingProps){
    return(
        <div className={styles.loadingContainer}>
            <Image src={"/media/images/small_loading.gif"} alt={"Loading.."} width={100} height={100}/>
            <h1>{loadingMessage}</h1>
            <h2>{progressMessage}...</h2>
        </div>
    )
}