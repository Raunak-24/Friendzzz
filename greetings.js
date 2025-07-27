document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.card');
    
    // Add click event to open/close the card
    card.addEventListener('click', function() {
        this.classList.toggle('open');
    });
    
    // Add initial animation after a short delay
    setTimeout(function() {
        card.classList.add('animate-in');
    }, 500);
});