import { fetchProductById } from '../api/product';
import { CartProductItem, DefaultModalValues, ProductItem, Sizes } from '../types/products';
import { getCart, saveCartItem } from '../utils/cart';
import { ProductImage } from '../data/productImage';

import defaultImage from '../../assets/img/not-image.png';
import { checkAuth } from '../api/auth';
import { calculatePrices, fromCents, toCents } from '../utils/price';

export async function showModal(id: number) {
  showLoader(true);
  try {
    const productInfo = (await fetchProductById(id)) as ProductItem;
    const isAuthorized = await checkAuth();

    createModal(id, productInfo, isAuthorized);
  } catch (error) {
    openErrorModal();
  }

  showLoader(false);
}

function createModal(id: number, productInfo: ProductItem, isAuthorized: boolean) {
  let defaultValues: DefaultModalValues = {
    currentSize: 's',
    selectedAdditives: [],
    basePrice: 0,
    isAuthorized: isAuthorized,
  };

  const modal = document.querySelector('#dishModal') as HTMLElement;

  const cart = getCart();
  const existingItem = cart.find((item: CartProductItem) => item.id === id);

  if (existingItem) {
    defaultValues.currentSize = existingItem.selectedSize || defaultValues.currentSize;
    defaultValues.selectedAdditives = (existingItem.selectedAdditives || []).map(String);
  } else {
    resetState(defaultValues);
  }

  defaultValues.basePrice = parseFloat(productInfo.sizes[defaultValues.currentSize as Sizes].price);

  (modal.querySelector('.modal__image') as HTMLImageElement).src =
    ProductImage[productInfo.id] || defaultImage;
  (modal.querySelector('.modal__title') as HTMLElement).textContent = productInfo.name;
  (modal.querySelector('.modal__desc') as HTMLElement).textContent = productInfo.description;

  const sizes = modal.querySelector('.modal__size-btns') as HTMLElement;
  const additives = modal.querySelector('.modal__additives-btns') as HTMLElement;
  const price = modal.querySelector('#modalPrice') as HTMLElement;
  const modalDishOverlay = modal.querySelector('#dishModal .modal__overlay') as HTMLElement;
  const modalDishCloseBtn = modal.querySelector(
    '#dishModal .modal__close-btn'
  ) as HTMLButtonElement;
  const addBtn = modal.querySelector('.modal__buy-btn') as HTMLButtonElement;

  modalDishCloseBtn.addEventListener('click', () => closeModal(), { once: true });
  modalDishOverlay.addEventListener('click', () => closeModal(), { once: true });
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') closeModal();
    },
    { once: true }
  );

  function closeModal(reset = true) {
    modal.classList.remove('active');
    document.body.classList.remove('lock');
  }

  initBoxSizes(sizes, productInfo, defaultValues);
  initBoxAdditives(additives, productInfo, defaultValues);

  if (existingItem) {
    restoreSelectedAdditives(additives, defaultValues.selectedAdditives);
  }

  updatePrice(productInfo, price, defaultValues);

  sizesBtnHandler(sizes, productInfo, price, defaultValues);
  additivesBtnHandler(additives, productInfo, price, defaultValues);

  addBtn.addEventListener('click', () => {
    const { commonPrice, discountPrice } = calculatePrices(productInfo, defaultValues);

    const item = {
      id: productInfo.id,
      product: productInfo,
      selectedSize: defaultValues.currentSize as Sizes,
      selectedAdditives: [...defaultValues.selectedAdditives],
      commonPrice,
      discountPrice,
    } as CartProductItem;

    saveCartItem(item);
    closeModal();
  });

  modal.classList.add('active');
  document.body.classList.add('lock');
}

function restoreSelectedAdditives(additivesContainer: HTMLElement, selectedAdditives: string[]) {
  selectedAdditives.forEach((idx) => {
    const input = additivesContainer.querySelector(
      `input[data-index="${idx}"]`
    ) as HTMLInputElement;
    const label = input?.closest('.modal__additive-label');
    if (input) {
      input.checked = true;
      label?.classList.add('active');
    }
  });
}

function updatePrice(
  productInfo: ProductItem,
  price: HTMLElement,
  { isAuthorized, currentSize, selectedAdditives }: DefaultModalValues
) {
  const curSize = productInfo.sizes[currentSize as Sizes];
  if (!curSize) return;

  const sizeRaw = isAuthorized && curSize.discountPrice ? curSize.discountPrice : curSize.price;
  const sizeCents = toCents(sizeRaw);

  const additivesCents = selectedAdditives.reduce((sum, idx) => {
    const add = productInfo.additives[Number(idx)];
    if (!add) return sum;
    const addRaw = isAuthorized && add.discountPrice ? add.discountPrice : add.price;
    return sum + toCents(addRaw);
  }, 0);

  const totalCents = sizeCents + additivesCents;
  price.textContent = `$${fromCents(totalCents)}`;
}

