import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/notifications.module.css";
import React, {useEffect, useRef, useState} from "react";
import { Knock } from "@knocklabs/node";
import {makeRequestWithToken} from "@/lib/api_tools";
import { useSession } from "next-auth/react";
import {RongoaUser} from "@/lib/users";
import {NOTIFICATIONS} from "@/lib/constants";
import {useRouter} from "next/router";


export default function Page(){

    const {data: session} = useSession();

    const dataFetch = useRef(false);

    useEffect(() => {


    }, [session]);



    const router = useRouter();

    const openProfileChanger = () =>{

    }

    return(
        <Wrapper>
            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {
                        router.push("/media/profile")
                    }} className={styles.backButton}>
                        <img src={"/media/images/back.svg"} alt={"back"}/>
                    </button>

                    <h1>Settings</h1>

                </div>


                {/* Settings */}
                <div className={styles.notifications}>
                    <p> Last Login: {userLastLogin} </p>
                    <button onClick={openProfileChanger}>Profile Picture</button>
                    <h1>User Name</h1>
                    <h1>Log Out</h1>
                    <h1>Delete Account</h1>

                </div>

            </div>
        </Wrapper>
    )
}