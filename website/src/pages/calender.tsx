import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React from "react";

type CalenderRef = React.ForwardedRef<HTMLDivElement>
export default function Calender(ref: CalenderRef){
    const pageName = "Calender"

    return(
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>
            {/* Add a page transition */}
        </>
    )
}