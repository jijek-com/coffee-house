import { fetchJSON } from './fatchJSON';

import { API_URL } from './index';

import { Category, ProductItem, ErrorProduct } from '../types/products';

export async function fetchProducts(): Promise<Record<Category, ProductItem[]> | ErrorProduct> {
  const data = await fetchJSON<ProductItem[]>(API_URL.products);

  const grouped: Record<Category, ProductItem[]> = {
    coffee: [],
    tea: [],
    dessert: [],
  };

  for (const item of data) {
    const category = item.category?.toLowerCase() as Category;
    if (grouped[category]) grouped[category].push(item);
  }

  return grouped;
}

export async function fetchProductById(id: number): Promise<ProductItem> {
  return await fetchJSON<ProductItem>(`${API_URL.products}/${id}`);
}
