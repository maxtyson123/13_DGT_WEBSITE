import styles from "@/styles/scroll_to_top.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";

export default function ScrollToTop(){

    // State for showing the button
    const [showButton, setShowButton] = useState(false)

    // Function to check if the user has scrolled down enough to show the button
    const checkScrollTop = () => {
        setShowButton(window.pageYOffset > 150)
    }

    // Add event listener to check if the user has scrolled down enough to show the button
    useEffect(() => {
        window.addEventListener("scroll", checkScrollTop)
        return function cleanup() {
            window.removeEventListener("scroll", checkScrollTop)
        }
    }, [])

    // Handle clikc
    const handleClick = (e: React.MouseEvent) => {
        if (e.type === 'click') {

            // On regular click, scroll to the top
            window.scrollTo({top: 0, behavior: "smooth"})

        } else if (e.type === 'contextmenu') {

            // Don't show the context menu
            e.preventDefault()

            // On left click, scroll to the bottom. This is helpful so i dont have to scroll to the bottom of the page when testing the create plant page
            window.scrollTo({top: 100000, behavior: "smooth"})
        }
    };

    return(
        <>
            {/* Button to scroll to the top of the page */}
            {
                showButton ?
                    <>
                        {/* Shadowed div that holds the button, onclick scroll to the top */}
                         <div className={styles.scrollButton} onClick={handleClick} onContextMenu={handleClick}>
                        <FontAwesomeIcon icon={faArrowUp} />
                         </div>
                    </>
                    : <></>}

        </>
    )
}