function additivesBtnHandler(
  additives: HTMLElement,
  productInfo: ProductItem,
  price: HTMLElement,
  defaultValues: DefaultModalValues
) {
  additives.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const idx = (e.target as HTMLElement).dataset.index as string;
      const label = (e.target as HTMLElement).closest('.modal__additive-label') as HTMLLabelElement;

      if ((e.target as HTMLInputElement).checked) {
        if (!defaultValues.selectedAdditives.includes(idx)) {
          defaultValues.selectedAdditives.push(idx);
        }
        label.classList.add('active');
      } else {
        defaultValues.selectedAdditives = defaultValues.selectedAdditives.filter((i) => i !== idx);
        label.classList.remove('active');
      }

      updatePrice(productInfo, price, defaultValues);
    });
  });
}

function sizesBtnHandler(
  sizes: HTMLElement,
  productInfo: ProductItem,
  price: HTMLElement,
  defaultValues: DefaultModalValues
) {
  sizes.querySelectorAll('.modal__size-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      sizes.querySelectorAll('.modal__size-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      defaultValues.currentSize = (btn as HTMLButtonElement).dataset.size as string;
      updatePrice(productInfo, price, defaultValues);
    });
  });
}

function initBoxSizes(
  sizes: HTMLElement,
  productInfo: ProductItem,
  { currentSize, isAuthorized }: DefaultModalValues
) {
  sizes.innerHTML = Object.entries(productInfo.sizes)
    .map(([key, val]) => {
      const basePrice = parseFloat(val.price);
      const discountPrice = val.discountPrice ? parseFloat(val.discountPrice) : basePrice;

      let tooltip = '';

      if (isAuthorized && val.discountPrice) {
        tooltip = `<span class="tooltip"><s>$${basePrice.toFixed(2)}</s> $${discountPrice.toFixed(2)}</span>`;
      } else {
        tooltip = `<span class="tooltip">$${basePrice.toFixed(2)}</span>`;
      }

      return `
        <button class="modal__size-btn ${key === currentSize ? 'active' : ''}" 
                data-size="${key}">
          <span class="modal__size-btn-letter">${key.toUpperCase()}</span>
          <span class="modal__size-btn-text fs-medium fw-semibold">${val.size}</span>
          ${tooltip}
        </button>
      `;
    })
    .join('');
}

function initBoxAdditives(
  additives: HTMLElement,
  productInfo: ProductItem,
  { selectedAdditives, isAuthorized }: DefaultModalValues
) {
  additives.innerHTML = productInfo.additives
    .map((add, i) => {
      const idxStr = String(i);
      const checked = selectedAdditives.includes(idxStr) ? 'checked' : '';
      const active = selectedAdditives.includes(idxStr) ? 'active' : '';
      const basePrice = parseFloat(add.price || '0');
      const discountPrice = add.discountPrice ? parseFloat(add.discountPrice) : basePrice;

      let tooltip = '';
      if (isAuthorized && add.discountPrice) {
        tooltip = `<span class="tooltip"><s>$${basePrice.toFixed(2)}</s> $${discountPrice.toFixed(2)}</span>`;
      } else {
        tooltip = `<span class="tooltip">$${basePrice.toFixed(2)}</span>`;
      }

      return `
        <label class="modal__additive-label ${active}">
          <span class="modal__additive-numb">${i + 1}</span>
          <input class="modal__additive-input" type="checkbox" data-index="${i}" ${checked}>
          <span class="modal__additive-text">${add.name}</span>
          ${tooltip}
        </label>
      `;
    })
    .join('');
}

function resetState(defaultValues: DefaultModalValues) {
  defaultValues.basePrice = 0;
  defaultValues.currentSize = 's';
  defaultValues.selectedAdditives = [];
}

function showLoader(show: boolean) {
  const loader = document.querySelector('#loaderOverlay') as HTMLElement;
  if (!loader) return;
  loader.classList.toggle('hidden', !show);
}

function openErrorModal() {
  const modalError = document.querySelector('#errorModal') as HTMLElement;
  modalError.classList.add('active');

  const modalErrorCloseBtn = modalError.querySelector(
    '#errorModal .modal__close-btn'
  ) as HTMLButtonElement;
  const modalErrorOverlay = modalError.querySelector('#errorModal .modal__overlay') as HTMLElement;

  modalErrorCloseBtn.addEventListener('click', () => closeErrorModal(modalError), { once: true });
  modalErrorOverlay.addEventListener('click', () => closeErrorModal(modalError), { once: true });
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') closeErrorModal(modalError);
    },
    { once: true }
  );

  document.body.classList.add('lock');
}

function closeErrorModal(modal: HTMLElement) {
  modal.classList.remove('active');
  document.body.classList.remove('lock');
}
