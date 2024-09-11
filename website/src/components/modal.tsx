import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import styles from "@/styles/components/modal.module.css"
import {fetchPlant, macronCodeToChar, numberDictionary} from "@/lib/plant_data";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {getFilePath, getPostImage} from "@/lib/data";
import {UserCard} from "@/pages/media/components/cards";
import {RongoaUser} from "@/lib/users";
import {useSession} from "next-auth/react";
import {PlantSelector} from "@/components/input_sections";
import {Loading} from "@/components/loading";
import {postImage} from "@/pages/media/new";

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
export function ImagePopup({show, hideCallback, id = 0}: ImagePopupProps) {

    const [activeTab, setActiveTab] = useState(0)
    const [defaultShow, setDefaultShow] = useState(false)
    const [isDragging, setIsDragging] = useState(false);
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
    const [localImages, setLocalImages] = useState<string[]>([])
    const [localFiles, setLocalFiles] = useState<File[]>([])
    const [selectedImages, setSelectedImages] = useState<boolean[][]>([[], [], []])

    const [loadingMessage, setLoadingMessage] = useState("")
    const [currentDisplayImages, setCurrentDisplayImages] = useState<object[]>([])

    const [plantNames, setPlantNames] = useState<string[]>(["Loading..."]);
    const [plantIDs, setPlantIDs] = useState<string[]>([""]);

    const dataFetch = useRef(false)
    const [renderKey, setRenderKey] = useState(0)

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

        // Fetch the images for this user
        const userPosts = await makeCachedRequest("editor_posts_mine_"+id, `/api/posts/fetch?operation=list&id=${(session?.user as RongoaUser).database.id}`);
        console.log(userPosts);
        let plantUserPosts;
        if(userPosts){
            // Reverse the posts
            userPosts.reverse();

            plantUserPosts = userPosts.filter((post: any) => post.post_plant_id == id)
            setMyImages(plantUserPosts);
        }


        // Fetch the posts for this plant
        const posts = await makeCachedRequest("editor_posts_"+id, "/api/posts/fetch?operation=siteFeed&plant_id=" + id)
        if(posts)
            setPostImages(posts)


        let cSelectedImages = [[], Array(posts.length).fill(false), Array(plantUserPosts.length).fill(false)]
        console.log(cSelectedImages)
        setSelectedImages(cSelectedImages)
    }


    const updateSelectedImages = (imageIndex: number) => {
        let newSelectedImages = selectedImages
        newSelectedImages[activeTab][imageIndex] = !newSelectedImages[activeTab][imageIndex]
        console.log(newSelectedImages)
        setSelectedImages(newSelectedImages)
        setRenderKey(renderKey + 1)
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
        resetCurrentImage()
    }

    const resetCurrentImage = () => {
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

    const dragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const dropFile = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);

    };

    const submitFile = () => {

        // Create and click an file input
        const input = document.createElement('input') as HTMLInputElement;
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
                handleFiles(event.target.files);
            }
        };
        input.click();
    }

    const dragLeave = () => {
        setIsDragging(false);
    };

    const handleFiles = (files: FileList) => {

        // Create blobs for all the files
        const blobs = Array.from(files).map(file => URL.createObjectURL(file))

        setLocalImages((prev) => [...prev, ...blobs])
        setLocalFiles((prev) => [...prev, ...Array.from(files)])

    }


    const uploadImage = async (image: string) => {


        // Get the file
        const file = localFiles[localImages.indexOf(image)]
        console.log(file)


        const titleInput = document.getElementById("title") as HTMLElement;
        const title = titleInput.innerText;
        if(title === "Please Type a Title Here" || title === "No Image Selected") {
            alert("Please type a title")
            return;
        }


        // Set the loading message
        setLoadingMessage("Uploading image")

        // Create a form data object
        const user = session?.user as RongoaUser
        if(user == null) return
        const userID = user.database.id
        const userName = user.database.user_name

        // Upload the image
        await postImage(file, title, id, userID, userName, setLoadingMessage, true)
        setLoadingMessage("")

        // Remove the image from the local images
        const index = localImages.indexOf(image)
        setLocalImages((prev) => { prev.splice(index, 1); return prev})
        setLocalFiles((prev) => { prev.splice(index, 1); return prev})

        // Reset the current image
        resetCurrentImage()
    }

    return (
            <>
                {loadingMessage && <Loading progressMessage={loadingMessage}/>}
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
                                    <h1
                                        id={"title"}
                                        contentEditable={activeTab == 3}
                                    >{currentImageName}</h1>
                                    <h2>Description</h2>
                                </div>

                                <div>
                                    <h3>{currentImage}</h3>
                                    { activeTab !== 3 &&
                                        <>
                                            <h3>{currentImagePlant}</h3>
                                            <h3>{currentImageDate}</h3>
                                        </>
                                    }
                                </div>

                                {activeTab == 3 ?
                                     <>
                                         <button
                                             className={styles.uploadImageButton}
                                             onClick={() => uploadImage(currentImage)}>Upload</button>
                                     </>
                                    :
                                    <UserCard id={currentImageUser}/>
                                }

                            </div>


                            {/* Main content */}
                            <div
                                className={`${styles.mainContent} ${isDragging ? styles.dragging : ''}`}
                                onDrop={dropFile}
                                onDragOver={dragOver}
                                onDragLeave={dragLeave}
                                key={renderKey}
                            >
                                {isDragging && <div className={styles.dragText}>Drop your image here</div>}
                                {activeTab == 3 ?
                                    <>
                                        {/* Current Image Blobs */}
                                        {localImages.map((image, index) => {
                                            return (
                                                <div className={styles.imageContainer} key={index}>
                                                    <img src={image}
                                                         alt={"Placeholder"}
                                                         onClick={() => {
                                                             setCurrentImage(image)
                                                             setCurrentImageName("Please Type a Title Here")
                                                         }}
                                                    />
                                                </div>
                                            )
                                        })}

                                        {/* Upload Image Only Button */}
                                        {!isDragging &&
                                            <button className={styles.uploadImageButton} onClick={submitFile}>Upload
                                                Image</button>}

                                    </>
                                    :
                                    <>

                                    {/* If there are no images */}
                                    {currentDisplayImages.length === 0 &&
                                        <div className={styles.noImages}>
                                            <h1>No Images</h1>
                                        </div>
                                    }

                                    {/* Display the images */}
                                    {currentDisplayImages.map((post: any, index: number) => {
                                            return (
                                                <div className={styles.imageContainer + " " + (selectedImages[activeTab][index] ? styles.selected : "")} key={index}>
                                                    <img src={getPostImage(post)}
                                                         alt={"Placeholder"}
                                                         onClick={() => {
                                                             setCurrentImage(getPostImage(post))
                                                             setCurrentImageName(post.post_title)
                                                             setCurrentImageUser(post.post_user_id)
                                                             setCurrentImagePlant(plantNames[plantIDs.indexOf(post.post_plant_id)])
                                                             setCurrentImageDate(new Date(post.post_date).toLocaleString())
                                                             updateSelectedImages(index)
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