import React, { useState } from "react"
import styles from "@/styles/components/image.module.css"
import {ModalImage} from "@/components/modal";
import {CreditedImage} from "@/components/credits";
import {images} from "next/dist/build/webpack/config/blocks/images";


export interface ImageArrayProps {
    images: {url: string, name: string, credits: string, description: string}[]
    colour?: string
    enableModal?: boolean
}

export function ImageArray(props: ImageArrayProps) {
    const [currentImage, setCurrentImage] = useState(0)

    // Image slide show
    const nextImage = () => {
        if(currentImage === props.images.length - 1) {
            setCurrentImage(0)
        } else {
            setCurrentImage(currentImage + 1)
        }
    }

    const previousImage = () => {
        if(currentImage === 0) {
            setCurrentImage(props.images.length - 1)
        } else {
            setCurrentImage(currentImage - 1)
        }
    }

    return(
        <>
            <div className={styles.imageContainer}>
                {props.enableModal ?
                    <ModalImage
                        url={props.images[currentImage].url}
                        description={props.images[currentImage].description}
                    >
                        <CreditedImage
                            url={props.images[currentImage].url}
                            alt={props.images[currentImage].name}
                            credits={props.images[currentImage].credits}
                        />
                    </ModalImage>
                    :
                    <CreditedImage url={props.images[currentImage].url} alt={props.images[currentImage].name} credits={props.images[currentImage].credits}/>
                }
            </div>
            {props.images.length > 1 &&
                <div className={styles.imageControls}>
                    <button onClick={previousImage}>&#60;</button>
                    <div className={styles.dotsContainer}>
                        {props.images.map((image, index) => {
                            return <button key={index} onClick={() => setCurrentImage(index)} className={styles.dot + " " + (currentImage === index ? styles.active : "")}/>
                        })}
                    </div>
                    <button onClick={nextImage}>&#62;</button>
                </div>
            }
        </>
    )

}