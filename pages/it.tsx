import type { GetServerSideProps, NextPage } from 'next';
import { Page } from '../src/components/Page';
import {
  getSeenSuggestions,
  getResponseCookies,
} from '../src/server/cookies/cookies';
import { getSuggestion } from '../src/application/Suggestions';

type HomePageProps = {
  suggestion: string;
};

const Home: NextPage<HomePageProps> = ({ suggestion }) => (
  <Page suggestion={suggestion} favicon="🖥️" />
);

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { cookies } = req;

  const seenSuggestions = getSeenSuggestions(cookies);

  const category = 'it';

  const [suggestion, newSeenSuggestions] = getSuggestion(
    category,
    seenSuggestions
  );

  const responseCookies = getResponseCookies(newSeenSuggestions);
  res.setHeader('Set-Cookie', responseCookies);

  return { props: { suggestion: suggestion || null } };
};

export default Home;
