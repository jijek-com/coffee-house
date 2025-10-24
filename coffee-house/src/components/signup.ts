import { signUp } from '../api/auth';

import './../../assets/styles/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm') as HTMLFormElement;
  const registerBtn = document.getElementById('registerBtn') as HTMLButtonElement;
  const globalError = document.getElementById('globalError') as HTMLElement;

  const citySelect = document.getElementById('city') as HTMLSelectElement;
  const streetSelect = document.getElementById('street') as HTMLSelectElement;

  const streets: Record<string, string[]> = {
    london: [
      'Baker Street',
      'Oxford Street',
      'King’s Road',
      'High Street',
      'Bond Street',
      'Fleet Street',
      'Piccadilly',
      'Regent Street',
      'Downing Street',
      'Abbey Road',
    ],
    paris: [
      'Rue de Rivoli',
      'Boulevard Saint-Germain',
      'Avenue Montaigne',
      'Rue Mouffetard',
      'Rue Cler',
      'Rue de la Paix',
      'Rue Oberkampf',
      'Rue Saint-Honoré',
      'Rue de la Huchette',
      'Rue Lepic',
    ],
    berlin: [
      'Unter den Linden',
      'Friedrichstraße',
      'Kurfürstendamm',
      'Karl-Marx-Allee',
      'Potsdamer Straße',
      'Alexanderstraße',
      'Schönhauser Allee',
      'Leipziger Straße',
      'Oranienstraße',
      'Torstraße',
    ],
  };

  citySelect.addEventListener('change', () => {
    streetSelect.innerHTML = '<option value="">Select street</option>';
    const selectedCity = citySelect.value;
    if (selectedCity && streets[selectedCity]) {
      streets[selectedCity].forEach((street) => {
        const opt = document.createElement('option');
        opt.value = street;
        opt.textContent = street;
        streetSelect.appendChild(opt);
      });
    }
    validateField(citySelect);
  });

  const validators: Record<string, (value: string, data?: Record<string, any>) => true | string> = {
    name: (value) =>
      /^[A-Za-z][A-Za-z0-9]{2,}$/.test(value) ||
      'Login must start with a letter and be at least 3 characters long',
    passwd: (value) =>
      /^(?=.*[0-9!@#$%^&*(),.?":{}|<>]).{6,}$/.test(value) ||
      'Password must be 6+ chars and include a special character',
    confirmPasswd: (value, data) => value === data?.passwd || 'Passwords do not match',
    city: (value) => value !== '' || 'Please select a city',
    street: (value) => value !== '' || 'Please select a street',
    houseNumber: (value) => Number(value) > 1 || 'House number must be greater than 1',
  };

  const inputs = form.querySelectorAll('input, select') as NodeListOf<
    HTMLInputElement | HTMLSelectElement
  >;

  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('focus', () => clearError(input));
  });

  form.addEventListener('input', checkFormValidity);

  function validateField(input: HTMLInputElement | HTMLSelectElement) {
    const name = input.id;
    const value = input.value.trim();
    const data = Object.fromEntries(new FormData(form).entries());
    const validator = validators[name];
    const error = validator ? validator(value, data) : true;

    if (typeof error === 'string') {
      input.classList.add('error');
      const nextEl = input.nextElementSibling as HTMLElement | null;
      if (nextEl) nextEl.textContent = error;
      return false;
    } else {
      input.classList.remove('error');
      const nextEl = input.nextElementSibling as HTMLElement | null;
      if (nextEl) nextEl.textContent = '';
      return true;
    }
  }

  function clearError(input: HTMLInputElement | HTMLSelectElement) {
    input.classList.remove('error');
    (input.nextElementSibling as HTMLElement).textContent = '';
  }

  function checkFormValidity() {
    const valid = Array.from(inputs).every((el) => validateField(el));
    registerBtn.disabled = !valid;
  }

  function getFormValue(form: HTMLFormElement, name: string): string {
    const formData = new FormData(form);
    const value = formData.get(name);
    return typeof value === 'string' ? value.trim() : '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    globalError.textContent = '';

    const allValid = Array.from(inputs).every((el) => validateField(el));
    if (!allValid) return;

    const payByInput = form.querySelector(
      'input[name="paymentMethod"]:checked'
    ) as HTMLInputElement | null;

    const payload = {
      login: getFormValue(form, 'name'),
      password: getFormValue(form, 'passwd'),
      confirmPassword: getFormValue(form, 'confirmPasswd'),
      city: getFormValue(form, 'city'),
      street: getFormValue(form, 'street'),
      houseNumber: parseInt(getFormValue(form, 'houseNumber')),
      paymentMethod: payByInput?.value.toLocaleLowerCase() || '',
    };

    try {
      await signUp(payload);

      alert('Registration successful!');
      form.reset();
      registerBtn.disabled = true;

      setTimeout(() => {
        window.location.href = '/menu.html';
      }, 1000);
    } catch (err) {
      globalError.textContent = (err as Error).message;
    }
  });
});
