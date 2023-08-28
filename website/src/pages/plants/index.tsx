import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useState} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/plants/mushrooms.module.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {InfiniteLoading} from "@/components/infinteLoading";


export default function Mushrooms(){
    const pageName = "Plants"
    const queryClient = new QueryClient()
    const [show,setShow] = useState(false);

    return(
        <>
            {/* The header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* The main page header is just the plant index title */}
            <PageHeader size={"small"}>
                <div className={styles.header}>
                    <h1>Plants</h1>
                </div>
            </PageHeader>

            {/* Section for infinite scroll */}
            <Section autoPadding>

                <div className={styles.allPlants}>

                    {/* Section title */}
                    <h1 className={styles.title}>All Plants</h1>
                    <p className={styles.subtitle}> To search for a specific plant, use the search page or the plant index page. </p>

                    <QueryClientProvider client={queryClient}>
                        <InfiniteLoading searchQuery={"/api/plants/search?mushrooms=exclude"}/>
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