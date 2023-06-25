import styles from "@/styles/error.module.css"
import React from "react";

interface ErrorProps{
    error: string;
}

/**
 * Renders an Error component that displays an error message.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.error - The error message to be displayed.
 *
 * @returns {JSX.Element} - The JSX element representing the Error component.
 */
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