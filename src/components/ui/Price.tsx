import { cn } from '@/lib/utils/cn';
import { formatMoney } from '@/lib/utils/format';

interface PriceProps {
  price: number;
  salePrice?: number | null;
  /** Size preset for the effective price. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' };

export function Price({ price, salePrice, size = 'md', className }: PriceProps) {
  const onSale = Boolean(salePrice && salePrice < price);
  const effective = onSale ? salePrice! : price;

  return (
    <span className={cn('flex flex-col leading-tight', className)}>
      {onSale && <span className="text-xs text-brand-forest/50 line-through">₹{formatMoney(price)}</span>}
      <span className={cn('font-bold text-brand-forest', SIZES[size])}>₹{formatMoney(effective)}</span>
    </span>
  );
}
