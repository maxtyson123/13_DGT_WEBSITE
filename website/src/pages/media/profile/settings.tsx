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
    const [loading, setLoading] = useState(false);




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

    const uploadProfilePicture = async (file: File)  => {

        return true
    }

    const uploadName = async (name: string)  => {
        return true
    }

    const submit = async () => {

        setLoading(true)

        if(changeProfilePicture){
            const file = (document.getElementById("file") as HTMLInputElement).files?.[0]
            if(file){
                await uploadProfilePicture(file)
            }
        }else{
            const name = (document.querySelector("input") as HTMLInputElement).value
            await uploadName(name)
        }

        setLoading(false)

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

                        { loading ?
                            <div className={styles.loading}>
                                <h1>
                                    Loading...
                                </h1>
                            </div>
                            : <>
                            { changeProfilePicture &&
                                <div>
                                    <h1>Change Profile Picture</h1>
                                    <input id={"file"} type={"file"} title="Upload File"/>
                                    <label htmlFor="file">Upload File</label>
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
                        </> }



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