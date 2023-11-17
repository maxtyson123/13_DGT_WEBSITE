import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import Section from "@/components/section";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/account/index.module.css";
import {Loading} from "@/components/loading";
import {Error} from "@/components/error";
import {loginSection} from "@/pages/account";
import Footer from "@/components/footer";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {checkUserPermissions, getStrings, RongoaUser} from "@/lib/users";
import {DropdownSection} from "@/components/dropdown_section";

export default function KeyViewer(){
    const pageName = "Account";

    const { data: session } = useSession()

    const router = useRouter()

    // Data states
    const [userApiKeyData, setUserApiKeyData] = useState<any>(null)

    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    // Check if the user is logged in
    useEffect(() => {
        let { id } = router.query

        if (session?.user && id) {
            getKeyData(id as string)
        }
    }, [session, router.query])

    const getKeyData = async (id: string) => {
        setLoading(true)

        const urlData = id.split("_")
        let user = urlData[1]

        // Try to parse the id
        let localId = parseInt(id[0])
        if(isNaN(localId)){
            setError("Invalid Key ID")
            setLoading(false)
            return
        }

        try {
            // Create the url
            let apiUrl = "/api/user/api_keys?operation=fetch"

            // Check if the user is the current user
            if (user !== "0") {

                // Check if we are allowed to view other users keys
                if(checkUserPermissions(session?.user as RongoaUser, "data:account:viewPrivateDetails")){
                    apiUrl += "&publicUserID=" + user
                }else{
                    // Send them to their account page
                    router.push("/account")
                }

            }

            // Get the data
            let apikeys = await makeCachedRequest("userApiKeysData_"+user, apiUrl)
            if (!apikeys){
                setError("Failed to fetch API key data")
                setLoading(false)
                return
            }

            // Get the key with the matching id
            let key = apikeys.filter((key: any) => key.id === localId)
            console.log(key)

            // Check if the key exists
            if (key.length === 0){
                setError("API key not found")
                setLoading(false)
                return
            }

            // Get the key
            key = key[0]

            // Parse the key data
            key.api_key_permissions = getStrings(JSON.parse(key.api_key_permissions))
            key.api_key_last_used = new Date(key.api_key_last_used).toLocaleString()
            key.api_key_logs = JSON.parse(key.api_key_logs).reverse()
            key.api_key_created = new Date(key.api_key_logs.filter((log: any) => log.action === "Created")[0].time).toLocaleString()

            // Add a type to the logs
            for (let i = 0; i < key.api_key_logs.length; i++) {
                let log = key.api_key_logs[i]

                if (log.action === "Created" || log.action.includes("Allowed")){
                    log.type = "success"
                }else if (log.action.includes("Denied")) {
                    log.type = "error"
                }
            }

            // Set the key data
            setUserApiKeyData(key)

        } catch (e) {

            // Set the error
            setError("Failed to fetch API key data")
            setLoading(false)
        }

        setLoading(false)
    }

    const clearLogs = async () => {
        setLoading(true)

        // Clear the logs
        try{
            const result = await makeRequestWithToken('get', '/api/user/api_keys', {operation: "clear_logs", id: userApiKeyData.id})

        }catch (e) {
            setError("Failed to clear logs")
            setLoading(false)
        }

        // Refresh the key data
        await refreshKey()

        setLoading(false)

    }

    const refreshKey = async () => {
        setLoading(true)

        // Clear the local cache
        localStorage.removeItem("userApiKeysData_0")

        // Get the key data
        await getKeyData(router.query.id as string)

        setLoading(false)
    }

    const keyViewer = () => {
        return(
            <>
                <Section autoPadding>

                    <div className={styles.keyViewerContainer}>
                        <h2>{userApiKeyData?.api_key_name}</h2>

                        <div className={styles.keyViewItem}>
                            <h3>ID: </h3>
                            <p>{userApiKeyData?.id}</p>
                        </div>

                        <div className={styles.keyViewItem}>
                            <h3>Created: </h3>
                            <p>{userApiKeyData?.api_key_created}</p>
                        </div>

                        <div className={styles.keyViewItem}>
                            <h3>Value: </h3>
                            <p>{userApiKeyData?.api_key_value}</p>
                        </div>

                        <div className={styles.keyViewItem}>
                            <h3>Last Used: </h3>
                            <p>{userApiKeyData?.api_key_last_used}</p>
                        </div>
                    </div>

                    <div className={styles.keyViewerDropdowns}>

                        <DropdownSection title={"Permissions"} open>
                            {userApiKeyData?.api_key_permissions.map((permission: string, index: number) => {
                                return(
                                    <div key={index} className={styles.permissionItem}>
                                        <p>{permission}</p>
                                    </div>
                                )
                            })}
                        </DropdownSection>

                        <br/>

                        <DropdownSection title={"Logs"}>
                            {userApiKeyData?.api_key_logs.map((log: any, index: number) => {
                                return(
                                    <div key={index} className={styles.logItem}>
                                        <h3>{new Date(log.time).toLocaleString()}:</h3>
                                        <p className={log.type === "success" ? styles.success : styles.error}> {log.action}</p>
                                    </div>
                                )
                            })}
                            <button className={styles.createButton} onClick={clearLogs}>Clear Logs</button>
                            <button className={styles.createButton}>Refresh</button>
                        </DropdownSection>
                    </div>

                </Section>
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
                        <h1>Create New Key</h1>
                    </div>
                </PageHeader>
            </Section>

            {/* Loading Message */}
            {loading && <Loading progressMessage={"Fetching API key..."}/>}

            {/* Error Message */}
            {error && <Section autoPadding> <Error error={error}/> </Section> }

            {!session?
                loginSection()
                :
                keyViewer()
            }

            {/* Footer */}
            <Section>
                <Footer/>
            </Section>

        </>
    )

}