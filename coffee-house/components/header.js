class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        document.addEventListener('DOMContentLoaded', () => {
            function lockBody() {
                const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.body.style.paddingRight = scrollBarWidth + 'px';
                document.body.classList.add('lock');
            }

            function unlockBody() {
                document.body.style.paddingRight = '';
                document.body.classList.remove('lock');
            }

            const burger = document.querySelector('.header__burger');
            const menu = document.querySelector('.header__nav');
            const links = document.querySelectorAll('.header__nav a');

            function toggleMenu() {
                const isActive = burger.classList.toggle('active');
                menu.classList.toggle('active');

                const isMobile = window.innerWidth <= 768;

                if (isMobile) isActive ? lockBody() : unlockBody();
            }

            burger.addEventListener('click', toggleMenu);
            links.forEach(link => link.addEventListener('click', toggleMenu));

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && burger.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        this.innerHTML = `
        <style>
            .header__box-fixed {
                padding: 20px 40px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .header__ul {
                margin-top: -7px;
                display: flex;
                column-gap: 41px;
                justify-content: space-between;
            }
            
            .header__ul .menu__link {
                padding-bottom: 4px;
                transition: color .6s ease, border .6s;
                color: var(--text-dark);
                border-bottom: 2px solid transparent;
            }

            @media (hover: hover) and (pointer: fine) {
                .menu__link:hover {
                    border-bottom: 2px solid var(--border-dark);
                }
            }
            
            .header__menu {
                margin-top: 16px;
                display: flex;
                align-self: baseline;
                column-gap: 8px;
                transition: border .6s;
            }

            @media (hover: hover) and (pointer: fine) {
                .header__menu:hover {
                    border-bottom: 2px solid var(--border-dark);
                }
            }
            
            .header__nav .mobile {
                display: none;
            }
            
            .header__menu-icon {
                width: 20px;
                height: 20px;
            }
            
            .header__burger {
                display: none;
                position: relative;
                width: 44px;
                height: 44px;
                border-radius: 40px;
                border: 1px solid var(--border-dark);
            }
            
            .burger__line {
                position: absolute;
                top: 16px;
                right: 13px;
                display: block;
                width: 16px;
                height: 2px;
                border-radius: 4px;
                background-color: var(--text-dark);
                transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
            }
            
            .header__burger.active .burger__line:first-child {
                transform: rotate(45deg) translate(3px, 2px);
            }
            
            .header__burger.active .burger__line:last-child {
                transform: rotate(-45deg) translate(3px, -2px)
            }
            
            .burger__line:last-child {
                top: 24px;
            }
            
            @media screen and (max-width: 768px) {
                .header__box-fixed {
                    padding: 16px 40px 16px;
                }
            
                .header__logo {
                    margin-top: 4px;
                }
            
                .header__nav {
                    position: fixed;
                    top: 100px;
                    right: -100%;
                    width: calc(100% - 40px);
                    height: calc(100% - 290px);
                    display: flex;
                    justify-content: center;
                    transition: right 0.3s ease;
                    z-index: 20;
                    background: var(--bc);
                    padding: 96px 20px;
                }
            
                .header__nav.active {
                    right: 0;
                }
            
                .header__menu {
                    display: none;
                }
            
                .header .menu {
                    flex-direction: column;
                    justify-content: start;
                    place-items: center;
                    row-gap: 72px;
                }
            
                .header .menu__link {
                    text-align: center;
                    letter-spacing: 1.2px;
                }
            
                .header__burger {
                    display: block;
                }
            
                .header__nav .mobile {
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                }
            
                .header__menu-icon {
                    width: 40px;
                    height: 40px;
                }
            
                .mobile .header__menu {
                    display: flex;
                    column-gap: 16px;
                    align-items: center;
                }
            }
            
            @media screen and (max-width: 600px) {
                .header__box-fixed {
                    padding: 16px 16px;
                }
            }
          </style>
          
        <header class="header">
            <div class="container">
                <div class="header__box-fixed">
                    <a href="#" class="header__logo">
                        <img src="./assets/img/logo.svg" alt="logo icon">
                    </a>

                    <nav class="header__nav">
                        <ul class="header__ul menu">
                            <li class="menu__item">
                                <a class="menu__link fs-links" href="./coffee-house/#favorite">Favorite coffee</a>
                            </li>

                            <li class="menu__item">
                                <a class="menu__link fs-links" href="./coffee-house/#about">About</a>
                            </li>

                            <li class="menu__item">
                                <a class="menu__link fs-links" href="./coffee-house/#mobile">Mobile app</a>
                            </li>

                            <li class="menu__item">
                                <a class="menu__link fs-links" href="#contacts">Contact us</a>
                            </li>

                            <li class="menu__item mobile">
                                <button class="header__menu" onclick="window.location.href='menu.html'">
                                    <span class="header__menu-text fs-links">Menu</span>
                                    <img class="header__menu-icon" src="./assets/img/coffee-cup.svg" alt="Icon Menu" >
                                </button>
                            </li>
                        </ul>
                    </nav>

                    <button class="header__menu" onclick="window.location.href='menu.html'">
                        <span class="header__menu-text fs-links">Menu</span>
                        <img class="header__menu-icon" src="./assets/img/coffee-cup.svg" alt="Icon Menu" >
                    </button>

                    <button class="header__burger burger">
                        <span class="burger__line"></span>
                        <span class="burger__line"></span>
                    </button>
                </div>
            </div>
        </header>
    `;
    }
}

customElements.define('header-component', Header);
