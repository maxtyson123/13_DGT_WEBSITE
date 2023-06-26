import { Html, Head, Main, NextScript } from 'next/document'

// This is the custom document file that Next.js uses to render the HTML
export default function Document() {
  return (
    <Html lang="en">
     {/* The head section */}
      <Head />
      <body>
        {/* The content of the website (see app.tsx) */}
        <Main />

        {/* The scripts Next.js injects into the document */}
        <NextScript />
      </body>
    </Html>
  )
}
