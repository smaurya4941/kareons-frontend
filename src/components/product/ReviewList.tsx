'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitReviewAction } from '@/lib/actions/reviews';
import { useToast } from '@/components/ui/Toast';
import { Icon } from '@/components/ui/Icon';
import { StarRating } from '@/components/ui/StarRating';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils/format';
import type { Review } from '@/types/api';

interface ReviewListProps {
  reviews: Review[];
  ratingAvg: number | null;
  reviewsCount: number;
  productId: number;
  productSlug: string;
  isAuthenticated: boolean;
}

export function ReviewList({
  reviews,
  ratingAvg,
  reviewsCount,
  productId,
  productSlug,
  isAuthenticated,
}: ReviewListProps) {
  return (
    <section id="reviews" className="mx-auto mb-12 max-w-4xl scroll-mt-20 border-t border-soft-border pt-10">
      <div className="flex flex-col gap-12 md:flex-row">
        <div className="md:w-1/3">
          <h3 className="mb-2 font-display text-3xl font-bold text-on-surface">Customer Reviews</h3>
          <div className="mb-2 flex items-center gap-3">
            <StarRating rating={ratingAvg ?? 0} showValue={false} size={26} />
            <span className="text-2xl font-bold text-on-surface">{(ratingAvg ?? 0).toFixed(1)}</span>
          </div>
          <p className="mb-8 font-medium text-on-surface-variant">Based on {reviewsCount} reviews</p>

          <ReviewForm productId={productId} productSlug={productSlug} isAuthenticated={isAuthenticated} />
        </div>

        <div className="space-y-6 md:w-2/3">
          {reviews.length === 0 ? (
            <EmptyState
              icon="rate_review"
              title="No Reviews Yet"
              description="Be the first to share your experience with this formulation!"
            />
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="hover-electric rounded-xl border border-soft-border bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-lg font-bold text-brand-gold-dark">
                      {(review.user?.name ?? 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-on-surface">{review.user?.name ?? 'Anonymous'}</h4>
                      <p className="text-xs font-medium text-on-surface-variant">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} showValue={false} size={18} />
                </div>
                {review.title && <h5 className="mt-4 text-lg font-bold text-on-surface">{review.title}</h5>}
                <p className="mt-2 leading-relaxed text-on-surface-variant">{review.review}</p>
                {review.admin_reply && (
                  <p className="mt-3 rounded-lg bg-surface p-3 text-sm text-on-surface-variant">
                    <strong>Reply from Kare Ons:</strong> {review.admin_reply}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewForm({
  productId,
  productSlug,
  isAuthenticated,
}: {
  productId: number;
  productSlug: string;
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [done, setDone] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => router.push(`/login?next=/product/${productSlug}`)}
        className="block w-full rounded-lg border-2 border-brand-gold-dark py-3 text-center font-bold text-brand-gold-dark transition-colors hover:bg-brand-forest hover:text-white"
      >
        Log in to Review
      </button>
    );
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
        <Icon name="check_circle" size={20} className="text-emerald-600" />
        {done}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mb-4 w-full rounded-lg border-2 border-brand-gold-dark py-3 font-bold text-brand-gold-dark transition-colors hover:bg-brand-forest hover:text-white"
      >
        {open ? 'Cancel' : 'Write a Review'}
      </button>

      {open && (
        <form
          className="space-y-4 rounded-xl border border-soft-border bg-surface p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(async () => {
              const result = await submitReviewAction(productId, productSlug, {
                rating,
                title: title || undefined,
                comment,
              });
              if (result.success) {
                setDone(result.message ?? 'Review submitted! It is pending moderation.');
                setOpen(false);
              } else {
                toast(result.message ?? 'Could not submit review.', 'error');
              }
            });
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ color: n <= rating ? '#c9a452' : '#c6c6cd', fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-soft-border bg-white px-4 py-2 text-sm outline-none focus:border-brand-gold-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">Your Review</label>
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-soft-border bg-white px-4 py-2 text-sm outline-none focus:border-brand-gold-dark"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-forest px-6 py-3 font-medium text-white transition-colors hover:bg-brand-forest/90 disabled:opacity-70"
          >
            {isPending && <Icon name="progress_activity" size={20} className="animate-spin" />}
            {isPending ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
}
