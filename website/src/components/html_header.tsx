import Head from "next/head";

export default function HtmlHeader(props: any) {

    // Constants
    const currentPage = props.currentPage;
    const iconpath = "/media/images/logo.svg";

    return(
        <>
                <Head>
                    <title>{currentPage}</title>
                    <link rel="icon" href={iconpath}/>
                    <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                    <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@100&display=swap" rel="stylesheet"/>
                </Head>
        </>
    )
}