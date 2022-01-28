import type { GetServerSideProps, NextPage } from 'next';
import { Page } from '../src/components/Page';
import { getSuggestion } from '../src/application/Suggestions';
import {
  getResponseCookies,
  getSeenSuggestions,
} from '../src/server/cookies/cookies';

type HomePageProps = {
  suggestion: string;
};

const Home: NextPage<HomePageProps> = ({ suggestion }) => (
  <Page suggestion={suggestion} />
);

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { cookies } = req;

  const seenSuggestions = getSeenSuggestions(cookies);

  const category = 'home';

  const [suggestion, newSeenSuggestions] = getSuggestion(
    category,
    seenSuggestions
  );

  const responseCookies = getResponseCookies(newSeenSuggestions);
  res.setHeader('Set-Cookie', responseCookies);

  return { props: { suggestion: suggestion || null } };
};

export default Home;
