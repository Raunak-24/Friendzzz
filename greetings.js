document.addEventListener('DOMContentLoaded', function () {
    const card = document.querySelector('.card');
    const front = document.querySelector('.card-front');
    const inside = document.querySelector('.card-inside');

    function adjustCardHeight() {
        const activeSide = card.classList.contains('open') ? inside : front;
        const newHeight = activeSide.scrollHeight;
        card.style.height = newHeight + 'px';

        // Automatically scroll to the card (only when opened)
        if (card.classList.contains('open')) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    card.addEventListener('click', function () {
        card.classList.toggle('open');
        setTimeout(adjustCardHeight, 300);
    });

    setTimeout(adjustCardHeight, 100);
});
