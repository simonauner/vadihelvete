'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Re-fetches the page every few seconds while the tab is visible. */
export const AutoRefresh = ({ seconds = 4 }: { seconds?: number }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh();
    }, seconds * 1000);

    return () => clearInterval(timer);
  }, [router, seconds]);

  return null;
};
