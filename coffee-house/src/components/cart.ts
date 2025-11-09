import { checkAuth } from '../api/auth';
import { placeOrder } from '../api/order';

import { Additives, CartProductItem, ConfirmItems } from '../types/products';
import { User } from '../types/profile';

import { getCurrentUser } from '../utils/user';
import { getCart, saveCart } from '../utils/cart';
import { changeTheme } from "./theme";

import { ProductImage } from '../data/productImage';

import defaultImage from './../../assets/img/not-image.png';
import trashIcon from './../../assets/img/trash.svg';

import './../../assets/styles/styles.css';

document.addEventListener('DOMContentLoaded', initCartPage);

async function initCartPage() {
  const cartContainer = document.querySelector('.total__dishes-box') as HTMLElement;
  if (!cartContainer) return;

  const totalEl = document.querySelector('.total__section .heading3:last-child') as HTMLElement;
  const authSection = document.querySelector('.auth__section') as HTMLElement;
  const userInfoSection = document.querySelector('.user-info__box-fixed') as HTMLElement;
  const totalSection = document.querySelector('.total__section') as HTMLElement;
  const confirmBtn = document.querySelector('.user-info__btn') as HTMLButtonElement;

  const cart = getCart();
  const isAuthorized = await checkAuth();
  const user = isAuthorized ? getCurrentUser() : null;

  updateAuthUI(isAuthorized, user);
  renderCart(cart);
  await changeTheme();

  if (!isAuthorized || cart.length === 0) {
    confirmBtn.style.display = 'none';
    confirmBtn.disabled = true;
  } else {
    confirmBtn.style.display = 'block';
    confirmBtn.disabled = false;

    confirmBtn.onclick = async () => {
      if (!cart.length) return;
      await handleConfirm(cart);
    };

    renderCart(cart);
  }

  function updateAuthUI(isAuth: boolean, user: User | null) {
    if (isAuth && user) {
      authSection.style.display = 'none';
      userInfoSection.innerHTML = `
        <div class="user-info__row">
          <div class="heading3">Address:</div>
          <div class="heading3 text-right">${user.city}, ${user.street}, ${user.houseNumber}</div>
        </div>
        <div class="user-info__row">
          <div class="heading3">Pay By:</div>
          <div class="heading3 text-right">${user.paymentMethod}</div>
        </div>`;

      userInfoSection.style.display = 'block';
    } else {
      userInfoSection.style.display = 'none';
      authSection.style.display = cart.length ? 'flex' : 'none';
    }
  }

  function renderCart(cartItems: CartProductItem[]) {
    cartContainer.innerHTML = '';

    if (!cartItems.length) {
      confirmBtn.disabled = true;
      totalEl.textContent = '$0.00';
      return;
    }

    cartItems.forEach((item, index) => {
      const img = ProductImage[item.id] || defaultImage;
      const additives = item.selectedAdditives?.length
        ? item.selectedAdditives
            .map((v) => (item.product.additives[Number(v)] as Additives).name)
            .join(', ')
        : '-';

      const hasDiscount = isAuthorized && item.discountPrice;

      const element = document.createElement('div');
      element.className = 'total__row';
      element.innerHTML = `
        <div class="total__col">
          <div class="total__btn-delete" data-index="${index}">
            <img class="total__btn-delete-icon" src="${trashIcon}" alt="Icon delete" />
          </div>
          <img class="total__dishes-img" src="${img}" alt="Dish" />
          <div class="total__desc">
            <div class="total__title heading3">${item.product.name}</div>
            <div class="total__info fs-medium">${item.selectedSize.toUpperCase()}, ${additives}</div>
          </div>
        </div>
        <p class="heading3 total__price">
          ${
            hasDiscount
              ? `<span class="total__price--discount">$${item.discountPrice}</span>
               <span class="total__price--crossed">$${item.commonPrice}</span>`
              : `$${item.commonPrice}`
          }
        </p>`;
      cartContainer.appendChild(element);
    });

    updateTotal(cartItems);
    confirmBtn.disabled = false;

    cartContainer.querySelectorAll('.total__btn-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = Number((e.currentTarget as HTMLElement).dataset.index);
        cartItems.splice(idx, 1);
        saveCart(cartItems);
        window.dispatchEvent(new CustomEvent('cart-updated'));
        renderCart(cartItems);
        updateAuthUI(isAuthorized, user);
      });
    });

    confirmBtn.onclick = async () => {
      if (!cartItems.length) return;
      await handleConfirm(cartItems);
    };
  }

  async function handleConfirm(cartItems: CartProductItem[]) {
    showLoader(true);
    try {
      const items = cartItems.map((item) => ({
        productId: item.product.id,
        size: item.selectedSize,
        additives:
          item.selectedAdditives
            .map((idx) => item.product.additives[Number(idx)]?.name)
            .filter((name): name is string => Boolean(name)) || [],
        quantity: 1,
      }));

      const totalPrice = cartItems.reduce((acc, item) => {
        const price = isAuthorized && item.discountPrice ? item.discountPrice : item.commonPrice;
        return acc + Number(price);
      }, 0);

      const payload: ConfirmItems = {
        items,
        totalPrice: Number(totalPrice.toFixed(2)),
      };

      await placeOrder(payload);
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('cart-updated'));

      showNotification(
        'Thank you for your order! Our manager will contact you shortly.',
        'success'
      );
      renderCart([]);
      updateAuthUI(isAuthorized, user);

      confirmBtn.style.display = 'none';
      confirmBtn.disabled = true;
    } catch {
      showNotification('Something went wrong. Please, try again.', 'error');
    } finally {
      showLoader(false);
    }
  }

  function updateTotal(cartItems: CartProductItem[]) {
    const total = cartItems.reduce((acc, item) => {
      const price = isAuthorized && item.discountPrice ? item.discountPrice : item.commonPrice;
      return acc + Number(price || 0);
    }, 0);
    totalEl.textContent = '$' + total.toFixed(2);
  }
}

function showLoader(show: boolean) {
  const overlay = document.querySelector('.loader__overlay') as HTMLElement;
  if (!overlay) return;

  const loader = overlay.querySelector('.loader') as HTMLElement;
  if (!loader) return;

  loader.classList.toggle('hidden', !show);
  overlay.style.display = show ? 'flex' : 'none';

  document.body.style.overflow = show ? 'hidden' : '';
}

function showNotification(message: string, type: 'success' | 'error') {
  let notif = document.querySelector('.notification') as HTMLElement;

  if (!notif) {
    notif = document.createElement('div');
    notif.className = 'notification';
    document.body.appendChild(notif);
  }

  notif.textContent = message;
  notif.classList.remove('success', 'error');
  notif.classList.add(type, 'active');

  setTimeout(() => notif.classList.remove('active'), 4000);
}
