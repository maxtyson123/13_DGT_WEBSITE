import React, {useEffect, useRef} from "react";
import {useRouter} from 'next/router'
import Section from "@/components/section";
import {fetchPlant, getNamesInPreference, ImageMetaData, PlantData} from "@/lib/plant_data";
import styles from "@/styles/pages/plants/id.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {convertUseTag} from "@/components/plant_card";
import Image from "next/image";
import {AttachmentSection, AutoSection, SourceSection} from "@/components/plant_sections";
import {Error} from "@/components/error";
import {CreditedImage} from "@/components/credits";
import {useSession} from "next-auth/react";
import {ModalImage} from "@/components/modal";
import Link from "next/link";
import {Loading} from "@/components/loading";
import {checkUserPermissions, RongoaUser} from "@/lib/users";
import {Layout} from "@/components/layout";
import {loader_data} from "@/lib/loader_data";
import PostFeed from "@/components/postfeed";
import {getPostImage} from "@/lib/data";
import {ImageArray} from "@/components/image";

export default function PlantPage() {

    // Store the plant data
    const [plantData, setPlantData] = React.useState<PlantData | null>(null)
    const [plantNames, setPlantNames] = React.useState(["Loading...", "Loading...", "Loading..."])
    const [images, setImages] = React.useState<{url: string, name: string, credits: string, description: string}[]>([{
        url: "/media/images/default_noImage.png",
        name: "No Image",
        credits: "",
        description: ""
    }])


    const [showMainImage, setShowMainImage] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)


    // Loading
    const [loadingMessage, setLoadingMessage] = React.useState("")

    // Render key to re render stuff on resize
    const [renderKey, setRenderKey] = React.useState(0)

    // Error state
    const [error, setError] = React.useState("")

    // Get the logged-in user
    const { data: session } = useSession()
    const [editMode, setEditMode] = React.useState(false)

    // Set up the router
    const router = useRouter()

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    const getData = async () => {

        console.log("Fetching plant data")
        setLoadingMessage("Checking plant id...")

        let { id } = router.query

        // If there is no id then there is a problem
        if(!id){

            console.log("No id")

            setError("Invalid plant id")
            setLoadingMessage("")
            return;
        }

        // Try converting the id to a number
        let localId = parseInt(id as string)

        // If it is not a number then there is a problem
        if(isNaN(localId)){

            console.log("Not a number")

            setError("Invalid plant id")
            setLoadingMessage("")
            return
        }

        // Fetch the plant data
        setLoadingMessage("Fetching plant data...")
        const plantOBJ = await fetchPlant(localId)
        console.log("Plant OBJ:")
        console.log(plantOBJ)

        // If the plant data is null then there is a problem
        if(!plantOBJ){
            setError("Plant not found")
            setLoadingMessage("")
            return
        }

        // Set the plant data
        setPlantData(plantOBJ)
        setPlantNames(getNamesInPreference(plantOBJ))

        setLoadingMessage("")
    }

    // Fetch the plant data from the api for this plant on load
    useEffect(() => {

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        getData().then(() => {console.log("Plant data fetched")} ).catch((error) => {console.log(error)});


    }, []);

    // Handle screen size changes
    useEffect(() => {

        // If the screen is mobile sized, set the isMobile state to true
        const handleResize = () => {
            if (window.outerWidth < 1500 || window.innerWidth < 1500) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
            setRenderKey(window.innerWidth + window.outerWidth)
        }

        // Add an event listener to the window to check if the screen size changes
        window.addEventListener("resize", handleResize);

        // Call the handleResize function to check the screen size on load
        handleResize();

        // Remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])


    // Load the data when the plant data changes
    useEffect(() => {

        // Set the description
        const div = document.getElementById("large_description");
        if (div) {
            div.innerHTML = plantData ? plantData.long_description : "Loading...";
        }

        if(!plantData) return;

        if(!(plantData.display_images.length > 0)) return;
        const images = plantData.display_images.map((image: any) => {
                return {
                    url: getPostImage(image),
                    name: image.post_title,
                    credits: image.post_user_id.toString(),
                    description: image.post_description
                }
            })

        setImages(images)

    }, [plantData]);

    const editThisPlant = () => {

        router.push("/plants/create?id=" + plantData?.id)

    }

    const toggleMainImage = () => {
        setShowMainImage(!showMainImage)
    }


    // Check if the user is an editor
    useEffect(() => {


        // Check if there is a session
        if(!session || !session.user)
            return

        // Check if the user can edit
        setEditMode(checkUserPermissions(session.user as RongoaUser, "pages:plants:edit"))

    }, [session])

    const plantHeader = () => {
        return (
            <>
                <div className={styles.plantHeader}>

                    {/* ID of the plant if it exists*/}
                    <div className={styles.headerItem}>
                        <p className={styles.plantId}>ID : {plantData ? plantData.id : "0000"}</p>
                    </div>


                    {/* Author and last modified date. Convert the date into the right format */}
                    <div className={styles.headerItem}>
                        <p className={styles.smallInline}>Author(s): {plantData?.authors.map(
                            (author, index) => (
                                <Link href={"/account/" + author.id}
                                      key={index}>{author.user_name}{index !== plantData.authors.length - 1 ? ", " : ""}</Link>
                            )
                        )}</p>
                        <p className={styles.smallInline}>Last
                            Modified: {plantData ? new Date(plantData.last_modified).toLocaleString().split(",")[0] : "00/00/00"}</p>

                    </div>

                    {/* Plant name */}
                    <div className={styles.headerItem}>
                        <p className={styles.headerTitle}>{plantNames[0]}</p>
                    </div>

                    {/* Plant uses, loop through them creating an item for each one but make sure it's in the right format first */}
                    <div className={styles.headerItem}>
                        <div className={styles.usesContianer}>

                            {plantData && plantData.use.map((use, index) => (
                                <p key={index} className={styles.smallInline}>{convertUseTag(use)}</p>
                            ))}

                        </div>
                    </div>

                    {/* Plant location found */}
                    <div className={styles.headerItem}>
                        <p className={styles.plantId}>{plantData ? plantData.location_found : "Lost :("}</p>
                    </div>

                </div>
            </>
        )
    }

    const page = () => {
        return(
            <>
                <Section autoPadding>
                    {editMode ? <button className={styles.editButton} onClick={editThisPlant}>Edit</button> : <></>}
                    <div className={styles.plantMainInfo}>

                        {/* If there is an error then display it */}
                        {error === "" ? null : <Error error={error}/>}

                        <div className={"row"}>

                            {/* Show the preferred name as the title and the others as the subtitle */}
                            <div className={"column"}>
                                <h1> {plantNames[0]} </h1>
                                <h2> {plantNames[1]} | {plantNames[2]} </h2>

                                {/* The contents of this is set by JS as the description is in html format and that won't work as plaintext*/}
                                <div className={styles.description} id={"large_description"}></div>
                            </div>

                            <div className={"column"}>

                                <div className={styles.plantImageContainer}>
                                    <ImageArray images={images} enableModal/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                <Section autoPadding>
                    <div className={styles.monthsContainer}>

                        {/* If there are no events then there shouldn't be a title */}
                        {plantData?.months_ready_for_use && plantData.months_ready_for_use.length > 0 &&
                            <h1 className={styles.title}> Events </h1>
                        }

                        {/* Loop through the events and display them */}
                        {plantData?.months_ready_for_use.map((month, index) => (
                            <div key={index} className={styles.month}>
                                <h1>{month.event}</h1>
                                <p>{month.start_month} - {month.end_month}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section autoPadding>
                    <div key={renderKey}>
                        <div className={styles.sectionsContainer}>

                            {/* Load all the big sections */}
                            {plantData?.sections.map((section, index) => (
                                <AutoSection
                                    section={section}
                                    isLeft={isMobile ? true : index % 2 === 0}
                                    key={index}
                                />
                            ))}

                            {/* Attachments section */}
                            {
                                plantData?.attachments && plantData?.attachments.filter((attachment) => attachment.type !== "image").length > 0 ?
                                    <>
                                        <br/>
                                        <div className={styles.attachmentsSection}>
                                            <h1> Attachments </h1>
                                            <div className={styles.attachmentsContainer}>
                                                {plantData?.attachments.filter((attachment) => attachment.type !== "image").map((attachment, index) => (
                                                    <AttachmentSection attachment={attachment} key={index}/>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                    </>
                            }

                            {/* Load all the sources sections */}
                            {
                                plantData?.sections && plantData?.sections.filter((section) => section.type === "source").length > 0 ?
                                    <div className={styles.sourceSection}>
                                        <br/>
                                        <br/>
                                        <h1> Sources </h1>
                                        {plantData?.sections.filter((section) => section.type === "source").map((source, index) => (
                                            <SourceSection section={source} key={index}/>
                                        ))}

                                    </div>
                                    :
                                    <></>
                            }


                        </div>
                    </div>
                </Section>


                {/* Images feed */}
                {plantData?.id &&
                    <Section autoPadding>
                        <PostFeed plant_id={plantData.id}/>
                    </Section>
                }
            </>
        )
    }

    return (
        <>
            <Layout pageName={"Plant"} loadingMessage={loadingMessage} error={error} header={plantHeader()}>
                {
                    (plantData?.published || editMode) ?
                        page()
                        :
                        <Section autoPadding>
                            <h1> This plant is not published </h1>
                        </Section>

                }
           </Layout>
        </>
    );
}