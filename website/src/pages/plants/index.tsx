import React, {useState} from "react";
import styles from "@/styles/pages/plants/mushrooms.module.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {InfiniteLoading} from "@/components/infinteLoading";
import {Layout} from "@/components/layout";


export default function Plants(){
    const pageName = "Plants"
    const queryClient = new QueryClient()

    return(
        <>
          <Layout pageName={pageName} header={"Plants"}>
              {/* Section title */}
              <h1 className={styles.title}>All Plants</h1>
              <p className={styles.subtitle}> To search for a specific plant, use the search page or the plant
                  index page. </p>

              <div className={styles.mushroomContainer}>
                  <QueryClientProvider client={queryClient}>
                      <InfiniteLoading searchQuery={"/api/plants/search?mushrooms=exclude"} display={"PlantCardApi"}/>
                  </QueryClientProvider>
              </div>
          </Layout>
        </>
    )
}