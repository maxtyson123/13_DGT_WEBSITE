import React from "react";
import styles from "@/styles/pages/plants/mushrooms.module.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {InfiniteLoading} from "@/components/infinteLoading";
import {Layout} from "@/components/layout";

export default function Mushrooms(){
    const pageName = "Mushrooms"
    const queryClient = new QueryClient()


    return(
        <>
            <Layout pageName={pageName} header={"Plants"}>
                {/* Section title */}
                <h1 className={styles.title}>All Mushrooms</h1>
                <p className={styles.subtitle}> To search for a specific mushroom, use the search page. </p>

                <QueryClientProvider client={queryClient}>
                    <InfiniteLoading searchQuery={"/api/plants/search?mushrooms=only"}/>
                </QueryClientProvider>
            </Layout>
        </>
    )
}