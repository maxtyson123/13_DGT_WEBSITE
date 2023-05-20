import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";

type IndexRef = React.ForwardedRef<HTMLDivElement>
export default function PlantIndex(ref: IndexRef){
    const pageName = "Plant Index"

    return(
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>
        </>
    )
}