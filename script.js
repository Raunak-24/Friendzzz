const accessKey = 'nnzYM_D-RwaiEJnWZlBQHhjX2qptAEZTl4u01DyosgI';
const imageWrapper = document.querySelector('.image-wrapper');
let currentIndex = 0;
let images = [];

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAYyhwvbR0j05AzO5CKq_YvQ6Sa_2ZqPF0",
    authDomain: "scenery-burst.firebaseapp.com",
    databaseURL: "https://scenery-burst-default-rtdb.firebaseio.com",
    projectId: "scenery-burst",
    storageBucket: "scenery-burst.firebasestorage.app",
    messagingSenderId: "676260138190",
    appId: "1:676260138190:web:0f942d17e9d7d82be5549f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Handle visitor entry
function handleVisitorEntry() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const nameInput = document.getElementById('visitorName');
    const submitButton = document.getElementById('submitName');

    submitButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            db.ref('visitors').push({
                name: name,
                timestamp: new Date().toLocaleString()
            });
            welcomeOverlay.style.display = 'none';
            loadGallery();
        }
    });
}

// Load gallery images
async function loadGallery() {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?count=10&query=scenery&client_id=${accessKey}`
        );
        const data = await response.json();
        images = data.map(image => ({
            url: image.urls.regular,
            location: image.location.name || 'Beautiful Location',
            description: image.description || 'Scenic View'
        }));
        
        showImage(0);
        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }, 5000);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display image
function showImage(index) {
    const image = images[index];
    imageWrapper.style.backgroundImage = `url(${image.url})`;
    imageWrapper.innerHTML = `
        <div class="image-info">
            <h2>${image.location}</h2>
            <p>${image.description}</p>
        </div>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', handleVisitorEntry);
