import Link from 'next/link';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";

export default function Navbar(props: any) {

    // Constant variables
    const currentPage = props.currentPage;
    const pageNames = ["Home", "About", "Updates", "Repository", "Code"];

    // CSS Styling
    const navBarContainer = "w-full h-16 flex justify-center items-center";
    const navBarDisplay = "navbar h-16 bg-main-1 w-3/4 rounded-bl-2xl rounded-br-2xl flex justify-between items-center";
    const navButton = "bg-secondary-1 h-12 rounded-xl text-white font-bold ml-4 p-5 text-center";
    const navButtonActive = "bg-secondary-3 h-12 rounded-xl text-white font-bold ml-4 p-5 text-center";
    const navButtonSettings = "bg-secondary-1 h-12 rounded-xl text-white font-bold ml-4 p-5 text-center ml-auto mr-4";



    return(
        <>
            {/* Container that centers the nav bar */}
            <div className={navBarContainer}>

                {/* Displays a curved container in the center, holds the links */}
                <div className={navBarDisplay}>

                    {/* Loop through the pages  */}
                    {pageNames.map((name) => (
                        /* Create a link for handling the click of the button, if the page is the home page then convert to index */
                        <Link href={name === "Home" ? "/" : name.toLowerCase()}>

                            {/* Create a button for the user to click, if it is the current page then give it active styling*/}
                            <button className={name === currentPage ? navButtonActive : navButton}>
                                {name}
                            </button>
                        </Link>
                    ))}

                    {/* Settings button */}
                    <button className={navButtonSettings}><FontAwesomeIcon icon={faGear}  style={{ fontSize: 30}}/></button>

                </div>
            </div>
        </>
    )
}