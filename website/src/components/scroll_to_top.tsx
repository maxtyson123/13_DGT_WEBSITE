import styles from "@/styles/scroll_to_top.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";

export default function ScrollToTop(){

    const [showButton, setShowButton] = useState(false)

    const checkScrollTop = () => {
        setShowButton(window.pageYOffset > 150)
    }

    useEffect(() => {
        window.addEventListener("scroll", checkScrollTop)
        return function cleanup() {
            window.removeEventListener("scroll", checkScrollTop)
        }
    }, [])

    return(
        <>
            {
                showButton ?    <div className={styles.scrollButton} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </div> : <></>
            }

        </>
    )
}