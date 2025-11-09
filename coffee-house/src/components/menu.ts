import { fetchProducts } from '../api/product';
import { ProductImage } from '../data/productImage';
import { Category, ErrorProduct, ProductItem } from '../types/products';

import defaultImage from './../../assets/img/not-image.png';
import './../../assets/styles/styles.css';

import { showModal } from './modal';
import { checkAuth } from '../api/auth';
import { changeTheme } from './theme';

let products: Record<Category, ProductItem[]> | ErrorProduct = { coffee: [], tea: [], dessert: [] };

document.addEventListener('DOMContentLoaded', initMenu);

async function initMenu(): Promise<void> {
  let currentCategory: Category = 'coffee';

  const categoryLinks = document.querySelectorAll<HTMLLIElement>('.offer__links-li');
  const dishesContainer = document.querySelector<HTMLElement>('.dishes__card');
  if (!dishesContainer) return;

  const loadContainer = createLoadContainer();

  showMenuLoader(dishesContainer);

  try {
    const [isAuthorized, fetchedProducts, theme] = await Promise.all([
      checkAuth(),
      fetchProducts(),
      changeTheme(),
    ]);

    products = fetchedProducts;
    renderProducts(dishesContainer, currentCategory, isAuthorized, loadContainer.button);

    categoryLinks.forEach((link) => {
      link.addEventListener('click', () => {
        categoryLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');

        const text = link.querySelector('.offer__links-text')?.textContent?.toLowerCase();
        if (!text) return;

        currentCategory = text as Category;
        renderProducts(dishesContainer, currentCategory, isAuthorized, loadContainer.button);
      });
    });

    loadContainer.button.addEventListener('click', () =>
      showAllProducts(dishesContainer, currentCategory, isAuthorized, loadContainer.button)
    );

    dishesContainer.addEventListener('click', async (e) => {
      const card = (e.target as HTMLElement).closest('.card');
      if (!card) return;
      const id = Number((card as HTMLElement).dataset.id);
      if (!Number.isNaN(id)) await showModal(id);
    });

    window.addEventListener('resize', () =>
      renderProducts(dishesContainer, currentCategory, isAuthorized, loadContainer.button)
    );
  } catch (error) {
    console.error('Error loading products:', error);
    showErrorMessage(dishesContainer);

    const loadBtnContainer = document.querySelector('.dishes__load-container');
    if (loadBtnContainer) loadBtnContainer.remove();
  }
}

function renderProducts(
  container: HTMLElement,
  category: Category,
  isAuthorized: boolean,
  loadMoreBtn: HTMLButtonElement
): void {
  const width = window.innerWidth;
  const perPage = width <= 768 ? 4 : 8;
  const items = (products as Record<Category, ProductItem[]>)[category] || [];

  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  items
    .slice(0, perPage)
    .forEach((product: ProductItem) => fragment.append(renderCard(product, isAuthorized)));
  container.append(fragment);

  loadMoreBtn.style.display = width <= 768 && items.length > perPage ? 'block' : 'none';
  loadMoreBtn.dataset.visibleCount = perPage.toString();

  const existing = document.querySelector('.dishes__load-container');
  if (!existing) container.after(loadMoreBtn.parentElement!);
}

function showAllProducts(
  container: HTMLElement,
  category: Category,
  isAuthorized: boolean,
  loadMoreBtn: HTMLButtonElement
): void {
  const items = (products as Record<Category, ProductItem[]>)[category] || [];
  const visibleCount = Number(loadMoreBtn.dataset.visibleCount || 0);
  const remaining = items.slice(visibleCount);

  if (remaining.length === 0) return;

  const fragment = document.createDocumentFragment();
  remaining.forEach((p) => fragment.append(renderCard(p, isAuthorized)));
  container.append(fragment);

  loadMoreBtn.style.display = 'none';
}

function renderCard(product: ProductItem, isAuthorized: boolean): HTMLElement {
  const { id, name, description, price, discountPrice } = product;

  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = id.toString();

  const imgSrc = ProductImage[id] || defaultImage;

  card.innerHTML = `
    <div class="card__wrap-img">
      <img class="card__img" src="${imgSrc}" alt="${name}" loading="lazy">
    </div>
    <div class="card__boxed">
      <div class="card__row">
        <h3 class="card__title heading3">${name}</h3>
        <p class="card__desc fs-medium">${description}</p>
      </div>
      ${
        isAuthorized && discountPrice
          ? `<p class="heading3 card__price">
              <span class="card__price--discount">$${discountPrice}</span>
              <span class="card__price--crossed">$${price}</span>
             </p>`
          : `<p class="heading3 card__price">$${price}</p>`
      }
    </div>
  `;
  return card;
}

function createLoadContainer(): { container: HTMLElement; button: HTMLButtonElement } {
  const container = document.createElement('div');
  container.classList.add('dishes__load-container');

  const button = document.createElement('button');
  button.classList.add('dishes__load-btn');
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228
        2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8"
        stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3"
        stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  container.append(button);
  return { container, button };
}

function showMenuLoader(container: HTMLElement) {
  container.innerHTML = '<div class="loader"></div>';
}

function showErrorMessage(container: HTMLElement) {
  container.innerHTML = `
    <div class="error-message">
      <p>Something went wrong. Please, refresh the page</p>
    </div>
  `;
}
