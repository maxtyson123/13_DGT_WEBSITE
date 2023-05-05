import '@/styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";

import type { AppProps} from 'next/app'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'
import { config } from "@fortawesome/fontawesome-svg-core";
import { Analytics } from '@vercel/analytics/react';

// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;


export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()
  const pageKey = router.asPath

  return (
      <>
        <main>
          <AnimatePresence initial={false} mode="popLayout">
              <Component  key={pageKey} {...pageProps} />
          </AnimatePresence>
          <Analytics />
        </main>
      </>
  )
}
