import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <Container className="py-16">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
        <span className="material-symbols-outlined animate-spin text-4xl text-brand-gold-dark">progress_activity</span>
        <p className="text-sm text-on-surface-variant">Loading…</p>
      </div>
    </Container>
  );
}
