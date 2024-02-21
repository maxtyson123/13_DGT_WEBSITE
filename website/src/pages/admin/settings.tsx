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
import {forEach} from "remeda";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();

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


    const loadJSON = async (json: any) => {

        // Check if there is data
        if(!json || !json.data){
            setFileError("No data in file")
            setFileState("error")
            return
        }

        let plantTable: PlantData[] = []
        let attachmentTable: any[] = []
        let craftTable: any[] = []
        let customTable: any[] = []
        let edibleTable: any[] = []
        let medicinalTable: any[] = []
        let monthsTable: any[] = []
        let sourceTable: any[] = []

        // Loop through the data
        for(let i = 0; i < json.data.length; i++){

            // Get the data
            const data = json.data[i][0]

            // Check if there is the id
            if(!data.id){
                setFileError("No vaild data")
                setFileState("error")
                return
            }

            // Get the table names
            let tableNames = Object.keys(data)

            // Check if it is attachment data
            if(tableNames.includes("attachments_path")){
                attachmentTable = json.data[i];
                continue;
            }

            // Check if it is craft data
            if(tableNames.includes("craft_part_of_plant")){
                craftTable = json.data[i];
                continue;
            }

            // Check if it is custom data
            if(tableNames.includes("custom_title")){
                customTable = json.data[i];
                continue;
            }

            // Check if it is edible data
            if(tableNames.includes("edible_part_of_plant")){
                edibleTable = json.data[i];
                continue;
            }

            // Check if it is medicinal data
            if(tableNames.includes("medical_use")){
                medicinalTable = json.data[i];
                continue;
            }

            // Check if it is months data
            if(tableNames.includes("months_event")){
                monthsTable = json.data[i];
                continue;
            }

            // Check if it is source data
            if(tableNames.includes("source")){
                sourceTable = json.data[i];
                continue;
            }

            // Check if it is plant data
            if(tableNames.includes("preferred_name"))
                plantTable = json.data[i];
        }

        // Set the data
        setFileState("success")
        setFileError("")

        // Send the data to the server
        setLoading(true)
        setLoadingMessage("Uploading data...")

        // Use the api
        const data = {
            plantTable: plantTable,
            attachmentTable: attachmentTable,
            craftTable: craftTable,
            customTable: customTable,
            edibleTable: edibleTable,
            medicinalTable: medicinalTable,
            monthsTable: monthsTable,
            sourceTable: sourceTable
        }

        await makeRequestWithToken("post", "/api/files/backup_database", data)

    }

    const setFile = (file: File | null) => {


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

        // Clear the error
        setFileError("")

        // Get the contents of the file as a json object
        const reader = new FileReader();
        reader.onload = async (e) => {
            const contents = e.target?.result as string
            try {
                loadJSON(JSON.parse(contents))

            } catch (error) {
                setFileError("Error reading file")
                setFileState("error")
                return
            }
        }
        reader.readAsText(file)
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
                                <p> None yet </p>

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