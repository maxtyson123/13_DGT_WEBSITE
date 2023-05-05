import Link from 'next/link';
import Image from 'next/image';
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faHome, faBook, faCalendar} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/navbar.module.css";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export default function Navbar(props: any) {

    // Get the data from the props
    const currentPage = props.currentPage;

    // Define items for the navbar, each item is an array with the following format: Name to display, icon, link
    const pageNames = [
        ["Home", faHome, "/"],
        ["Plant Index", faBook, "/plant_index"],
        ["Calender", faCalendar, "/calender"],
        ["Search", faSearch, "/search"],
    ];


    return(
        <>
            {/* Container the navbar */}
            <div className={styles.navbar}>

                {/* The logo and title first, they get their own div for grouping*/}
                <div>

                    {/* The next.js link component is used to link to other pages using the built-in router functionality*/}
                    {/* Home container is used to group the logo and title together, placing them side by side*/}
                    <Link scroll={false} href="/" className={styles.homeContainer}>
                        <Image
                            src="/media/images/logo.svg"
                            alt="Rongoa Logo"
                            width={50}
                            height={100}
                            className={styles.logo}
                        />
                        <h1 className={styles.title} > Rongoa </h1>
                    </Link>
                </div>

                {/* The right side of the navbar, contains the links to other pages*/}
                <div className={styles.navright}>

                    {/* Loop through the pageNames array and create a link for each page*/}
                    {pageNames.map((page, index) => (
                        <Link key={index} scroll={false} href={String(page[2])} className={page[0] === currentPage ? styles.activePage : ""}>
                            <FontAwesomeIcon className={"inline"} icon={page[1] as IconProp}/>
                            <p>{String(page[0])}</p>
                            {/* A link is created for each page, the link is styled to be active if the page is the current page*/}
                            {/* It Contains the icon and the name of the page*/}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}