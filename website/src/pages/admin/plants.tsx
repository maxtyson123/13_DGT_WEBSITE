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
import {makeCachedRequest} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import { Client } from "@axiomhq/axiom-node";
import {getNamesInPreference, macronCodeToChar, numberDictionary, PlantData} from "@/lib/plant_data";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();

    const { data: session } = useSession()

    // Stats
    const [logs, setLogs] = useState([] as any[])

    // Load the data
    const [loading, setLoading] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState("Loading...")
    const [error, setError] = useState("")


    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)
    useEffect(() => {

        // Check the user permissions
        if(session?.user)
            if(!checkUserPermissions(session?.user as RongoaUser, "pages:admin:publicAccess")){
                setError("You do not have permission toasdasd access this page.")
                setLoading(false)
                return
            }

        // Fetch the data
        if (dataFetch.current)
            return

        dataFetch.current = true
        fetchData()
    }, [session])


    const fetchData = async () => {

        // Set the loading message
        setLoading(true)


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

                    <div className={globalStyles.gridCentre}>
                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Message</th>
                                    <th>Environment</th>
                                    <th>Level</th>
                                    <th>Url</th>
                                </tr>
                                </thead>
                                <tbody>
                                {logs.map((log, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{new Date(log._time).toLocaleString()}</td>
                                            <td>{log.data.message}</td>
                                            <td>{log.data.vercel.environment}</td>
                                            <td>{log.data.level}</td>
                                            <td>{log.data.fields.path}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
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