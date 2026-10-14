import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const fontData = readFile(
  join(process.cwd(), 'src/assets/ArchivoBlack-Regular.woff')
);

type OgImageProps = {
  /** Small line above the headline. */
  kicker?: string;
  headline: string;
  /** Part of the headline shown in the accent colour, after the headline. */
  highlight?: string;
  emoji?: string;
};

export const ogImage = async ({
  kicker,
  headline,
  highlight,
  emoji,
}: OgImageProps) => {
  const length = headline.length + (highlight?.length ?? 0);
  const fontSize = length > 120 ? 54 : length > 70 ? 64 : length > 45 ? 76 : 92;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: '#fff6ee',
        color: '#1d1310',
        fontFamily: 'Archivo Black',
      }}
    >
      <div style={{ display: 'flex', fontSize: 34, color: '#6b5a53' }}>
        {kicker ?? ''}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          fontSize,
          lineHeight: 1.05,
          letterSpacing: -1,
        }}
      >
        {[
          ...headline.split(' ').map((word) => ({ word, accent: false })),
          ...(highlight ?? '')
            .split(' ')
            .filter(Boolean)
            .map((word) => ({ word, accent: true })),
        ].map(({ word, accent }, index) => (
          <span
            key={index}
            style={{
              marginRight: fontSize * 0.25,
              color: accent ? '#d92f1a' : undefined,
            }}
          >
            {word}
          </span>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: 36,
        }}
      >
        <div style={{ display: 'flex' }}>
          vad i helvete<span style={{ color: '#d92f1a' }}>.nu</span>
        </div>
        <div style={{ display: 'flex', fontSize: 80 }}>{emoji ?? ''}</div>
      </div>
    </div>,
    {
      ...ogSize,
      emoji: 'twemoji',
      fonts: [{ name: 'Archivo Black', data: await fontData, weight: 400 }],
    }
  );
};
