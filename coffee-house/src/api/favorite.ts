import { API_URL } from './index';
import { fetchJSON } from './fatchJSON';
import { ProductItem } from '../types/products';

export async function getFavoriteProducts(): Promise<Omit<ProductItem, 'sizes' | 'additives'>[]> {
  return await fetchJSON<Omit<ProductItem, 'sizes' | 'additives'>[]>(API_URL.favorite);
}
