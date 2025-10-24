import { DefaultModalValues, ProductItem, Sizes } from '../types/products';

export function toCents(raw: string | number): number {
  const s = typeof raw === 'number' ? String(raw) : raw.replace(',', '.');
  const n = parseFloat(s || '0');
  return Math.round((n + Number.EPSILON) * 100);
}

export function fromCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function calculatePrices(
  productInfo: ProductItem,
  { currentSize, selectedAdditives }: DefaultModalValues
) {
  const curSize = productInfo.sizes[currentSize as Sizes];
  if (!curSize) return { commonPrice: 0, discountPrice: 0 };

  const sizeBaseCents = toCents(curSize.price);
  const sizeDiscountCents = curSize.discountPrice ? toCents(curSize.discountPrice) : sizeBaseCents;

  const additivesBaseCents = selectedAdditives.reduce((sum, idx) => {
    const add = productInfo.additives[Number(idx)];
    if (!add) return sum;
    return sum + toCents(add.price);
  }, 0);

  const additivesDiscountCents = selectedAdditives.reduce((sum, idx) => {
    const add = productInfo.additives[Number(idx)];
    if (!add) return sum;
    return sum + toCents(add.discountPrice ?? add.price);
  }, 0);

  const totalBaseCents = sizeBaseCents + additivesBaseCents;
  const totalDiscountCents = sizeDiscountCents + additivesDiscountCents;

  return {
    commonPrice: fromCents(totalBaseCents),
    discountPrice: fromCents(totalDiscountCents),
  };
}
