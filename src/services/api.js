import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const weatherApi = {
  searchCities: async (query) => {
    try {
      const response = await axios.get(`${GEO_URL}/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  getWeather: async (lat, lon) => {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  getForecast: async (lat, lon) => {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  getAirQuality: async (lat, lon) => {
    try {
      const response = await axios.get(`${BASE_URL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching air quality:', error);
      throw error;
    }
  },
};
