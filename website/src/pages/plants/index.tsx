import React, {useState} from "react";
import styles from "@/styles/pages/plants/mushrooms.module.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {InfiniteLoading} from "@/components/infinteLoading";
import {Layout} from "@/components/layout";


export default function Mushrooms(){
    const pageName = "Plants"
    const queryClient = new QueryClient()
    const [show,setShow] = useState(false);

    return(
        <>
          <Layout pageName={pageName} header={"Plants"}>
              {/* Section title */}
              <h1 className={styles.title}>All Plants</h1>
              <p className={styles.subtitle}> To search for a specific plant, use the search page or the plant
                  index page. </p>

              <QueryClientProvider client={queryClient}>
                  <InfiniteLoading searchQuery={"/api/plants/search?mushrooms=exclude"}/>
              </QueryClientProvider>
          </Layout>
        </>
    )
}