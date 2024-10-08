import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import styles from "@/styles/components/modal.module.css"
import {fetchPlant, macronCodeToChar, numberDictionary, PostData} from "@/lib/plant_data";
import {makeCachedRequest, makeRequestWithToken, removeCachedRequest} from "@/lib/api_tools";
import {getFilePath, getPostImage} from "@/lib/data";
import {UserCard} from "@/pages/media/components/cards";
import {RongoaUser} from "@/lib/users";
import {useSession} from "next-auth/react";
import {PlantSelector, SimpleTextArea, SmallInput, UserSelector} from "@/components/input_sections";
import {Loading} from "@/components/loading";
import {postImage} from "@/pages/media/new";
import {prop} from "remeda";

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
                    <span className={styles.close} onClick={hideCallbackOveride ? hideCallbackOveride : toggleShow} style={{color: "white"}}>&times;</span>
                    <img className={styles.modalContent} src={url} alt={description}/>
                    <p className={styles.caption}>{description}</p>
                </div>
            }
        </>
    )
}



type ImagePopupProps = {
    show: boolean
    hideCallback: () => void
    setImages: (value: any[]) => void
    startImages?: any[]
    id?: number
}

/* Multi page image upload selector */
export function ImagePopup({show, hideCallback, id = 0, setImages, startImages}: ImagePopupProps) {

    const [activeTab, setActiveTab] = useState(0)
    const [defaultShow, setDefaultShow] = useState(false)
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const {data: session} = useSession();

    const [currentImage, setCurrentImage] = useState({
        id: 0,
        post_image: "/media/images/logo.svg",
        post_title: "No Image Selected",
        post_user_id: 0,
        post_plant_id: id,
        post_date: "No Date",
        post_description: "No Description",
        post_in_use: false
    })
    const [currentImageMine, setCurrentImageMine] = useState(true)

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

    useEffect(() => {

        // If selectedImages is empty, wait for datafetch to finish
        if(selectedImages[0].length === 0) return

        // Get where the start images are located in the thisImages array and update the relevant selectedImages array
        let currentSelectedImages = selectedImages
        if(startImages){
            startImages.forEach((image: any) => {
                let index = thisImages.findIndex((post: any) => post.id === image.id)
                if(index !== -1){
                    currentSelectedImages[0][index] = true
                }
            })
        }

    }, [startImages, selectedImages]);


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
        let plantUserPosts;
        if(userPosts){
            // Reverse the posts
            userPosts.reverse();

            plantUserPosts = userPosts.filter((post: any) => post.post_plant_id == id)
            setMyImages(plantUserPosts);
        }


        // Fetch the posts for this plant
        const posts = await makeCachedRequest("editor_posts_"+id, "/api/posts/fetch?operation=siteFeed&plant_id=" + id)
        let thisPlantPosts;
        let thisPostsPosts;
        if(posts){
            // Reverse the posts
            posts.reverse();

            thisPlantPosts = posts.filter((post: any) => post.post_in_use)
            thisPostsPosts = posts.filter((post: any) => !post.post_in_use)

            setThisImages(thisPlantPosts)
            setPostImages(thisPostsPosts)
            setCurrentDisplayImages(thisPlantPosts)

        }

        let cSelectedImages = [Array(thisPlantPosts.length).fill(false), Array(thisPostsPosts.length).fill(false), Array(plantUserPosts.length).fill(false)]
        setSelectedImages(cSelectedImages)
    }


    const updateSelectedImages = (imageIndex: number, tab = activeTab) => {

        let newSelectedImages = selectedImages
        newSelectedImages[tab][imageIndex] = !newSelectedImages[tab][imageIndex]

        // Set the current image
        let currentImageL : any = currentDisplayImages[imageIndex]
        setCurrentImage(currentImageL)

        // If the current tab is the post gallery
        if(tab === 1){
            let myPostIndex = myImages.findIndex((post: any) => post.id === currentImageL.id)
            if(myPostIndex !== -1){
                newSelectedImages[2][myPostIndex] = newSelectedImages[tab][imageIndex]
            }

        // My Images
        }else if(tab === 2){

            // Update the post gallery tab if its the same image
            let postIndex = postImages.findIndex((post: any) => post.id === currentImageL.id)
            if(postIndex !== -1){
                newSelectedImages[1][postIndex] = newSelectedImages[tab][imageIndex]
            }

            // Update the this plant tab if its the same image
            let thisIndex = thisImages.findIndex((post: any) => post.id === currentImageL.id)
            if(thisIndex !== -1){
                newSelectedImages[0][thisIndex] = newSelectedImages[tab][imageIndex]
            }
        }else{

            // Update the posts tab if it's the same image
            let myPostIndex = myImages.findIndex((post: any) => post.id === currentImageL.id)
            if(myPostIndex !== -1){
                newSelectedImages[2][myPostIndex] = newSelectedImages[tab][imageIndex]
            }
        }


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
        setCurrentImage({
            id: 0,
            post_image: "/media/images/logo.svg",
            post_title: "No Image Selected",
            post_user_id: 0,
            post_plant_id: id,
            post_date: "No Date",
            post_description: "No Description",
            post_in_use: false
        })
        setCurrentImageMine(false)
    }


    const hide = async () => {

        // Set the loading message
        setLoadingMessage("Moving images")

        // Find the selected images for the post gallery
        let selectedPostImages : any = selectedImages[1].map((value, index) => {
            if(value) return postImages[index]
        })

        // Remove the undefined values
        selectedPostImages = selectedPostImages.filter((value: any) => value)

        // If none are selected, return
        if(!selectedPostImages) return

        // Update the in use status of the selected images
        await makeRequestWithToken("get","/api/posts/move?" + selectedPostImages.map((post: any) => `id=${post.id}`).join("&"))

        // Move them to the plant images
        setThisImages((prev) => {
            setCurrentDisplayImages([...prev, ...selectedPostImages])
            return [...prev, ...selectedPostImages]
        })
        let updatedThisImages = [...thisImages, ...selectedPostImages]

        // If any are authored by the user, move them to the user images also
        let selectedMyImages = selectedPostImages.filter((post: any) => post.post_user_id === (session?.user as RongoaUser).database.id)
        if(selectedMyImages){
            setMyImages((prev) => [...prev, ...selectedMyImages])
        }

        // Remove the selected images from the post images
        let newPostImages = postImages.filter((post: any) => !selectedPostImages.includes(post))
        setPostImages(newPostImages)

        // Update the selected status
        let newSelectedImages = selectedImages
        newSelectedImages[0].push(...selectedPostImages.map(() => true))
        newSelectedImages[1] = newSelectedImages[1].filter((value) => !value)
        newSelectedImages[2].push(...selectedMyImages.map(() => true))
        setSelectedImages(newSelectedImages)

        // Clear the cache
        sessionStorage.removeItem("editor_posts_"+id)
        sessionStorage.removeItem("editor_posts_mine_"+id)

        // Change tab
        setTab(0)

        // Clear loading message
        setLoadingMessage("")

        // Get the selected images
        let newImages = newSelectedImages[0].map((value, index) => {
            if(value) return updatedThisImages[index]
        })
        newImages = newImages.filter((value: any) => value)
        setImages(newImages)


        // Hide the modal
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
        input.onchange = ((event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
                handleFiles(event.target.files);
            }
        }) as any;
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

        // Check if the title has been set
        const titleInput = document.getElementById("title") as HTMLElement;
        const title = titleInput.innerText;
        if(title === "Please Type a Title Here" || title === "No Image Selected" || title.length < 3) {
            alert("Please type a title")
            return;
        }

        // Check if the description has been set
        if(currentImage.post_description === "" || currentImage.post_description === "No Description"){
            alert("Please type a description")
            return;
        }

        // Check if the user is the author
        if(!currentImageMine && (currentImage.post_user_id === 0 || currentImage.post_user_id == undefined)){
            alert("Please select a user or check the 'I took this image' box")
            return
        }

        // Set the loading message
        setLoadingMessage("Uploading image")

        // Create a form data object
        const user = session?.user as RongoaUser
        if(user == null) return
        const userID = user.database.id
        const userName = user.database.user_name

        // Upload the image
        const newPost = await postImage(file, title, currentImage.post_description, id, (currentImageMine ? userID : currentImage.post_user_id), userName, setLoadingMessage, true)

        if(!newPost)
            return

        console.log("New Post", newPost)

        // Remove the image from the local images
        const index = localImages.indexOf(image)
        setLocalImages((prev) => { prev.splice(index, 1); return prev})
        setLocalFiles((prev) => { prev.splice(index, 1); return prev})

        // Reset the current image
        resetCurrentImage()
        sessionStorage.removeItem("editor_posts_"+id)
        sessionStorage.removeItem("editor_posts_mine_"+id)

        if(currentImageMine)
            setMyImages((prev) => [...prev, newPost])

        setThisImages((prev) => [...prev, newPost])
        let newSelectedImages = selectedImages
        newSelectedImages[0].push(true)
        newSelectedImages[2].push(true)
        setSelectedImages(newSelectedImages)
        setLoadingMessage("")
    }

    const handleEdit = (e: boolean, post: PostData | null) => {

        setIsEditing(false)
        if(!post) return

        // Helper function to update the images
        const updateImageArray = (images: any[], post: any) => {
            let index = images.findIndex((value) => value.id === post.id);
            if (index !== -1) images[index] = post;
            return images;
        };

        // Update the post in all arrays
        setCurrentDisplayImages((prev) => updateImageArray([...prev], post));
        setMyImages((prev) => updateImageArray([...prev], post));
        setPostImages((prev) => updateImageArray([...prev], post));
        setThisImages((prev) => updateImageArray([...prev], post));
        setCurrentImage(post)

    }

    return (
            <>

                {loadingMessage && <Loading progressMessage={loadingMessage}/>}
                {defaultShow &&
                    <div className={styles.imagePopup}>
                        <div className={styles.imagePopupContent}>

                            <div key={currentImage.post_image + "asdj" + currentImage.post_title}>
                                <EditPostPopup
                                    show={isEditing}
                                    hideCallback={(e, post) => handleEdit(e, post)}
                                    post={currentImage}
                                    disableChangePlant
                                />
                            </div>



                            <span className={styles.close}
                                  onClick={hide}
                            >&times;</span>

                            <span className={styles.close + " " + styles.edit}
                                  onClick={() => setIsEditing(true)}

                            >✎</span>

                            {/* Tab selector */}
                            <div className={styles.tabs}>

                                {["This Plant", "Post Gallery", "My Posts", "Upload"].map((tab, index) => {
                                    return (
                                        <button onClick={() => setTab(index)}
                                                className={activeTab === index ? styles.activeTab : ""} key={index}>
                                            <p>{tab}</p>

                                            {/* Selected  Count */}
                                            {selectedImages[index] && selectedImages[index].filter((value) => value).length > 0 &&
                                                <p className={styles.selectedCount}>{selectedImages[index].filter((value) => value).length}</p>
                                            }
                                        </button>
                                    )
                                })}

                            </div>

                            {/* Side panel */}
                            <div className={styles.sidePanel}>
                                <img src={getPostImage(currentImage)} alt={currentImage.post_title}/>
                                <div>
                                    <h1
                                        id={"title"}
                                        contentEditable={activeTab == 3 && currentImage.post_title !== "No Image Selected"}
                                    >{currentImage.post_title}</h1>

                                    {activeTab !== 3 ?
                                        <p>{currentImage.post_description}</p>
                                        :
                                        <SimpleTextArea
                                            placeHolder={"Description"}
                                            required={true}
                                            state={"normal"}
                                            changeEventHandler={(value) => setCurrentImage({
                                                ...currentImage,
                                                post_description: value
                                            })}
                                        />
                                    }

                                </div>

                                <div key={currentImageMine ? "a" : "b"}>
                                    {activeTab !== 3 ?
                                        <>
                                            <h3>{getPostImage(currentImage)}</h3>
                                            <h3>{plantNames[plantIDs.indexOf(currentImage.post_plant_id as any)]}</h3>
                                            <h3>{currentImage.post_date}</h3>
                                        </>
                                        :
                                        <>
                                            <div className={styles.myImage}>
                                                <input type={"checkbox"} id={"myImage"} name={"myImage"}
                                                       defaultChecked={currentImageMine}
                                                       onChange={() => setCurrentImageMine(!currentImageMine)}/>
                                                <label htmlFor={"myImage"}>I took this image</label>
                                            </div>
                                            {
                                                !currentImageMine &&
                                                <UserSelector
                                                    setUser={(value) => setCurrentImage({
                                                        ...currentImage,
                                                        post_user_id: value
                                                    })}
                                                />
                                            }
                                        </>
                                    }
                                </div>

                                {activeTab == 3 ?
                                    <>
                                        <button
                                            className={styles.uploadImageButton}
                                            onClick={() => uploadImage(currentImage.post_image)}>Upload
                                        </button>
                                    </>
                                    :
                                    <UserCard id={currentImage.post_user_id}/>
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
                                                             setCurrentImage({
                                                                 id: 0,
                                                                 post_image: image,
                                                                 post_title: "Please Type a Title Here",
                                                                 post_user_id: 0,
                                                                 post_plant_id: id,
                                                                 post_date: "No Date",
                                                                 post_description: "No Description",
                                                                 post_in_use: false
                                                             })
                                                             setCurrentImageMine(false)
                                                         }}
                                                    />
                                                </div>
                                            )
                                        })}

                                        {/* Upload Image Only Button */}
                                        {!isDragging &&
                                            <button className={styles.uploadImageButton} onClick={submitFile}>Select
                                                Image(s)</button>
                                        }

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
                                                <div
                                                    className={styles.imageContainer + " " + (selectedImages[activeTab][index] ? styles.selected : "")}
                                                    key={index}>
                                                    <img src={getPostImage(post)}
                                                         alt={"Placeholder"}
                                                         onClick={() => {
                                                             updateSelectedImages(index)
                                                         }}
                                                    />

                                                    {/* Selected  Count */}
                                                    {selectedImages[activeTab][index] &&
                                                        <p className={styles.selectedCount}>&#10004;</p>
                                                    }
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


