import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import Credits from "@/components/credits";

type SearchRef = React.ForwardedRef<HTMLDivElement>
export default function Search(ref: SearchRef){
    const pageName = "Search"

    return(
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <Credits/>
        </>
    )
}