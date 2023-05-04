import Head from "next/head";

export default function HtmlHeader(props: any) {

    // Constants
    const currentPage = props.currentPage;
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