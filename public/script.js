const weatherForm = document.getElementById('weatherForm');
const weatherResult = document.getElementById('weatherResult');
const errorMessage = document.getElementById('errorMessage');
const historyBody = document.getElementById('historyBody');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const mapContainer = document.getElementById('map');
let map;

// Configura el mapa de Leaflet
function initMap(lat, lon) {
    if (!map) {
        map = L.map(mapContainer).setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
    }
    map.setView([lat, lon], 13);
    L.marker([lat, lon]).addTo(map);
}

weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lat = document.getElementById('lat').value;
    const lon = document.getElementById('lon').value;

    // Llamar a la API del clima
    const response = await fetch(`/weather/current?lat=${lat}&lon=${lon}`);
    if (response.ok) {
        const data = await response.json();
        displayWeather(data);
        loadWeatherHistory(); // Cargar historial después de obtener el clima
        initMap(lat, lon); // Inicializa el mapa con la ubicación
    } else {
        const errorData = await response.json();
        errorMessage.innerText = errorData.error || 'Error al obtener datos del clima';
    }
});

function displayWeather(data) {
    const { name, main, weather, wind, sys } = data;
    const description = weather[0].description;
    const icon = weather[0].icon;

    weatherResult.innerHTML = `
        <div class="card">
            <h2>${name}, ${sys.country}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
            <p><strong>Temperatura:</strong> ${main.temp} °C</p>
            <p><strong>Descripción:</strong> ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <p><strong>Temperatura Mínima:</strong> ${main.temp_min} °C</p>
            <p><strong>Temperatura Máxima:</strong> ${main.temp_max} °C</p>
            <p><strong>Humedad:</strong> ${main.humidity}%</p>
            <p><strong>Presión:</strong> ${main.pressure} hPa</p>
            <p><strong>Velocidad del Viento:</strong> ${wind.speed} m/s</p>
        </div>
    `;
}

async function loadWeatherHistory() {
    try {
        const response = await fetch('/weather/history');
        const history = await response.json();
        historyBody.innerHTML = '';

        history.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.city}</td>
                <td>${entry.lat}</td>
                <td>${entry.lon}</td>
                <td>${entry.temperature} °C</td>
                <td>${entry.description.charAt(0).toUpperCase() + entry.description.slice(1)}</td>
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
            `;
            historyBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar el historial:', error);
    }
}

// Función para limpiar el historial
clearHistoryBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/weather/clear-history', { method: 'DELETE' });
        if (response.ok) {
            historyBody.innerHTML = '';
        } else {
            const errorData = await response.json();
            errorMessage.innerText = errorData.error || 'Error al limpiar el historial';
        }
    } catch (error) {
        console.error('Error al limpiar el historial:', error);
    }
});

// Cargar el historial al inicio
loadWeatherHistory();
