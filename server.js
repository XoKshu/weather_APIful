import express from 'express';
import { createClient } from 'redis';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 5000;

// Configuración del cliente de Redis
const redisClient = createClient();
redisClient.connect().catch(err => console.error('Error connecting to Redis:', err));

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); 

// Ruta para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener datos del clima actual
app.get('/weather/current', async (req, res) => {
    const { lat, lon } = req.query;
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=40cfb8159579e1b79fe9eee83477b7f4&units=metric&lang=es`);
        const data = await response.json();

        if (response.ok) {
            const weatherHistory = {
                city: data.name,
                lat,
                lon,
                temperature: data.main.temp,
                description: data.weather[0].description,
                timestamp: Date.now(),
            };
            await redisClient.rPush('weather_history', JSON.stringify(weatherHistory));
            res.json(data);
        } else {
            res.status(404).json({ error: 'Datos del clima no encontrados' });
        }
    } catch (error) {
        console.error('Error al obtener datos del clima:', error);
        res.status(500).json({ error: 'Error al obtener datos del clima' });
    }
});

// Ruta para obtener el historial de consultas
app.get('/weather/history', async (req, res) => {
    try {
        const history = await redisClient.lRange('weather_history', 0, -1);
        const formattedHistory = history.map(entry => JSON.parse(entry));
        res.json(formattedHistory);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
});

// Ruta para limpiar el historial
app.delete('/weather/clear-history', async (req, res) => {
    try {
        await redisClient.del('weather_history');
        res.status(204).send();
    } catch (error) {
        console.error('Error al limpiar el historial:', error);
        res.status(500).json({ error: 'Error al limpiar el historial' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
