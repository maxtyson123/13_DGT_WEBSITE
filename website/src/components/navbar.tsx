import Link from 'next/link';
import Image from 'next/image';
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faHome, faBook, faCalendar} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/navbar.module.css";

export default function Navbar(props: any) {

    const currentPage = props.currentPage;
    const pageNames = [
        ["Home", faHome, "/"],
        ["Plant Index", faBook, "/plant_index"],
        ["Calender", faCalendar, "/calender"],
        ["Search", faSearch, "/search"],
    ];


    return(
        <>

            <div className={styles.navbar}>

                {/* Render the logo and title */}
                <div className={styles.logoContainer}>

                    <Link href="/" className={styles.homeContainer}>
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
                <div className={styles.navright}>
                    {pageNames.map((page) => (
                        <>
                            <Link key={page[2]} href={page[2]} className={page[0] === currentPage ? styles.activePage : ""}>
                                <FontAwesomeIcon className={"inline"} icon={page[1]}/>
                                <p>{page[0]}</p>
                            </Link>

                        </>
                    ))}
                </div>
            </div>


        </>
    )
}