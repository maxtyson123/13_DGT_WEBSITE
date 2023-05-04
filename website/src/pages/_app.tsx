import '@/styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";

import type { AppProps } from 'next/app'
import { config } from "@fortawesome/fontawesome-svg-core";
import { Analytics } from '@vercel/analytics/react';

// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;


export default function App({ Component, pageProps }: AppProps) {
  return (
      <>
        <main>
          <Component {...pageProps} />
          <Analytics />
        </main>
      </>
  )
}
