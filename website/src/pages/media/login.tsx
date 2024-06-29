import styles from '@/styles/media/login.module.css'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Wrapper from "@/pages/media/components/wrapper";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";

export default function Login(){

    const router = useRouter();

    const publicKey = "fhyw5m5ft21sxmtchpvoqp6sak19q7ahocphds90"

    const dataFetch = useRef(false);
    const [icons, setIcons] = useState<any[]>([])

    const { data: session } = useSession();

    useEffect(() => {

        // Check all the data has been fetched
        if(dataFetch.current)
            return

        // Fetch the data
        dataFetch.current = true;
        fetchData();

    }, []);


    // Check if the user already logged in
    useEffect(() => {
        if(session?.user){
            router.push("/media")
        }
    }, [session])

    const fetchData = async () => {

        // Get the random user
        const response = await axios.get("/api/auth/random?amount=4&api_key=" + publicKey)


        // TODO IF FAILS

        let idString = ""
        for(let i = 0; i < response.data.data.length; i++){
            idString += ("id=" + response.data.data[i].id)
            if(i != response.data.data.length - 1)
                idString += "&"
        }

        // Get the icons
        const userData = await axios.get("/api/user/data?" + idString + "&api_key=" + publicKey)
        // TODO IF FAILS

        // Turn into a list of icons
        let icons = []
        for(let i = 0; i < userData.data.raw.length; i++){
            if(userData.data.raw[i].user_image == "undefined")
                icons.push("/media/images/logo.svg")
            else
                icons.push(userData.data.raw[i].user_image)

        }

        console.log("Icons", icons)
        setIcons(icons)

    }

    return(
        <>
            <Wrapper login>
                <div className={styles.container}>
                    {/* Log In Circle Icon */}
                    <div className={styles.cicrcles}>
                        <div className={styles.circle1}>
                            <div className={styles.dot + " " + styles.dot1}><img src={icons[0]}/></div>
                            <div className={styles.dot + " " + styles.dot2}><img src={icons[1]}/></div>
                            <div className={styles.dot + " " + styles.dot3}><img src={icons[2]}/></div>
                            <div className={styles.dot + " " + styles.dot4}><img src={icons[3]}/></div>
                            <div className={styles.circle2}>
                                <div className={styles.smallDot + " " + styles.dot1}/>
                                <div className={styles.smallDot + " " + styles.dot2}/>
                            </div>
                        </div>
                    </div>

                    {/* Text */}
                    <h1> Lets Connect</h1>
                    <h1> Together</h1>

                    {/* Buttons */}
                    <div className={styles.buttons}>
                        <button onClick={() => signIn()}> Log In</button>
                        <button className={styles.signup} onClick={() => signIn()}> Sign Up</button>
                    </div>
                </div>
            </Wrapper>
        </>
    )
}