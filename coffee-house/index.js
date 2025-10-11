const modal = document.getElementById('dishModal');

if (modal) {
    function lockBody() {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollBarWidth + 'px';
        document.body.classList.add('lock');
    }

    function unlockBody() {
        document.body.style.paddingRight = '';
        document.body.classList.remove('lock');
    }

    const modalOverlay = modal.querySelector('.modal__overlay');
    // const modalClose = modal.querySelector('.modal__close');
    const bookButtons = document.querySelectorAll('.offer__dishes .card');

    function openModal() {
        modal.classList.add('active');
        lockBody()
    }

    function closeModal() {
        modal.classList.remove('active');
        unlockBody()
    }

    bookButtons.forEach(btn => btn.addEventListener('click', openModal));
    // modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
