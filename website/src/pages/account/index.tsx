import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import React, {useEffect, useRef} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/account/index.module.css"
import statsStyles from "@/styles/components/stats.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera, faPerson, faSeedling} from "@fortawesome/free-solid-svg-icons";
import {signIn, signOut, useSession} from "next-auth/react";
import {ADMIN_USER_TYPE, EDITOR_USER_TYPE, MEMBER_USER_TYPE, RongoaUser} from "@/lib/users";
import axios from "axios";
import Image from "next/image";
import {globalStyles} from "@/lib/global_css";
import {DropdownSection} from "@/components/dropdown_section";
import {useRouter} from "next/router";

export default function Account() {

    const pageName = "Account";

    const { data: session } = useSession()

    const router = useRouter()

    const [userName, setUserName] = React.useState<string | null | undefined>("")
    const [userEmail, setUserEmail] = React.useState<string | null | undefined>("")
    const [userRole, setUserRole] = React.useState<string | null | undefined>("")
    const [userImage, setUserImage] = React.useState<string | null | undefined>("")
    const [userLastLogin, setUserLastLogin] = React.useState<string | null | undefined>("")
    const [userPlants, setUserPlants] = React.useState<string | null | undefined>("")
    const [userPosts, setUserPosts] = React.useState<string | null | undefined>("")
    const [userPlantsData, setUserPlantsData] = React.useState(null)



    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)


    useEffect(() => {

        // If there is session data
        if(session?.user) {

            let user = session.user as RongoaUser
            if(!user) return

            setUserName(user.name)
            setUserEmail(user.email)
            switch (user.database.user_type){
                case MEMBER_USER_TYPE:
                    setUserRole("Member")
                    break

                case ADMIN_USER_TYPE:
                    setUserRole("Admin")
                    break

                case EDITOR_USER_TYPE:
                    setUserRole("Editor")
                    break
            }
            setUserImage(user.image)
            setUserLastLogin(user.database.user_last_login.split("T")[0])
            setUserPosts("0")

            // Prevent the data from being fetched again
            if (dataFetch.current)
                return
            dataFetch.current = true

            // Get the users data
            fetchData()

        }

    }, [session])


    const fetchData = async () => {


        // Get the users plants
        try {
            const plants = await axios.get("/api/user/plants/")
            if(!plants.data.error){
                setUserPlants(plants.data.data.length.toString())
            }
            setUserPlantsData(plants.data.data)
        } catch (e) {
            console.log(e)
            setUserPlants("0")
        }
    }

    const signOutUser = async () => {
        await signOut()
        await router.push("/")
    }

    const deleteAccount = async () => {
        await axios.delete("/api/user/delete/")
        await signOutUser()
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
                        <h1>Your Account</h1>
                    </div>
                </PageHeader>
            </Section>

            { !session ?
                <>
                    <div className={globalStyles.gridCentre}>
                        <button className={styles.signInButton} onClick={() => signIn()}><FontAwesomeIcon icon={faPerson}/> Sign in</button>
                    </div>
                </>
                :
                <>
                    {/* Users Information */}
                    <Section autoPadding>
                        <div className={globalStyles.gridCentre}>
                            <div className={styles.accountContainer}>

                                <div className={styles.lastLogin}>
                                    <p> Last Login: {userLastLogin} </p>
                                </div>

                                <div className={styles.mainInfo}>
                                    <div className={styles.accountImage}>
                                        <Image src={userImage ? userImage.replaceAll("s96-c", "s192-c") : "/media/images/logo.svg"} alt={userName ? userName : ""} fill={true}/>
                                    </div>
                                    <h1> {userName}</h1>
                                    <h2> {userEmail}</h2>
                                    <h2> {userRole}</h2>
                                </div>

                                <div className={statsStyles.statsRowContainer + " " + statsStyles.twoCols}>

                                    {/* Each stat is a div with the number central and the icon and value inline */}
                                    <div className={statsStyles.stat}>
                                        <h2> {userPlants}</h2>
                                        <FontAwesomeIcon icon={faSeedling} className={statsStyles.inline}/>
                                        <p className={statsStyles.inline}> Plants </p>
                                    </div>

                                    {/* Each stat is a div with the number central and the icon and value inline */}
                                    <div className={statsStyles.stat}>
                                        <h2> N/A </h2>
                                        <FontAwesomeIcon icon={faCamera} className={statsStyles.inline}/>
                                        <p className={statsStyles.inline}> Posts </p>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </Section>

                    {/* Users Plants */}
                    <Section autoPadding>
                        <DropdownSection title={"Plants Created"} open>
                            <div><p>asd</p></div>
                        </DropdownSection>
                    </Section>

                    {/* Users Posts */}
                    <Section autoPadding>
                        <DropdownSection title={"Posts"} open>
                            <div><p>asd</p></div>
                        </DropdownSection>
                    </Section>

                    {/* Users Api Keys */}
                    <Section autoPadding>
                        <DropdownSection title={"Api Keys"} open>
                            <div><p>asd</p></div>
                        </DropdownSection>
                    </Section>

                    {/* Actions */}
                    <Section autoPadding>
                        <div className={globalStyles.gridCentre}>

                            <div className={styles.actionItem}>
                                <button onClick={signOutUser} className={styles.signOutButton}>Sign Out</button>
                            </div>

                            <div className={styles.actionItem}>
                                <button onClick={deleteAccount} className={styles.deleteAccountButton}>Delete Account</button>
                            </div>
                        </div>
                    </Section>
                </>
            }
            {/* Footer */}
            <Section>
                <Footer/>
            </Section>
        </>

    )
}
