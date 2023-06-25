import styles from "@/styles/plant_sections.module.css"
import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCopyright,
    faFile,
    faFileAlt,
    faFileArchive,
    faFileAudio,
    faFileCode,
    faFileCsv,
    faFileExcel,
    faFileImage,
    faFilePdf,
    faFilePowerpoint,
    faFileVideo,
    faFileWord,
    faGlobe
} from "@fortawesome/free-solid-svg-icons";
import {
    AttachmentSectionData,
    CraftSectionData,
    CustomSectionData,
    EdibleSectionData,
    FileMetaData,
    formatFileSize,
    ImageMetaData,
    MedicalSectionData,
    SourceSectionData
} from "@/lib/plant_data";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

interface AutoSectionProps{
    section: any
    images: AttachmentSectionData[]
    isLeft: boolean
}

/**
 * AutoSection component. Renders the correct section based on the type of section.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.section - The section data.
 * @param {string} props.section.type - The type of section.
 * @param {AttachmentSectionData[]} props.images - The images for the plant.
 * @param {boolean} props.isLeft -  Whether the image should be on the left or right side of the page.
 *
 * @see {@link EdibleSection} - The edible section.
 * @see {@link MedicalSection} - The medical section.
 * @see {@link CraftSection} - The craft section.
 * @see {@link CustomSection} - The custom section.
 * @see {@link SourceSection} - The source section.
 * @see {@link AttachmentSection} - The attachment section.
 *
 * @returns {JSX.Element} The rendered section component.
 */
export function AutoSection({section, images, isLeft} : AutoSectionProps){
    switch (section.type){
        case "edible":
            return <EdibleSection section={section} images={images} isLeft={isLeft}/>
        case "medical":
            return <MedicalSection section={section} images={images} isLeft={isLeft}/>
        case "craft":
            return <CraftSection section={section} images={images} isLeft={isLeft}/>
        case "custom":
            return <CustomSection section={section}/>
        default:
            return <></>

    }
}

interface EdibleSectionProps{
    section:                EdibleSectionData;
    images:                 AttachmentSectionData[]
    isLeft:                 boolean
}

/**
 * EdibleSection component. Splits the page into two columns, one for the image and one for the text. Will then insert the valus from the section into the text, any AdvancedTextArea HTML will be inserted correctly.
 *
 * @param {Object} props - Component props.
 * @param {EdibleSectionData} props.section - The section data.
 * @param {AttachmentSectionData} props.images - The images for the plant.
 * @param {boolean} props.isLeft -  Whether the image should be on the left or right side of the page.
 *
 * @see {@link AdvancedTextArea} - The advanced text area component.
 *
 * @returns {JSX.Element} The rendered section component.
 */
export function EdibleSection({section, images, isLeft} : EdibleSectionProps){

    // Store the nutrition amd preparation section in a ref
    const nutritionRef = useRef<HTMLParagraphElement>(null)
    const preparationRef = useRef<HTMLParagraphElement>(null)

    // Get the image of the part of the plant
    let image_index = images.findIndex((image) => {
        return (image.meta as ImageMetaData).name == section.image_of_part
    })

    const imageDiv = (
        <>
            <div className={styles.imageContainer}>
                <Image
                    src={images[image_index] ? images[image_index].path : "/media/images/loading.gif"}
                    alt={images[image_index] ? (images[image_index].meta as ImageMetaData).name : "Loading"}
                    fill
                    style={{objectFit: "contain"}}

                />
                <p className={styles.credits}> <FontAwesomeIcon icon={faCopyright}/> {images[image_index] ? (images[image_index].meta as ImageMetaData).credits : "Uncredited"} </p>
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
    section:                MedicalSectionData;
    images:                 AttachmentSectionData[]
    isLeft:                 boolean
}

/**
 * Medical Section component. Splits the page into two columns, one for the image and one for the text. Will then insert the valus from the section into the text, any AdvancedTextArea HTML will be inserted correctly.
 *
 * @param {Object} props - Component props.
 * @param {MedicalSectionData} props.section - The section data.
 * @param {AttachmentSectionData} props.images - The images for the plant.
 * @param {boolean} props.isLeft - Whether the image should be on the left or right side of the page.
 *
 * @see {@link AdvancedTextArea} - The advanced text area component.
 *
 * @returns {JSX.Element} The rendered section component.
 */
export function MedicalSection({section, images, isLeft} : MedicalSectionProps){

    // Store the use and preparation in a ref to set the contents with html later
    const meduseRef = useRef<HTMLDivElement>(null)
    const preparationRef = useRef<HTMLDivElement>(null)

    // Get the image of the part of the plant
    let image_index = images.findIndex((image) => {
        return (image.meta as ImageMetaData).name == section.image
    })


    const imageDiv = (
        <>
            <div className={styles.imageContainer}>
                <Image
                    src={images[image_index] ? images[image_index].path : "/media/images/loading.gif"}
                    alt={images[image_index] ? (images[image_index].meta as ImageMetaData).name : "Loading"}
                    fill
                    style={{objectFit: "contain"}}

                />
                <p className={styles.credits}> <FontAwesomeIcon icon={faCopyright}/> {images[image_index] ? (images[image_index].meta as ImageMetaData).credits : "Uncredited"} </p>
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
    section:                CraftSectionData;
    images:                 AttachmentSectionData[]
    isLeft:                 boolean
}

/**
 * CraftSection component. Splits the page into two columns, one for the image and one for the text. Will then insert the valus from the section into the text, any AdvancedTextArea HTML will be inserted correctly.
 *
 * @param {Object} props - Component props.
 * @param {CraftSectionData} props.section - The section data.
 * @param {AttachmentSectionData} props.images - The images for the plant.
 * @param {boolean} props.isLeft -  Whether the image should be on the left or right side of the page.
 *
 * @see {@link AdvancedTextArea} - The advanced text area component.
 *
 * @returns {JSX.Element} The rendered section component.
 */
export function CraftSection({section, images, isLeft} : CraftSectionProps){

    // Store the use and additional info in a ref to set the contents with html later
    const craft_useRef = useRef<HTMLDivElement>(null)
    const additional_infoRef = useRef<HTMLDivElement>(null)

    // Find the same image name in the images array
    let image_index = images.findIndex((image) => {
        return (image.meta as ImageMetaData).name == section.image
    })


    const imageDiv = (
        <>
            <div className={styles.imageContainer}>
                <Image
                    src={images[image_index] ? images[image_index].path : "/media/images/loading.gif"}
                    alt={images[image_index] ? (images[image_index].meta as ImageMetaData).name : "Loading"}
                    fill
                    style={{objectFit: "contain"}}

                />
                <p className={styles.credits}> <FontAwesomeIcon icon={faCopyright}/> {images[image_index] ? (images[image_index].meta as ImageMetaData).credits : "Uncredited"} </p>
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
    section: SourceSectionData
}

/**
 * SourceSection component. Displays the source of the information, will convert any links into clickable links and will display the source type.
 *
 * @param {Object} props - Component props.
 * @param {SourceSectionData} props.section - The section data.
 *
 * @returns {JSX.Element} The rendered section component.
 */
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
            <div className={styles.sectionContainer + " " + styles.sourceSection}>
                <ul>
                    {sourceItem}
                </ul>
            </div>
        </>
    )
}

interface CustomSectionProps{
    section: CustomSectionData;
}

/**
 * CustomSection component. Displays a custom section, will display the title and text of the section. IF the text uses HTML from the AdvancedTextArea component, it will be inserted correctly.
 *
 * @param {Object} props - Component props.
 * @param {CustomSectionData} props.section - The section data.
 *
 * @see {@link AdvancedTextArea} - The advanced text area component.
 *
 * @returns {JSX.Element} The rendered section component.
 */
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
            <div className={styles.sectionContainer }>
                <h1> {section.title} </h1>
                <div ref={textRef}></div>
            </div>

        </>
    )
}

