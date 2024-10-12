8# Weather API Project

Este proyecto es una aplicación web para consultar datos del clima de cualquier ubicación en el mundo utilizando la API de OpenWeather. La aplicación permite ingresar las coordenadas (latitud y longitud) para obtener información meteorológica en tiempo real. También cuenta con un historial de consultas y un mapa interactivo que muestra la ubicación correspondiente.

## Características

- Consultar datos meteorológicos actuales de cualquier ubicación utilizando la API de OpenWeather.
- Muestra información detallada del clima, como:
  - Ciudad.
  - Latitud y longitud.
  - Temperatura.
  - Descripción del clima (en español).
  - Icono representativo del clima.
- Historial de consultas almacenado en Redis.
- Mapa interactivo utilizando Leaflet que muestra la ubicación basada en las coordenadas ingresadas.
- Funcionalidad para limpiar el historial de consultas.
  
## Tecnologías utilizadas

- **Backend:**
  - Node.js con Express.
  - Redis para almacenar el historial de consultas.
  - OpenWeather API para obtener datos del clima.
  - `node-fetch` para realizar solicitudes HTTP.
  
- **Frontend:**
  - HTML5, CSS3.
  - JavaScript.
  - Leaflet.js para el mapa interactivo.
  
## Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- Node.js (v14+).
- Redis.
- Una cuenta en [OpenWeather](https://openweathermap.org/) para obtener una API KEY
