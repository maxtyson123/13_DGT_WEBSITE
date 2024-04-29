import React, {useEffect} from "react";
import Section from "@/components/section";
import styles from "@/styles/pages/account/index.module.css"
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {SmallInput, ValidationState} from "@/components/input_sections";
import {getDefaultPermissions, getStrings, getUserPermissions, RongoaUser, UserPermissions} from "@/lib/users";
import {makeRequestWithToken} from "@/lib/api_tools";
import {Error} from "@/components/error";
import {Layout} from "@/components/layout";

export default function Account() {

    return(
        <AccountPage dataID={"0"}/>
    )

}

interface AccountPageProps {
    dataID: string | string[]
}

export function AccountPage({dataID}: AccountPageProps){
    const pageName = "Account";

    const { data: session } = useSession()

    const router = useRouter()

    // Data states
    const [keyName, setKeyName] = React.useState("")
    const [keyNameState, setKeyNameState] = React.useState<[ValidationState, string]>(["normal", ""])
    const [keyPermissions, setKeyPermissions] = React.useState<string[]>([])

    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    // Check if the user is logged in
    useEffect(() => {
        if (session?.user) {
            generateKeyPermissions()
        }
    }, [session])


    // Generate the key permissions
    const generateKeyPermissions = () => {

        const permissions = getUserPermissions(session?.user as RongoaUser)
        setKeyPermissions(getStrings(permissions))
    }

    const getPermissions = () => {

        let permissions: UserPermissions = getDefaultPermissions();

        function updatePermissions(permissions: any, keys: string[], permissionValue: boolean) {
            let currentLevel = permissions;

            for (let i = 0; i < keys.length - 1; i++) {
                currentLevel = currentLevel[keys[i]] = currentLevel[keys[i]] || {};
            }

            currentLevel[keys[keys.length - 1]] = permissionValue;
        }

        // Loop through the permissions
        for (let permission of keyPermissions) {

            // Get the value of the permission
            let permissionValue = (document.getElementById(permission) as HTMLInputElement)?.checked

            // Check if the permission is undefined or null
            if (permissionValue === undefined || permissionValue === null) continue;

            // Get the keys
            let keys = permission.split(":")

            // Replace access with publicAccess
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === "access") keys[i] = "publicAccess"
            }

            // Update the permissions
            updatePermissions(permissions, keys, permissionValue)

        }
        return permissions

    }

    const uploadKey = async () => {

        setLoading(true)

        // Check if the key name is valid
        if (keyName === "") {
            setKeyNameState(["error", "Key name cannot be empty"])
            setLoading(false)

            // Scroll to the top of the page
            window.scrollTo(0, 0)
            return
        }else {
            setKeyNameState(["success", ""])
        }

        // Get the permissions
        const permissions = getPermissions()

        // Check if there is atleast one permission set to true
        let hasPermission = false
        for (let permission of keyPermissions) {

            // Get the value of the permission
            let permissionValue = (document.getElementById(permission) as HTMLInputElement)?.checked

            if(permissionValue) hasPermission = true
        }

        if(!hasPermission){
            setError("You must have atleast one permission set to true")
            setLoading(false)

            // Scroll to the top of the page
            window.scrollTo(0, 0)
            return
        }

        // Upload the key
        try{
            const response = await makeRequestWithToken("post", "/api/user/keys?operation=new&keyName=" + keyName + "&permissions=" + JSON.stringify(permissions))
        } catch (e) {
            console.log(e)
            setError((e as Error).message)
        }

        // Delete the cached user keys
        sessionStorage.removeItem("userApiKeysData_0")

        setLoading(false)
        // Go to the account page
        await router.push("/account/")

    }


    return(
        <>
            <Layout pageName={pageName} loadingMessage={loading ? "Uploading Key..." : ""} error={error} header={"Create New Key"} loginRequired>
                <Section autoPadding>

                    <div className={styles.keysCreatorContainer}>

                        <div className={styles.keyItem}>
                            <h2>Key Name</h2>
                            <SmallInput placeHolder={"Enter Name..."} required={true} state={keyNameState[0]} errorText={keyNameState[1]} changeEventHandler={setKeyName}/>
                        </div>

                        <h2>Permissions</h2>

                        {keyPermissions.map((permission, index) => {
                            return (
                                <div key={index} className={styles.keyItem}>
                                    {/* Check box for the permission */}
                                    <label htmlFor={permission}>{permission}</label>
                                    <input type={"checkbox"} id={permission} name={permission} value={permission}/>

                                </div>
                            )
                        })}

                        <button className={styles.createButton} onClick={uploadKey}>Create Key</button>

                    </div>
                </Section>
            </Layout>
        </>

    )
}