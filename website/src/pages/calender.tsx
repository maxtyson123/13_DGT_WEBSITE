import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import Credits from "@/components/credits";

type CalenderRef = React.ForwardedRef<HTMLDivElement>
export default function Calender(ref: CalenderRef){
    const pageName = "Calender"

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