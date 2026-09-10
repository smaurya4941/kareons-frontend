import { cn } from '@/lib/utils/cn';

/** Matches the Blade `kareon_stars()` helper: full / half / outline at 0.5 steps. */
function starIcons(avg: number): ('star' | 'star_half' | 'star_outline')[] {
  const out: ('star' | 'star_half' | 'star_outline')[] = [];
  for (let i = 1; i <= 5; i++) {
    if (avg >= i) out.push('star');
    else if (avg >= i - 0.5) out.push('star_half');
    else out.push('star_outline');
  }
  return out;
}

interface StarRatingProps {
  rating: number | null;
  count?: number;
  size?: number;
  /** Show "(4.5) (12)" text alongside. */
  showValue?: boolean;
  className?: string;
}

export function StarRating({ rating, count, size = 15, showValue = true, className }: StarRatingProps) {
  if (rating === null || (count !== undefined && count === 0)) {
    return <span className={cn('text-xs text-brand-forest/40', className)}>No reviews yet</span>;
  }

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {starIcons(rating).map((icon, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{
            fontSize: size,
            color: '#c9a452',
            fontVariationSettings: `'FILL' ${icon === 'star_outline' ? 0 : 1}`,
          }}
          aria-hidden
        >
          {icon === 'star_outline' ? 'star' : icon}
        </span>
      ))}
      {showValue && (
        <span className="ml-1 text-xs text-brand-forest/60">
          {rating.toFixed(1)}
          {count !== undefined && ` (${count})`}
        </span>
      )}
    </span>
  );
}
