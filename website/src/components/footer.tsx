import Image from "next/image";
import React from "react";
import styles from "@/styles/components/footer.module.css";
import SearchBox from "@/components/search_box";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {PageName, pageNames} from "@/components/navbar";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

interface footerEntryProps {
    page: PageName,
    mobile?: boolean
}
function FooterEntry({page, mobile} : footerEntryProps) {

    if(page.children.length > 0 && !mobile) {
        return (
            <Link scroll={false} href={String(page.path)} className={styles.link}>
                <FontAwesomeIcon className={"inline"} icon={page.icon as IconProp}/>
                <p className={"inline"}>{String(page.name)}</p>
                {/* A link is created for each page, the link is styled to be active if the page is the current page*/}
                {/* It Contains the icon and the name of the page*/}

                {page.children.map((child, index) => (
                    <FooterEntry page={child} key={index}/>
                ))}
            </Link>
        )
    }
    else {
        return(
            <>
                <Link scroll={false} href={String(page.path)} className={styles.link}>
                    <FontAwesomeIcon className={"inline"} icon={page.icon as IconProp}/>
                    <p className={"inline"}>{String(page.name)}</p>
                    {/* A link is created for each page, the link is styled to be active if the page is the current page*/}
                    {/* It Contains the icon and the name of the page*/}
                </Link>
                {page.children.map((child, index) => (
                    <FooterEntry page={child} key={index}/>
                ))}
            </>


        )
    }
}

/**
 * Renders the Footer component which displays a footer at the bottom of the page with a search box and links to other pages.
 *
 * @returns {JSX.Element} - The JSX element representing the Footer component.
 */
export default function Footer() {
    return (
        <>
            <div className={styles.footer}>

                {/* Make the image container go behind the content*/}
                {/* Apply the styling to the div as <Image> uses fit="cover" to make image the size of the div */}
                {/* Blur data is a low res blurred image that is shown while the image is loading, stored in base64 */}
                <div className={"absolute -z-10 "+ styles.footerBackgroundImage}>
                    {/* Background Image using Next.js Image Component, with blur placeholder for when the image is loading*/}
                    <Image
                        src={"/media/images/main_bg.jpg"}
                        alt={"Plants Background"}
                        fill={true}
                        objectFit="cover"
                        quality={100}
                        placeholder={"blur"}
                        blurDataURL={"data:image/jpeg;base64,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"}
                    />
                </div>

                {/* Search box */}
                <div className={styles.searchBoxContainer}>
                    <SearchBox/>
                </div>


                {/* Links to the other pages */}
                <div className={styles.links}>
                    <h1> Rongoā </h1>
                    <ul>
                        {/* Loop through the pageNames array and create a link for each page*/}
                        {pageNames.map((page, index) => (
                            <li key={index}>
                                <FooterEntry page={page} key={index}/>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}