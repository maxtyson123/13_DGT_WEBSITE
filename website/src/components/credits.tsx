import styles from "@/styles/credits.module.css";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCodeBranch} from "@fortawesome/free-solid-svg-icons";

export default function Credits(){
    const [expanded, setExpanded] = useState(false)

    const handleExpand = () => {
        setExpanded(!expanded)
    }

    return(
        <>
            <div className={styles.creditsContainer} onClick={expanded ? () =>{} : handleExpand}>
                <h1  onClick={handleExpand}> Max Tyson </h1>

                <div className={ expanded ? styles.contentContainer : styles.hidden}>
                    <div className={styles.item}>
                        <FontAwesomeIcon icon={faCodeBranch} />
                        <a target="_blank" href="https://github.com/maxtyson123/13_DGT_WEBSITE">Source</a>
                    </div>
                </div>
            </div>
        </>
    )
}