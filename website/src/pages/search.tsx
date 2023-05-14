import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React from "react";
import PageHeader from "@/components/page_header";

type SearchRef = React.ForwardedRef<HTMLDivElement>
export default function Search(ref: SearchRef){
    const pageName = "Search"

    return(
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>
        </>
    )
}