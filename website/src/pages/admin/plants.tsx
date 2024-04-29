import Section from "@/components/section";
import styles from "@/styles/pages/admin.module.css";
import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import {getNamesInPreference, macronsForDisplay, PlantData} from "@/lib/plant_data";
import {SmallInput, ValidationState} from "@/components/input_sections";
import Table from "@/components/table";
import {Layout} from "@/components/layout";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();

    const { data: session } = useSession()

    // Stats
    const [pla, setPlants] = useState([] as PlantData[])

    // Load the data
    const [loadingMessage, setLoadingMessage] = useState("")
    const [error, setError] = useState("")

    // Excel input
    const [excelInput, setExcelInput] = useState("")
    const [excelError, setExcelError] = useState("")
    const [excelState, setExcelState] = useState<ValidationState>("normal")

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)
    useEffect(() => {

        // Fetch the data
        if (dataFetch.current)
            return

        dataFetch.current = true
        fetchData()
    }, [session])


    const fetchData = async () => {

        // Download the plants from the database
        const plants = await makeCachedRequest("plant_admin_data", "/api/plants/search?getNames=true&getExtras=true&mushrooms=include")
        if(!plants){
            setError("Failed to fetch the plant data.")
            setLoadingMessage("")
            return
        }

        // Convert the data to the PlantData type
        const plantData = plants as PlantData[]
        for(let i = 0; i < plantData.length; i++)
            plantData[i] = macronsForDisplay(plantData[i])

        console.log(plantData)

        // Set the plant data
        setPlants(plantData)
        setLoadingMessage("")
    }

    const deletePlant = async (id: number) => {


        // Set loading message
        setLoadingMessage("Deleting plant...")

        // Send the remove request
        const response = await makeRequestWithToken("get", "/api/plants/remove?id=" + id)

        // Log that the admin has deleted the plant
        log.info(`Admin ${session?.user?.email} has deleted the plant with id ${id}`)

        refresh()
    }

    const getPlantExcel = async () => {


        // Check if the input is valid
        if(excelInput === ""){
            setExcelError("Please enter a table name.")
            setExcelState("error")
            return
        }

        // Set the state to valid
        setExcelState("success")

        // Set the loading message
        setLoadingMessage("Downloading plant data...")

        // Download the plant data
        const response = await makeRequestWithToken("get", "/api/plants/json?operation=convert&tableName=" + excelInput)

        // Check if there was an error
        if(!response){
            setError("Failed to fetch the plant data.")
            setLoadingMessage("")
            return
        }

        // Get the data
        const data = response.data.data as PlantData;

        // Download the data
        const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = excelInput + ".json";
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        setLoadingMessage("")
    }

    const refresh = () => {
        // Clear the cache
        sessionStorage.removeItem("plant_admin_data")
        sessionStorage.removeItem("plant_stats")

        // Reload the data
        fetchData()
    }

    return (
        <>
            <Layout pageName={pageName} loadingMessage={loadingMessage} error={error} loginRequired permissionRequired={"pages:admin:publicAccess"} header={"Plants"}>
                {/* Section for the welcome message and search box */}
                <Section autoPadding>
                    <div className={globalStyles.gridCentre}>
                        <div className={globalStyles.container}>
                            <div className={styles.adminHeaderContainer}>
                                <h1>Welcome to the Admin Page</h1>

                                <p>Logged in as {session?.user?.name} ({session?.user?.email})</p>

                                <br/>
                                <p> You are currently managing the plants in the database. You can add, edit, and delete plants from the database.</p>

                                <Link href={"/admin/"}><button>Return</button></Link>
                            </div>
                        </div>
                    </div>

                </Section>


                <Section autoPadding>
                    <button onClick={refresh}> Refresh </button>
                    <Table>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Last Modified</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>

                        {pla.map((plant, index) => (
                            <tr key={index}>
                                <td> {plant.id} </td>
                                <td> {getNamesInPreference(plant)[0]} </td>
                                <td> {plant.plant_type} </td>
                                <td> {new Date(plant.last_modified).toLocaleString()} </td>
                                <td><Link href={"/plants/create?id=" + plant.id}>
                                    <button>Edit</button>
                                </Link></td>
                                <td><button onClick={() => {deletePlant(plant.id)}}>Delete</button></td>
                            </tr>
                        ))}
                    </Table>
                </Section>


                <Section autoPadding>

                    <div className={globalStyles.gridCentre}>
                        <div className={globalStyles.container}>
                            <div className={styles.adminHeaderContainer}>
                                <h1>Convert Plant Data</h1>
                                <p> Download the plant data in JSON format from the excel file. </p>

                                <br/>

                                <SmallInput placeHolder={"Table Name"} required={true} state={excelState} changeEventHandler={setExcelInput} errorText={excelError}/>
                                <button onClick={getPlantExcel}>Download Plant Data</button>
                            </div>
                        </div>
                    </div>
                </Section>
            </Layout>
        </>
    )
}