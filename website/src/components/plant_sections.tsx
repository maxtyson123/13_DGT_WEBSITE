import styles from "@/styles/plant_sections.module.css"
import React, {useEffect, useRef} from "react";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopyright} from "@fortawesome/free-solid-svg-icons";

interface AutoSectionProps{
    section: any
    images: {
        path:           string;
        type:           string;
        meta:           object;
        downloadable:   boolean;
    }[]
    isLeft: boolean
}

export function AutoSection({section, images, isLeft} : AutoSectionProps){
    switch (section.type){
        case "edible":
            return <EdibleSection section={section} images={images} isLeft={isLeft}/>
        case "medical":
            return <MedicalSection section={section} images={images} isLeft={isLeft}/>
        case "craft":
            return <CraftSection section={section} images={images} isLeft={isLeft}/>
        case "source":
            return <SourceSection section={section}/>
        case "custom":
            return <CustomSection section={section}/>
        default:
            return <div></div>

    }
}

interface EdibleSectionProps{
    section: {
        type:               string;
        part_of_plant:      string;
        image_of_part:      string;
        nutrition:          string;
        preparation:        string;
        preparation_type:   string;
    }
    images: {
        path:               string;
        type:               string;
        meta:               object;
        downloadable:       boolean;
    }[]
    isLeft:                 boolean
}
export function EdibleSection({section, images, isLeft} : EdibleSectionProps){

    // Store the nutrition amd preparation section in a ref
    const nutritionRef = useRef<HTMLParagraphElement>(null)
    const preparationRef = useRef<HTMLParagraphElement>(null)

    // Get the image of the part of the plant
    let image_index = parseInt(section.image_of_part.split(" ")[1])

    if (isNaN(image_index)){
        image_index = 0
    }else{
        image_index -= 1
    }

    // Check that it is a valid index
    if (image_index < 0 || image_index >= images.length){
        image_index = 0
    }


    const imageDiv = (
        <>
            <div className={styles.imageContainer}>
                <Image
                    src={images[image_index] ? images[image_index].path : "/media/images/loading.gif"}
                    alt={images[image_index].meta.name ? images[image_index].meta.name : "Loading"}
                    fill
                    style={{objectFit: "contain"}}

                />
                <p className={styles.credits}> <FontAwesomeIcon icon={faCopyright}/> {images[image_index] ? images[image_index].meta.credits : "Loading"} </p>
            </div>
        </>
    )

    const textDiv = (
        <>
            <div className={styles.infoDiv}>
                <h1> Edible Use </h1>
                <h3> Part of Plant: </h3> <p> {section.part_of_plant} </p>
                <div ref={nutritionRef} ></div>
                <h3> Preparation Type: </h3> <p> {section.preparation_type}</p>
                <div ref={preparationRef}> </div>
            </div>
        </>
    )

    // Set the inner html of the nutrition and preparation sections with a useEffect
    useEffect(() => {

        if (nutritionRef.current != null){
            nutritionRef.current.innerHTML = "<h3> Nutrition: </h3> " + section.nutrition
        }

        if (preparationRef.current != null){
            preparationRef.current.innerHTML = "<h3> Preparation: </h3> " + section.preparation
        }
    }, [nutritionRef, preparationRef, section.nutrition, section.preparation])


    return(
        <>
            <div className={styles.sectionContainer + " " + styles.split}>
                {isLeft ? imageDiv : textDiv}
                {isLeft ? textDiv : imageDiv}
            </div>
        </>
    )
}

interface MedicalSectionProps{
    section: {
        type:               string;
        medical_type:       string;
        use:                string;
        image:              string;
        preparation:        string;
    }
    images: {
        path:               string;
        type:               string;
        meta:               object;
        downloadable:       boolean;
    }[]
    isLeft:                 boolean
}
export function MedicalSection({section, images, isLeft} : MedicalSectionProps){

    // Store the use and preparation in a ref to set the contents with html later
    const meduseRef = useRef<HTMLDivElement>(null)
    const preparationRef = useRef<HTMLDivElement>(null)

    // Get the image of the part of the plant
    let image_index = parseInt(section.image.split(" ")[1])

    if (isNaN(image_index)){
        image_index = 0
    }else{
        image_index -= 1
    }

    // Check that it is a valid index
    if (image_index < 0 || image_index >= images.length){
        image_index = 0
    }


    const imageDiv = (
        <>
            <div className={styles.imageContainer}>
                <Image
                    src={images[image_index] ? images[image_index].path : "/media/images/loading.gif"}
                    alt={images[image_index] ? images[image_index].meta.name : "Loading"}
                    fill
                    style={{objectFit: "contain"}}

                />
                <p className={styles.credits}> <FontAwesomeIcon icon={faCopyright}/> {images[image_index] ? images[image_index].meta.credits : "Loading"} </p>
            </div>
        </>
    )

   const textDiv = (
        <>
            <div className={styles.infoDiv}>
                <h1> {section.medical_type} Medical Use </h1>
                <div ref={meduseRef}></div>
                <div ref={preparationRef}></div>
            </div>
        </>
    )

    // Set the inner html of the use and preparation sections with a useEffect
    useEffect(() => {

        if (meduseRef.current != null){
            meduseRef.current.innerHTML = "<h3> Use: </h3> " + section.use
        }

        if (preparationRef.current != null){
            preparationRef.current.innerHTML = "<h3> Preparation: </h3> " + section.preparation
        }

    }, [meduseRef, preparationRef, section.use, section.preparation])

    return(
        <>
            <div className={styles.sectionContainer + " " + styles.split}>
                {isLeft ? imageDiv : textDiv}
                {isLeft ? textDiv : imageDiv}
            </div>
        </>
    )
}

