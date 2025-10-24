import { API_URL } from './index';
import { fetchJSON } from './fatchJSON';
import { SignInResponse } from '../types/profile';

export async function checkAuth(): Promise<boolean> {
  const token = localStorage.getItem('token');

  if (!token) return false;

  try {
    const data = await fetchJSON(API_URL.user, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Authorized user:', data);
    return true;
  } catch (err) {
    console.error('checkAuth error:', err);
    return false;
  }
}

export async function signIn(login: string, password: string): Promise<void | { token: string }> {
  try {
    const response = await fetchJSON<SignInResponse>(API_URL.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    console.log('signIn response:', response);

    if (!response?.access_token) {
      throw new Error('Invalid response from server');
    }
    const { access_token, user } = response;

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    console.log('Authorized success:', user);
  } catch (err) {
    console.error('signIn error:', err);
    throw err;
  }
}

export async function signOut(): Promise<void> {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function signUp(payload: {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: string;
}): Promise<void | { token: string }> {
  try {
    const response = await fetchJSON<SignInResponse>(API_URL.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('signUp response:', response);

    if (!response?.access_token) {
      throw new Error('Invalid response from server');
    }

    const { access_token, user } = response;

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    console.log('Registration success:', user);
  } catch (err) {
    console.error('signUp error:', err);
    throw err;
  }
}
