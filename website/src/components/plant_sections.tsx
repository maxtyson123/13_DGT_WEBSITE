import {inspect} from "util";
import styles from "@/styles/plant_sections.module.css"

interface AutoSectionProps{
    section: any
    images: {
        path:           string;
        type:           string;
        name:           string;
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
        name:               string;
        downloadable:       boolean;
    }[]
    isLeft:                 boolean
}
export function EdibleSection({section, images, isLeft} : EdibleSectionProps){

    const imageDiv = (
        <>
            <p>IMAGE</p>
        </>
    )

    const textDiv = (
        <>
            <div>
                <h1> Edible Use </h1>
                <p> Part of Plant: {section.part_of_plant} </p>
                <p> Nutrition: {section.nutrition} </p>
                <p> Preparation: {section.preparation} </p>
                <p> Preparation Type: {section.preparation_type} </p>
            </div>
        </>
    )

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
        name:               string;
        downloadable:       boolean;
    }[]
    isLeft:                 boolean
}
export function MedicalSection({section, images, isLeft} : MedicalSectionProps){
   const imageDiv = (
        <>
            <p>IMAGE</p>
        </>
    )

    const textDiv = (
        <>
            <div>
                <h1> {section.medical_type} Medical Use </h1>
                <p> Use: {section.use} </p>
                <p> Preparation: {section.preparation} </p>
            </div>
        </>
    )

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
        name:               string;
        downloadable:       boolean;
    }[]
    isLeft:                 boolean
}
export function CraftSection({section, images, isLeft} : CraftSectionProps){
   const imageDiv = (
        <>
            <p>IMAGE</p>
        </>
    )

    const textDiv = (
        <>
            <div>
                <h1> Craft Use </h1>
                <p> Part of Plant: {section.part_of_plant} </p>
                <p> Use: {section.use} </p>
                <p> Additional Info: {section.additonal_info} </p>
            </div>
        </>
    )

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
                    <li> Internet: <a href={section.data}>{section.data}</a></li>
                </>
            )
            break;

        // Other special cases here

        default:
            sourceItem = (
                <>
                    <li> {section.source_type}: {section.data}</li>
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

    return(
        <>
            <div className={styles.sectionContainer}>
                <h1> {section.title} </h1>
                <p> {section.text} </p>
            </div>

        </>
    )
}