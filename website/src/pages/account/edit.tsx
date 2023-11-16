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
import {ADMIN_USER_TYPE, EDITOR_USER_TYPE, MEMBER_USER_TYPE, RongoaUser, UserDatabaseDetails} from "@/lib/users";
import {globalStyles} from "@/lib/global_css";
import {useRouter} from "next/router";
import {Error} from "@/components/error";
import {FileInput, SmallInput, ValidationState} from "@/components/input_sections";
import {dateToString} from "@/lib/plant_data";
import {Loading} from "@/components/loading";
import {makeRequestWithToken} from "@/lib/api_tools";

export default function EditAccount() {
    const pageName = "Account";

    const { data: session, update } = useSession()

    const router = useRouter()

    // User data
    const [userName, setUserName] = React.useState<string>("")
    const [userEmail, setUserEmail] = React.useState<string>("")
    const [userRole, setUserRole] = React.useState<string>("")
    const [userImage, setUserImage] = React.useState<string>("")
    const [userLastLogin, setUserLastLogin] = React.useState<string>("")
    const [userLocalImage, setUserLocalImage] = React.useState<File | null>(null)

    // Data states
    const [validUserName, setValidUserName] = React.useState<[ValidationState, string]>(["normal", "no error"])
    const [validUserEmail, setValidUserEmail] = React.useState<[ValidationState, string]>(["normal", "no error"])
    const [validUserImage, setValidUserImage] = React.useState<[ValidationState, string]>(["normal", "no error"])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingMessage, setLoadingMessage] = React.useState<string>("")

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)
    const[error, setError] = useState<string>()

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
        switch (user.user_type){
            case MEMBER_USER_TYPE:
                setUserRole("Member")
                break

            case ADMIN_USER_TYPE:
                setUserRole("Admin")
                break

            case EDITOR_USER_TYPE:
                setUserRole("Editor")
                break
        }
        if(user.user_image != null && user.user_image != "undefined")
            setUserImage(user.user_image.replaceAll("s96-c", "s192-c"))
        setUserLastLogin(dateToString(new Date(user.user_last_login)))
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
                const response = await makeRequestWithToken("get","/api/user/email?email=" + userEmail)

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

        setLoading(true)

        const userID = (session?.user as RongoaUser).database.id.toString()

        // Upload the user image if there is one
        if(userLocalImage !== null) {

            setLoadingMessage("Uploading profile image...")

            // Create a new form data object and append the file to it
            const formData = new FormData();
            formData.append('file', userLocalImage);
            formData.append('id', userID);
            formData.append('path', 'users');

            try {
                // Send the form data to the server
                const response = await makeRequestWithToken('post', '/api/files/upload', formData);

                // Check if the file was uploaded successfully
                if (!response.data.error) {
                    console.log("File uploaded successfully")
                }

            } catch (error) {
                console.log('An error occurred.');
            }
        }

        setLoadingMessage("Updating user data...")

        // Update the user data
        try {

            let url = "/api/user/update?name=" + userName
                + "&email=" + userEmail
                + "&id=" + userID

            if(userLocalImage !== null) url += "&image=" + process.env.NEXT_PUBLIC_FTP_PUBLIC_URL + "/users/" + userID + "/" + userLocalImage?.name

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
                user_image: userLocalImage ? process.env.NEXT_PUBLIC_FTP_PUBLIC_URL + "/users/" + userID + "/" + userLocalImage?.name : (session?.user as RongoaUser).database.user_image,
                user_api_keys: (session?.user as RongoaUser).database.user_api_keys,
                user_type: (session?.user as RongoaUser).database.user_type,
                user_last_login: (session?.user as RongoaUser).database.user_last_login,
                user_restricted_access: (session?.user as RongoaUser).database.user_restricted_access

            }
        }).then(r => console.log(r))

        // Push the user back to the account page
        await router.push("/account")
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

                <Section autoPadding>
                    <div className={globalStyles.gridCentre}>
                        <div className={styles.accountContainer}>

                            <div className={styles.lastLogin}>
                                <p>  Last Login: {userLastLogin} </p>
                                <div>
                                    <button className={styles.updateButton} onClick={() => updateUserData()}>Update</button>
                                    <button className={styles.updateButton} onClick={() => router.push("/account")}>Cancel</button>
                                </div>
                            </div>

                            <div className={styles.mainInfo}>
                                <div className={styles.accountImageInput}>
                                    <FileInput
                                        placeHolder={"Enter your profile picture"}
                                        required={false}
                                        state={validUserImage[0]}
                                        errorText={validUserImage[1]}
                                        defaultValue={[userImage, "image"]}
                                        changeEventHandler={setUserLocalImage}
                                        size={[250,250]}
                                        styleClass={styles.accountImage}
                                    />
                                </div>
                                <SmallInput
                                    placeHolder={"Enter your nickname"}
                                    required={false}
                                    state={validUserName[0]}
                                    errorText={validUserName[1]}
                                    defaultValue={userName}
                                    changeEventHandler={setUserName}
                                />
                                <p className={styles.toolTip}> Click to Change</p>

                                <h2> {userEmail}</h2>
                                <h2> {userRole}</h2>
                            </div>
                        </div>
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
            {error && <>
                <br/>
                <br/>
                <br/>
                <br/>
                <Error error={error}/>
            </>
            }

            {/* Loading Message */}
            {loading && <Loading progressMessage={loadingMessage}/>}

            {/* Account Editor */}
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
