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

    if (!nameInput || !submitButton) {
        console.error('Required elements not found');
        return;
    }

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitName();
        }
    });

    submitButton.addEventListener('click', submitName);

    function submitName() {
        const name = nameInput.value.trim();
        if (name) {
            db.ref('visitors').push({
                name: name,
                timestamp: new Date().toLocaleString()
            }).then(() => {
                welcomeOverlay.style.display = 'none';
                loadGallery();
            }).catch(error => {
                console.error('Error saving visitor:', error);
            });
        }
    }
}

// Load gallery images
async function loadGallery() {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?count=10&query=scenery&client_id=${accessKey}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        images = data.map(image => ({
            url: image.urls.regular,
            location: image.location?.name || 'Beautiful Location',
            description: image.description || image.alt_description || 'Scenic View'
        }));
        
        if (images.length > 0) {
            showImage(0);
            startSlideshow();
        }
    } catch (error) {
        console.error('Error loading images:', error);
        imageWrapper.innerHTML = `
            <div style="color: white; text-align: center;">
                <h2>Unable to load images</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}

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

function startSlideshow() {
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', handleVisitorEntry);
