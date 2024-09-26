import styles from "@/styles/components/plant_sections.module.css"
import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
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
    AttachmentData,
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
import {CreditedImage} from "@/components/credits";
import {ModalImage} from "@/components/modal";
import {getPostImage} from "@/lib/data";
import {ImageArray} from "@/components/image";

interface AutoSectionProps{
    section: any
    images: AttachmentData[]
    isLeft: boolean
}

/**
 * AutoSection component. Renders the correct section based on the type of section.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.section - The section data.
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
export function AutoSection({section, isLeft} : AutoSectionProps){
    switch (section.type){
        case "edible":
            return <EdibleSection section={section} isLeft={isLeft}/>
        case "medical":
            return <MedicalSection section={section} isLeft={isLeft}/>
        case "craft":
            return <CraftSection section={section} isLeft={isLeft}/>
        case "custom":
            return <CustomSection section={section}/>
        default:
            return <></>

    }
}

interface EdibleSectionProps{
    section:                EdibleSectionData;
    isLeft:                 boolean
}

/**
 * EdibleSection component. Splits the page into two columns, one for the image and one for the text. Will then insert the values from the section into the text, any AdvancedTextArea HTML will be inserted correctly.
 *
 * @param {Object} props - Component props.
 * @param {EdibleSectionData} props.section - The section data.
 * @param {boolean} props.isLeft -  Whether the image should be on the left or right side of the page.
 *
 *
 * @returns {JSX.Element} The rendered section component.
 */
export function EdibleSection({section, isLeft} : EdibleSectionProps){

    // Store the nutrition amd preparation section in a ref
    const nutritionRef = useRef<HTMLParagraphElement>(null)
    const preparationRef = useRef<HTMLParagraphElement>(null)

    const hasImage = section.images.length > 0
    const images = hasImage ?
        section.images.map((image: any) => {
            return {
                url: getPostImage(image),
                name: image.post_title,
                credits: image.post_user_id.toString(),
                description: image.post_title
            }
        })
        : [{
            url: "/media/images/default_noImage.png",
            name: "No Image",
            credits: "",
            description: ""
        }]

    const imageDiv = (
        <>
            <div className={styles.imageContainer}>
                <ImageArray images={images} enableModal/>
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
    isLeft:                 boolean
}

/**
 * Medical Section component. Splits the page into two columns, one for the image and one for the text. Will then insert the values from the section into the text, any AdvancedTextArea HTML will be inserted correctly.
 *
 * @param {Object} props - Component props.
 * @param {MedicalSectionData} props.section - The section data.
 * @param {boolean} props.isLeft - Whether the image should be on the left or right side of the page..
 *
 * @returns {JSX.Element} The rendered section component.
 */
export function MedicalSection({section, isLeft} : MedicalSectionProps){

    // Store the use and preparation in a ref to set the contents with html later
    const medUseRef = useRef<HTMLDivElement>(null)
    const preparationRef = useRef<HTMLDivElement>(null)
    const restrictedRef = useRef<HTMLDivElement>(null)

    // TODO COMPONETIZE THIS
    const hasImage = section.images.length > 0
    const images = hasImage ?
        section.images.map((image: any) => {
            return {
                url: getPostImage(image),
                name: image.post_title,
                credits: image.post_user_id.toString(),
                description: image.post_title
            }
        })
        : [{
            url: "/media/images/default_noImage.png",
            name: "No Image",
            credits: "",
            description: ""
        }]

    const imageDiv = (
        <>
            <div className={styles.imageContainer}>
                <ImageArray images={images} enableModal/>
            </div>
        </>
    )

   const textDiv = (
        <>
            <div className={styles.infoDiv}>
                <h1> {section.medical_type} Medical Use </h1>
                <div ref={medUseRef}></div>
                <div ref={preparationRef}></div>
                <div ref={restrictedRef}></div>
            </div>
        </>
    )

    // Set the inner html of the use and preparation sections with a useEffect
    useEffect(() => {

        if (medUseRef.current != null){
            medUseRef.current.innerHTML = "<h3> Use: </h3> " + section.use
        }

        if (preparationRef.current != null){
            preparationRef.current.innerHTML = "<h3> Preparation: </h3> " + section.preparation
        }

        if (restrictedRef.current != null && section.restricted != ""){
            restrictedRef.current.innerHTML = "<h3> Restricted: </h3> " + section.restricted
        }

    }, [medUseRef, preparationRef, section.use, section.preparation])

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
    isLeft:                 boolean
}

/**
 * CraftSection component. Splits the page into two columns, one for the image and one for the text. Will then insert the values from the section into the text, any AdvancedTextArea HTML will be inserted correctly.
 *
 * @param {Object} props - Component props.
 * @param {CraftSectionData} props.section - The section data.
 * @param {boolean} props.isLeft -  Whether the image should be on the left or right side of the page.
 *
 * @returns {JSX.Element} The rendered section component.
 */
export function CraftSection({section, isLeft} : CraftSectionProps){

    // Store the use and additional info in a ref to set the contents with html later
    const craft_useRef = useRef<HTMLDivElement>(null)
    const additional_infoRef = useRef<HTMLDivElement>(null)

    const hasImage = section.images.length > 0
    const images = hasImage ?
        section.images.map((image: any) => {
            return {
                url: getPostImage(image),
                name: image.post_title,
                credits: image.post_user_id.toString(),
                description: image.post_title
            }
        })
    : [{
            url: "/media/images/default_noImage.png",
            name: "No Image",
            credits: "",
            description: ""
       }]

    const imageDiv = (
        <>
            <div className={styles.imageContainer}>
                <ImageArray images={images} enableModal/>
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
            console.log("CRAFT:")
            console.log(section.use_identifier)
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
    let sourceItem: JSX.Element

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
    attachment: AttachmentData;
}

/**
 * AttachmentSection component. Displays an attachment section, will display the title and a link to the attachment. The link will open in a new tab. The attachment type will be displayed as an icon if possible.
 *
 * @param {Object} props - Component props.
 * @param {AttachmentData} props.attachment - The attachment data.
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

    }, [attachment.type])

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