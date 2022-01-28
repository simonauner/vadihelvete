import type { NextPage } from 'next';
import { Page } from '../src/Page';
import { getSuggestion } from '../src/Suggestions';

type HomePageProps = {
  suggestion: string;
};

const Home: NextPage<HomePageProps> = ({ suggestion }) => (
  <Page suggestion={suggestion} favicon="🖥️" />
);

export const getServerSideProps = async () => {
  const suggestion = getSuggestion('it');
  return { props: { suggestion } };
};

export default Home;
