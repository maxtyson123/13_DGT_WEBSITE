//set PATH=%PATH%;C:\Users\max.tyson\Downloads\node-v14.16.0-win-x64\node-v14.16.0-win-x64

import Navbar from "@/components/navbar";
import React from "react";
import HtmlHeader from "@/components/html_header";
import Section from "@/components/section";
import PageHeader from "@/components/page_header";

export default function Home() {
    const pageName = "Home"

    return (
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            <Section>
                <PageHeader>
                    <h1> TITLE </h1>
                </PageHeader>
            </Section>

            {
                /*


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