interface AttachmentSectionProps{
    attachment: AttachmentSectionData;
}

/**
 * AttachmentSection component. Displays an attachment section, will display the title and a link to the attachment. The link will open in a new tab. The attachment type will be displayed as an icon if possible.
 *
 * @param {Object} props - Component props.
 * @param {AttachmentSectionData} props.attachment - The attachment data.
 *
 * @returns {JSX.Element} The rendered section component.
 */
export function AttachmentSection({attachment} : AttachmentSectionProps){
    const [fileIcon, setFileIcon] = useState<IconDefinition>(faFile)

    useEffect(() => {

        switch (attachment.type) {
            case "json":
                setFileIcon(faFileCode);
                break;
            case "pdf":
                setFileIcon(faFilePdf);
                break;
            case "doc":
            case "docx":
                setFileIcon(faFileWord);
                break;
            case "xls":
            case "xlsx":
                setFileIcon(faFileExcel);
                break;
            case "ppt":
            case "pptx":
                setFileIcon(faFilePowerpoint);
                break;
            case "txt":
                setFileIcon(faFileAlt);
                break;
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "tiff":
            case "webp":
            case "svg":
            case "ico":
            case "psd":
            case "ai":
            case "raw":
            case "eps":
            case "bmp":
                setFileIcon(faFileImage);
                break;
            case "mp3":
            case "wav":
            case "ogg":
            case "flac":
            case "aac":
            case "wma":
            case "aiff":
            case "dsd":
            case "pcm":
            case "mp2":
            case "m4a":
                setFileIcon(faFileAudio);
                break;
            case "mp4":
            case "avi":
            case "mkv":
            case "mov":
            case "wmv":
            case "flv":
            case "webm":
            case "m4v":
            case "mpeg":
            case "mpg":
            case "mpe":
            case "mpv":
            case "m4p":
            case "m4b":
            case "m4r":
                setFileIcon(faFileVideo);
                break;
            case "zip":
            case "rar":
            case "tar":
            case "gz":
            case "bz2":
            case "xz":
            case "7zip":
            case "iso":
            case "dmg":
            case "pkg":
            case "deb":
            case "rpm":
            case "z":
            case "taz":
            case "tgz":
            case "tlz":
            case "txz":
            case "tbz":
            case "tbz2":
            case "tz":
            case "7z":
                setFileIcon(faFileArchive);
                break;
            case "html":
            case "htm":
            case "xhtml":
            case "php":
            case "asp":
            case "aspx":
            case "jsp":
            case "js":
            case "css":
            case "scss":
            case "sass":
            case "less":
            case "xml":
                setFileIcon(faGlobe);
                break;
            case "csv":
                setFileIcon(faFileCsv);
                break;
            default:
                setFileIcon(faFile);
                break;
        }

    }, [])

    return(
        <>
            <a href={attachment.path} download={(attachment.meta as FileMetaData).name} target={"_blank"}>
                <div className={styles.attachment}>
                    <FontAwesomeIcon icon={fileIcon} size={"3x"} />
                    <p> {(attachment.meta as FileMetaData).name} </p>
                    <p> {formatFileSize((attachment.meta as FileMetaData).size) } </p>
                </div>
            </a>
        </>
    )
}