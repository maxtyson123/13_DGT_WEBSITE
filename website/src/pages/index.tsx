import Navbar from "@/components/navbar";
import React from "react";
import HtmlHeader from "@/components/html_header";

export default function Home() {
    const pageName = "Home"

    return (
        <>
            <HtmlHeader currentPage={pageName}/>
            {
                /*

                    <Navbar/>  - This sticky

                    <PageHeader>
                        <WelcomeDiv/>
                    </PageHeader>

                    <Section>
                        <CollumContainer amount=3>
                            <Collum>
                                <PlantCard data=/>
                                <PlantCard data=/>
                                <PlantCard data=/>
                            </Collum>
                        </Collum>
                    </Section>


                 */
            }

        </>
    );
}
