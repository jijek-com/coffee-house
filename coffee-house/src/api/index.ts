const BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/';

export const API_URL = {
  favorite: `${BASE_URL}/products/favorites`,
  products: `${BASE_URL}/products`,
  register: `${BASE_URL}/auth/register`,
  login: `${BASE_URL}/auth/login`,
  user: `${BASE_URL}/auth/profile`,
  order: `${BASE_URL}/orders/confirm`,
} as const;
