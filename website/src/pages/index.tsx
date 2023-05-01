import Navbar from "@/components/navbar";
import React from "react";
import HtmlHeader from "@/components/html_header";

export default function Home() {
    const pageName = "Home"

    return (
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {
                /*

                    <Navbar/>  - This sticky

                    <Section>
                        <PageHeader>
                                - Welcome div
                        </PageHeader>
                    </Section>

                    <Section>
                        <ColumnContainer amount=3>
                            <Column>
                                <PlantCard data=/>
                                <PlantCard data=/>
                                <PlantCard data=/>
                            </Column>
                        </Column>
                    </Section>

                    <Section>
                        - Image Break Here
                    </Section>

                    <Section>
                        <Stats/>
                    </Section>

                    <Section>
                        </Footer/>
                    </Section>

                 */
            }

        </>
    );
}
