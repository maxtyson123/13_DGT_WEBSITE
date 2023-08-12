import React, {useEffect} from "react";
import {faBars, faBook, faCalendar, faClose, faHome, faLeaf, faSearch, faSpa} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from "@/styles/components/navbar.module.css"
import {IconProp} from "@fortawesome/fontawesome-svg-core";

// Define items for the navbar, each item is an array with the following format: Name to display, icon, link
// Export it so that it can be used in the footer, that way it is easier to keep the navbar and footer in sync with what links they have
export const pageNames = [
    ["Home", faHome, "/"],
    ["Plant Index", faBook, "/plant_index"],
    ["Mushrooms", faSpa, "/mushrooms"],
    ["Calender", faCalendar, "/calender"],
    ["Search", faSearch, "/search"],
];

/**
 * Navbar component. Renders either the mobile or desktop version of the navbar based on the screen size.
 *
 * @param {Object} props - Component props.
 * @param {string} props.currentPage - The current active page.
 *
 * @see {@link MobileNavbar} - The mobile version of the navbar.
 * @see {@link DesktopNavbar} - The desktop version of the navbar.
 *
 * @returns {JSX.Element} The rendered navbar component.
 */
export default function Navbar(props: any) {

    // Get the data from the props
    const currentPage = props.currentPage;
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {

        // If the screen is mobile sized, set the isMobile state to true
        const handleResize = () => {
            if (window.outerWidth < 600 || window.innerWidth < 600) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        }

        // Add an event listener to the window to check if the screen size changes
        window.addEventListener("resize", handleResize);

        // Call the handleResize function to check the screen size on load
        handleResize();

        // Remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener("resize", handleResize);
        }

    }, [])

    // Return the navbar
    return (
        <>
            {/* If the screen is mobile sized, display the mobile navbar, otherwise display the desktop navbar*/}
            {isMobile ? <MobileNavbar currentPage={currentPage}/> : <DesktopNavbar currentPage={currentPage}/>}
        </>
    )


}

interface navbarProps {
    currentPage: string
}

/**
 * The desktop version of the navbar. Will show the logo and the name of the website on the left, and the links on the right. Links are styled to be active if they have the same name as the current page.
 *
 * @param {Object} props - Component props.
 * @param {string} props.currentPage - The current active page.
 *
 * @see {@link pageNames} - The array of page names and links.
 * @see {@link Navbar} - The parent navbar component.
 *
 * @returns {JSX.Element} The rendered desktop navbar component.
 */
function DesktopNavbar({currentPage} : navbarProps){
    return(
        <>
            {/* Container the navbar */}
            <div className={styles.navbar}>

                {/* The next.js link component is used to link to other pages using the built-in router functionality*/}
                {/* Home container is used to group the logo and title together, placing them side by side*/}
                <Link scroll={false} href="/">
                    <Image
                        src="/media/images/logo.svg"
                        alt="Rongoā Logo"
                        width={50}
                        height={100}
                        className={styles.logo}
                    />

                </Link>

                <Link scroll={false} href="/"> <h1 className={styles.title} > Rongoā </h1> </Link>

                <div className={styles.navBreak}></div>


                {/* Loop through the pageNames array and create a link for each page*/}
                {pageNames.map((page, index) => (
                    <Link key={index} scroll={false} href={String(page[2])} className={currentPage === page[0] ? styles.activePage : styles.navItem}>
                        <FontAwesomeIcon icon={page[1] as IconProp}/>
                        <p>{String(page[0])}</p>
                        {/* A link is created for each page, the link is styled to be active if the page is the current page*/}
                        {/* It Contains the icon and the name of the page*/}
                    </Link>
                ))}

            </div>
        </>
    )
}

/**
 * The mobile version of the navbar. Will show the logo left, current page in the centre and a hamburger menu on the right. Clicking the hamburger menu will expand the navbar to show the links. Links are styled to be active if they have the same name as the current page.
 *
 * @param {Object} props - Component props.
 * @param {string} props.currentPage - The current active page.
 *
 * @see {@link pageNames} - The array of page names and links.
 * @see {@link Navbar} - The parent navbar component.
 *
 * @returns {JSX.Element} The rendered mobile navbar component.
 */
function MobileNavbar({currentPage} : navbarProps){

    const page = pageNames.find((page) => page[0] === currentPage);

    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    }

    let className = styles.navbar + " " + styles.mobileNav + " "
    if(isExpanded){
        className += styles.expanded;
    }else{
        className += styles.collapsed;
    }

    return(
        <>
            {/* Container the navbar */}
            <div className={className}>

                {/* The next.js link component is used to link to other pages using the built-in router functionality*/}
                {/* Home container is used to group the logo and title together, placing them side by side*/}
                <Link scroll={false} href="/" className={styles.navItem}>
                    <FontAwesomeIcon icon={faLeaf}/>
                    <p> Rongoā </p>
                </Link>

                {
                    page === undefined || isExpanded ?
                        <div></div>
                        :
                        <Link scroll={false} href={String(page[2])} className={styles.activePage}>
                            <FontAwesomeIcon icon={page[1] as IconProp}/>
                            <p>{String(page[0])}</p>
                            {/* A link is created for each page, the link is styled to be active if the page is the current page*/}
                            {/* It Contains the icon and the name of the page*/}
                        </Link>
                }

                {
                    isExpanded ?
                        <>{pageNames.map((page, index) => (
                                <Link key={index} scroll={false} href={String(page[2])} className={currentPage === page[0] ? styles.activePage : styles.navItem}>
                                    <FontAwesomeIcon icon={page[1] as IconProp}/>
                                    <p>{String(page[0])}</p>
                                    {/* A link is created for each page, the link is styled to be active if the page is the current page*/}
                                    {/* It Contains the icon and the name of the page*/}
                                </Link>
                            ))}</>
                        :
                        <></>
                }

                {
                    isExpanded ?
                        <a href={"#"} onClick={toggleExpanded} className={styles.close}> <FontAwesomeIcon icon={faClose}/><p> Close </p> </a>
                        :
                        <a href={"#"} onClick={toggleExpanded} className={styles.navItem}> <FontAwesomeIcon icon={faBars}/> <p> More Pages </p> </a>
                }
            </div>
        </>
    )
}