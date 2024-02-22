import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import Section from "@/components/section";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/admin.module.css";
import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import Footer from "@/components/footer";
import {loginSection} from "@/pages/account";
import {useSession} from "next-auth/react";
import {Loading} from "@/components/loading";
import {Error} from "@/components/error";
import {checkUserPermissions, RongoaUser} from "@/lib/users";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import { Client } from "@axiomhq/axiom-node";
import {getNamesInPreference, macronCodeToChar, macronsForDisplay, numberDictionary, PlantData} from "@/lib/plant_data";
import {FileInput, ValidationState} from "@/components/input_sections";
import {useRouter} from "next/router";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();
    const router = useRouter()
    const { data: session } = useSession()

    // Back up file
    const [fileError, setFileError] = useState<string>("");
    const [fileState, setFileState] = useState<ValidationState>("normal");

    // Load the data
    const [loading, setLoading] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState("Loading...")
    const [error, setError] = useState("")


    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)
    useEffect(() => {

        // Check the user permissions
        if(!checkUserPermissions(session?.user as RongoaUser, "pages:admin:publicAccess")){
            setError("You do not have permission to access this page.")
            setLoading(false)
            return
        }
        setError("")

        // Fetch the data
        if (dataFetch.current)
            return

        dataFetch.current = true
        fetchData()
    }, [session])


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

    const fetchData = async () => {

        // Set the loading message
        setLoading(true)

        setLoading(false)
    }



    const setFile = async (file: File | null) => {


        // Check if a file has been selected
        if(!file){
            setFileError("No file selected")
            setFileState("error")
            return
        }

        // Check if the file is the right type json
        if(file.type !== "application/json"){
            setFileError("File must be a json file")
            setFileState("error")
            return
        }

        // Set the data
        setFileState("success")
        setFileError("")

        // Send the data to the server
        setLoading(true)
        setLoadingMessage("Uploading data...")

        // Create a new form data object and append the file to it
        const formData = new FormData();
        formData.append('file', file);
        formData.append('backup', "true");

        try {
            // Send the form data to the server
            const response = await makeRequestWithToken('post', '/api/files/upload', formData);

            // Check if the file was uploaded successfully
            if (!response.data.error) {
                console.log("File uploaded successfully")
                setLoading(false)
            }

            // Clear the cache
            clearCache()

            // Go back to the admin page
            router.push("/admin")

        } catch (error) {
            setLoading(false)
            console.error(error)
            setError("An error occurred while uploading the file")
        }
    }


    const clearCache = async () => {
        localStorage.clear()
        window.location.reload()
    }

    const adminPage = () => {
        return (
            <>

                {/* Section for the welcome message and search box */}
                <Section autoPadding>
                    <div className={globalStyles.gridCentre}>
                        <div className={globalStyles.container}>
                            <div className={styles.adminHeaderContainer}>
                                <h1>Welcome to the Admin Page</h1>

                                <p>Logged in as {session?.user?.name} ({session?.user?.email})</p>
                                <p>Current Time: {new Date().toLocaleString()}</p>

                                <br/>
                                <p> You are currently managing the settings in the database. You can download a back up of files or the database.</p>

                                <Link href={"/admin/"}><button>Return</button></Link>
                            </div>
                        </div>
                    </div>

                </Section>


                <Section autoPadding>
                    <div className={globalStyles.gridCentre}>
                        <div className={globalStyles.container}>
                            <div className={styles.adminHeaderContainer}>
                                <h1>Settings</h1>
                                <button onClick={clearCache}>Clear Cache</button>

                                <br/>

                                <h1> Backup </h1>
                                <button onClick={handleFilesDownload}>Download Files</button>
                                <button onClick={handleDatabaseDownload}>Download Database</button>

                                <h3> Import Back Up </h3>
                                <FileInput required={false} state={fileState} errorText={fileError} changeEventHandler={setFile}  placeHolder={"Back Up File"}/>
                            </div>
                        </div>
                    </div>
                </Section>

            </>
        )
    }

    return (
        <>

            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>


            {/* Header for the page */}
            <Section>
                <PageHeader size={"medium"}>
                    <h1>Admin</h1>
                </PageHeader>
            </Section>

            {/* Loading Message */}
            {loading && <Loading progressMessage={loadingMessage}/>}


            {/* Error Message */}
            {error ?

                <Section autoPadding>
                    <Error error={error}/>
                </Section>

                :
                <>
                    {!session ?
                        loginSection()
                        :
                        adminPage()
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