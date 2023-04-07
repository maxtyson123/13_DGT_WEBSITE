import Link from 'next/link';
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faHome, faInfoCircle, faNewspaper, faCodeBranch, faCode, faArrowDown} from "@fortawesome/free-solid-svg-icons";
import Settings from "@/components/settings";


export default function Navbar(props: any) {
    // State variables
    const [settingsToggle, setSettingsToggle] = React.useState(false);

    // Constant variables
    const currentPage = props.currentPage;
    const pageNames = ["Home", "About", "Updates", "Repository", "Code"];
    const pageIcons = [faHome, faInfoCircle, faNewspaper, faCodeBranch, faCode];

    // CSS Styling
    const navBarContainer = "w-full h-16 flex justify-center items-center";
    const navBarDisplay = "navbar bg-main-1 pt-2 pb-2 w-3/4 rounded-bl-2xl rounded-br-2xl flex justify-between items-center flex-wrap";
    const navButtonBase = "h-12 rounded-xl text-white font-bold ml-4 p-5 text-center leading-none hover:shadow-lg hover:shadow-cyan-500/50";
    const navButtonActive = navButtonBase + " bg-sky-500";
    const navButtonInActive = navButtonBase + " bg-sky-800";

    // Show settings function
    function showSettings() {
        // Toggle the settings
        setSettingsToggle(!settingsToggle);
        console.log(settingsToggle)
    }

    return(
        <>


            {/* Container that centers the nav bar */}
            <div className={navBarContainer}>


                {/* Displays a curved container in the center, holds the links */}
                <div className={navBarDisplay}>

                    {/* Settings div */}
                    <Settings enabled={settingsToggle} />

                    {/* Loop through the pages  */}
                    {pageNames.map((name) => (
                        /* Create a link for handling the click of the button, if the page is the home page then convert to index */
                        <Link key={name} href={name === "Home" ? "/" : name.toLowerCase()}>

                            {/* Create a button for the user to click, if it is the current page then give it active styling*/}
                            <button className={name === currentPage ? navButtonActive : navButtonInActive}>
                                <FontAwesomeIcon className={"inline"} icon={pageIcons[pageNames.indexOf(name)]}/>
                                <p className={"inline"}> {name}</p>
                            </button>
                        </Link>
                    ))}

                    {/* Settings button */}
                    <button onClick={showSettings} className={"bg-sky-800 rounded-bl-2xl rounded-br-2xl text-white p-5 leading-3 hover:shadow-lg hover:shadow-cyan-500/50 ml-auto mr-4 -mt-96 pt-96 pb-2"}>
                        <FontAwesomeIcon className={settingsToggle ? "rotate-180" : "hover:rotate-90 "} icon={settingsToggle ? faArrowDown : faGear}  style={{ fontSize: 30}}/>
                    </button>

                </div>
            </div>
        </>
    )
}