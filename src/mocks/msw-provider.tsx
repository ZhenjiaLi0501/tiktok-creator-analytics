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
      if (process.env.NODE_ENV !== 'development') {
        setIsReady(true);
        return;
      }
      try {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
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
