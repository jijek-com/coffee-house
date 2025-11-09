import { getFavoriteProducts } from '../api/favorite';
import { checkAuth } from '../api/auth';

import type { ProductItem } from '../types/products';

import { initCarousel } from './carousel';
import { changeTheme } from "./theme";

import { FavoriteImage } from '../data/favoriteImage';
import defaultImage from './../../assets/img/not-image.png';

import './../../assets/styles/styles.css';

document.addEventListener('DOMContentLoaded', init);

async function init(): Promise<void> {
  await renderFavorites();
  await changeTheme();
}

function setListState(list: HTMLElement, state: 'loading' | 'empty' | 'error'): void {
  const templateMap: Record<typeof state, string> = {
    loading: `<div class="loader"></div>`,
    empty: `
      <section class="carousel__item">
        <h3 class="item__title">No favorite products yet.</h3>
        <p class="item__desc fs-medium">Add some products to your favorites list.</p>
      </section>
    `,
    error: `
      <section class="carousel__item">
        <h3 class="item__title">Something went wrong. Please, refresh the page.</h3>
        <p class="item__desc fs-medium"></p>
      </section>
    `,
  };

  list.innerHTML = templateMap[state];
}

async function renderFavorites(): Promise<void> {
  const list = document.querySelector<HTMLElement>('.carousel__list');
  if (!list) return;

  setListState(list, 'loading');

  try {
    const [isAuthorized, favorites] = await Promise.all([checkAuth(), getFavoriteProducts()]);

    if (!favorites.length) {
      setListState(list, 'empty');
      return;
    }

    drawFavoriteList(list, favorites, isAuthorized);
    initCarousel();
  } catch (e) {
    setListState(list, 'error');
  }
}

function drawFavoriteList(
  list: HTMLElement,
  favorites: Omit<ProductItem, 'sizes' | 'additives'>[],
  hasDiscount: boolean
): void {
  const fragment = document.createDocumentFragment();

  for (const product of favorites) {
    const section = document.createElement('section');
    section.className = 'carousel__item';

    const img = document.createElement('img');
    img.className = 'item__img';
    img.src = FavoriteImage[product.id] || defaultImage;
    img.alt = product.name;

    const title = createTextElement('h3', 'item__title', product.name);
    const desc = createTextElement('p', 'item__desc fs-medium', product.description);

    const price = document.createElement('p');
    price.className = 'heading3 item__price';
    price.innerHTML =
      hasDiscount && product.discountPrice
        ? `<span class="item__price--discount">$${product.discountPrice}</span>
           <span class="item__price--crossed">$${product.price}</span>`
        : `$${product.price}`;

    section.append(img, title, desc, price);
    fragment.append(section);
  }

  list.innerHTML = '';
  list.append(fragment);
}

function createTextElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
}
