import type { NextConfig } from 'next';

const unicodeRoutes: Record<string, string> = {
  '/ha-på-mig': '/ha-pa-mig',
  '/bestäm': '/bestam',
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Canonical routes are ASCII; redirect the å/ä/ö spellings people type.
  redirects: async () =>
    Object.entries(unicodeRoutes).map(([source, destination]) => ({
      source: encodeURI(source),
      destination,
      permanent: true,
    })),
};

export default nextConfig;
