import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import Section from "@/components/section";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/admin.module.css";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import Footer from "@/components/footer";
import {loginSection} from "@/pages/account";
import {useSession} from "next-auth/react";
import {Loading} from "@/components/loading";
import {Error} from "@/components/error";
import {checkUserPermissions, RongoaUser} from "@/lib/users";
import {makeCachedRequest} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
export default function Admin(){
    const pageName = "Admin";

    const { data: session } = useSession()

    // Stats
    const [numberOfPlants, setNumberOfPlants] = useState(0)
    const [numberOfUsers, setNumberOfUsers] = useState(0)
    const [numberOfSettings, setNumberOfSettings] = useState(0)

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

        // Fetch the user count
        setLoadingMessage("Fetching user count...")
        const users = await makeCachedRequest("user_stats", "/api/auth/random?amount=9999999")
        if(!users){
            setError("User data not found")
            setLoading(false)
            return
        }

        // Store the number of users
        setNumberOfUsers(users.length)

        // Fetch the plant count
        setLoadingMessage("Fetching plant count...")
        const plants = await makeCachedRequest("plant_stats", "/api/plants/uses")
        if(!plants){
            setError("Plant data not found")
            setLoading(false)
            return
        }

        // Store the number of plants
        let plantCount = 0
        for (const use in plants)
            plantCount += 1
        setNumberOfPlants(plantCount)


        // Fetch the settings count
        setLoadingMessage("Fetching settings count...")

        // Finish loading
        setLoading(false)
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
                    {!session?
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