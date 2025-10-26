import { getCart } from '../utils/cart';

import logo from './../../assets/img/logo.svg';
import menu from './../../assets/img/coffee-cup.svg';
import cart from './../../assets/img/shopping-bag.svg';

import './../../assets/styles/header.css';
import { checkAuth } from '../api/auth';

class Header extends HTMLElement {
  private curPage?: string;
  private cartBtn!: HTMLButtonElement;
  private cartBtnCount!: HTMLSpanElement;
  private burger!: HTMLButtonElement;
  private menu!: HTMLElement;
  private links!: NodeListOf<HTMLAnchorElement>;

  constructor() {
    super();

    this.updateCartCount = this.updateCartCount.bind(this);
    this.handleStorage = this.handleStorage.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback(): void {
    this.curPage = this.dataset.page ?? '';

    this.render();
    this.initElements();
    this.initEvents();

    this.updateLinks();
    this.updateCartCount();
  }

  disconnectedCallback(): void {
    window.removeEventListener('cart-updated', this.updateCartCount);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('storage', this.handleStorage);
  }

  private initElements(): void {
    this.cartBtn = this.querySelector('.header__cart')!;
    this.cartBtnCount = this.querySelector('.header__cart-count')!;
    this.burger = this.querySelector('.header__burger')!;
    this.menu = this.querySelector('.header__nav')!;
    this.links = this.querySelectorAll('.header__nav a')!;
  }

  public render(): void {
    this.innerHTML = `
      <header class="header">
        <div class="container">
          <div class="header__box-fixed">
            <a href="./index.html" class="header__logo"><img src="${logo}" alt="logo icon"></a>

            <nav class="header__nav">
              <ul class="header__ul menu">
                <li class="menu__item">
                  <a class="menu__link fs-links" href="#favorite">Favorite coffee</a>
                </li>

                <li class="menu__item">
                  <a class="menu__link fs-links" href="#about">About</a>
                </li>

                <li class="menu__item">
                  <a class="menu__link fs-links" href="#mobile">Mobile app</a>
                </li>

                <li class="menu__item">
                  <a class="menu__link fs-links" href="#contacts">Contact us</a>
                </li>

                <li class="menu__item mobile">
                  <button class="header__menu" id="btnMenu">
                    <span class="header__menu-text fs-links">Menu</span>
                    <img class="header__menu-icon" src="${menu}" alt="Icon Menu" >
                  </button>
                </li>
                
                 <li class="menu__item mobile">
                  <button class="header__cart-mob" onclick="window.location.href='cart.html'">
                    <span class="header__menu-text fs-links">Cart</span>
                    <img class="header__menu-icon" src="${cart}" alt="Icon Cart" >
                  </button>
                </li>
              </ul>
            </nav>
                    
            <div class="header__right">
              <button class="header__cart" onclick="window.location.href='cart.html'">
                <img class="header__cart-img" src="${cart}" alt="Icon cart">
                <span class="header__cart-count fs-medium"></span>
              </button>

              <button class="header__menu">
                <span class="header__menu-text fs-links">Menu</span>
                <img class="header__menu-icon" src="${menu}" alt="Icon Menu" >
              </button>

              <button class="header__burger burger">
                <span class="burger__line"></span>
                <span class="burger__line"></span>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  public initEvents(): void {
    this.querySelectorAll('.header__cart, .header__cart-mob').forEach((btn) =>
      btn.addEventListener('click', () => location.assign('cart.html'))
    );

    this.querySelectorAll('button.header__menu').forEach((btn) => {
      if (this.curPage === 'menu') btn.classList.add('disabled');
      btn.addEventListener('click', (e) => {
        if (this.burger.classList.contains('active')) this.toggleMenu();
        if (this.curPage === 'menu') {
          e.preventDefault();
          return;
        }
        location.assign('menu.html');
      });
    });

    this.burger.addEventListener('click', this.toggleMenu);
    this.links.forEach((link) => link.addEventListener('click', this.toggleMenu));

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('cart-updated', this.updateCartCount);
    window.addEventListener('storage', this.handleStorage);
  }

  private handleResize(): void {
    if (window.innerWidth > 768 && this.burger.classList.contains('active')) this.toggleMenu();
    this.updateCartCount();
  }

  private handleStorage(e: StorageEvent): void {
    if (e.key === 'cart') this.updateCartCount();
  }

  private async updateCartCount(): Promise<void> {
    const cart = getCart();
    const isAuthorized = await checkAuth().catch(() => false);
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      this.cartBtn.style.display = 'none';
      this.cartBtnCount.textContent = '';
      return;
    }

    const shouldShowCart = cart.length > 0 || isAuthorized;

    if (shouldShowCart) {
      this.cartBtn.style.display = 'flex';
      this.cartBtnCount.textContent = String(cart.length);
    } else {
      this.cartBtn.style.display = 'none';
      this.cartBtnCount.textContent = '';
    }
  }

  private updateLinks(): void {
    const isHomePage =
      window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    this.links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        link.setAttribute('href', isHomePage ? href : `index.html${href}`);
      }
    });
  }

  private lockBody(): void {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    document.body.classList.add('lock');
  }

  private unlockBody(): void {
    document.body.style.paddingRight = '';
    document.body.classList.remove('lock');
  }

  private toggleMenu = (): void => {
    const isActive = this.burger.classList.toggle('active');
    this.menu.classList.toggle('active');

    isActive && window.innerWidth <= 768 ? this.lockBody() : this.unlockBody();
  };
}

customElements.define('header-component', Header);
