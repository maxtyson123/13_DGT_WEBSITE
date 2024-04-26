import '@/styles/components/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";

import type {AppProps} from 'next/app'
import {useRouter} from 'next/router'
import {config} from "@fortawesome/fontawesome-svg-core";
import {SessionProvider} from "next-auth/react";
import React from "react";


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
            <div className={"pageWrapper"}>
                <div className={"content"}>
                    <Component  key={pageKey} {...pageProps} />
                </div>
            </div>



          </SessionProvider>
        </main>
      </>
  )
}