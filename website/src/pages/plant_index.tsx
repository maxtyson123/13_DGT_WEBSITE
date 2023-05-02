import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React from "react";

export default function PlantIndex(){
    const pageName = "Plant Index"

    return(
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>
        </>
    )
}