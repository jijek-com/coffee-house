export function initCarousel() {
  const carouselItems = document.querySelector('.carousel__list') as HTMLElement;

  if (!carouselItems) return;

  const items = document.querySelectorAll('.carousel__item') as NodeListOf<HTMLElement>;
  const leftBtn = document.querySelector('.carousel__left') as HTMLElement;
  const rightBtn = document.querySelector('.carousel__right') as HTMLElement;
  const indicators = document.querySelectorAll('.indicator') as NodeListOf<HTMLElement>;

  let currentIndex = 0;
  const slideCount = items.length;
  const intervalDuration = 6000;

  let remainingTime = intervalDuration;
  let progressStartWidth = 0;

  let intervalId: number;
  let startTime: number;

  function updateCarousel() {
    carouselItems.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicators.forEach((ind) => ind.classList.remove('active'));
    (indicators[currentIndex] as HTMLElement).classList.add('active');
    resetProgress();
  }

  function resetProgress() {
    indicators.forEach((i) => {
      const progress = i.querySelector('.progress') as HTMLElement;
      progress.style.transition = 'none';
      progress.style.width = '0';
    });

    const activeProgress = (indicators[currentIndex] as HTMLElement).querySelector(
      '.progress'
    ) as HTMLElement;

    requestAnimationFrame(() => {
      activeProgress.style.transition = `width ${remainingTime}ms linear`;
      activeProgress.style.width = '100%';
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    remainingTime = intervalDuration;

    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    remainingTime = intervalDuration;

    updateCarousel();
  }

  function stopAutoPlay() {
    clearTimeout(intervalId);
    remainingTime -= Date.now() - startTime;

    const activeProgress = (indicators[currentIndex] as HTMLElement).querySelector(
      '.progress'
    ) as HTMLElement;
    const computedWidth = parseFloat(getComputedStyle(activeProgress).width);
    const totalWidth = (activeProgress.parentElement as HTMLElement).offsetWidth;
    progressStartWidth = (computedWidth / totalWidth) * 100;

    activeProgress.style.transition = 'none';
    activeProgress.style.width = `${progressStartWidth}%`;
  }

  function startAutoPlay() {
    startTime = Date.now();
    intervalId = setTimeout(() => {
      nextSlide();
      startAutoPlay();
    }, remainingTime);

    const activeProgress = (indicators[currentIndex] as HTMLElement).querySelector(
      '.progress'
    ) as HTMLElement;
    activeProgress.style.transition = `width ${remainingTime}ms linear`;
    activeProgress.style.width = '100%';
  }

  rightBtn.addEventListener('click', () => {
    stopAutoPlay();
    remainingTime = intervalDuration;
    nextSlide();
    startAutoPlay();
  });

  leftBtn.addEventListener('click', () => {
    stopAutoPlay();
    remainingTime = intervalDuration;
    prevSlide();
    startAutoPlay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoPlay();
    else {
      startAutoPlay();
      resetProgress();
    }
  });

  carouselItems.addEventListener('mouseenter', () => stopAutoPlay());

  carouselItems.addEventListener('mouseleave', () => {
    startAutoPlay();
    const activeProgress = (indicators[currentIndex] as HTMLElement).querySelector(
      '.progress'
    ) as HTMLElement;
    activeProgress.style.transition = `width ${remainingTime}ms linear`;
    activeProgress.style.width = '100%';
  });

  let startX = 0;
  carouselItems.addEventListener('touchstart', (e: TouchEvent) => {
    startX = (e.touches[0] as Touch).clientX;
    stopAutoPlay();
  });

  carouselItems.addEventListener('touchend', (e: TouchEvent) => {
    const endX = (e.changedTouches[0] as Touch).clientX;
    const diff = endX - startX;
    if (diff > 50) prevSlide();
    if (diff < -50) nextSlide();

    remainingTime = intervalDuration;
    startAutoPlay();
    resetProgress();
  });

  updateCarousel();
  startAutoPlay();
}