interface CraftSectionProps{
    section: {
        type:               string;
        part_of_plant:      string;
        use:                string;
        image:              string;
        additonal_info:     string;
    }
    images: {
        path:               string;
        type:               string;
        meta:               object;
        downloadable:       boolean;
    }[]
    isLeft:                 boolean
}
export function CraftSection({section, images, isLeft} : CraftSectionProps){

    // Store the use and additional info in a ref to set the contents with html later
    const craft_useRef = useRef<HTMLDivElement>(null)
    const additional_infoRef = useRef<HTMLDivElement>(null)

    // Get the image of the part of the plant
    let image_index = parseInt(section.image.split(" ")[1])

    if (isNaN(image_index)){
        image_index = 0
    }else{
        image_index -= 1
    }

    // Check that it is a valid index
    if (image_index < 0 || image_index >= images.length){
        image_index = 0
    }


    const imageDiv = (
        <>
            <div className={styles.imageContainer}>
                <Image
                    src={images[image_index] ? images[image_index].path : "/media/images/loading.gif"}
                    alt={images[image_index] ? images[image_index].meta.name : "Loading"}
                    fill
                    style={{objectFit: "contain"}}

                />
                <p className={styles.credits}> <FontAwesomeIcon icon={faCopyright}/> {images[image_index] ? images[image_index].meta.credits : "Loading"} </p>
            </div>
        </>
    )

    const textDiv = (
        <>
            <div className={styles.infoDiv}>
                <h1> Craft Use </h1>
                <h3> Part of Plant: </h3> <p> {section.part_of_plant} </p>
                <div ref={craft_useRef}></div>
                <div ref={additional_infoRef}></div>
            </div>
        </>
    )

    // Set the inner html of the use and additional info sections with a useEffect
    useEffect(() => {

        if (craft_useRef.current != null){
            craft_useRef.current.innerHTML = "<h3> Use: </h3> " + section.use
        }

        if (additional_infoRef.current != null){
            additional_infoRef.current.innerHTML = "<h3> Additional Info: </h3> " + section.additonal_info
        }

    }, [craft_useRef, additional_infoRef, section.use, section.additonal_info])

    return(
        <>
            <div className={styles.sectionContainer + " " + styles.split}>
                {isLeft ? imageDiv : textDiv}
                {isLeft ? textDiv : imageDiv}
            </div>
        </>
    )
}

interface SourceSectionProps{
    section: {
        type:           string;
        source_type:    string;
        data:           string;
    }
}
export function SourceSection({section} : SourceSectionProps){
    let sourceItem = (
        <>
        </>
    )

    switch (section.source_type){
        case "Internet":
            sourceItem = (
                <>
                    <li> Source (Internet): <a href={section.data}>{section.data}</a></li>
                </>
            )
            break;

        // Other special cases here

        default:
            sourceItem = (
                <>
                    <li> Source ({section.source_type}): {section.data}</li>
                </>
            )
    }

    return(
        <>
            <div className={styles.sectionContainer}>
                <ul>
                    {sourceItem}
                </ul>
            </div>
        </>
    )
}

interface CustomSectionProps{
    section: {
        type:           string;
        title:          string;
        text:           string;
    }
}
export function CustomSection({section} : CustomSectionProps){

    // Store the text in a ref to set the contents with html later
    const textRef = useRef<HTMLDivElement>(null)

    // Set the inner html of the text section with a useEffect
    useEffect(() => {

            if (textRef.current != null){
                textRef.current.innerHTML = section.text
            }

    }, [textRef, section.text])

    return(
        <>
            <div className={styles.sectionContainer}>
                <h1> {section.title} </h1>
                <div ref={textRef}></div>
            </div>

        </>
    )
}