import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/notifications.module.css";
import React, {useEffect, useRef, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {signOut, useSession} from "next-auth/react";
import {RongoaUser} from "@/lib/users";
import {useRouter} from "next/router";
import {UserCard} from "@/pages/media/components/cards";


export default function Page(){

    const {data: session} = useSession();


    const [changeProfilePicture, setChangeProfilePicture] = useState(false);
    const [changeName, setChangeName] = useState(false);

    const dataFetch = useRef(false);

    useEffect(() => {


    }, [session]);



    const router = useRouter();

    const signOutUser = async () => {

        // Clear the cache
        sessionStorage.clear()
        await signOut({callbackUrl: "/media/login"})
    }

    const deleteAccount = async () => {
        await makeRequestWithToken("get","/api/user/delete/")
        await signOutUser()
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

                {/* Change Info Popup */}
                { (changeProfilePicture || changeName) &&
                <div className={styles.changeInfoPopup}>
                    <div className={styles.changeInfoPopupContent}>
                        { changeProfilePicture &&
                        <div>
                            <h1>Change Profile Picture</h1>
                            <input type={"file"}/>
                            <button>Submit</button>
                        </div>
                        }

                        { changeName &&
                        <div>
                            <h1>Change Name</h1>
                            <input type={"text"}/>
                            <button>Submit</button>
                        </div>
                        }

                        <button onClick={() => {
                            setChangeProfilePicture(false)
                            setChangeName(false)
                        }}>Cancel</button>

                    </div>
                </div>
                }

                {/* Settings */}
                <div className={styles.settings}>

                    { session?.user &&

                        <>
                            <UserCard id={(session?.user as RongoaUser).database.id}/>
                            <p> Last Login: {new Date((session?.user as RongoaUser).database.user_last_login).toLocaleString()} </p>

                        </>

                    }

                    <div className={styles.divider}></div>

                    <button onClick={() => { setChangeProfilePicture(true) }}>Change Profile Picture</button>
                    <button onClick={() => { setChangeName(true) }}>Change Name</button>

                    <div className={styles.divider}></div>

                    <button onClick={signOutUser}>Log Out</button>
                    <button onClick={deleteAccount} className={styles.redButton}>Delete Account</button>
                </div>

            </div>
        </Wrapper>
    )
}