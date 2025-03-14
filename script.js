const accessKey = 'nnzYM_D-RwaiEJnWZlBQHhjX2qptAEZTl4u01DyosgI';
const imageWrapper = document.querySelector('.image-wrapper');

// Initialize variables
let images = [];
let currentIndex = 0;
let visitors = [];
let slideshowInterval;
let isPlaying = true;
let db;

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAYyhwvbR0j05AzO5CKq_YvQ6Sa_2ZqPF0",
    authDomain: "scenery-burst.firebaseapp.com",
    databaseURL: "https://scenery-burst-default-rtdb.firebaseio.com",
    projectId: "scenery-burst",
    storageBucket: "scenery-burst.firebasestorage.app",
    messagingSenderId: "676260138190",
    appId: "1:676260138190:web:0f942d17e9d7d82be5549f",
    measurementId: "G-B9F9KQCRL8"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
} catch (error) {
    console.error('Firebase initialization error:', error);
    alert('Error connecting to visitor system. Gallery will still work.');
}

// Remove the duplicate db initialization
// const db = firebase.database();

// Update showVisitors function to handle empty data
function showVisitors() {
    db.ref('visitors').on('value', (snapshot) => {
        const visitors = snapshot.val() || {};
        const visitorList = document.createElement('div');
        visitorList.className = 'visitor-list';
        
        visitorList.innerHTML = `
            <h3>Recent Visitors</h3>
            <ul>
                ${Object.values(visitors).length ? 
                    Object.values(visitors).map(visitor => `
                        <li>${visitor.name} - ${visitor.timestamp}</li>
                    `).join('') :
                    '<li>No visitors yet</li>'
                }
            </ul>
        `;
        
        document.body.appendChild(visitorList);
    });
}
const db = firebase.database();

// Remove duplicate fetchImages function and keep only one version
async function fetchImages() {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?count=50&query=scenery&client_id=${accessKey}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        images = data.map(image => ({
            url: image.urls.regular,
            location: image.location.name || 'Scenic Location',
            description: getDetailedDescription(image.location.name || image.description || image.alt_description)
        }));
        
        if (images.length > 0) {
            createNavZones();
            showImage(currentIndex);
            startSlideshow();
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        imageWrapper.innerHTML = `
            <div style="color: white; text-align: center; padding: 20px;">
                <h2>Unable to load images</h2>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Remove duplicate startSlideshow function and keep only one version
function startSlideshow() {
    setInterval(nextImage, 12000);
}

// Initialize everything after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    handleVisitorEntry();
    fetchImages();
});

// Update showImage function to handle empty states
function showImage(index) {
    if (!images[index]) return;
    
    imageWrapper.classList.add('fade');
    setTimeout(() => {
        imageWrapper.style.backgroundImage = `url(${images[index].url})`;
        updateImageInfo(index);
        imageWrapper.classList.remove('fade');
        updateProgress(); // Add progress bar update
    }, 3000);
}

function getDetailedDescription(locationInfo) {
    // Default detailed description if location is unknown
    if (!locationInfo || locationInfo === 'Scenic Location') {
        return `This breathtaking landscape showcases nature's incredible artistry.\n
        The stunning vista before you captures the essence of natural beauty.\n
        Rich colors and textures blend seamlessly in this magnificent view.\n
        The perfect harmony of light and shadow creates a mesmerizing scene.\n
        Every element works together to create this spectacular panorama.\n
        The composition draws you in, inviting peaceful contemplation.\n
        A testament to the extraordinary wonders our world holds.`;
    }

    // Custom descriptions based on location keywords
    const descriptions = {
        'mountain': `Majestic peaks rise dramatically against the pristine sky.\n
        Snow-capped summits touch the clouds in ethereal beauty.\n
        Ancient rock formations tell stories of geological wonder.\n
        Crystal-clear mountain air fills this elevated paradise.\n
        Rugged terrain creates an awe-inspiring natural amphitheater.\n
        Alpine meadows dot the landscape in vibrant patches.\n
        A remarkable display of Earth's towering achievements.`,

        'beach': `Crystalline waters meet pristine sandy shores in perfect harmony.\n
        Gentle waves create a soothing natural symphony.\n
        Palm trees sway in the warm, tropical breeze.\n
        Turquoise waters stretch endlessly to the horizon.\n
        White sand beaches glisten under the golden sun.\n
        Coastal beauty captures the essence of paradise.\n
        A serene escape where ocean meets earth.`,

        'forest': `Ancient trees stand as silent guardians of time.\n
        Sunlight filters through the dense canopy in golden rays.\n
        Rich biodiversity thrives in this verdant sanctuary.\n
        Moss-covered stones add mystery to the woodland floor.\n
        The air is rich with the scent of pine and earth.\n
        Natural pathways wind through this green cathedral.\n
        A peaceful haven of natural wonder and life.`
    };

    // Match location with appropriate description
    for (let key in descriptions) {
        if (locationInfo.toLowerCase().includes(key)) {
            return descriptions[key];
        }
    }

    // Return default nature description if no specific match
    return descriptions['mountain'];
}

