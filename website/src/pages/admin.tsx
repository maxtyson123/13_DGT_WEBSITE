import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useEffect} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/admin.module.css";
import {signIn, signOut, useSession} from "next-auth/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen, faPerson} from "@fortawesome/free-solid-svg-icons";
import {Error} from "@/components/error";
import Image from "next/image";
import axios from "axios";
import {DropdownInput, SmallInput} from "@/components/input_sections";
import {useRouter} from "next/router";
import {USE_POSTGRES} from "@/lib/constants";

interface authEntry {
    value: string,
    type: string,
    nickname: string,
    permissions: string,
}

interface plantEntry {
    id: number,
    english_name: string,
    maori_name: string,
    latin_name: string,
}

export default function PlantIndex(){
    const pageName = "Admin"

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [loadingMessage, setLoadingMessage] = React.useState("")

    // Get the logged-in user
    const { data: session } = useSession()
    const [userAllowed, setUserAllowed] = React.useState(0)
    const [authData, setAuthData] = React.useState<authEntry[]>([])
    const [plantData, setPlantData] = React.useState<plantEntry[]>([])

    // New User Data
    const [newAuthEntry, setNewAuthEntry] = React.useState("")
    const [newAuthType, setNewAuthType] = React.useState("")
    const [newAuthNickname, setNewAuthNickname] = React.useState("")
    const [newAuthPermissions, setNewAuthPermissions] = React.useState("")

    // Error
    const [error, setError] = React.useState("")

    // Router
    const router = useRouter()

    // Check the user is authed
    useEffect(() => {
        if(userAllowed == 0)
            checkUser().then(() => {console.log("Finished checking user auth")}).catch((error) => {console.log(error)})
    }, [session])

    const checkUser = async () => {
        setError("")
        setUserAllowed(0)
        setLoading(true)
        setLoadingMessage("Checking user permissions...")

        // If there is no logged-in user then return
        if (!session?.user?.email){
            setLoading(false)
            return
        }

        // Test the user is admin
        const response = await axios.get("/api/auth/test_auth")
        const data = response.data

        // If the message is a success then the user is admin
        if(data.message == "User whitelisted"){
            if(data.permissions == "admin"){
                setUserAllowed(3)
            }else{
                setUserAllowed(2)
            }
            await getAdminAuthData()
            await getPlantData()
        }else{
            setError("User is not admin")
            setUserAllowed(1)
        }
        setLoading(false)
    }

    const getAdminAuthData = async () => {
        setLoading(true)
        setLoadingMessage("Getting admin auth data...")

        const response = await axios.get("/api/auth/edit_auth?operation=fetch")
        const data = response.data.data

        // Create an array to store the plant auths (for each name)
        let auths: authEntry[] = []
        setAuthData(auths)

        // Loop through the data and set the auths
        for (let i = 0; i < data.length; i++) {
            if(USE_POSTGRES){
                auths.push({value: data[i].entry, type: data[i].type, nickname: data[i].nickname, permissions: data[i].permissions})
            }else{
                auths.push({value: data[i].auth_entry, type: data[i].auth_type, nickname: data[i].auth_nickname, permissions: data[i].auth_permissions})
            }

        }

        // Set the plant auths
        setAuthData(auths)
        setLoading(false)
    }

    const getPlantData = async () => {
        setLoading(true)
        setLoadingMessage("Getting plant data...")

        const response = await axios.get("/api/plants/search?getNames=true")
        const data = response.data.data

        // Create an array to store the plant auths (for each name)
        let plants: plantEntry[] = []
        setPlantData(plants)

        // Loop through the data and set the plants
        for (let i = 0; i < data.length; i++) {
            plants.push({id: data[i].id, english_name: data[i].english_name, maori_name: data[i].maori_name, latin_name: data[i].latin_name})
        }

        // Set the plant plants
        setPlantData(plants)
        setLoading(false)
    }

    const addAuthEntry = async () => {

        // Clear the error
        setError("")

        // Check the new auth entry is valid
        if(newAuthEntry == ""){ setError("Please enter an entry"); return}
        if(newAuthType == ""){ setError("Please enter a type"); return}
        if(newAuthNickname == ""){ setError("Please enter a nickname"); return}
        if(newAuthPermissions == ""){ setError("Please enter permissions"); return}

        setLoading(true)
        setLoadingMessage("Adding new auth entry...")

        // Update the auth entry
        const response = await axios.get("/api/auth/edit_auth?operation=add&entry=" + newAuthEntry + "&type=" + newAuthType + "&nickname=" + newAuthNickname + "&permissions=" + newAuthPermissions)

        // Reload the auth data
        await getAdminAuthData()
        setLoading(false)
    }

    const removeAuthEntry = async (entry: string, type: string, nickname: string, permissions: string) => {

        // Clear the error
        setError("")

        setLoading(true)
        setLoadingMessage("Removing auth entry...")
        // Update the auth entry
        const response = await axios.get("/api/auth/edit_auth?operation=remove&entry=" + entry + "&type=" + type + "&nickname=" + nickname + "&permissions=" + permissions)

        // Reload the auth data
        await getAdminAuthData()
        setLoading(false)

    }

    const removePlant = async (id: number) => {

            // Clear the error
            setError("")
            setLoading(true)
            setLoadingMessage("Removing plant...")

            // Update the auth entry
            const response = await axios.get("/api/plants/remove?id=" + id)

            // Reload the auth data
            await getPlantData()
            setLoading(false)

    }

    const handleDownload = async () => {
        try {
            const response = await fetch('/api/files/backup_files');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'images.zip';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };

    return(
        <>
            {/* The header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* The main page header is just the plant index title */}
            <PageHeader size={"small"}>
                <div className={styles.header}>
                    <h1>Admin</h1>
                </div>
            </PageHeader>

            {/* Admin Panel */}
            <Section autoPadding>
                { !session ?
                    <>
                        <div className={styles.userDetails}>
                            <p> Please sign in to edit plants  </p>
                            <button onClick={() => signIn()}><FontAwesomeIcon icon={faPerson}/> Sign in</button>
                        </div>
                    </>
                    :
                    <>
                        {/* If the user is signed in then show the user details and sign out button */}
                        <div className={styles.userDetails}>
                            <p> Signed in as <span className={styles.email}> {session.user ? session.user.email : "No Email"} </span> </p>
                            <button onClick={() => signOut()}><FontAwesomeIcon icon={faDoorOpen}/> Sign out</button>
                        </div>
                        {
                           loading ?
                                <div className={styles.loadingAdminData}>
                                    <Image
                                        src={"/media/images/old_loading.gif"}
                                        alt={"loading"}
                                        width={100}
                                        height={100}
                                    />
                                    <p> {loadingMessage} </p>
                                </div>
                                :
                                <>
                                    {
                                        error ?
                                            <Error error={error}/> : <></>
                                    }
                                    <div className={styles.adminPanel}>
                                        <br/>
                                        {
                                            userAllowed == 3 ?
                                                <>
                                                    <button onClick={handleDownload}>Download Images</button>
                                                    <h1> Users </h1>
                                                    <br/>
                                                    <table>
                                                        <tr>
                                                            <th>Entry</th>
                                                            <th>Type</th>
                                                            <th>Nickname</th>
                                                            <th>Permissions</th>
                                                            <th>Action</th>
                                                        </tr>

                                                        {authData.map((auth, index) => (
                                                            <tr key={index}>
                                                                <td> {auth.value} </td>
                                                                <td> { auth.type.charAt(0).toUpperCase() + auth.type.slice(1)} </td>
                                                                <td> { auth.nickname} </td>
                                                                <td> { auth.permissions.charAt(0).toUpperCase() + auth.permissions.slice(1)} </td>
                                                                <td> <button onClick={()=>{
                                                                    removeAuthEntry(auth.value, auth.type, auth.nickname, auth.permissions)
                                                                }}> Remove </button> </td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td>
                                                                <SmallInput placeHolder={"New Entry"} required={false} state={"normal"} changeEventHandler={setNewAuthEntry}/>
                                                            </td>
                                                            <td>
                                                                <DropdownInput placeHolder={"Type"} required={false} state={"normal"} options={["email", "api"]} changeEventHandler={setNewAuthType}/>
                                                            </td>
                                                            <td>
                                                                <SmallInput placeHolder={"Nickname"} required={false} state={"normal"} changeEventHandler={setNewAuthNickname}/>
                                                            </td>
                                                            <td>
                                                                <DropdownInput placeHolder={"Permissions"} required={false} state={"normal"} options={["member", "admin"]} changeEventHandler={setNewAuthPermissions}/>
                                                            </td>
                                                            <td> <button onClick={addAuthEntry}> Add </button></td>
                                                        </tr>

                                                    </table>
                                                </>
                                                :
                                                <></>
                                        }
                                        {
                                            userAllowed >= 2 ?
                                                <>
                                                    <br/>
                                                    <h1> Plants </h1>
                                                    <button className={styles.createPlant} onClick={()=>{router.push("/plants/create")}}> Add Plant </button>
                                                    <br/>
                                                    <table>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>English Name</th>
                                                            <th>Latin Name</th>
                                                            <th>Maori Name</th>
                                                            <th>Change</th>
                                                            <th>Delete</th>
                                                        </tr>

                                                        {plantData.map((plant, index) => (
                                                            <tr key={index}>
                                                                <td> {plant.id} </td>
                                                                <td> {plant.english_name} </td>
                                                                <td> {plant.latin_name} </td>
                                                                <td> {plant.maori_name} </td>
                                                                <td> <button onClick={()=>{
                                                                    router.push("/plants/create?id=" + plant.id)
                                                                }}> Edit </button> </td>
                                                                <td>
                                                                    {userAllowed == 3?
                                                                        <>
                                                                            <button onClick={() => {removePlant(plant.id)}}> Remove </button>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            Not Allowed
                                                                        </>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </table>
                                                </>
                                                :
                                                <></>
                                        }
                                    </div>
                                </>
                        }
                    </>
                }
            </Section>



            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <ScrollToTop/>


        </>
    )
}
