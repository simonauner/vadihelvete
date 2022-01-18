import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Button } from "../src/Button/Button";
import { getSuggestion } from "../src/Suggestions";
import styles from "../styles/Home.module.css";

type HomePageProps = {
  suggestion: string;
};

const Home: NextPage<HomePageProps> = ({ suggestion }) => {
  const handleClick = () => {
    location.reload();
  };

  const metaTitle = "Vad i helevete ska jag göra nu?";
  const metaDescription = "Vet du inte riktigt vad du ska göra med ditt liv?";
  const metaUrl = "https://vadihelvete.se";

  return (
    <div className={styles.container}>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {/* facebook open graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />

        {/* twitter */}
        <meta name="twitter:domain" content="vadihelvete.se" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:url" content={metaUrl} />
        <meta name="twitter:label1" content="Slut på idéer?" />
        <meta name="twitter:data1" content="Ja! ✅" />
        <meta name="twitter:label2" content="Tycker om att få order?" />
        <meta name="twitter:data2" content="Oh, yes! ✅" />

        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>"
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Du kan väl för i helvete {suggestion}</h1>

        <p className={styles.description}>
          <Button onClick={handleClick}>
            Det har jag ju för i helvete redan gjort
          </Button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export async function getServerSideProps() {
  const suggestion = getSuggestion();

  return { props: { suggestion } };
}

export default Home;
