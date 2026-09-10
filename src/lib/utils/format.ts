/** Mirrors PHP number_format($n, 2) with the "en-IN" grouping the Blade site uses. */
export function formatMoney(value: number): string {
  return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

export function discountPercent(price: number, salePrice: number | null): number | null {
  if (!salePrice || salePrice >= price || price <= 0) return null;
  return Math.round(((price - salePrice) / price) * 100);
}
