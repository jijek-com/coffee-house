import { signIn } from '../api/auth';
import { changeTheme } from "./theme";

import './../../assets/styles/styles.css';

document.addEventListener('DOMContentLoaded', async () => {
  const loginInput = document.querySelector('#login') as HTMLInputElement;
  const passwordInput = document.querySelector('#password') as HTMLInputElement;
  const signInBtn = document.querySelector('.signin__btn') as HTMLButtonElement;
  const globalError = document.querySelector('.signin__error-global') as HTMLElement;

  await changeTheme();

  function validateLogin(value: string) {
    if (value.length < 3) return 'Login must be at least 3 characters';
    if (!/^[A-Za-z]/.test(value)) return 'Login must start with a english letter';
    if (!/^[A-Za-z0-9]+$/.test(value)) return 'Only English letters and numbers allowed';
    return '';
  }

  function validatePassword(value: string) {
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(value))
      return 'Password must contain a special character or number';
    return '';
  }

  function clearError(input: HTMLElement) {
    const errorEl = (input.parentElement as HTMLElement).querySelector(
      '.signin__error'
    ) as HTMLElement;
    errorEl.textContent = '';
    input.classList.remove('error');
  }

  function checkFormValidity() {
    const loginValid = !validateLogin(loginInput.value);
    const passwordValid = !validatePassword(passwordInput.value);
    signInBtn.disabled = !(loginValid && passwordValid);
  }

  function showValidationState(input: HTMLInputElement, message: string, isValid: boolean | null) {
    const errorEl = (input.parentElement as HTMLElement).querySelector(
      '.signin__error'
    ) as HTMLElement;

    if (isValid === null) {
      errorEl.textContent = '';
      input.classList.remove('error', 'success');
      return;
    }

    if (isValid) {
      errorEl.textContent = '';
      input.classList.remove('error');
      input.classList.add('success');
    } else {
      errorEl.textContent = message;
      input.classList.remove('success');
      input.classList.add('error');
    }
  }

  function handleInputValidation(input: HTMLInputElement, validator: (v: string) => string) {
    const value = input.value.trim();
    if (!value) {
      showValidationState(input, '', null);
      return;
    }

    const message = validator(value);
    const isValid = message === '';
    showValidationState(input, message, isValid);
  }

  loginInput.addEventListener('blur', () => handleInputValidation(loginInput, validateLogin));
  passwordInput.addEventListener('blur', () =>
    handleInputValidation(passwordInput, validatePassword)
  );

  [loginInput, passwordInput].forEach((input) => {
    input.addEventListener('focus', () => {
      clearError(input);
      globalError.textContent = '';
    });

    input.addEventListener('input', () => {
      checkFormValidity();
    });
  });

  signInBtn.addEventListener('click', async () => {
    globalError.textContent = '';

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      await signIn(login, password);
      setTimeout(() => {
        window.location.href = './menu.html';
      }, 1000);
    } catch (error) {
      globalError.textContent =
        error instanceof Error && error.message.includes('401')
          ? 'Incorrect login or password'
          : 'Server error. Please try again later.';
    }
  });

  checkFormValidity();
});
