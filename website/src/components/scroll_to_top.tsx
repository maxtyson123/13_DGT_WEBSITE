import styles from "@/styles/scroll_to_top.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";

/**
 * Scroll to top button component. Shows a button that scrolls to the top of the page when clicked. Will hide itself if the user is already near the top of the page. To scroll to the bottom of the page, right-click the button.
 *
 * @returns {JSX.Element} The rendered scroll to top button component.
 */
export default function ScrollToTop(){

    // State for showing the button
    const [showButton, setShowButton] = useState(false)

    // Function to check if the user has scrolled down enough to show the button
    const checkScrollTop = () => {
        setShowButton(window.scrollY > 150)
    }

    // Add event listener to check if the user has scrolled down enough to show the button
    useEffect(() => {
        window.addEventListener("scroll", checkScrollTop)
        return function cleanup() {
            window.removeEventListener("scroll", checkScrollTop)
        }
    }, [])

    // Handle click
    const handleClick = (e: React.MouseEvent) => {
        if (e.type === 'click') {

            // On regular click, scroll to the top
            window.scrollTo({top: 0, behavior: "smooth"})

        } else if (e.type === 'contextmenu') {

            // Don't show the context menu
            e.preventDefault()

            // On left click, scroll to the bottom. This is helpful, so I don't have to scroll to the bottom of the page when testing the create plant page
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