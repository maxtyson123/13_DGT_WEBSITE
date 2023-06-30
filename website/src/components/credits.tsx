import styles from "@/styles/credits.module.css";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCodeBranch} from "@fortawesome/free-solid-svg-icons";
import {DarkMode, Dyslexic} from "@/components/accessibility";

/**
 * Renders the Credits component which displays the credits information and additional accessibility options.
 *
 * @returns {JSX.Element} - The JSX element representing the Credits component.
 */
export default function Credits(){

    // Store whether the credits are expanded or not
    const [expanded, setExpanded] = useState(false)

    const handleExpand = () => {
        // Toggle the expanded state
        setExpanded(!expanded)
    }

    return(
        <>
            {/* Container chip for the credits, allow clicking to expand if it isn't already expanded (this prevents it being unexpanded when the link is clicked */}
            <div className={styles.creditsContainer} onClick={expanded ? () =>{} : handleExpand}>

                {/* The credits text */}
                <h1  onClick={handleExpand}> Max Tyson </h1>

                {/* The credits content that is shown the user expands*/}
                <div className={ expanded ? styles.contentContainer : styles.hidden}>
                    <div className={styles.item}>
                        {/* Link to the GitHub repo */}
                        <FontAwesomeIcon icon={faCodeBranch} />

                        {/* Target the link to a new tab */}
                        <a target="_blank" href="https://github.com/maxtyson123/13_DGT_WEBSITE">Source</a>
                    </div>

                    {/* Accessibility options */}
                    <div className={styles.item}>
                        <DarkMode/>
                    </div>
                    <div className={styles.item}>
                        <Dyslexic/>
                    </div>
                </div>
            </div>
        </>
    )
}