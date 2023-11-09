import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import React, {useEffect, useRef, useState} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/account/index.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPerson} from "@fortawesome/free-solid-svg-icons";
import {signIn, useSession} from "next-auth/react";
import {RongoaUser, UserDatabaseDetails} from "@/lib/users";
import {globalStyles} from "@/lib/global_css";
import {useRouter} from "next/router";
import {Error} from "@/components/error";
import {FileInput, SmallInput, ValidationState} from "@/components/input_sections";
import axios from "axios";

export default function EditAccount() {
    const pageName = "Account";

    const { data: session } = useSession()

    const router = useRouter()

    // User data
    const [userName, setUserName] = React.useState<string>("")
    const [userEmail, setUserEmail] = React.useState<string>("")
    const [userImage, setUserImage] = React.useState<string>("")
    const [userLocalImage, setUserLocalImage] = React.useState<File | null>(null)

    // Data states
    const [validUserName, setValidUserName] = React.useState<[ValidationState, string]>(["normal", "no error"])
    const [validUserEmail, setValidUserEmail] = React.useState<[ValidationState, string]>(["normal", "no error"])
    const [validUserImage, setValidUserImage] = React.useState<[ValidationState, string]>(["normal", "no error"])

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)
    const[error, setError] = useState<string>("")

    useEffect(() => {


        if(session?.user) {

            let user = session.user as RongoaUser
            if(!user) return

            // Load the user data
            loadUserData(user.database)

            // Prevent the data from being fetched again
            if (dataFetch.current)
                return
            dataFetch.current = true

        }

    }, [session])

    const loadUserData = (user: UserDatabaseDetails) => {
        setUserName(user.user_name)
        setUserEmail(user.user_email)
        if(user.user_image != null || user.user_image != undefined) setUserImage(user.user_image)
    }

    const validateUserDetails = async () => {


        const user = session?.user as RongoaUser

        // Check if username changed
        if(userName !== user.database.user_name){

            // Check that there is a valid name
            if(userName.length < 3) {
                setValidUserName(["error", "Username must be at least 3 characters long"])
                return false
            }
        }

        // Username is valid
        setValidUserName(["success", "no error"])

        // Check if email changed
        if(userEmail !== user.database.user_email) {

            // Check that there is a valid email
            if (userEmail === "") {
                setValidUserEmail(["error", "Email cannot be empty"])
                return false
            }

            // Check if the email is in the correct format using regex
            let emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
            if (!emailRegex.test(userEmail)) {
                setValidUserEmail(["error", "Email is not valid"])
                return false
            }

            // Check that the email is not already in use
            try {
                const response = await axios.get("/api/user/email?email=" + userEmail)

                if (response.data.user) {
                    setValidUserEmail(["error", "Email is already in use"])
                    return false
                }

            } catch (e) {
                console.log(e)
            }

        }

        // Email is valid
        setValidUserEmail(["success", "no error"])

        // Check that there is a image being uploaded
        if(userLocalImage !== null) {

            console.log(userLocalImage)

            // Check that the image is a valid type
            if(!userLocalImage.type.includes("image/")) {
                setValidUserImage(["error", "Image must be a png or jpeg"])
                return false
            }

            // Check that the image is not too large
            if(userLocalImage.size > 1000000) {
                setValidUserImage(["error", "Image must be less than 1MB"])
                return false
            }
        }

        setValidUserImage(["success", "no error"])
        return true
    }

    const  updateUserData =  async () => {

        // Check that the user details are valid
        if(!await validateUserDetails())
            return

        const userID = (session?.user as RongoaUser).database.id.toString()

        // Upload the user image if there is one
        if(userLocalImage !== null) {

            // Create a new form data object and append the file to it
            const formData = new FormData();
            formData.append('file', userLocalImage);
            formData.append('id', userID);
            formData.append('path', 'users');

            try {
                // Send the form data to the server
                const response = await fetch('/api/files/upload', {
                    method: 'POST',
                    body: formData,
                });

                // If the response is ok then get the json data and set the image url
                if (response.ok) {
                    console.log('File uploaded successfully.');
                } else {
                    const data = await response.json();
                    console.log(data);
                }
            } catch (error) {
                console.log('An error occurred.');
            }
        }

        // Update the user data
        try {

            let url = "/api/user/update?name=" + userName
                + "&email=" + userEmail
                + "&id=" + userID

            if(userLocalImage !== null) url += "&image=" + process.env.NEXT_PUBLIC_FTP_PUBLIC_URL + "/users/" + userID + "/" + userLocalImage?.name

            const userData = await axios.get(url)
            console.log(userData)

        } catch (e) {
            console.log(e)
        }


    }

    const loginSection = () => {
        return (
            <>
                <div className={globalStyles.gridCentre}>
                    <button className={styles.signInButton} onClick={() => signIn()}><FontAwesomeIcon icon={faPerson}/> Sign in</button>
                </div>
            </>
        )
    }

    const editSection = () => {
        return (
            <>
                {/* Users Information */}
                <Section autoPadding>
                    <div className={styles.userDetailsContainer}>
                        <h1> Your Details </h1>

                        <div className={styles.userDetail}>
                            <h2>Username</h2>
                            <SmallInput
                                placeHolder={"Enter your nickname"}
                                required={true}
                                state={validUserName[0]}
                                errorText={validUserName[1]}
                                defaultValue={userName}
                                changeEventHandler={setUserName}
                            />
                        </div>

                        <div className={styles.userDetail}>
                            <h2>Email</h2>
                            <SmallInput
                                placeHolder={"Enter your email"}
                                required={true}
                                state={validUserEmail[0]}
                                errorText={validUserEmail[1]}
                                defaultValue={userEmail}
                                changeEventHandler={setUserEmail}
                            />
                        </div>

                        <div className={styles.userDetail}>
                            <h2>Profile Picture</h2>
                            <FileInput
                                placeHolder={"Enter your profile picture"}
                                required={true}
                                state={validUserImage[0]}
                                errorText={validUserImage[1]}
                                defaultValue={[userImage, "image"]}
                                changeEventHandler={setUserLocalImage}
                            />
                        </div>

                        <button className={styles.updateButton} onClick={() => updateUserData()}>Update</button>
                    </div>
                </Section>

            </>
        )
    }


    return(
        <>

            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>


            {/* Header for the page */}
            <Section>
                <PageHeader size={"small"}>
                    <div className={styles.welcomeContainer}>
                        <h1>Your Account</h1>
                    </div>
                </PageHeader>
            </Section>



            {/* Error Message */}
            {error && <Error error={error}/>}

            {!session?
                loginSection()
                :
                editSection()
            }


            {/* Footer */}
            <Section>
                <Footer/>
            </Section>
        </>

    )

}