function updateImageInfo(index) {
    const imageInfo = document.createElement('div');
    imageInfo.className = 'image-info';
    const descriptionLines = images[index].description.split('\n');
    imageInfo.innerHTML = `
        <h2>${images[index].location}</h2>
        ${descriptionLines.map(line => `<p>${line.trim()}</p>`).join('')}
    `;
    imageWrapper.innerHTML = '';
    imageWrapper.appendChild(imageInfo);
}

function startSlideshow() {
    setInterval(nextImage, 12000); // Increased to 12 seconds (3s fade out + 6s display + 3s fade in)
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

// Add the missing prevImage function
function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

// Move the nav-zone event listeners after DOM elements are created
function createNavZones() {
    const leftZone = document.createElement('div');
    leftZone.className = 'nav-zone left';
    const rightZone = document.createElement('div');
    rightZone.className = 'nav-zone right';
    
    imageWrapper.appendChild(leftZone);
    imageWrapper.appendChild(rightZone);
    
    leftZone.addEventListener('click', prevImage);
    rightZone.addEventListener('click', nextImage);
}

// Update the fetchImages function to create nav zones after loading
async function fetchImages() {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?count=50&query=scenery&client_id=${accessKey}`
        );
        const data = await response.json();
        images = data.map(image => ({
            url: image.urls.regular,
            location: image.location.name || 'Scenic Location',
            description: getDetailedDescription(image.location.name || image.description || image.alt_description)
        }));
        createNavZones();
        showImage(currentIndex);
        startSlideshow();
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

// Remove the existing nav-zone event listeners since we're adding them in createNavZones
// Delete or comment out these lines:
// document.querySelector('.nav-zone.left').addEventListener('click', prevImage);
// document.querySelector('.nav-zone.right').addEventListener('click', nextImage);

function startSlideshow() {
    setInterval(nextImage, 8000); // 8 seconds total (2s fade out + 4s display + 2s fade in)
}

// Initialize the gallery
fetchImages();

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Space') toggleSlideshow();
});

let touchStartX = 0;
let touchEndX = 0;

imageWrapper.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

imageWrapper.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextImage();
    if (touchStartX - touchEndX < -50) prevImage();
});


function updateProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = `${(currentIndex + 1) / images.length * 100}%`;
    imageWrapper.appendChild(progressBar);
}

// At the top of the file, after initial variables
let slideshowInterval;
let isPlaying = true;

// Remove duplicate fetchImages function, keep only the first one
// Remove duplicate startSlideshow function, keep only this version
function startSlideshow() {
    slideshowInterval = setInterval(nextImage, 12000);
}

// Remove duplicate keyboard event listeners, keep only this consolidated version
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Space') {
        e.preventDefault(); // Prevent page scroll
        toggleSlideshow();
    }
    if (e.key.toLowerCase() === 'v') {
        const existingList = document.querySelector('.visitor-list');
        if (existingList) {
            existingList.remove();
        } else {
            showVisitors();
        }
    }
});

// Remove the standalone fetchImages() call since it's now in DOMContentLoaded

// Add keyboard shortcut for visitor list
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Space') toggleSlideshow();
    if (e.key.toLowerCase() === 'v') {
        const existingList = document.querySelector('.visitor-list');
        if (existingList) {
            existingList.remove();
        } else {
            showVisitors();
        }
    }
});

// Remove the duplicate initialization
// fetchImages();

// Modify the show visitors function
function showVisitors() {
    db.ref('visitors').on('value', (snapshot) => {
        const visitors = snapshot.val();
        const visitorList = document.createElement('div');
        visitorList.className = 'visitor-list';
        
        visitorList.innerHTML = `
            <h3>Recent Visitors</h3>
            <ul>
                ${Object.values(visitors).map(visitor => `
                    <li>${visitor.name} - ${visitor.timestamp}</li>
                `).join('')}
            </ul>
        `;
        
        document.body.appendChild(visitorList);
    });
}

// Move handleVisitorEntry function before DOMContentLoaded
function handleVisitorEntry() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const nameInput = document.getElementById('visitorName');

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const name = nameInput.value.trim();
            if (name) {
                db.ref('visitors').push({
                    name: name,
                    timestamp: new Date().toLocaleString()
                });
                welcomeOverlay.style.opacity = '0';
                setTimeout(() => {
                    welcomeOverlay.style.display = 'none';
                }, 1000);
            }
        }
    });
}

// Remove duplicate functions
// Remove second fetchImages function
// Remove second startSlideshow function
// Remove second initialization call

// Update keyboard event listener to include both navigation and visitor list
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Space') toggleSlideshow();
    if (e.key.toLowerCase() === 'v') {
        const existingList = document.querySelector('.visitor-list');
        if (existingList) {
            existingList.remove();
        } else {
            showVisitors();
        }
    }
});

function toggleSlideshow() {
    if (isPlaying) {
        clearInterval(slideshowInterval);
    } else {
        slideshowInterval = setInterval(nextImage, 12000);
    }
    isPlaying = !isPlaying;
}
