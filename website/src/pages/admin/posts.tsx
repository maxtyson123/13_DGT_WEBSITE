import Section from "@/components/section";
import styles from "@/styles/pages/admin.module.css";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {globalStyles} from "@/lib/global_css";
import { useLogger } from 'next-axiom';
import {DropdownInput, FileInput, FilteredSearchInput, SmallInput, ValidationState} from "@/components/input_sections";
import {useRouter} from "next/router";
import {Layout} from "@/components/layout";
import {RongoaUser, UserDatabaseDetails} from "@/lib/users";
import {PostCard, PostCardApi} from "@/pages/media/components/cards";
import {getFilePath, toTitleCase} from "@/lib/data";
import {ModalImage} from "@/components/modal";
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
    const [plantNames, setPlantNames] = useState<string[]>(["Loading..."]);
    const [plantIDs, setPlantIDs] = useState<string[]>([""]);

    const [showEditPost, setShowEditPost] = useState(false)


    useEffect(() => {
        getUnModeratedPosts()
    }, [])

    const getUnModeratedPosts = async () => {

        // Get the plants
        const plants = await makeCachedRequest('plants_names_all', '/api/plants/search?getNames=true&getUnpublished=true');

        // Get the plant names
        let plantNames = plants.map((plant : any) => {

            if (plant.maori_name && plant.english_name)
                return  macronCodeToChar(`${plant.maori_name} | ${plant.english_name}`, numberDictionary)

            if(plant.maori_name)
                return macronCodeToChar(plant.maori_name, numberDictionary)

            if(plant.english_name)
                return macronCodeToChar(plant.english_name, numberDictionary)

        });


        // Remove the macrons
        plantNames = plantNames.map(option => option.toLowerCase().replaceAll("ā", "a").replaceAll("ē", "e").replaceAll("ī", "i").replaceAll("ō", "o").replaceAll("ū", "u"));

        // Set the first letter to be capital
        plantNames = plantNames.map(option => toTitleCase(option));

        const plantIDs = plants.map((plant : any) => plant.id);

        setPlantNames(plantNames);
        setPlantIDs(plantIDs);

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

        console.log(plant)
        console.log(plantNames)
        console.log(plantIDs)
        const post_plant_id = plantIDs[plantNames.indexOf(plant)];
        console.log(post_plant_id)

        if (postCard) {
            postCard.classList.add(styles.slideoutAnimation);
            setTimeout(async () => {
                // Perform the moderation action (approve/deny)
                let url = `/api/posts/moderate?id=${posts[currentIndex].id}&operation=${action}`;

                if(action === "edit") {
                    url += `&post_title=${postTitle}&post_plant_id=${post_plant_id}`;
                }

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

                {showEditPost && (
                    <div className={styles.editPostOverlay}>
                        <div className={styles.editPostContainer}>
                            <div className={styles.editPostHeader}>
                                <h1>Edit Post</h1>
                                <button onClick={() => setShowEditPost(false)}>Cancel</button>
                            </div>
                            <div className={styles.editPostContent}>
                                <SmallInput
                                    placeHolder={"Post Title"}
                                    required={true}
                                    state={"normal"}
                                    defaultValue={posts[currentIndex].post_title}
                                    changeEventHandler={setPostTitle}
                                />

                                <FilteredSearchInput
                                    placeHolder={"Plant"}
                                    required={true}
                                    state={"normal"}
                                    options={plantNames}
                                    defaultValue={plantNames[plantIDs.indexOf(posts[currentIndex].post_plant_id)]}
                                    changeEventHandler={setPlant}
                                    forceOptions
                                />
                                <button onClick={() => handleModeration("edit")}>Submit</button>
                            </div>
                        </div>
                    </div>
                    )
                }


                <Section autoPadding>
                    <div className={globalStyles.gridCentre}>
                        <div className={globalStyles.container}>
                            <div className={styles.adminHeaderContainer}>
                                <h1>Post Moderation</h1>
                                <p> There are {posts.length} posts that need to be moderated. </p>
                            </div>
                        </div>

                        <div id={"widthReference"} style={{width: "400px", height: "50px"}}/>
                        <ModalImage url={getFilePath(posts[currentIndex]?.post_user_id, posts[currentIndex]?.id, posts[currentIndex]?.post_image)} description={"Post: " + currentIndex} >
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
                </Section>
            </Layout>
        </>
    )
}