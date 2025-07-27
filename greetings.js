
document.addEventListener('DOMContentLoaded', function () {
    const card = document.querySelector('.card');
    const front = document.querySelector('.card-front');
    const inside = document.querySelector('.card-inside');

    // Adjust height based on visible side
    function adjustCardHeight() {
        const activeSide = card.classList.contains('open') ? inside : front;
        const newHeight = activeSide.scrollHeight;
        card.style.height = newHeight + 'px';
    }

    // Flip card on click
    card.addEventListener('click', function () {
        card.classList.toggle('open');
        setTimeout(adjustCardHeight, 300); // Wait for flip
    });

    // Initial height adjustment
    setTimeout(adjustCardHeight, 100);
});
