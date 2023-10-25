import React from "react";
import styles from "@/styles/components/modal.module.css"

interface ModalImageProps {
    url: string
    description: string
    show: boolean
    hideCallback: () => void
}

export function ModalImage({url, description, show, hideCallback}: ModalImageProps) {
    return (
        <>
            {show &&
                <div className={styles.modal}>
                    <span className={styles.close} onClick={hideCallback}>&times;</span>
                    <img className={styles.modalContent} src={url} alt={description}/>
                    <p className={styles.caption}>description</p>
                </div>
            }
        </>
    )
}