interface EditPostPopupProps {
    show: boolean
    hideCallback: (e: boolean, post: PostData | null) => void
    post: any
    disableChangePlant?: boolean
}

export function EditPostPopup(props: EditPostPopupProps) {

    const [post, setPost] = useState(props.post)

    const submitEdit = async () => {
        let url = `/api/posts/edit?id=${post.id}&post_title=${post.post_title}&post_plant_id=${post.post_plant_id}&post_description=${post.post_description}`

        await makeRequestWithToken("get", url);

        props.hideCallback(true, post)
    }

    if(!props.post){
        return <></>
    }

    return (
        <>
        {
            props.show &&
                <div className={styles.editPostOverlay}>
                    <div className={styles.editPostContainer}>
                        <div className={styles.editPostHeader}>
                            <h1>Edit Post</h1>
                            <button onClick={() => {props.hideCallback(false, null)}}>Close</button>
                        </div>
                        <div className={styles.editPostContent}>
                            <SmallInput
                                placeHolder={"Post Title"}
                                required={true}
                                state={"normal"}
                                defaultValue={post.post_title}
                                changeEventHandler={(value) => setPost({...post, post_title: value})}
                            />

                            {!props.disableChangePlant &&
                            <PlantSelector
                                setPlant={(value) => setPost({...post, post_plant_id: value})}
                                allowNew={false}
                                defaultValue={post.post_plant_id}
                            />}

                            <SimpleTextArea
                                defaultValue={post.post_description}
                                placeHolder={"Description"}
                                required={true}
                                state={"normal"}
                            />
                            <button onClick={submitEdit}>Submit</button>
                        </div>
                    </div>
                </div>
        }
        </>
    )

}