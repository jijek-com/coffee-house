document.addEventListener('DOMContentLoaded', (event) => {
    const startBtn = document.getElementById('startGame') as HTMLButtonElement;
    const gameBoard = document.getElementById('gameBoard') as HTMLElement;
    const scoreEl = document.getElementById('score') as HTMLElement;
    const gameOverEl = document.getElementById('gameOver') as HTMLElement;
    const finalScoreEl = document.getElementById('finalScore') as HTMLElement;

    if (!startBtn || !gameBoard || !scoreEl || !gameOverEl || !finalScoreEl) {
        throw new Error('One of the game elements was not found');
    }

    let score = 0;
    let gameTime = 30;
    let gameInterval: ReturnType<typeof setInterval>;
    let timer: ReturnType<typeof setTimeout>;
    let isGameRunning = false;

    const beanFalls: { element: HTMLElement; pos: number; speed: number; rafId: number }[] = [];

    function startGame() {
        score = 0;
        scoreEl.textContent = score.toString();
        gameOverEl.classList.add('hidden');

        gameBoard.innerHTML = '';
        beanFalls.length = 0;

        isGameRunning = true;

        gameInterval = setInterval(() => {
            if (isGameRunning) createBean();
        }, 700);

        timer = setTimeout(endGame, gameTime * 1000);
    }

    function createBean() {
        const bean = document.createElement('div');
        bean.classList.add('coffee-bean');
        const x = Math.random() * (gameBoard.offsetWidth - 40);
        bean.style.left = `${x}px`;
        bean.style.top = `-40px`;

        gameBoard.appendChild(bean);

        let pos = -40;
        let speed = 2;

        function fall() {
            pos += speed;
            bean.style.top = `${pos}px`;

            if (pos > gameBoard.offsetHeight) {
                bean.remove();
                cancelAnimationFrame(rafId);
            } else {
                rafId = requestAnimationFrame(fall);
            }
        }

        let rafId = requestAnimationFrame(fall);
        beanFalls.push({ element: bean, pos, speed, rafId });

        bean.addEventListener('click', () => {
            if (!isGameRunning) return;
            score++;
            scoreEl.textContent = score.toString();
            bean.remove();
            cancelAnimationFrame(rafId);
        });
    }

    function endGame() {
        isGameRunning = false;

        clearInterval(gameInterval);
        clearTimeout(timer);

        beanFalls.forEach((beanData) => {
            cancelAnimationFrame(beanData.rafId);

            const slowFall = () => {
                beanData.speed *= 0.9;
                beanData.pos += beanData.speed;
                beanData.element.style.top = `${beanData.pos}px`;

                if (beanData.speed > 0.1 && beanData.pos < gameBoard.offsetHeight) {
                    beanData.rafId = requestAnimationFrame(slowFall);
                }
            };

            requestAnimationFrame(slowFall);
        });

        gameBoard.innerHTML = '';
        finalScoreEl.textContent = score.toString();
        gameOverEl.classList.remove('hidden');
    }

    startBtn.addEventListener('click', startGame);
});
