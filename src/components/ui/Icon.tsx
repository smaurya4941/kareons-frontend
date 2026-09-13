import { cn } from '@/lib/utils/cn';

export interface IconProps {
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
  const isHidden = rest['aria-label'] ? undefined : (rest['aria-hidden'] ?? true);
  const role = rest['aria-label'] ? 'img' : undefined;

  return (
    <span
      role={role}
      aria-hidden={isHidden}
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
