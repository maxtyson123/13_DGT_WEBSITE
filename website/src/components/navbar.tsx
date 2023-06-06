import Link from 'next/link';
import Image from 'next/image';
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from "@/styles/navbar.module.css";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faBook, faCalendar, faHome, faSearch} from "@fortawesome/free-solid-svg-icons";

// Define items for the navbar, each item is an array with the following format: Name to display, icon, link
// Export it so that it can be used in the footer, that way it is easier to keep the navbar and footer in sync with what links they have
export const pageNames = [
    ["Home", faHome, "/"],
    ["Plant Index", faBook, "/plant_index"],
    ["Calender", faCalendar, "/calender"],
    ["Search", faSearch, "/search"],
];

export default function Navbar(props: any) {

    // Get the data from the props
    const currentPage = props.currentPage;

    return(
        <>
            {/* Container the navbar */}
            <div className={styles.navbar}>

                {/* The next.js link component is used to link to other pages using the built-in router functionality*/}
                {/* Home container is used to group the logo and title together, placing them side by side*/}
                <Link scroll={false} href="/">
                    <Image
                        src="/media/images/logo.svg"
                        alt="Rongoa Logo"
                        width={50}
                        height={100}
                        className={styles.logo}
                    />

                </Link>

                <Link scroll={false} href="/"> <h1 className={styles.title} > Rongoa </h1> </Link>

                <div></div>


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