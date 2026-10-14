import NextHead from 'next/head';
import { FC } from 'react';

type HeadProps = {
  favicon?: string;
};

export const Head: FC<HeadProps> = ({ favicon = '🎯' }) => {
  const metaTitle = 'Vad i helvete ska jag göra nu?';
  const metaDescription = 'Vet du inte riktigt vad du ska göra med ditt liv?';
  const metaUrl = 'https://vadihelvete.nu';

  return (
    <NextHead>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {/* facebook open graph tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />

      {/* twitter */}
      <meta name="twitter:domain" content="vadihelvete.nu" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:label1" content="Slut på idéer?" />
      <meta name="twitter:data1" content="Ja! ✅" />
      <meta name="twitter:label2" content="Tycker om att få nya idéer?" />
      <meta name="twitter:data2" content="Oh, yes! ✅" />

      <link
        rel="icon"
        href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${favicon}</text></svg>`}
      />
    </NextHead>
  );
};
