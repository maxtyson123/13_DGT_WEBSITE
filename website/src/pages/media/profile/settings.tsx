import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/notifications.module.css";
import React, {useEffect, useRef, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {signOut, useSession, } from "next-auth/react";
import {RongoaUser} from "@/lib/users";
import {useRouter} from "next/router";
import {UserCard} from "@/pages/media/components/cards";


export default function Page(){

    const {data: session, update} = useSession();


    const [changeProfilePicture, setChangeProfilePicture] = useState(false);
    const [changeName, setChangeName] = useState(false);
    const [loading, setLoading] = useState(false);

    const [userName, setUserName] = useState("")
    const [fileUploaded, setFileUploaded] = useState(false)
    const [profilePicture, setProfilePicture] = useState<any>(null)


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
        setLoading(true)

        // Check if the file is empty
        if(!file){
            setLoading(false)
            return false
        }

        // Get the details
        const userID = (session?.user as RongoaUser).database.id.toString()
        const userEmail = (session?.user as RongoaUser).database.user_email
        const userName = (session?.user as RongoaUser).database.user_name

        // Create a new form data object and append the file to it
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', "ignore");
        formData.append('path', 'users/' + userID  +  '/profile');

        try {
            // Send the form data to the server
            console.log("Uploading file")
            const response = await makeRequestWithToken('post', '/api/files/upload', formData);

            // Check if the file was uploaded successfully
            if (!response.data.error) {
                console.log("File uploaded successfully")
            }

        } catch (error) {
            console.log('An error occurred.');
        }

        // Update the user data
        try {

            let url = "/api/user/update?name=" + userName
                + "&email=" + userEmail
                + "&id=" + userID

            url += "&image=" + process.env.NEXT_PUBLIC_FTP_PUBLIC_URL + "/users/" + userID + "/profile/" + file?.name

            const userData = await makeRequestWithToken("put", url)
            console.log(userData)
            console.log(url)
            console.log("User data updated")

        } catch (e) {
            console.log(e)
        }

        console.log("User data updated")

        // update the session
        await update({
            database: {
                id: (session?.user as RongoaUser).database.id,
                user_name: userName,
                user_email: userEmail,
                user_image: process.env.NEXT_PUBLIC_FTP_PUBLIC_URL + "/users/" + userID + "/profile/" + file?.name,
                user_type: (session?.user as RongoaUser).database.user_type,
                user_last_login: (session?.user as RongoaUser).database.user_last_login,
                user_restricted_access: (session?.user as RongoaUser).database.user_restricted_access

            }
        }).then(r => console.log(r))

        // Push the user back to the account page
        // Push the user back to the account page
        await router.push("/media/profile")

        return true
    }

    const uploadName = async (name: string)  => {
        setLoading(true)

        // Check if the name is empty or the same or less than 3 characters
        if(name.length < 3 || name == (session?.user as RongoaUser).database.user_name){
            setLoading(false)
            return false
        }

        // Get the details
        const userID = (session?.user as RongoaUser).database.id.toString()
        const userEmail = (session?.user as RongoaUser).database.user_email

        // Update the user data
        try {

            let url = "/api/user/update?name=" + userName
                + "&email=" + userEmail
                + "&id=" + userID

            const userData = await makeRequestWithToken("put", url)
            console.log(userData)
            console.log(url)
            console.log("User data updated")

        } catch (e) {
            console.log(e)
        }

        console.log("User data updated")

        // update the session
        await update({
            database: {
                id: (session?.user as RongoaUser).database.id,
                user_name: userName,
                user_email: userEmail,
                user_image: (session?.user as RongoaUser).database.user_image,
                user_type: (session?.user as RongoaUser).database.user_type,
                user_last_login: (session?.user as RongoaUser).database.user_last_login,
                user_restricted_access: (session?.user as RongoaUser).database.user_restricted_access

            }
        }).then(r => console.log(r))

        // Push the user back to the account page
        await router.push("/media/profile")

        return true
    }

    const submit = async () => {



        if(changeProfilePicture){
            const file = (document.getElementById("file") as HTMLInputElement).files?.[0]
            if(file){
                await uploadProfilePicture(file)
            }
        }else{
            const name = (document.querySelector("input") as HTMLInputElement).value
            await uploadName(name)
        }



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
                                    <input
                                        id={"file"}
                                        type={"file"}
                                        title="Upload File"
                                        accept="image/*"
                                        disabled={fileUploaded}
                                        onChange={(e) => {
                                            setFileUploaded(true)
                                            setProfilePicture((e.target as HTMLInputElement).files?.[0])
                                        }}
                                    />
                                    <label htmlFor="file">{fileUploaded ? "Uploaded" : "Upload File"}</label>
                                    <button onClick={() =>{
                                        uploadProfilePicture(profilePicture)
                                    }}>Submit</button>
                                </div>
                            }

                            { changeName &&
                                <div>
                                    <h1>Change Name</h1>
                                    <input
                                        type={"text"}
                                        defaultValue={(session?.user as RongoaUser).database.user_name}
                                        onChange={(e) => {
                                            setUserName(e.target.value)
                                        }}
                                    />
                                    <button onClick={() => {
                                        uploadName(userName)
                                    }}>Submit</button>
                                </div>
                            }

                            <button onClick={() => {
                                setChangeProfilePicture(false)
                                setChangeName(false)
                            }}>Cancel</button>
                        </>
                    }

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