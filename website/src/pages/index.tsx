//set PATH=%PATH%;C:\Users\max.tyson\Downloads\node-v14.16.0-win-x64\node-v14.16.0-win-x64

import React from "react";
import styles from "@/styles/index.module.css"
import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import Section from "@/components/section";
import PageHeader from "@/components/page_header";
import SearchBox from "@/components/search_box";
import ScrollingPlant from "@/components/scrolling_plant";

export default function Home() {
    const pageName = "Home"

    return (
        <>
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            <Section>
                <PageHeader>
                   <div className={styles.welcomeContainer}>

                       <div className={styles.titleContainer}>
                           <h1 className={styles.title}> Rongoa </h1>
                           <p className={styles.description}>Site description ... ... ... ... ... ... ... ... ... ... ... ...
                               ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...
                               ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...
                               ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...  </p>
                       </div>
                       <div className={styles.plantContainer}>
                           <ScrollingPlant/>
                       </div>
                   </div>
                    <SearchBox/>
                </PageHeader>
            </Section>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
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
