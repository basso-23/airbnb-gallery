import "@/styles/globals.css";
import "@fontsource-variable/inter";
import "swiper/css";
import "swiper/css/pagination";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <main>
      <Head>
        <title>Airbnb selection</title>
      </Head>
      <Component {...pageProps} />
    </main>
  );
};

export default App;
