import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React from "react";
import PageTransition from "@/components/transitioner";

type IndexRef = React.ForwardedRef<HTMLDivElement>
export default function PlantIndex(ref: IndexRef){
    const pageName = "Plant Index"

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