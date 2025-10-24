import { API_URL } from './index';
import { ConfirmItems } from '../types/products';

export async function placeOrder(cart: ConfirmItems) {
  const res = await fetch(API_URL.order, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(cart),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Order confirmation failed');
  }
}
