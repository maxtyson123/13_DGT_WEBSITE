import Section from "@/components/section";
import styles from "@/styles/pages/admin.module.css";
import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {makeCachedRequest} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import { Client } from "@axiomhq/axiom-node";
import {Layout} from "@/components/layout";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();
    const client = new Client({
        token: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
        orgId: "rongoa-mv7u",
    });

    const { data: session } = useSession()

    // Stats
    const [numberOfPlants, setNumberOfPlants] = useState(0)
    const [numberOfUsers, setNumberOfUsers] = useState(0)
    const [numberOfSettings, setNumberOfSettings] = useState(0)
    const [logs, setLogs] = useState([] as any[])

    // Load the data
    const [loadingMessage, setLoadingMessage] = useState("")
    const [error, setError] = useState("")


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
        

        // Fetch the user count
        setLoadingMessage("Fetching user count...")
        const users = await makeCachedRequest("user_stats", "/api/auth/random?amount=9999999")
        if(!users){
            setError("User data not found")
            setLoadingMessage("")
            return
        }
        setError("")

        // Store the number of users
        setNumberOfUsers(users.length)

        // Fetch the plant count
        setLoadingMessage("Fetching plant count...")
        const plants = await makeCachedRequest("plant_stats", "/api/plants/uses")
        if(!plants){
            setError("Plant data not found")
            setLoadingMessage("")
            return
        }

        // Store the number of plants
        let plantCount = 0
        for (const use in plants)
            plantCount += 1
        setNumberOfPlants(plantCount)


        // Fetch the settings count
        setLoadingMessage("Fetching settings count...")

        // Fetch the logs
        setLoadingMessage("Fetching logs...")


        const aplQuery = "['vercel'] | where message contains '' and not(['vercel.source'] contains 'build') | top 100 by _time desc"

        const res = await client.query(aplQuery);
        if (!res.matches || res.matches.length === 0) {
            console.warn('no matches found');
            return;
        }

        console.log(res.matches);
        setLogs(res.matches)

        // Finish loading
        setLoadingMessage("")
    }


    return (
        <>

            <Layout pageName={pageName} loadingMessage={loadingMessage} error={error} loginRequired header={"Admin"} permissionRequired={"pages:admin:publicAccess"}>
                <Section autoPadding>
                    <div className={globalStyles.gridCentre}>
                        <div className={globalStyles.container}>
                            <div className={styles.adminHeaderContainer}>
                                <h1>Welcome to the Admin Page</h1>

                                <p>Logged in as {session?.user?.name} ({session?.user?.email})</p>
                                

                                <br/>
                                <p>Here you can manage the website content and settings.</p>

                                <Link href={"/admin/plants"}>
                                    <button>Manage Plants</button>
                                </Link>
                                <Link href={"/admin/users"}>
                                    <button>Manage Users</button>
                                </Link>
                                <Link href={"/admin/settings"}>
                                    <button>Manage Settings</button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className={styles.adminDataContainer}>
                        <div className={styles.adminData}>
                            <h2>Plants</h2>
                            <p>There are currently <strong>{numberOfPlants}</strong> plants in the database.</p>
                        </div>
                        <div className={styles.adminData}>
                            <h2>Users</h2>
                            <p>There are currently <strong>{numberOfUsers}</strong> users in the database.</p>
                        </div>
                        <div className={styles.adminData}>
                            <h2>Settings</h2>
                            <p>There are currently <strong>{numberOfSettings}</strong> settings in the database.</p>
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
            </Layout>
        </>
    )
}
