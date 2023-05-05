import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React from "react";
import PageTransition from "@/components/transitioner";
import PageHeader from "@/components/page_header";

type SearchRef = React.ForwardedRef<HTMLDivElement>
export default function Search(ref: SearchRef){
    const pageName = "Search"

    return(
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Add a page transition */}
            <PageTransition ref={ref}>
            </PageTransition>
        </>
    )
}