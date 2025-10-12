const carouselItems = document.querySelector('.carousel__list');
const items = document.querySelectorAll('.carousel__item');

const leftBtn = document.querySelector('.carousel__left');
const rightBtn = document.querySelector('.carousel__right');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = 0;
const slideCount = items.length;
const intervalDuration = 6000;

let remainingTime = intervalDuration;
let progressStartWidth = 0;

let intervalId;
let startTime;

function updateCarousel() {
    carouselItems.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicators.forEach(ind => ind.classList.remove('active'));
    indicators[currentIndex].classList.add('active');

    resetProgress();
}

function resetProgress() {
    indicators.forEach(i => {
        const progress = i.querySelector('.progress');
        progress.style.transition = 'none';
        progress.style.width = '0';
    });

    const activeProgress = indicators[currentIndex].querySelector('.progress');

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

    const activeProgress = indicators[currentIndex].querySelector('.progress');
    const computedWidth = parseFloat(getComputedStyle(activeProgress).width);
    const totalWidth = activeProgress.parentElement.offsetWidth;
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

    const activeProgress = indicators[currentIndex].querySelector('.progress');
    activeProgress.style.transition = `width ${remainingTime}ms linear`;
    activeProgress.style.width = '100%';
}

rightBtn.addEventListener('click', () => {
    stopAutoPlay();
    nextSlide();
    startAutoPlay();
});

leftBtn.addEventListener('click', () => {
    stopAutoPlay();
    prevSlide();
    startAutoPlay();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // вкладка неактивна — стоп
        stopAutoPlay();
    } else {
        // вкладка снова активна — продолжить корректно
        startAutoPlay();
        resetProgress();
    }
});

carouselItems.addEventListener('mouseenter', () => {
    stopAutoPlay();
});

carouselItems.addEventListener('mouseleave', () => {
    startAutoPlay();
    const activeProgress = indicators[currentIndex].querySelector('.progress');
    activeProgress.style.transition = `width ${remainingTime}ms linear`;
    activeProgress.style.width = '100%';
});

let startX = 0;
carouselItems.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoPlay();
});

carouselItems.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 50) prevSlide();
    if (diff < -50) nextSlide();
    startAutoPlay();
    resetProgress();
});

updateCarousel();
startAutoPlay();

