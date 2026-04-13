import { useState, useEffect, useRef } from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { FiSearch, FiMapPin, FiX } from 'react-icons/fi';
import { weatherApi } from '../services/api';

export default function RightPanel() {
  const { currentWeather, fetchWeatherData } = useWeatherStore();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoadingSearch(true);
        try {
          const results = await weatherApi.searchCities(query);
          setSuggestions(results);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingSearch(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentWeather) return null;

  const { clouds, main: { humidity }, wind } = currentWeather;

  const handleCityClick = (name, lat, lon, country) => {
    fetchWeatherData(lat, lon, name, country);
    setQuery('');
    setSuggestions([]);
    setIsFocused(false);
  };

  const presetCities = [
    { name: 'Birmingham', lat: 52.4862, lon: -1.8904, country: 'GB' },
    { name: 'Manchester', lat: 53.4808, lon: -2.2426, country: 'GB' },
    { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'US' },
    { name: 'California', lat: 36.7783, lon: -119.4179, country: 'US' },
  ];

  return (
    <div className="relative w-full md:w-2/5 h-full bg-black/60 backdrop-blur-3xl border-l border-white/10 flex flex-col items-center py-10 px-10 text-white overflow-hidden">
      
      {/* Search Button (Absolute top right) */}
      <button 
        className="absolute top-0 right-0 w-20 h-20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center text-white z-50 outline-none focus:outline-none focus:ring-0 border-none"
        onClick={() => {
          if (searchRef.current) {
            searchRef.current.querySelector('input')?.focus();
          }
        }}
        title="Search"
      >
        <FiSearch className="w-6 h-6" />
      </button>

      <div className="w-full max-w-sm flex-1 flex flex-col justify-center space-y-12 pb-10">
        
        {/* Locations / Search Section */}
        <div className="w-full relative" ref={searchRef}>
          <div className="border-b border-white/20 pb-3 mb-6 flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Another location"
              className="flex-1 bg-transparent text-sm font-medium tracking-wide text-white placeholder-white/80 outline-none focus:outline-none focus:ring-0 pr-2 min-w-0"
            />
            {isLoadingSearch && (
              <div className="w-4 h-4 ml-2 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />
            )}
            {query && !isLoadingSearch && (
              <button 
                onClick={() => setQuery('')}
                className="ml-2 text-white/50 hover:text-white shrink-0 outline-none focus:outline-none focus:ring-0"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {isFocused && query.length > 2 && (
            <div className="absolute top-10 left-0 w-full bg-black/80 backdrop-blur-3xl border-none rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[110] max-h-48 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((city, index) => (
                  <button
                    key={`${city.lat}-${city.lon}-${index}`}
                    onClick={() => handleCityClick(city.name, city.lat, city.lon, city.country)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left transition-colors border-b border-white/5 last:border-0 outline-none focus:outline-none focus:ring-0 focus:bg-white/10"
                  >
                    <FiMapPin className="text-white/40 text-sm shrink-0" />
                    <div className="flex-1 truncate">
                      <div className="text-white text-sm">{city.name}</div>
                      <div className="text-white/40 text-[11px]">
                        {city.state && `${city.state}, `}{city.country}
                      </div>
                    </div>
                  </button>
                ))
              ) : !isLoadingSearch ? (
                <div className="px-4 py-3 text-white/40 text-xs">No cities found</div>
              ) : null}
            </div>
          )}

          <ul className="flex flex-col space-y-6">
            {presetCities.map((city) => (
              <li key={city.name}>
                <button 
                  onClick={() => handleCityClick(city.name, city.lat, city.lon, city.country)}
                  className="text-white/60 hover:text-white transition-colors text-base font-light tracking-wide w-full text-left outline-none focus:outline-none focus:ring-0"
                >
                  {city.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Details Section */}
        <div className="w-full">
          <h3 className="text-sm border-b border-white/20 pb-4 mb-6 font-medium tracking-wide">
            Weather Details
          </h3>
          <ul className="flex flex-col space-y-6">
            <li className="flex justify-between items-center text-white/60">
              <span className="font-light tracking-wide text-base">Cloudy</span>
              <span className="text-white font-medium">{clouds.all}%</span>
            </li>
            <li className="flex justify-between items-center text-white/60">
              <span className="font-light tracking-wide text-base">Humidity</span>
              <span className="text-white font-medium">{humidity}%</span>
            </li>
            <li className="flex justify-between items-center text-white/60">
              <span className="font-light tracking-wide text-base">Wind</span>
              <span className="text-white font-medium">{Math.round(wind.speed * 3.6)}km/h</span>
            </li>
          </ul>
        </div>

        {/* Next Days Section */}
        <div className="w-full border-t border-white/20 pt-6 mt-6">
          <h3 className="text-sm text-white/60 font-medium tracking-wide">
            Next Days
          </h3>
          {/* Fading gradient effect for the rest of the list */}
          <div className="h-10 w-full bg-gradient-to-b from-transparent to-slate-900/10 mt-2 pointer-events-none" />
        </div>

      </div>
    </div>
  );
}
