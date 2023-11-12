import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useEffect} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/admin.module.css";
import {useSession} from "next-auth/react";
import {Error} from "@/components/error";
import axios from "axios";
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
    const [error, setError] = React.useState("Under Development")

    // Router
    const router = useRouter()

    // Check the user is authed
    useEffect(() => {
        if(userAllowed == 0)
            checkUser().then(() => {console.log("Finished checking user auth")}).catch((error) => {console.log(error)})
    }, [session])

    const checkUser = async () => {
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



        try {
            // Update the auth entry
            const response = await axios.get("/api/auth/edit_auth?operation=add&entry=" + Buffer.from(newAuthEntry).toString('base64') + "&type=" + newAuthType + "&nickname=" + newAuthNickname + "&permissions=" + newAuthPermissions)
        }
        catch (error) {
            setError("Error adding new auth entry")
        }

        // Reload the auth data
        await getAdminAuthData()
        setLoading(false)
    }

    const removeAuthEntry = async (entry: string, type: string, nickname: string, permissions: string) => {

        // Clear the error
        setError("")

        setLoading(true)
        setLoadingMessage("Removing auth entry...")

        // Convert to base64
        entry = Buffer.from(entry).toString('base64')

        // Update the auth entry
        try {
            const response = await axios.get("/api/auth/edit_auth?operation=remove&entry=" + entry + "&type=" + type + "&nickname=" + nickname + "&permissions=" + permissions)
        } catch (error) {
            setError("Error removing auth entry")
        }

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

    const handleFilesDownload = async () => {
        try {
            setLoading(true)
            setLoadingMessage("Downloading files... (this may take a while)");
            const response = await fetch('/api/files/backup_files');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "backup-files-" + new Date().toISOString().slice(0, 10) + ".zip";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
        setLoading(false)
    };

    const handleDatabaseDownload = async () => {
        try {
            setLoading(true)
            setLoadingMessage("Downloading database...")
            const response = await fetch('/api/files/backup_database');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "backup-database-" + new Date().toISOString().slice(0, 10) + ".json";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
        setLoading(false)
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
            <Error error={error}/>


            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <ScrollToTop/>


        </>
    )
}
