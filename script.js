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
    }, 2000);
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function startSlideshow() {
    setInterval(nextImage, 8000); // 8 seconds total (2s fade out + 4s display + 2s fade in)
}

// Initialize the gallery
fetchImages();