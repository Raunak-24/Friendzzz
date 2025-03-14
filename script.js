const accessKey = 'nnzYM_D-RwaiEJnWZlBQHhjX2qptAEZTl4u01DyosgI';
const imageWrapper = document.querySelector('.image-wrapper');

let images = [];
let currentIndex = 0;

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
        showImage(currentIndex);
        startSlideshow();
    } catch (error) {
        console.error('Error fetching images:', error);
    }
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

function showImage(index) {
    imageWrapper.classList.add('fade');
    setTimeout(() => {
        imageWrapper.style.backgroundImage = `url(${images[index].url})`;
        updateImageInfo(index);
        imageWrapper.classList.remove('fade');
    }, 3000); // Increased to 3000ms to match CSS transition
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

// Add at the beginning of the file, after the constants
let visitors = [];

// Add before fetchImages() call
function handleVisitorEntry() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const nameInput = document.getElementById('visitorName');
    let timer;

    nameInput.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const name = nameInput.value.trim();
            if (name) {
                // Store in Firebase instead of localStorage
                db.ref('visitors').push({
                    name: name,
                    timestamp: new Date().toLocaleString()
                });
                welcomeOverlay.style.opacity = '0';
                setTimeout(() => {
                    welcomeOverlay.style.display = 'none';
                }, 1000);
            }
        }, 2000);
    });
}

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
