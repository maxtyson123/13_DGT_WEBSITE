import Section from "@/components/section";
import styles from "@/styles/pages/admin.module.css";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import {
    DropdownInput,
    FileInput,
    FilteredSearchInput,
    PlantSelector, SimpleTextArea,
    SmallInput,
    ValidationState
} from "@/components/input_sections";
import {useRouter} from "next/router";
import {Layout} from "@/components/layout";
import {RongoaUser, UserDatabaseDetails} from "@/lib/users";
import {PostCard, PostCardApi} from "@/pages/media/components/cards";
import {getFilePath, getPostImage, toTitleCase} from "@/lib/data";
import {EditPostPopup, ModalImage} from "@/components/modal";
import {getNamesInPreference, macronCodeToChar, numberDictionary} from "@/lib/plant_data";

export default function Admin(){
    const pageName = "Admin";
    const log = useLogger();
    const router = useRouter()
    const { data: session, update } = useSession()

    const [posts, setPosts] = useState<any[]>([])
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [loadingMessage, setLoadingMessage] = useState("")
    const [error, setError] = useState("")

    const [postTitle, setPostTitle] = useState("")
    const [plant, setPlant] = useState("")

    const [showEditPost, setShowEditPost] = useState(false)


    useEffect(() => {
        getUnModeratedPosts()
    }, [])

    const getUnModeratedPosts = async () => {

        try {
            setLoadingMessage("Loading posts to moderate")
            const response = await makeRequestWithToken("get", "/api/posts/moderate?operation=list")


            if(response.data.data){

                setPosts(response.data.data)
            }
            setLoadingMessage("")

        } catch (e: any) {
            setError("Error loading posts to moderate")
            log.error(e)
        }
    }

    const handleModeration = (action: string) => {


        setLoadingMessage("Moderating post...")
        setShowEditPost(false);
        const postContainer = document.querySelector(`.${styles.postsToModerate}`);
        const postCard = postContainer?.firstChild as HTMLElement;

        if (postCard) {
            postCard.classList.add(styles.slideoutAnimation);
            setTimeout(async () => {
                // Perform the moderation action (approve/deny)
                let url = `/api/posts/moderate?id=${posts[currentIndex].id}&operation=${action}`;

                await makeRequestWithToken("get", url);
                setLoadingMessage("");

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
                                <p> There are {posts.length} posts that need to be moderated. </p>
                            </div>
                        </div>

                        <div id={"widthReference"} style={{width: "400px", height: "50px"}}/>
                        {posts && posts.length > 0 &&
                            <ModalImage url={getPostImage(posts[currentIndex])} description={"Post: " + currentIndex} >
                                <div className={styles.postsToModerate}>
                                {posts && posts.slice(currentIndex, currentIndex + 2).map((post: any) => (

                                        <PostCardApi id={post.id} key={post.id}/>

                                ))}
                                {currentIndex >= posts.length && (
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
                            </ModalImage>
                        }

                        <div className={styles.adminHeaderContainer}>
                            <div className={styles.approveAndDeny}>
                                <button style={{background: "red"}} onClick={() => handleModeration("deny")}> Deny</button>
                                <button style={{background: "orange"}} onClick={() => {
                                   if(posts[currentIndex]?.post_plant_id) {
                                       setShowEditPost(true);
                                   }
                                }}> Edit</button>
                                <button onClick={() => handleModeration("approve")}> Approve</button>
                            </div>
                        </div>
                    </div>

                    <EditPostPopup show={showEditPost} hideCallback={(edited, post) => {
                        setShowEditPost(false)
                        if(edited)  handleModeration("approve");
                    }
                    } post={posts[currentIndex]}/>

                </Section>
            </Layout>
        </>
    )
}