import { create } from 'zustand';
import { weatherApi } from '../services/api';

export const useWeatherStore = create((set, get) => ({
  currentWeather: null,
  forecast: null,
  airQuality: null,
  location: null,
  nearbyCities: [],
  isLoading: false,
  error: null,
  theme: 'default',
  weatherConfig: {
    bgImage: 'https://images.unsplash.com/photo-1534088568595-a066f410cbda?auto=format&fit=crop&q=80&w=2000',
    mood: 'Dramatic',
    color: 'from-orange-900 to-slate-900'
  },

  setTheme: (weatherCode, icon) => {
    let themeType = 'default';
    let config = {
      bgImage: 'https://images.unsplash.com/photo-1534088568595-a066f410cbda?auto=format&fit=crop&q=80&w=2000',
      mood: 'Dramatic',
      color: 'from-orange-900 to-slate-900'
    };

    if (weatherCode >= 200 && weatherCode < 300) {
      themeType = 'stormy';
      config = {
        bgImage: 'https://images.unsplash.com/photo-1551234250-1c6ae78a87b7?auto=format&fit=crop&q=80&w=2000',
        mood: 'Chaotic',
        color: 'from-slate-900 to-indigo-950'
      };
    } else if (weatherCode >= 300 && weatherCode < 600) {
      themeType = 'rainy';
      config = {
        bgImage: 'https://images.unsplash.com/photo-1534274988757-a28bf1a5b991?auto=format&fit=crop&q=80&w=2000',
        mood: 'pensive',
        color: 'from-cyan-900 to-blue-950'
      };
    } else if (weatherCode >= 600 && weatherCode < 700) {
      themeType = 'snowy';
      config = {
        bgImage: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=2000',
        mood: 'Serene',
        color: 'from-blue-100 to-slate-300'
      };
    } else if (weatherCode === 800) {
      if (icon?.includes('n')) {
        themeType = 'night';
        config = {
          bgImage: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&q=80&w=2000',
          mood: 'Quiet',
          color: 'from-slate-900 to-black'
        };
      } else {
        themeType = 'sunny';
        config = {
          bgImage: 'https://images.unsplash.com/photo-1561570138547-7901763e05e2?auto=format&fit=crop&q=80&w=2000',
          mood: 'Energetic',
          color: 'from-blue-400 to-orange-300'
        };
      }
    } else if (weatherCode > 800) {
      if (icon?.includes('n')) {
        themeType = 'night';
        config = {
          bgImage: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&q=80&w=2000',
          mood: 'Mysterious',
          color: 'from-slate-900 to-black'
        };
      } else {
        themeType = 'cloudy';
        config = {
          bgImage: 'https://images.unsplash.com/photo-1534088568595-a066f410cbda?auto=format&fit=crop&q=80&w=2000',
          mood: 'Dramatic',
          color: 'from-orange-900 to-slate-900'
        };
      }
    }

    set({ theme: themeType, weatherConfig: config });
  },

  fetchWeatherData: async (lat, lon, name, country) => {
    const { setTheme } = get();
    set({ isLoading: true, error: null, location: { name, country, lat, lon } });

    try {
      const [weather, forecast, aqi] = await Promise.all([
        weatherApi.getWeather(lat, lon),
        weatherApi.getForecast(lat, lon),
        weatherApi.getAirQuality(lat, lon)
      ]);

      // Mocking nearby cities based on core data for the "Featured" look
      const nearby = [
        { name: 'North Jakarta', temp: Math.round(weather.main.temp + 2), condition: 'Mostly Sunny' },
        { name: 'Bandung', temp: Math.round(weather.main.temp - 2), condition: 'Cloudy' },
        { name: 'South Jakarta', temp: Math.round(weather.main.temp + 4), condition: 'Sunny' },
      ];

      set({
        currentWeather: weather,
        forecast: forecast,
        airQuality: aqi,
        nearbyCities: nearby,
        isLoading: false
      });

      if (weather?.weather?.[0]) {
        const { id, icon } = weather.weather[0];
        setTheme(id, icon);
      }
    } catch (error) {
      set({ error: 'Failed to fetch weather data. Please try again.', isLoading: false });
    }
  },

  initDefaultCity: async () => {
    await get().fetchWeatherData(-6.2088, 106.8456, 'Jakarta', 'ID');
  }
}));
