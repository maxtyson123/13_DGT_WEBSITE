//set PATH=%PATH%;C:\Users\max.tyson\Downloads\node-v18.18.2-win-x64\node-v18.18.2-win-x64

import React, {useEffect, useRef} from "react";

import styles from "@/styles/index.module.css"
import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import Section from "@/components/section";
import PageHeader from "@/components/page_header";
import SearchBox from "@/components/search_box";
import {PlantCardApi, PlantCardLoading} from "@/components/plant_card";
import Stats from "@/components/stats";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import {getFromCache, saveToCache} from "@/lib/cache";
import axios from "axios";
import {globalStyles} from "@/lib/global_css";
import Image from "next/image";
import Slider from "@/components/slider";
import {AttachmentData, fetchPlant, ImageMetaData} from "@/lib/plant_data";
import {CreditedImage} from "@/components/credits";
import {QueryClient} from "@tanstack/react-query";

export default function Home() {
    const pageName = "Home"

    // Stats for the featured plants
    const [isLoading, setIsLoading] = React.useState(true)
    const [isMobile, setIsMobile] = React.useState(false)


    const [plantIds, setPlantIds] = React.useState([0,0,0,0,0,0])
    const [location, setLocation] = React.useState("13-dgt-website.vercel.app")
    const [featuredImage , setFeaturedImage] = React.useState<AttachmentData>({
        type: "image",
        path: "/media/images/about_image.jpeg",
        meta: {name: "About Image", description: "Image for the about page", credit: "Test"},
        downloadable: false
    })



    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)

    const queryClient = new QueryClient()

    // Get the plant ids when the page loads
    useEffect(() => {

        setLocation(window.location.host)

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        getPlantIDs().then(() => {console.log("Plant IDs fetched")} ).catch((error) => {console.log(error)});
    }, [])

    /**
     * Gets 3 random IDs from the database to be used for the featured plants
     */
    const getPlantIDs = async () => {

        // Check if the plant ids have been cached
        const ids = getFromCache("plantIds")

        // If the plant ids have been cached
        if (ids !== null) {
            setPlantIds(ids)
            setIsLoading(false)
        }else{

            // Use the api to get the plant ids
            try{
                const amountToGet = 3

                // Make the api call
                const response = await axios.get(`/api/plants/random?amount=${amountToGet}`)

                // API returns the data as "data" which axios also uses, so we need to use response.data.data
                const data = response.data.data

                // Create an array to store the ids
                let ids = []

                // Fill the ids with 0s
                for (let i = 0; i < amountToGet; i++) {
                    ids[i] = 0
                }

                // Loop through the data and set the ids
                for (let i = 0; i < data.length; i++) {
                    ids[i] = data[i].id
                }

                // Set the plant ids
                setPlantIds(ids)
                setIsLoading(false)

                // Save the plant ids to the cache
                saveToCache("plantIds", ids)

            } catch (error) {
                    console.log(error)
            }
        }
    }

    // Update featured image when the plant ids change
    useEffect(() => {
        // Get the featured image by selecting a random image from the featured plants
        let featuredPlantId = plantIds[Math.floor(Math.random() * plantIds.length)]

        // Get the plant data
        fetchPlant(featuredPlantId).then((data) => {

            // If the plant data is null, return
            if (!data)
                return

            // Get all the attachments with image type
            let images = data.attachments.filter((attachment) => attachment.type === "image")

            // Get a random index and set the image
            let randomIndex = Math.floor(Math.random() * images.length)

            // Set the featured image
            setFeaturedImage(images[randomIndex])

            // Log the random image
            console.log("Random image: " + images[randomIndex].path)

        }).catch((error) => {
            console.log(error)
        })
    }, [plantIds])

    // Handle screensize changes
    useEffect(() => {

        // If the screen is mobile sized, set the isMobile state to true
        const handleResize = () => {
            if (window.outerWidth < 600 || window.innerWidth < 600) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
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

    return (
        <>
            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Section for the welcome message and search box */}
            <Section>
                {/* Use the page header component to display the welcome message (See: components/page_header.tsx) */}
                <PageHeader size={"large"}>

                  {/* Container for the welcome message and search box */}
                   <div className={styles.welcomeContainer}>

                       <Image
                           src={"/media/images/hero_image.png"}
                           alt={"Plant Hero Image"}
                           fill={true}
                           className={styles.heroImage}
                       />

                       {/* Place the title and description on the left */}
                       <div className={styles.title}>
                           <h1 > Rongoā </h1>
                       </div>

                       {/* Spacing */}
                       <div></div>


                       <p className={styles.description}>
                           This website is a resource for information about rongoā Māori, the traditional Māori healing system. It is intended to be a resource for anyone interested in learning more about rongoā, including practitioners, students, and members of the general public.
                       </p>

                       <div className={styles.searchBox}>
                        <SearchBox/>
                       </div>

                   </div>
                </PageHeader>
            </Section>

            {/* Section for about the website */}
            <Section autoPadding>
                {/* Section title */}
                <h1 className={styles.sectionTitle}>About</h1>

                {/* Container for the image and the text */}
                <div className={styles.aboutContainer}>

                    {/* Image */}
                    <div className={styles.aboutImage}>
                        <CreditedImage url={featuredImage.path} alt={(featuredImage.meta as ImageMetaData).description} credits={(featuredImage.meta as ImageMetaData).credits} colour={"white"}/>
                    </div>

                    {/* Text */}
                    <div className={styles.aboutText}>
                        <p> Welcome to this rongoā website</p>
                        <p> This website is a resource for information about rongoā Māori, the traditional Māori healing system. It is intended to be a resource for anyone interested in learning more about rongoā, including practitioners, students, and members of the general public.</p>
                        <p> Please note that the information provided on this site is not intended as a substitute for advice from Health Care Professionals, Medicinal Herbalist or Tohunga. It is for informational and educational purposes only.  (Please take personal responsibility for your decisions.)</p>
                        <p> This site is designed and populated by volunteers. Information is provided by a variety of sources, including books, websites, and personal experience. </p>
                        <p> Please contact us at <a href={"mailto:placeholder@email.com"}>placeholder@email.com</a> if:</p>
                        <ul>
                            <li>You have useful information or Images that you would like to contribute</li>
                            <li>You would like to volunteer time with research / data input</li>
                            <li>You find this information useful and would like to donate financially</li>
                            <li>You have any questions or comments about the site</li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* Section for the featured plants */}
            <Section>
                {/* Section title */}
                <h1 className={styles.sectionTitle}>Featured Plants</h1>

                    {
                        isLoading ?
                            <>
                                <Slider>
                                    <PlantCardLoading/>
                                    <PlantCardLoading/>
                                    <PlantCardLoading/>
                                </Slider>
                            </>
                            :
                            <>
                                <Slider>
                                    {/* Once the data has been fetched, load the individual card's data */}
                                    {plantIds.map((id) => (
                                        <div key={id} className={styles.sliderItem}> <PlantCardApi id={id}/></div>
                                    ))}
                                </Slider>
                            </>

                    }




                {/* Container that centers the cards */}
                <div className={styles.cardsContainer}>

                </div>
            </Section>

            {/* Section for the plant stats */}
            <Section autoPadding>

                {/* Container for the stats */}
                <div className={globalStyles.gridCentre}>

                    {/* Display the stats */}
                    <Stats/>
                </div>
            </Section>

            {/* Page footer */}
            <Section>
                    <Footer/>
            </Section>

            {/* Allow the user to scroll to the top of the page easily*/}
            <ScrollToTop/>
        </>
    );
}
