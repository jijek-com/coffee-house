import { DefaultModalValues, ProductItem } from '../types/products';
export declare function toCents(raw: string | number): number;
export declare function fromCents(cents: number): string;
export declare function calculatePrices(productInfo: ProductItem, { currentSize, selectedAdditives }: DefaultModalValues): {
    commonPrice: number;
    discountPrice: number;
} | {
    commonPrice: string;
    discountPrice: string;
};
//# sourceMappingURL=price.d.ts.map