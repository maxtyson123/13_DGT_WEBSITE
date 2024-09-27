import React, {useEffect, useRef, useState} from "react";
import Section from "@/components/section";
import styles from "@/styles/pages/account/index.module.css"
import statsStyles from "@/styles/components/stats.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera, faSeedling} from "@fortawesome/free-solid-svg-icons";
import {signOut, useSession} from "next-auth/react";
import {
    ADMIN_USER_TYPE,
    checkUserPermissions,
    EDITOR_USER_TYPE,
    getStrings,
    MEMBER_USER_TYPE,
    RongoaUser,
    UserDatabaseDetails
} from "@/lib/users";
import Image from "next/image";
import {globalStyles} from "@/lib/global_css";
import {DropdownSection} from "@/components/dropdown_section";
import {useRouter} from "next/router";
import Link from "next/link";
import {getNamesInPreference, macronCodeToChar, numberDictionary, PlantData} from "@/lib/plant_data";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {Layout} from "@/components/layout";
import {getPostImage} from "@/lib/data";
import {ModalImage} from "@/components/modal";

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
    const [userPostsData, setUserPostsData] = React.useState([])
    const [userApiKeysData, setUserApiKeysData] = React.useState([])
    const [userApiKeysShown, setUserApiKeysShown] = React.useState<boolean[]>([])
    const [userID, setUserID] = React.useState<number>(0)

    // States
    const [loadingMessage, setLoadingMessage] = React.useState<string>("")
    const[error, setError] = useState<string>("")
    const [editor, setEditor] = React.useState<boolean>(false)
    const [myAccount, setMyAccount] = React.useState<boolean>(false)
    const [hidePrivate, setHidePrivate] = React.useState<boolean>(true)
    const [isAdmin, setIsAdmin] = React.useState<boolean>(false)

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef("-1")

    useEffect(() => {

        // If there is a user id
        if(dataID){

            // Check if it is to be used
            if(dataID != "0"){

                // Try converting the id to a number
                let localId = parseInt(dataID as string)

                // If it is not a number then there is a problem
                if(isNaN(localId)){
                    console.log("Not a number")
                    setError("User not found")
                    setLoadingMessage("")
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

            // Not viewing a user, so we are viewing our own account

            // This is our account
            setMyAccount(true)
            setHidePrivate(false)

            let user = session.user as RongoaUser
            if(!user){
                setLoadingMessage("")
                return
            }

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

        console.log("Loading user data")
        console.log(user)

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

        setUserLastLogin(new Date(user.user_last_login).toLocaleString())
        setUserPosts("0")
        setIsAdmin(user.user_type == ADMIN_USER_TYPE)

    }


    const fetchData = async (localId: number = 0) => {

        setLoadingMessage("")

        // If we are viewing a user then we need to get their data
        if(localId != 0) {
            try {
                setLoadingMessage("Fetching user data...")

                // Get the data
                const user = await makeCachedRequest("userData_" + localId, "/api/user/data?id=" + localId)
                if(!user){
                    setError("User not found")
                    setLoadingMessage("")
                    return
                }
                loadUserData(user)

                // Override the editor state
                setEditor(false)

            } catch (e) {
                console.log(e)
                setLoadingMessage("")
                setError("User not found")
                return
            }
        }


        // Get the users plants
        try {
            setLoadingMessage("Fetching plants...")

            // Create the url
            let url = "/api/user/plants"
            if(localId != 0) {
                url += "?id=" + localId
            }

            // Get the data
            let plants = await makeCachedRequest("userPlantsData_" + localId, url)

            // Update the state variables
            if(plants){
                setUserPlants(plants.length.toString())
                setUserPlantsData(plants)
            }else{
                setUserPlants("0")
                setUserPlantsData([])
            }

        } catch (e) {

            // User has no plants
            console.log(e)
            setUserPlants("0")
        }

        // Get the users posts
        try{

            setLoadingMessage("Fetching posts...")

            // Get the posts
            const posts = await makeCachedRequest("userPostsData_" + localId, `/api/posts/fetch?operation=list&id=${(localId ? localId : (session?.user as RongoaUser).database.id)}`);
            console.log("posts", posts.length.toString())
            if(posts){
                // Reverse the posts
                posts.reverse();
                setUserPosts(posts.length.toString());
                setUserPostsData(posts);
            }else{
                setUserPosts("0")
                setUserPostsData([])
            }

        }catch (e) {
            console.log(e)
            setUserPosts("0")
        }

        // Get the users api keys
        try {

            // Create the url
            let apiUrl = "/api/user/keys?operation=fetch"
            if(localId != 0 && checkUserPermissions(session?.user as RongoaUser, "data:account:viewPrivateDetails")) {
                console.log("Can view private details")
                apiUrl += "&publicUserID=" + localId
            }

            setLoadingMessage("Fetching API keys...")


            // Get the data
            let apikeys = await makeCachedRequest("userApiKeysData_" + localId, apiUrl)
            if(!apikeys)
                apikeys = []

            // Update the state variables
            setUserApiKeysData(apikeys)

        } catch (e) {

            // User has no plants
            console.log(e)
            setUserPlants("0")
        }

        console.log("Finished fetching data")
        setLoadingMessage("")
    }

    const signOutUser = async () => {

        // Clear the cache
        sessionStorage.clear()
        await signOut({callbackUrl: "/"})
    }

    const deleteAccount = async () => {
        await makeRequestWithToken("get","/api/user/delete/")
        await signOutUser()
    }

    const deleteKey = async (keyID: string) => {

        // Delete the key
        try{
            await makeRequestWithToken("get","/api/user/keys?operation=remove&id=" + keyID)
        } catch (e) {
            console.log(e)
        }

        // Clear the key data
        sessionStorage.removeItem("userApiKeysData_" + userID)

        // Reload the data
        await fetchData(userID)
    }


    return (
        <>
            <Layout pageName={pageName} loginRequired error={error} loadingMessage={loadingMessage} header={userName + "'s Account"} permissionRequired={"pages:account:publicAccess"}>

                {/* Users Information */}
                <Section autoPadding>
                    <div className={globalStyles.gridCentre} key={dataID as string}>
                        <div className={globalStyles.container}>

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
                                    <h2> {userPosts} </h2>
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
                                        <td>{new Date(plant.last_modified).toLocaleString()}</td>
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

                            {editor && <button className={styles.createButton} disabled onClick={() => router.push("/plants/create")}>Create Plant | TEMPORARIlY DISABLED</button> }

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
                                    <th>Title</th>
                                    <th>Plant</th>
                                    <th>Date</th>
                                    <th className={styles.divider}>Divider</th>
                                    <th>View</th>
                                </tr>
                                </thead>
                                <tbody>
                                {userPostsData.length > 0 ? userPostsData.map((post: any) => (
                                    <tr key={post.id}>
                                        <td>{post.id}</td>
                                        <td>{post.post_title}</td>
                                        <td>{post.post_plant_id}</td>  {/* TODO: Get the plant name */}
                                        <td>{new Date(post.post_date).toLocaleString()}</td>
                                        <td className={styles.divider}>Divider</td>
                                        <td>
                                            <ModalImage url={getPostImage(post)} description={post.post_title}>
                                                <a>
                                                    <button className={styles.viewButton}>View</button>
                                                </a>
                                            </ModalImage>
                                        </td>

                                    </tr>
                                )) : <tr>
                                    <td><p> No Plants Found </p></td>
                                </tr>}
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
                                <table className={styles.dataTable} key={userApiKeysShown.toString()}>
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Value</th>
                                        <th>Last used</th>
                                        <th>Permissions</th>
                                        <th className={styles.divider}>Divider</th>
                                        <th>View</th>
                                        {editor && <th>Delete</th>}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userApiKeysData.length > 0 ? userApiKeysData.map((apiKey: any, index) => (
                                        <tr key={apiKey.id}>
                                            <td>{apiKey.id}</td>
                                            <td>{apiKey.api_key_name}</td>
                                            <td>{apiKey.api_key_value}</td>
                                            <td>{new Date(apiKey.api_key_last_used).toLocaleString()}</td>
                                            <td>{getStrings(JSON.parse(apiKey.api_key_permissions)).join(", ")}</td>
                                            <td className={styles.divider}>Divider</td>
                                            <td>
                                                <Link href={"/account/keys/" + apiKey.id + "_" + userID}>
                                                    <button className={styles.viewButton}>View</button>
                                                </Link>
                                            </td>

                                            {editor && <td>
                                                <button className={styles.editButton} onClick={() => {deleteKey(apiKey.id)}}>Delete</button>
                                            </td>}
                                        </tr>
                                    )) : <tr>
                                        <td><p> No Api Keys Found </p></td>
                                    </tr>}
                                    </tbody>
                                </table>

                                {myAccount && <button className={styles.createButton} onClick={() => router.push("/account/keys/create")}>Create Key</button> }

                            </div>
                        </DropdownSection>
                    </Section>
                }

                {/* Actions */}
                {myAccount &&
                    <Section autoPadding>
                        <div className={globalStyles.gridCentre}>
                            {isAdmin &&
                                <div className={styles.actionItem}>
                                    <Link href={"/admin"}><button className={styles.createButton}>Admin Panel</button></Link>
                                </div>
                            }
                            <div className={styles.actionItem}>
                                <button onClick={signOutUser} className={styles.signOutButton}>Sign Out</button>
                            </div>

                            <div className={styles.actionItem}>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <button onClick={deleteAccount} className={styles.deleteAccountButton}>Delete Account</button>
                            </div>
                        </div>
                    </Section>
                }
            </Layout>
        </>
    )
}