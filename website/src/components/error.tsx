import styles from "@/styles/error.module.css"
import React from "react";

interface ErrorProps{
    error: string;
}

export function Error({error}: ErrorProps){


    return(
        <>
            <div key={"error"} className={styles.errorContainer}>
                <h1>Something went wrong: </h1>
                <p>{error}</p>
            </div>
        </>
    )
}