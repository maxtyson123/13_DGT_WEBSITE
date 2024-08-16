import React, {useEffect, useState} from "react";
import styles from "@/styles/components/modal.module.css"

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



/* Multi page image upload selector */
export function ImagePopup({}){
    return (
        <div className={styles.imagePopup}>
            <div className={styles.imagePopupContent}>

                {/* Tab selector */}
                <div className={styles.tabs}>

                    <button className={styles.tab}>Current</button>
                    <button className={styles.tab}>Gallery</button>
                    <button className={styles.tab}>My Images</button>
                    <button className={styles.tab}>Upload</button>
                    <button className={styles.tab}>Close</button>

                </div>


            </div>
        </div>

    )
}