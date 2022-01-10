/* eslint-disable @next/next/no-css-tags */
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={{}}>
      <Head>
        <title>Kunal Gupta</title>
        <link href="/fonts/GTWalsheim/stylesheet.css" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
