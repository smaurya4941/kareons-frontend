import { cn } from '@/lib/utils/cn';

interface IconProps {
  /** Material Symbols Outlined ligature name, e.g. "shopping_cart". */
  name: string;
  /** Font-size in px (drives the glyph size). */
  size?: number;
  /** Filled variant. */
  fill?: boolean;
  weight?: number;
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

export function Icon({ name, size = 24, fill = false, weight = 300, className, ...rest }: IconProps) {
  return (
    <span
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
      className={cn('material-symbols-outlined', className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
