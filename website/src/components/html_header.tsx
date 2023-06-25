import Head from "next/head";

interface HtmlHeaderProps {
    currentPage: string
}

/**
 * HtmlHeader component is used to render the <head> tag for the page.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.currentPage - The name of the current page.
 *
 * @returns {JSX.Element} - A JSX Element that contains the <head> tag.
 */
export default function HtmlHeader({currentPage}: HtmlHeaderProps) {

    // Constants
    const iconPath = "/media/images/logo.svg";

    return(
        <>
            {/* Head Component for Next.js that allows editing the <head> tag */}
            <Head>

                {/* Title of the page and the favicon */}
                <title>{currentPage}</title>
                <link rel="icon" href={iconPath}/>

            </Head>
        </>
    )
}