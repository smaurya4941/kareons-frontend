'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <Icon name="error" size={32} className="text-error" />
      </div>
      <h1 className="font-display text-3xl font-bold text-brand-forest">Something Went Wrong</h1>
      <p className="max-w-md text-sm text-on-surface-variant">
        We hit an unexpected error loading this page. Please try again in a moment.
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-2">
        Try Again
      </button>
    </Container>
  );
}
