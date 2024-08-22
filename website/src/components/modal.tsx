import React, {useEffect, useRef, useState} from "react";
import styles from "@/styles/components/modal.module.css"
import {fetchPlant} from "@/lib/plant_data";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {getFilePath, getPostImage} from "@/lib/data";
import {UserCard} from "@/pages/media/components/cards";

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
    id: number
}

/* Multi page image upload selector */
export function ImagePopup({show, hideCallback, plantID = 1}: ImagePopupProps) {

    const [activeTab, setActiveTab] = useState(0)
    const [defaultShow, setDefaultShow] = useState(false)

    const [currentImage, setCurrentImage] = useState("/media/images/logo.svg")
    const [currentImageName, setCurrentImageName] = useState("No Image Selected")
    const [currentImageDescription, setCurrentImageDescription] = useState("No Description")
    const [currentImagePlant, setCurrentImagePlant] = useState("No Plant Selected")
    const [currentImageUser, setCurrentImageUser] = useState(20)

    const [thisImages, setThisImages] = useState<string[]>([])
    const [postImages, setPostImages] = useState<object[]>([])
    const [myImages, setMyImages] = useState<string[]>([])

    const dataFetch = useRef(false)


    const testImages = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg"]

    useEffect(() => {
        if (!dataFetch.current) {
            dataFetch.current = true
            fetchImages()
        }
    }, []);

    const fetchImages = async () => {

        // Fetch the images for this plant
        const plantOBJ = await fetchPlant(plantID);

        // Fetch the images for this post

        // Fetch the posts for this plant
        const posts = await makeCachedRequest("editor_posts_"+plantID, "/api/posts/fetch?operation=siteFeed&plant_id=" + plantID)
        setPostImages(posts)
        console.log(posts)

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
                                    <h3>Plant Name</h3>
                                    <h3>Post Date</h3>
                                </div>


                                <UserCard id={currentImageUser}/>

                            </div>


                            {/* Main content */}
                            <div className={styles.mainContent}>

                                {/* Post Gallery */}
                                {activeTab === 1 &&
                                    <>
                                        {postImages.map((post: any, index: number) => {
                                            return (
                                                <div className={styles.imageContainer} key={index}>
                                                    <img src={getPostImage(post)}
                                                         alt={"Placeholder"}
                                                         onClick={() => {
                                                             setCurrentImage(getPostImage(post))
                                                             setCurrentImageName(post.post_title)
                                                         }}
                                                    />
                                                </div>
                                            )

                                        })}
                                    </>
                                }



                            </div>

                        </div>
                    </div>
                }
            </>


    )
}