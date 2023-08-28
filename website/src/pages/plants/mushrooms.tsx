import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/plants/mushrooms.module.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {InfiniteLoading} from "@/components/infinteLoading";

export default function Mushrooms(){
    const pageName = "Mushrooms"
    const queryClient = new QueryClient()


    return(
        <>
            {/* The header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* The main page header is just the plant index title */}
            <PageHeader size={"small"}>
                <div className={styles.header}>
                    <h1>Mushrooms</h1>
                </div>
            </PageHeader>

            {/* Section for infinite scroll */}
            <Section autoPadding>

                <div className={styles.allPlants}>

                    {/* Section title */}
                    <h1 className={styles.sectionTitle}>All Plants</h1>
                    <p> To search for a specific mushroom, use the search page. </p>
                    <QueryClientProvider client={queryClient}>
                        <InfiniteLoading searchQuery={"/api/plants/search?mushrooms=only"}/>
                    </QueryClientProvider>
                </div>

            </Section>

            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <ScrollToTop/>

           
        </>
    )
}