import React, {useEffect} from "react";
import {
    faBars,
    faBook,
    faCalendar,
    faClose,
    faHome,
    faLeaf,
    faSearch,
    faSpa,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from "@/styles/components/navbar.module.css"
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {getSession} from "next-auth/react";
import {Session} from "next-auth";
import {RongoaUser} from "@/lib/users";

// Define items for the navbar, each item is an array with the following format: Name to display, icon, link
// Export it so that it can be used in the footer, that way it is easier to keep the navbar and footer in sync with what links they have

export interface PageName {
    name: string,
    icon: IconProp,
    path: string,
    children: PageName[]
    image?: string,
}

export const pageNames : PageName[] = [
    {name: "Home", icon: faHome, path: "/", children: []},
    {name: "Plants", icon: faLeaf, path: "/plants/", children: [
        {name: "Index", icon: faBook, path: "/plants/plant_index", children: []},
        {name: "Mushrooms", icon: faSpa, path: "/plants/mushrooms", children: []}
    ]},
    {name: "Calendar", icon: faCalendar, path: "/calendar", children: []},
    {name: "Search", icon: faSearch, path: "/search", children: []},
    {name: "Account", icon: faUser, path: "/account", children: []}
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
                <Link  href="/">
                    <Image
                        src={"/media/images/logo.svg"}
                        alt="Rongoā Logo"
                        width={50}
                        height={100}
                        className={styles.logo}
                    />

                </Link>

                <Link  href="/"> <h1 className={styles.title} > Rongoā </h1> </Link>

                <div className={styles.navBreak}></div>


                {/* Loop through the pageNames array and create a link for each page*/}
                {pageNames.map((page, index) => (
                        <NavEntry page={page} currentPage={currentPage} key={index}/>
                ))}

            </div>
        </>
    )
}

interface navEntryProps {
    page: PageName,
    currentPage: string,
    mobile?: boolean,
    expanded?: boolean
}
export function NavEntry({page, currentPage, mobile, expanded = true} : navEntryProps) {

    // State to keep track of if the page has children
    const [hasChildren, setHasChildren] = React.useState(false);
    const [session, setSession] = React.useState<Session | null>(null);
    const [hasImage, setHasImage] = React.useState(false);

    // When the component is mounted, check if the page has children
    useEffect(() => {
        if(page.children.length > 0) {
            setHasChildren(true);
        }

        // If the item is the account item get the session
        if(page.name === "Account") {
            getSession().then((session) => {
                setSession(session);
            }, (error) => {
                console.log(error);
            })
        }

    }, [])
    useEffect(() => {
        if (session){

            const user = session.user as RongoaUser

            if(user.database.user_image != "undefined"){
                setHasImage(true)
            }
        }

    }, [session])

    if(hasChildren && !mobile) {
        return (
                <Link  href={String(page.path)} className={currentPage === page.name ? styles.activePage : styles.navItem}>
                    <FontAwesomeIcon icon={page.icon as IconProp}/>
                    <p>{String(page.name)}</p>
                    {/* A link is created for each page, the link is styled to be active if the page is the current page*/}
                    {/* It Contains the icon and the name of the page*/}


                    <div className={styles.dropdownContent}>
                        {page.children.map((child, index) => (
                            <NavEntry page={child} currentPage={currentPage} key={index}/>
                        ))}
                    </div>

                </Link>
        )
    }
    else {
        return(
            <>
                <Link  href={String(page.path)} className={currentPage === page.name ? styles.activePage : styles.navItem}>
                    {hasImage && session ?
                        <img src={(session.user as RongoaUser).database.user_image} alt={"user account"} className={styles.userImage}/>
                        :
                        <>
                            <FontAwesomeIcon icon={page.icon as IconProp}/>
                            <p>{String(page.name)}</p>
                        </>
                    }
                    {/* A link is created for each page, the link is styled to be active if the page is the current page*/}
                    {/* It Contains the icon and the name of the page*/}
                </Link>
                {expanded && page.children.map((child, index) => (
                    <NavEntry page={child} currentPage={currentPage} key={index}/>
                ))}
            </>


        )
    }
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

    const page = pageNames.find((page) => page.name === currentPage);

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
                <Link  href="/" className={styles.navItem}>
                    <FontAwesomeIcon icon={faLeaf}/>
                    <p> Rongoā </p>
                </Link>

                {
                    page === undefined || isExpanded ?
                        <div></div>
                        :
                        <NavEntry page={page} currentPage={currentPage} mobile expanded={isExpanded}/>
                }

                {
                    isExpanded ?
                        <>{pageNames.map((page, index) => (
                            <NavEntry page={page} currentPage={currentPage} key={index} mobile expanded={isExpanded}/>
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