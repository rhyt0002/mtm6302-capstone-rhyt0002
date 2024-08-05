const API_KEY = 'jstwGK9yqSNFKVpNbOtxRGBrTPHpLf2Ld0AwX9Wu'; 
const API_URL = 'https://api.nasa.gov/planetary/apod';

document.getElementById('date-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const date = document.getElementById('date-input').value;
    if (date) {
        fetchImage(date);
    }
});

document.getElementById('save-favourite').addEventListener('click', saveFavourite);

function fetchImage(date) {
    fetch(`${API_URL}?api_key=${API_KEY}&date=${date}`)
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
            if (data.media_type === 'image') {
                displayImage(data);
            } else {
                alert('No image available for the selected date.');
            }
        })
        .catch(error => console.error('Error fetching image:', error));
}

function displayImage(data) {
    if (!data || !data.url || !data.hdurl || !data.title || !data.date || !data.explanation) {
        console.error('Invalid data:', data);
        return;
    }

    const imageGallery = document.getElementById('image-gallery');
    imageGallery.innerHTML = ''; // Clear previous content

    const imageContainer = document.createElement('div');

    const image = document.createElement('img');
    image.src = data.url;
    image.alt = data.title;
    image.addEventListener('click', () => {
        window.open(data.hdurl, '_blank');
    });

    const title = document.createElement('h3');
    title.textContent = data.title;

    const dateElement = document.createElement('p');
    dateElement.textContent = `Date: ${data.date}`;

    const explanation = document.createElement('p');
    explanation.textContent = data.explanation;

    imageContainer.appendChild(image);
    imageContainer.appendChild(title);
    imageContainer.appendChild(dateElement);
    imageContainer.appendChild(explanation);
    imageGallery.appendChild(imageContainer);

    // Show save favourite button
    document.getElementById('save-favourite').style.display = 'block';
}

function saveFavourite() {
    const imageGallery = document.getElementById('image-gallery');
    if (!imageGallery.firstChild) {
        alert('No image to save.');
        return;
    }

    const image = imageGallery.querySelector('img');
    const explanation = imageGallery.querySelectorAll('p')[1].textContent;
    const title = imageGallery.querySelector('h3').textContent;
    const date = imageGallery.querySelector('p').textContent.replace('Date: ', '');


    const favourite = { url: image.src, hdurl: image.src, title, date, explanation };

    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    favourites.push(favourite);
    localStorage.setItem('favourites', JSON.stringify(favourites));

    alert('Image saved to favourites.');
    loadFavourites();
}

function loadFavourites() {
    const favouritesGallery = document.getElementById('favourites-gallery');
    favouritesGallery.innerHTML = ''; // Clear previous content

    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    favourites.forEach(favourite => {
        const favouriteItem = document.createElement('div');
        favouriteItem.classList.add('favourite-item');

        const img = document.createElement('img');
        img.src = favourite.url;
        img.alt = favourite.title;
        img.addEventListener('click', () => {
            window.open(favourite.hdurl, '_blank');
        });

        const explanation = document.createElement('p');
        explanation.textContent = favourite.explanation;

        const title = document.createElement('h4');
        title.textContent = favourite.title;

        const date = document.createElement('p');
        date.textContent = `Date: ${favourite.date}`;

        

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remove';
        deleteButton.addEventListener('click', () => {
            removeFavourite(favourite);
        });

        favouriteItem.appendChild(img);
        favouriteItem.appendChild(title);
        favouriteItem.appendChild(date);
        favouriteItem.appendChild(explanation);
        favouriteItem.appendChild(deleteButton);

        favouritesGallery.appendChild(favouriteItem);
    });
}

function removeFavourite(favouriteToRemove) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    favourites = favourites.filter(favourite => favourite.url !== favouriteToRemove.url);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    loadFavourites();
}

// Load favourites when the page loads
document.addEventListener('DOMContentLoaded', loadFavourites);
