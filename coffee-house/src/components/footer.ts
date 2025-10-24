import location from './../../assets/img/pin-alt.svg';
import phone from './../../assets/img/phone.svg';
import time from './../../assets/img/clock.svg';

import './../../assets/styles/footer.css';

class Footer extends HTMLElement {
  constructor() {
    super();
  }

  public render(): void {
    this.innerHTML = `
      <footer class="footer" id="contacts">
        <div class="footer__container container">
          <div class="footer__box-fixed">
            <div class="footer__left">
              <h2 class="text-light">Sip, Savor, Smile. <span class="text-accent fs-italic">It’s coffee time!</span></h2>
              <ul class="footer__socials socials">
                <li class="socials__li">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3.01006C23 3.01006 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 23 3.01006 23 3.01006Z" stroke="#E1D4C9" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </li>
                <li class="socials__li">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#E1D4C9" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="#E1D4C9"/>
                    <path d="M17.5 6.51L17.51 6.49889" stroke="#E1D4C9" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </li>
                <li class="socials__li">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H14C12.6739 2 11.4021 2.52678 10.4645 3.46447C9.52678 4.40215 9 5.67392 9 7V10H6V14H9V22H13V14H16L17 10H13V7C13 6.73478 13.1054 6.48043 13.2929 6.29289C13.4804 6.10536 13.7348 6 14 6H17V2Z" stroke="#E1D4C9" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </li>
              </ul>
            </div>
            <div class="footer__right">
              <h3 class="text-light heading3 fw-semibold">Contact us</h3>
                <ul class="footer__menu">
                  <li class="footer__li">
                    <a class="footer__item item" target="_blank" href="./address.html">
                      <img src="${location}" alt="icon Location" >
                      <span class="item__text fs-medium fw-semibold text-light">8558 Green Rd.,  LA</span>
                    </a>
                  </li>
                  <li class="footer__li">
                    <a class="footer__item item" href="tel:+16035550123" >
                      <img src="${phone}" alt="icon phone" >
                      <span class="item__text fs-medium fw-semibold text-light">+1 (603) 555-0123</span>
                    </a>
                  </li>
                  <li class="footer__li">
                    <div class="footer__item item">
                      <img src="${time}" alt="icon clock" >
                        <span class="item__text fs-medium fw-semibold text-light">Mon-Sat: 9:00 AM – 23:00 PM</span>
                    </div>
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define('footer-component', Footer);
