import Section from "@/components/section";
import styles from "@/styles/pages/admin.module.css";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import {FileInput, SmallInput, ValidationState} from "@/components/input_sections";
import {useRouter} from "next/router";
import {Layout} from "@/components/layout";
import {RongoaUser, UserDatabaseDetails} from "@/lib/users";
import {PostCard, PostCardApi} from "@/pages/media/components/cards";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();
    const router = useRouter()
    const { data: session, update } = useSession()

    const [moderationIds, setModerationIds] = useState<number[]>([])
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [loadingMessage, setLoadingMessage] = useState("")
    const [error, setError] = useState("")


    useEffect(() => {
        getUnModeratedPosts()
    }, [])

    const getUnModeratedPosts = async () => {

        try {
            setLoadingMessage("Loading posts to moderate")
            const response = await makeRequestWithToken("get", "/api/posts/moderate?operation=list")


            if(response.data.data){

                const ids = response.data.data.map((post: any) => post.id)
                setModerationIds(ids)
            }
            setLoadingMessage("")

        } catch (e: any) {
            setError("Error loading posts to moderate")
            log.error(e)
        }
    }

    const handleModeration = (action: string) => {
        const postContainer = document.querySelector(`.${styles.postsToModerate}`);
        const postCard = postContainer?.firstChild as HTMLElement;
        if (postCard) {
            postCard.classList.add(styles.slideoutAnimation);
            setTimeout(async () => {
                // Perform the moderation action (approve/deny)
                await makeRequestWithToken("get", `/api/posts/moderate?id=${moderationIds[currentIndex]}&operation=${action}`);

                // Slide away the first post and show the next one
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 500); // Match the duration of the CSS transition
        }
    };

    return (
        <>
            <Layout pageName={pageName} loadingMessage={loadingMessage} error={error} loginRequired header={"Settings"} permissionRequired={"pages:admin:publicAccess"}>
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
                            </div>
                        </div>

                        <div id={"widthReference"} style={{width: "400px", height: "50px"}}/>
                        <div className={styles.postsToModerate}>
                            {moderationIds && moderationIds.slice(currentIndex, currentIndex + 2).map((id) => (
                                    <PostCardApi id={id} key={id}/>
                            ))}
                            {currentIndex >= moderationIds.length && (
                                <div style={{
                                    background: "white",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    marginTop: "200px",
                                    textAlign: "center",
                                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                                    height: "200px"
                                }}>
                                    <h1>No more posts to moderate</h1>
                                </div>
                            )}
                        </div>

                        <div className={styles.adminHeaderContainer}>
                            <div className={styles.approveAndDeny}>
                                <button style={{background: "red"}} onClick={() => handleModeration("deny")}> Deny</button>
                                <button onClick={() => handleModeration("approve")}> Approve</button>
                            </div>
                        </div>
                    </div>
                </Section>
            </Layout>
        </>
    )
}