import Section from "@/components/section";
import styles from "@/styles/pages/admin.module.css";
import Link from "next/link";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import {FileInput, SmallInput, ValidationState} from "@/components/input_sections";
import {useRouter} from "next/router";
import {Layout} from "@/components/layout";
import {RongoaUser, UserDatabaseDetails} from "@/lib/users";
import {PostCardApi} from "@/pages/media/components/cards";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();
    const router = useRouter()
    const { data: session, update } = useSession()


    // Load the data
    const [loadingMessage, setLoadingMessage] = useState("")
    const [error, setError] = useState("")


    return (
        <>
           <Layout pageName={pageName} loadingMessage={loadingMessage} error={error} loginRequired header={"Settings"} permissionRequired={"pages:admin:publicAccess"}>
               {/* Section for the welcome message and search box */}
               <Section autoPadding>
                   <div className={globalStyles.gridCentre}>
                       <div className={globalStyles.container}>
                           <div className={styles.adminHeaderContainer}>
                               <h1>Welcome to the Admin Page</h1>

                               <p>Logged in as {session?.user?.name} ({session?.user?.email})</p>
                               

                               <br/>
                               <p> You are currently managing the posts in the database. You can view all the posts and moderate the user posts.</p>

                               <Link href={"/admin/"}><button>Return</button></Link>
                           </div>
                       </div>
                   </div>

               </Section>


               <Section autoPadding>
                   <div className={globalStyles.gridCentre}>
                       <div className={globalStyles.container}>
                           <div className={styles.adminHeaderContainer}>
                               <h1>Post Moderation</h1>
                               <button> Delete</button>
                               <button> Approve</button>
                           </div>
                       </div>

                       <div id={"widthReference"} style={{width: "400px", height: "50px"}}/>
                       <div>
                            <PostCardApi id={35}/>
                       </div>
                   </div>
               </Section>
           </Layout>
        </>
    )
}