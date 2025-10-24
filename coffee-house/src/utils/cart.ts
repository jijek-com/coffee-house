import { CartProductItem, Sizes } from '../types/products';

export function getCart(): CartProductItem[] {
  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return [];

    const parsed = JSON.parse(raw) as CartProductItem[];

    return parsed.map((p) => ({
      id: p.id,
      product: p.product,
      selectedSize: String(p.selectedSize || 's') as Sizes,
      selectedAdditives: Array.isArray(p.selectedAdditives)
        ? (p.selectedAdditives.map(String) as string[])
        : [],
      commonPrice: p.commonPrice,
      discountPrice: p.discountPrice,
    })) as CartProductItem[];
  } catch (e) {
    return [] as CartProductItem[];
  }
}

export function saveCart(cart: CartProductItem[]): void {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    console.error('saveCart error', e);
  }
}

export function saveCartItem(item: CartProductItem): void {
  const cart = getCart();
  const existingIndex = cart.findIndex((i) => i.id === item.id);

  if (existingIndex !== -1) {
    cart[existingIndex] = item;
  } else {
    cart.push(item);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart-updated'));
}
