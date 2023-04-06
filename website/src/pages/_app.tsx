import '@/styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";

import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { config } from "@fortawesome/fontawesome-svg-core";

// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
      <>
        <main className={roboto.className}>
          <Component {...pageProps} />
        </main>
      </>
  )
}
