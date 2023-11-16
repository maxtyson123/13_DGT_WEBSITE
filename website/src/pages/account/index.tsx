import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import React, {useEffect, useRef, useState} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/account/index.module.css"
import statsStyles from "@/styles/components/stats.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera, faPerson, faSeedling} from "@fortawesome/free-solid-svg-icons";
import {signIn, signOut, useSession} from "next-auth/react";
import {
    ADMIN_USER_TYPE,
    checkUserPermissions,
    EDITOR_USER_TYPE,
    getUserPermissions,
    MEMBER_USER_TYPE,
    RongoaUser,
    UserDatabaseDetails
} from "@/lib/users";
import Image from "next/image";
import {globalStyles} from "@/lib/global_css";
import {DropdownSection} from "@/components/dropdown_section";
import {useRouter} from "next/router";
import Link from "next/link";
import {dateToString, getNamesInPreference, macronCodeToChar, numberDictionary, PlantData} from "@/lib/plant_data";
import {Error} from "@/components/error";
import {makeRequestWithToken} from "@/lib/api_tools";

export default function Account() {

    return(
        <AccountPage dataID={"0"}/>
    )

}

interface AccountPageProps {
    dataID: string | string[]
}

export function AccountPage({dataID}: AccountPageProps){
    const pageName = "Account";

    const { data: session } = useSession()

    const router = useRouter()

    // User data
    const [userName, setUserName] = React.useState<string>("")
    const [userEmail, setUserEmail] = React.useState<string>("")
    const [userRole, setUserRole] = React.useState<string>("")
    const [userImage, setUserImage] = React.useState<string>("")
    const [userLastLogin, setUserLastLogin] = React.useState<string>("")
    const [userPlants, setUserPlants] = React.useState<string>("")
    const [userPosts, setUserPosts] = React.useState<string>("")
    const [userPlantsData, setUserPlantsData] = React.useState([])
    const [userID, setUserID] = React.useState<number>(0)


    // States
    const [editor, setEditor] = React.useState<boolean>(false)
    const [myAccount, setMyAccount] = React.useState<boolean>(false)
    const [hidePrivate, setHidePrivate] = React.useState<boolean>(true)

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef("-1")
    const[error, setError] = useState<string>("")

    useEffect(() => {

        // If there is a user id
        if(dataID){

            // Check if it is to be used
            if(dataID != "0"){

                if(!checkUserPermissions(session?.user as RongoaUser, "pages:account:publicAccess"))
                    setError("You must be logged in to view other users")

                // Try converting the id to a number
                let localId = parseInt(dataID as string)

                // If it is not a number then there is a problem
                if(isNaN(localId)){
                    console.log("Not a number")
                    return
                }

                // Set the user id
                setUserID(localId)
                setMyAccount(false)

                // Check if we are allowed to show private data
                if(session?.user) {
                    setHidePrivate(!checkUserPermissions(session.user as RongoaUser, "data:account:viewPrivateDetails"))
                }

                // Prevent the data from being fetched again
                if (dataFetch.current == dataID)
                    return
                dataFetch.current = dataID as string

                fetchData(localId)
                return;
            }
        }

        if(session?.user) {

            // Not viewing a user so we are viewing our own account

            // This is our account
            setMyAccount(true)
            setHidePrivate(false)

            let user = session.user as RongoaUser
            if(!user) return

            // Log their permissions
            console.log("User permissions: ")
            console.log(getUserPermissions(user))

            // Load the user data
            loadUserData(user.database)

            // Prevent the data from being fetched again
            if (dataFetch.current == dataID)
                return
            dataFetch.current = dataID as string

            // Get the users data
            fetchData()

        }

    }, [session, dataID])


    const loadUserData = (user: UserDatabaseDetails) => {

        setUserName(user.user_name)
        setUserEmail(user.user_email)
        switch (user.user_type){
            case MEMBER_USER_TYPE:
                setUserRole("Member")
                break

            case ADMIN_USER_TYPE:
                setUserRole("Admin")
                setEditor(true)
                break

            case EDITOR_USER_TYPE:
                setUserRole("Editor")
                setEditor(true)
                break
        }

        // Set the user image
        if(user.user_image != null && user.user_image != "undefined")
            setUserImage(user.user_image)
        else
            setUserImage("")

        setUserLastLogin(dateToString(user.user_last_login))
        setUserPosts("0")
    }


    const fetchData = async (localId: number = 0) => {

        console.log("Fetching data")

        // If we are viewing a user then we need to get their data
        if(localId != 0) {
            try {

                const user = await makeRequestWithToken("get", "/api/user/data?id=" + localId)
                if(user.data.error){
                    setError("User not found")
                }
                loadUserData(user.data.user)

                // Override the editor state
                setEditor(false)

            } catch (e) {
                console.log(e)
                setError("User not found")
            }
        }


        // Get the users plants
        try {
            let url = "/api/user/plants"

            if(localId != 0) {
                url += "?id=" + localId
            }

            const plants = await makeRequestWithToken("get",url)
            if(!plants.data.error){
                setUserPlants(plants.data.data.length.toString())
            }
            setUserPlantsData(plants.data.data)
        } catch (e) {

            // User has no plants
            console.log(e)
            setUserPlants("0")
        }
    }

    const signOutUser = async () => {
        await signOut({callbackUrl: "/"})
    }

    const deleteAccount = async () => {
        await makeRequestWithToken("get","/api/user/delete/")
        await signOutUser()
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

    const accountSection = () => {
        return (
            <>
                {/* Users Information */}
                <Section autoPadding>
                    <div className={globalStyles.gridCentre} key={dataID as string}>
                        <div className={styles.accountContainer}>

                            <div className={styles.lastLogin}>
                                { !hidePrivate &&
                                    <>
                                        <p>  Last Login: {userLastLogin} </p>
                                        <Link href={"/account/edit"}><button> Edit </button></Link>
                                    </>
                                }

                            </div>

                            <div className={styles.mainInfo}>
                                <div className={styles.accountImage}>
                                    <Image
                                        src={userImage ? userImage.replaceAll("s96-c", "s192-c") : "/media/images/logo.svg"}
                                        alt={userName ? userName : ""} fill={true}/>
                                </div>
                                <h1> {userName}</h1>
                                { !hidePrivate &&  <h2> {userEmail}</h2> }
                                <h2> {userRole}</h2>
                            </div>

                            <div className={statsStyles.statsRowContainer + " " + statsStyles.twoCols}>

                                {/* Each stat is a div with the number central and the icon and value inline */}
                                <div className={statsStyles.stat}>
                                    <h2> {userPlants}</h2>
                                    <FontAwesomeIcon icon={faSeedling} className={statsStyles.inline}/>
                                    <p className={statsStyles.inline}> Plants </p>
                                </div>

                                {/* Each stat is a div with the number central and the icon and value inline */}
                                <div className={statsStyles.stat}>
                                    <h2> N/A </h2>
                                    <FontAwesomeIcon icon={faCamera} className={statsStyles.inline}/>
                                    <p className={statsStyles.inline}> Posts </p>
                                </div>

                            </div>
                        </div>
                    </div>

                </Section>

                {/* Users Plants */}
                <Section autoPadding>
                    <DropdownSection title={"Plants Created"} open>
                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Last Modified</th>
                                    <th className={styles.divider}>Divider</th>
                                    <th>View</th>

                                    {editor && <th>Edit</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {userPlantsData.length > 0 ? userPlantsData.map((plant: any) => (
                                    <tr key={plant.id}>
                                        <td>{plant.id}</td>
                                        <td>{macronCodeToChar(getNamesInPreference(plant as PlantData)[0], numberDictionary)}</td>
                                        <td>{plant.plant_type}</td>
                                        <td>{dateToString(new Date(plant.last_modified))}</td>
                                        <td className={styles.divider}>Divider</td>
                                        <td>
                                            <Link href={"/plants/" + plant.id}>
                                                <button className={styles.viewButton}>View</button>
                                            </Link>
                                        </td>

                                        {editor && <td>
                                            <Link href={"/plants/create?id=" + plant.id}>
                                                <button className={styles.editButton}>Edit</button>
                                            </Link>
                                        </td>}
                                    </tr>
                                )) : <tr>
                                    <td><p> No Plants Found </p></td>
                                </tr>}
                                </tbody>
                            </table>

                            {editor && <button className={styles.createButton} onClick={() => router.push("/plants/create")}>Create Plant</button> }

                        </div>
                    </DropdownSection>
                </Section>

                {/* Users Posts */}
                <Section autoPadding>
                    <DropdownSection title={"Posts"} open>
                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th className={styles.divider}>Divider</th>
                                    <th className={styles.divider}>Divider</th>
                                    <th>View</th>
                                    {editor && <th>Edit</th>}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><p> No Posts Found </p></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </DropdownSection>
                </Section>

                {/* Users Api Keys */}
                {!hidePrivate &&
                    <Section autoPadding>
                        <DropdownSection title={"Api Keys"} open>
                            <div className={styles.tableContainer}>
                                <table className={styles.dataTable}>
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Key</th>
                                        <th>Permissions</th>
                                        <th className={styles.divider}>Divider</th>
                                        <th>View</th>
                                        {editor && <th>Edit</th>}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td><p> No API Keys Found </p></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </DropdownSection>
                    </Section>
                }

                {/* Actions */}
                {myAccount &&
                    <Section autoPadding>
                        <div className={globalStyles.gridCentre}>

                            <div className={styles.actionItem}>
                                <button onClick={signOutUser} className={styles.signOutButton}>Sign Out</button>
                            </div>

                            <div className={styles.actionItem}>
                                <button onClick={deleteAccount} className={styles.deleteAccountButton}>Delete Account
                                </button>
                            </div>
                        </div>
                    </Section>
                }
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
                        <h1>{userName ? userName + "'s Account" : "Your Account"}</h1>
                    </div>
                </PageHeader>
            </Section>



            {/* Error Message */}
            {error ?

                <Section autoPadding>
                    <Error error={error}/>
                </Section>

                :
                <>
                    {!userID && !session?
                        loginSection()
                        :
                        accountSection()
                    }
                </>
            }




            {/* Footer */}
            <Section>
                <Footer/>
            </Section>
        </>

    )
}