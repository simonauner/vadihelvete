import { AreaPage } from '@/components/AreaPage';

export const StoreMissing = () => (
  <AreaPage title="Databasen saknas för i helvete">
    <p>
      Den här delen behöver Upstash Redis. Lägg till integrationen i Vercel (den
      sätter <code>KV_REST_API_URL</code> och <code>KV_REST_API_TOKEN</code>)
      och deploya om.
    </p>
  </AreaPage>
);
