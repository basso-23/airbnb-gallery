import "@/styles/globals.css";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <main className="inter">
      <Head>
        <title>Airbnb selection</title>
      </Head>
      <Component {...pageProps} />
    </main>
  );
};

export default App;
