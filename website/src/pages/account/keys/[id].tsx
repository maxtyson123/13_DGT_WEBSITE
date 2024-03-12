import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Section from "@/components/section";
import styles from "@/styles/pages/account/index.module.css";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {checkUserPermissions, getStrings, RongoaUser} from "@/lib/users";
import {DropdownSection} from "@/components/dropdown_section";
import {Layout} from "@/components/layout";

export default function KeyViewer(){
    const pageName = "Account";

    const { data: session } = useSession()

    const router = useRouter()

    // Data states
    const [userApiKeyData, setUserApiKeyData] = useState<any>(null)

    const [loading, setLoading] = React.useState("")
    const [error, setError] = React.useState("")

    // Check if the user is logged in
    useEffect(() => {
        let { id } = router.query

        if (session?.user && id)
            getKeyData(id as string)

    }, [session, router.query])

    const getKeyData = async (id: string) => {
        setLoading("Loading...")

        const urlData = id.split("_")
        let user = urlData[1]

        // Try to parse the id
        let localId = parseInt(urlData[0])
        if(isNaN(localId)){
            setError("Invalid Key ID")
            setLoading("")
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
                    await router.push("/account")
                }

            }

            // Get the data
            let apikeys = await makeCachedRequest("userApiKeysData_"+user, apiUrl)
            console.log(apikeys)
            if (!apikeys){
                setError("Failed to fetch API key data")
                setLoading("")
                return
            }

            // Get the key with the matching id
            let key = apikeys.filter((key: any) => key.id === localId)
            console.log(key)

            // Check if the key exists
            if (key.length === 0){
                setError("API key not found")
                setLoading("")
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
            setLoading("")
        }

        setLoading("")
    }

    const clearLogs = async () => {
        setLoading("Clearing logs...")

        // Clear the logs
        try{
            const result = await makeRequestWithToken('get', '/api/user/api_keys', {operation: "clear_logs", id: userApiKeyData.id})

        }catch (e) {
            setError("Failed to clear logs")
            setLoading("")
        }

        // Refresh the key data
        await refreshKey()

        setLoading("")

    }

    const refreshKey = async () => {
        setLoading("Refreshing...")

        // Clear the local cache
        sessionStorage.removeItem("userApiKeysData_"+userApiKeyData.user_id)

        // Get the key data
        await getKeyData(router.query.id as string)

        setLoading("")
    }


    return(
        <>
            <Layout pageName={pageName} loadingMessage={loading} error={error} loginRequired header={"Api Key"}>
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
            </Layout>
        </>
    )

}