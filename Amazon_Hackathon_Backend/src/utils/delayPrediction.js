// import axios from 'axios';

// const OPENWEATHER_API_KEY = '6b59ed267c805c61c3276648166091a0'; // Your OpenWeather API Key
// const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// async function fetchWeatherData(city) {
//   try {
//     const response = await axios.get(OPENWEATHER_API_URL, {
//       params: {
//         q: city,
//         appid: OPENWEATHER_API_KEY,
//         units: 'metric'
//       }
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error fetching weather data:', error);
//     return null;
//   }
// }

// async function getDelayStatus(city) {
//   const weatherData = await fetchWeatherData(city);
//   if (!weatherData) return 'On Time';

//   const { main, weather } = weatherData;
//   const temp = main.temp;
//   const condition = weather[0].main.toLowerCase();

//   if (condition.includes('rain') || condition.includes('snow') || temp < 5) {
//     return 'Delayed';
//   }
//   return 'On Time';
// }

// export { getDelayStatus };
