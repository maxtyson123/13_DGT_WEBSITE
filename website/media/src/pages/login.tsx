import styles from '@/styles/pages/login.module.css'
import {useEffect, useRef} from "react";
import axios from "axios";

export default function Login(){

    const dataFetch = useRef(false);

    useEffect(() => {

        // Check all the data has been fetched
        if(dataFetch.current)
            return

        // Fetch the data
        dataFetch.current = true;
        fetchData();

    }, []);

    const fetchData = async () => {

        // Fetch the data
        const response = await axios.get("/api/random")

        // Log the data
        console.log("Data:", response.data)

    }

    return(
        <>
            <div className={styles.container}>
                {/* Log In Circle Icon */}
                <div className={styles.cicrcles}>
                    <div className={styles.circle1}>
                        <div className={styles.dot + " " + styles.dot1}/>
                        <div className={styles.dot + " " + styles.dot2}/>
                        <div className={styles.dot + " " + styles.dot3}/>
                        <div className={styles.dot + " " + styles.dot4}/>
                        <div className={styles.circle2}>
                            <div className={styles.dot + " " + styles.dot1}/>
                            <div className={styles.dot + " " + styles.dot2}/>
                        </div>
                    </div>
                </div>

                {/* Text */}
                <h1> Lets Connect</h1>
                <h1> Together</h1>

                {/* Buttons */}
                <button> Log In</button>
                <button className={styles.signup}> Sign Up</button>

            </div>
        </>
    )
}