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

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();

    const { data: session } = useSession()

    // Stats
    const [pla, setPlants] = useState([] as PlantData[])

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


    const fetchData = async () => {

        // Set the loading message
        setLoading(true)

        // Download the plants from the database
        const plants = await makeCachedRequest("plant_admin_data", "/api/plants/search?getNames=true&getExtras=true&mushrooms=include")
        if(!plants){
            setError("Failed to fetch the plant data.")
            setLoading(false)
            return
        }

        // Convert the data to the PlantData type
        const plantData = plants as PlantData[]
        for(let i = 0; i < plantData.length; i++)
            plantData[i] = macronsForDisplay(plantData[i])

        // Set the plant data
        setPlants(plantData)

        setLoading(false)
    }

    const deletePlant = async (id: number) => {

        // Send the remove request
        const response = await makeRequestWithToken("get", "/api/plants/remove?id=" + id)

        // Clear the cache
        localStorage.removeItem("plant_admin_data")

        // Reload the page
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
                                <p> You are currently managing the plants in the database. You can add, edit, and delete plants from the database.</p>

                                <Link href={"/admin/"}><button>Return</button></Link>
                            </div>
                        </div>
                    </div>

                </Section>


                <Section autoPadding>
                    <div className={styles.plantTable}>
                        <div className={globalStyles.gridCentre}>
                            <table>
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
                            </table>
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