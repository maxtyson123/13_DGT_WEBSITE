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
import {ADMIN_USER_TYPE, checkUserPermissions, EDITOR_USER_TYPE, MEMBER_USER_TYPE, RongoaUser} from "@/lib/users";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import { Client } from "@axiomhq/axiom-node";
import {getNamesInPreference, macronCodeToChar, macronsForDisplay, numberDictionary, PlantData} from "@/lib/plant_data";
import {SmallInput, ValidationState} from "@/components/input_sections";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();

    const { data: session } = useSession()

    const permissionOptions = ["Member", "Editor", "Admin"]

    // Stats
    const [users, setUsers] = useState([] as RongoaUser[])

    // Load the data
    const [loading, setLoading] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState("Loading...")
    const [error, setError] = useState("")

    // Excel input
    const [excelInput, setExcelInput] = useState("")
    const [excelError, setExcelError] = useState("")
    const [excelState, setExcelState] = useState<ValidationState>("normal")

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
        const users = await makeCachedRequest("user_admin_data", "/api/auth/random?amount=9999999&extraData=true")
        if(!users){
            setError("Failed to fetch the user data.")
            setLoading(false)
            return
        }

        // Set the users
        let userData = users as RongoaUser[]
        for(let i = 0; i < userData.length; i++){
            userData[i].database = userData[i] as any;
        }

        // Sort the users by id
        userData.sort((a, b) => a.database.id - b.database.id)

        setUsers(userData)
        setLoading(false)
    }


    const updateUser = async (id: number) => {
        setLoading(true)
        setLoadingMessage("Updating user...")

        // Get the input values
        const name = (document.getElementById(`name_${id}`) as HTMLInputElement).value
        const email = (document.getElementById(`email_${id}`) as HTMLInputElement).value
        const type = (document.getElementById(`type_${id}`) as HTMLInputElement).value
        let permValue = permissionOptions.indexOf(type)

        // Check the if correct type
        if(permValue === -1){
            setError("Invalid type")
            setLoading(false)
            return
        }

        // Check if name is not empty
        if(name == ""){
            setError("Name cannot be empty")
            setLoading(false)
            return
        }

        // Check if email is not empty
        if(email == ""){
            setError("Email cannot be empty")
            setLoading(false)
            return
        }

        const adminData = {
            id: id,
            name: name,
            email: email,
            type: permValue
        }

        const response = await makeRequestWithToken("get", "/api/user/update?adminData=" + JSON.stringify(adminData))

        // Log that the admin has updated the user
        log.info(`Admin ${session?.user?.email} has updated the user with id ${id}`)

        // Remove the item in the local storage
        localStorage.removeItem("user_admin_data")

        // Reload the page
        window.location.reload()
    }

    const deleteUser = async (id: number) => {

        // Set the loading message
        setLoading(true)
        setLoadingMessage("Deleting user...")

        // Remove the user
        const response = await makeRequestWithToken("get", "/api/user/delete?id=" + id)

        // Remove the item in the local storage
        localStorage.removeItem("user_admin_data")

        // Reload the page
        window.location.reload()
    }

    const reload = () => {
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
                                <p> You are currently managing the users in the database. You can add, edit permissions, and delete users from the database.</p>

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
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>View Restricted</th>
                                    <th>Last Logged In</th>
                                    <th>Update</th>
                                    <th>Remove</th>
                                </tr>

                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td> {user.id} </td>
                                        <td><input id={`name_${user.id}`} defaultValue={user.database.user_name}/></td>
                                        <td><input id={`email_${user.id}`} defaultValue={user.database.user_email}/></td>
                                        <td>
                                            <select id={`type_${user.id}`}
                                                    defaultValue={permissionOptions[user.database.user_type]}>
                                                <option value="Admin">Admin</option>
                                                <option value="Editor">Editor</option>
                                                <option value="Member">Member</option>
                                            </select>
                                        </td>
                                        <td> {user.database.user_restricted_access ? "Yes" : "No"} </td>
                                        <td> {new Date(user.database.user_last_login).toLocaleString()} </td>
                                        <td><button onClick={() => {updateUser(user.database.id)}}>Update</button></td>
                                        <td><button onClick={() => {deleteUser(user.database.id)}}>Remove</button></td>
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
                    <div className={globalStyles.gridCentre}>
                        <button className={styles.reloadButton} onClick={reload}>Retry</button>
                    </div>
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