'use client';

import { useState } from 'react';

type ShareButtonProps = {
  path: string;
  text: string;
};

export const ShareButton = ({ path, text }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = new URL(path, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" className="button" onClick={share}>
      {copied ? 'Länken är kopierad!' : 'Skicka till någon som behöver det'}
    </button>
  );
};
