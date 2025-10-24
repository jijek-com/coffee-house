import { User } from '../types/profile';

export function getCurrentUser(): User | null {
  const userData = localStorage.getItem('user');
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    console.error('Invalid user data in localStorage');
    return null;
  }
}
