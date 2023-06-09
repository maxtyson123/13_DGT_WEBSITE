import '@/styles/globals.css'
import "@/styles/quill.snow.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import type {AppProps} from 'next/app'
import {useRouter} from 'next/router'
import {config} from "@fortawesome/fontawesome-svg-core";
import {Analytics} from '@vercel/analytics/react';
import Credits from "@/components/credits";
import {SessionProvider} from "next-auth/react";

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
              <Analytics />
           </SessionProvider>
        </main>
      </>
  )
}
