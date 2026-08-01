'use client';

import { useEffect, useState, type ReactNode } from 'react';

type MswProviderProps = {
  children: ReactNode;
};

export function MswProvider({ children }: MswProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function enableMocking() {
      if (typeof window === 'undefined') {
        return;
      }
      const shouldEnableMocking =
        process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';
      if (!shouldEnableMocking) {
        setIsReady(true);
        return;
      }
      try {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
          quiet: true,
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
        });
        console.log('MSW worker started');
      } catch (error) {
        console.error('Failed to start MSW worker:', error);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    enableMocking();

    return () => {
      isMounted = false;
    };
  }, []);
  if (!isReady) {
    return null;
  }
  return children;
}
