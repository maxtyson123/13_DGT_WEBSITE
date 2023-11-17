import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import React, {useEffect} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/account/index.module.css"
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {loginSection} from "@/pages/account";
import {SmallInput, ValidationState} from "@/components/input_sections";
import {getDefaultPermissions, getStrings, getUserPermissions, RongoaUser, UserPermissions} from "@/lib/users";
import {makeRequestWithToken} from "@/lib/api_tools";
import {Loading} from "@/components/loading";
import {Error} from "@/components/error";

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

        console.log(permissions)
        return permissions

    }

    const uploadKey = async () => {

        setLoading(true)

        // Check if the key name is valid
        if (keyName === "") {
            setKeyNameState(["error", "Key name cannot be empty"])
            setLoading(false)
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
            return
        }

        // Upload the key
        try{
            const response = await makeRequestWithToken("post", "/api/user/api_keys?operation=new&keyName=" + keyName + "&permissions=" + JSON.stringify(permissions))
        } catch (e) {
            console.log(e)
            setError((e as Error).message)
        }

        // Delete the cached user keys
        localStorage.removeItem("userApiKeysData_0")

        setLoading(false)
        // Go to the account page
        router.push("/account/")

    }

    const keysCreator = () => {
        return (
            <>
                <Section autoPadding>

                    <div className={styles.keysCreatorContainer}>

                        <div className={styles.keyItem}>
                            <h2>Key Name</h2>
                            <SmallInput placeHolder={"Enter Name..."} required={true} state={keyNameState[0]} errorText={keyNameState[1]} changeEventHandler={setKeyName}/>
                        </div>

                        <div className={styles.keyItem}>
                            <h2>Key Permissions</h2>
                            <div className={styles.keyPermissionsContainer}>
                                {keyPermissions.map((permission, index) => {
                                    return (
                                        <div key={index} className={styles.keyPermissionItem}>
                                            {/* Check box for the permission */}
                                            <label htmlFor={permission}>{permission}</label>
                                            <input type={"checkbox"} id={permission} name={permission} value={permission}/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className={styles.keyItem}>
                            <button className={styles.createKeyButton} onClick={uploadKey}>Create Key</button>
                        </div>

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
            {loading && <Loading progressMessage={"Uploading Key..."}/>}

            {/* Error Message */}
            {error && <Section autoPadding> <Error error={error}/> </Section> }

            {!session?
                loginSection()
                :
                keysCreator()
            }

            {/* Footer */}
            <Section>
                <Footer/>
            </Section>
        </>

    )
}