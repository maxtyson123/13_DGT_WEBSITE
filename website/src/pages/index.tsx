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
            {/* Setup the page header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Section for the welcome message and search box */}
            <Section>

                {/* Use the page header component to display the welcome message (See: components/page_header.tsx) */}
                <PageHeader>

                  {/* Container for the welcome message and search box */}
                   <div className={styles.welcomeContainer}>

                       {/* Place the title and description on the left */}
                       <div className={styles.titleContainer}>
                           <h1 className={styles.title}> Rongoa </h1>
                           <p className={styles.description}>Site description ... ... ... ... ... ... ... ... ... ... ... ...
                               ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...
                               ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...
                               ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...  </p>
                       </div>

                      {/* Place the plant model on the right */}
                       <div className={styles.plantContainer}>
                           <ScrollingPlant/>
                       </div>
                   </div>

                    {/* Search is to be below the welcome message so don't include it in the flex div*/}
                    <SearchBox/>
                </PageHeader>
            </Section>

            {/* Test Scrolling*/}
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
