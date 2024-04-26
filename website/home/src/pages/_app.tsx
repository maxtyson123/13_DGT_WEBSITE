import '@/styles/components/globals.css'
import "@/styles/components/quill.snow.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import type {AppProps} from 'next/app'
import {useRouter} from 'next/router'
import {config} from "@fortawesome/fontawesome-svg-core";
import {Analytics} from '@vercel/analytics/react';
import Credits from "@/components/credits";
import {SessionProvider} from "next-auth/react";
import { AxiomWebVitals } from 'next-axiom';
import ScrollToTop from "@/components/scroll_to_top";
import React from "react";

// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;


export default function App({ Component, pageProps }: AppProps) {

  // Get the current page URL
  const router = useRouter()
  const pageKey = router.asPath

  return (
      <>
        <main>
          {/* The session provider must wrap the entire app to keep the user logged in */}
          <SessionProvider session={pageProps.session}>

              {/* Show the page */}
              <Component  key={pageKey} {...pageProps} />

              {/* Credits and analytics should be on every page*/}
              <Credits/>

              {/* Allow the user to scroll to the top of the page easily*/}
              <ScrollToTop/>

              <Analytics />
              <AxiomWebVitals />
           </SessionProvider>
        </main>
      </>
  )
}
