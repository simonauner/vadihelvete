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

  return (
    <div className={styles.container}>
      <Head>
        <title>Vad i helvete ska jag göra nu?</title>
        <meta
          name="description"
          content="Vet du inte riktigt vad du ska göra?"
        />
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
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
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

  // Pass data to the page via props
  return { props: { suggestion } };
}

export default Home;
