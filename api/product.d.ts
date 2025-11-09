import { Category, ProductItem, ErrorProduct } from '../types/products';
export declare function fetchProducts(): Promise<Record<Category, ProductItem[]> | ErrorProduct>;
export declare function fetchProductById(id: number): Promise<ProductItem>;
//# sourceMappingURL=product.d.ts.map