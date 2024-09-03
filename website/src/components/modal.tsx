import React, {useEffect, useRef, useState} from "react";
import styles from "@/styles/components/modal.module.css"
import {fetchPlant, macronCodeToChar, numberDictionary} from "@/lib/plant_data";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {getFilePath, getPostImage} from "@/lib/data";
import {UserCard} from "@/pages/media/components/cards";
import {RongoaUser} from "@/lib/users";
import {useSession} from "next-auth/react";

interface ModalImageProps {
    url: string
    description: string
    show?: boolean
    hideCallbackOveride?: () => void
    children?: React.ReactNode
}

export function ModalImage({url, description, show, hideCallbackOveride, children}: ModalImageProps) {


    const [defaultShow, setDefaultShow] = useState(false)

    useEffect(() => {
        if(defaultShow) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

    }, [defaultShow])

    useEffect(() => {
        if(show) {
            setDefaultShow(true)
        }else{
            setDefaultShow(false)
        }
    }, [show])

    const toggleShow = () => {
        setDefaultShow(!defaultShow)
    }

    return (
        <>
            <div onClick={hideCallbackOveride ? hideCallbackOveride : toggleShow}>
                {children}
            </div>
            {defaultShow &&
                <div className={styles.modal}>
                    <span className={styles.close} onClick={hideCallbackOveride ? hideCallbackOveride : toggleShow}>&times;</span>
                    <img className={styles.modalContent} src={url} alt={description}/>
                    <p className={styles.caption}>{description}</p>
                </div>
            }
        </>
    )
}



type ImagePopupProps = {
    show: boolean
    hideCallback: () => (value: string[]) => void
    id?: number
}

/* Multi page image upload selector */
export function ImagePopup({show, hideCallback, id = 1}: ImagePopupProps) {

    const [activeTab, setActiveTab] = useState(0)
    const [defaultShow, setDefaultShow] = useState(false)
    const {data: session} = useSession();

    const [currentImage, setCurrentImage] = useState("/media/images/logo.svg")
    const [currentImageName, setCurrentImageName] = useState("No Image Selected")
    const [currentImageDescription, setCurrentImageDescription] = useState("No Description")
    const [currentImageDate, setCurrentImageDate] = useState("No Date")
    const [currentImagePlant, setCurrentImagePlant] = useState("No Plant Selected")
    const [currentImageUser, setCurrentImageUser] = useState(20)

    const [thisImages, setThisImages] = useState<object[]>([])
    const [postImages, setPostImages] = useState<object[]>([])
    const [myImages, setMyImages] = useState<object[]>([])

    const [currentDisplayImages, setCurrentDisplayImages] = useState<object[]>([])

    const [plantNames, setPlantNames] = useState<string[]>(["Loading..."]);
    const [plantIDs, setPlantIDs] = useState<string[]>([""]);

    const dataFetch = useRef(false)

    useEffect(() => {
        if (!dataFetch.current && id) {
            dataFetch.current = true
            fetchImages()
        }
    }, [id]);



    const fetchImages = async () => {

        // Get the plants (TODO: Used lots make function)
        const plants = await makeCachedRequest('plants_names_all', '/api/plants/search?getNames=true&getUnpublished=true');

        // Get the plant names
        const plantNames = plants.map((plant : any) => {

            if (plant.maori_name && plant.english_name)
                return  macronCodeToChar(`${plant.maori_name} | ${plant.english_name}`, numberDictionary)

            if(plant.maori_name)
                return macronCodeToChar(plant.maori_name, numberDictionary)

            if(plant.english_name)
                return macronCodeToChar(plant.english_name, numberDictionary)

        });
        const plantIDs = plants.map((plant : any) => plant.id);

        setPlantNames(plantNames);
        setPlantIDs(plantIDs);


        // Fetch the images for this plant
        const plantOBJ = await fetchPlant(id);

        // Fetch the images for this post
        const userPosts = await makeCachedRequest("editor_posts_mine_"+id, `/api/posts/fetch?operation=list&id=${(id ? id : (session?.user as RongoaUser).database.id)}`);
        console.log(userPosts);
        if(userPosts){
            // Reverse the posts
            userPosts.reverse();

            let plantUserPosts = userPosts.filter((post: any) => post.plant_id === id)

            setMyImages(plantUserPosts);
        }

        // Fetch the posts for this plant
        const posts = await makeCachedRequest("editor_posts_"+id, "/api/posts/fetch?operation=siteFeed&plant_id=" + id)
        if(posts)
            setPostImages(posts)

        // Fetch the images for this user

    }

    useEffect(() => {
        if(defaultShow) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

    }, [defaultShow])

    useEffect(() => {
            setDefaultShow(show)
    }, [show])


    const setTab = (tab: number) => {
        setActiveTab(tab)

        // Update the displayed images
        switch (tab){
            case 0:
                setCurrentDisplayImages(thisImages)
                break

            case 1:
                setCurrentDisplayImages(postImages)
                break

            case 2:
                setCurrentDisplayImages(myImages)
                break
        }

        // Reset the currently selected display one
        setCurrentImage("/media/images/logo.svg")
        setCurrentImageName("No Image Selected")
        setCurrentImageUser(20)
        setCurrentImagePlant("No Plant Selected")
        setCurrentImageDate("No Date")
    }


    const hide = () => {
        setDefaultShow(false)
        hideCallback()
    }

    return (
            <>
                {defaultShow &&
                    <div className={styles.imagePopup}>
                        <div className={styles.imagePopupContent}>


                    <span className={styles.close}
                          onClick={hide}
                          style={{color: "black"}}
                    >&times;</span>

                            {/* Tab selector */}
                            <div className={styles.tabs}>

                                <button onClick={() => setTab(0)}
                                        className={activeTab === 0 ? styles.activeTab : ""}>This Plant
                                </button>
                                <button onClick={() => setTab(1)}
                                        className={activeTab === 1 ? styles.activeTab : ""}>Post Gallery
                                </button>
                                <button onClick={() => setTab(2)} className={activeTab === 2 ? styles.activeTab : ""}>My
                                    Images
                                </button>
                                <button onClick={() => setTab(3)}
                                        className={activeTab === 3 ? styles.activeTab : ""}>Upload
                                </button>

                            </div>

                            {/* Side panel */}
                            <div className={styles.sidePanel}>
                                <img src={currentImage}
                                     alt={currentImageName}/>

                                <div>
                                    <h1>{currentImageName}</h1>
                                    <h2>Description</h2>
                                </div>

                                <div>
                                    <h3>{currentImage}</h3>
                                    <h3>{currentImagePlant}</h3>
                                    <h3>{currentImageDate}</h3>
                                </div>


                                <UserCard id={currentImageUser}/>

                            </div>


                            {/* Main content */}
                            <div className={styles.mainContent}>
                                    {currentDisplayImages.map((post: any, index: number) => {
                                        return (
                                            <div className={styles.imageContainer} key={index}>
                                                <img src={getPostImage(post)}
                                                     alt={"Placeholder"}
                                                     onClick={() => {
                                                         setCurrentImage(getPostImage(post))
                                                         setCurrentImageName(post.post_title)
                                                         setCurrentImageUser(post.post_user_id)
                                                         setCurrentImagePlant(plantNames[plantIDs.indexOf(post.post_plant_id)])
                                                         setCurrentImageDate(new Date(post.post_date).toLocaleString())

                                                     }}
                                                />
                                            </div>
                                        )

                                    })}

                            </div>

                        </div>
                    </div>
                }
            </>


    )
}