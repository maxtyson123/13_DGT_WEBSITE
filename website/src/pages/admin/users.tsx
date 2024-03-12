import Section from "@/components/section";
import styles from "@/styles/pages/admin.module.css";
import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {RongoaUser} from "@/lib/users";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import Table from "@/components/table";
import {Layout} from "@/components/layout";
import {useRouter} from "next/router";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();

    const { data: session } = useSession()

    const permissionOptions = ["Member", "Editor", "Admin"]

    // Stats
    const [users, setUsers] = useState([] as RongoaUser[])
    const router = useRouter()

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
    })


    const fetchData = async () => {

        // Download the plants from the database
        const users = await makeCachedRequest("user_admin_data", "/api/auth/random?amount=9999999&extraData=true")
        if(!users){
            setError("Failed to fetch the user data.")
            setLoadingMessage("")
            return
        }

        // Set the users
        let userData = users as RongoaUser[]
        for(let i = 0; i < userData.length; i++)
            userData[i].database = userData[i] as any;

        console.log(userData)
        setUsers(userData)
        setLoadingMessage("")
    }


    const updateUser = async (id: number) => {
        setLoadingMessage("Updating user...")

        // Get the input values
        const name = (document.getElementById(`name_${id}`) as HTMLElement).innerText
        const email = (document.getElementById(`email_${id}`) as HTMLElement).innerText
        const type = (document.getElementById(`type_${id}`) as HTMLInputElement).value
        const restricted = (document.getElementById(`restricted_${id}`) as HTMLInputElement).value
        let permValue = permissionOptions.indexOf(type)

        // Check the if correct type
        if(permValue === -1){
            setError("Invalid type")
            setLoadingMessage("")
            return
        }

        // Check if name is not empty
        if(name == ""){
            setError("Name cannot be empty")
            setLoadingMessage("")
            return
        }

        // Check if email is not empty
        if(email == ""){
            setError("Email cannot be empty")
            setLoadingMessage("")
            return
        }

        const adminData = {
            id: id,
            name: name,
            email: email,
            type: permValue,
            restricted: restricted === "Yes"
        }

        await makeRequestWithToken("get", "/api/user/update?adminData=" + JSON.stringify(adminData))

        // Log that the admin has updated the user
        log.info(`Admin ${session?.user?.email} has updated the user with id ${id}`)

        // Remove the item in the local storage
        sessionStorage.removeItem("user_admin_data")

        // Reload the page
        await router.push("/admin/")
    }

    const deleteUser = async (id: number) => {

        // Set the loading message
        setLoadingMessage("Deleting user...")

        // Remove the user
        const response = await makeRequestWithToken("get", "/api/user/delete?id=" + id)

        // Remove the item in the local storage
        sessionStorage.removeItem("user_admin_data")

        // Reload the page
        await router.push("/admin/")
    }

    const reload = () => {
        window.location.reload()
    }

    return (
        <>
            <Layout pageName={pageName} loadingMessage={loadingMessage} error={error} loginRequired permissionRequired={"pages:admin:publicAccess"} header={"Users"}>
                {/* Section for the welcome message and search box */}
                <Section autoPadding>
                    <div className={globalStyles.gridCentre}>
                        <div className={globalStyles.container}>
                            <div className={styles.adminHeaderContainer}>
                                <h1>Welcome to the Admin Page</h1>

                                <p>Logged in as {session?.user?.name} ({session?.user?.email})</p>
                                

                                <br/>
                                <p> You are currently managing the users in the database. You can add, edit permissions, and delete users from the database.</p>

                                <Link href={"/admin/"}><button>Return</button></Link>
                            </div>
                        </div>
                    </div>

                </Section>


                <Section autoPadding>
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Restricted Access</th>
                                <th>Last Login</th>
                                <th>Update</th>
                                <th>Remove</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td> {user.id} </td>
                                    <td><p id={`name_${user.id}`} contentEditable>{user.database.user_name}</p></td>
                                    <td><p id={`email_${user.id}`} contentEditable>{user.database.user_email}</p></td>
                                    <td>
                                        <select id={`type_${user.id}`} defaultValue={permissionOptions[user.database.user_type]}>
                                            <option value="Admin">Admin</option>
                                            <option value="Editor">Editor</option>
                                            <option value="Member">Member</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id={`restricted_${user.id}`} defaultValue={user.database.user_restricted_access ? "Yes" : "No"}>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </td>
                                    <td> {new Date(user.database.user_last_login).toLocaleString()} </td>
                                    <td> <button onClick={() => {updateUser(user.database.id)}}>Update </button> </td>
                                    <td> <button onClick={() => {deleteUser(user.database.id)}}>Remove </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Section>


                {/* New User */}
                <Section autoPadding>
                    <div className={globalStyles.gridCentre}>
                        <div className={globalStyles.container}>
                            <div className={styles.adminHeaderContainer}>
                                todo
                                <h1>New User</h1>
                                <input placeholder={"Name"} id={"new_name"}/>
                                <input placeholder={"Email"} id={"new_email"}/>
                                <button>Create New</button>
                            </div>
                        </div>
                    </div>
                </Section>
            </Layout>
        </>
    )
}