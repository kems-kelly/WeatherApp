import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiX } from 'react-icons/fi';
import { weatherApi } from '../services/api';
import { useWeatherStore } from '../store/weatherStore';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchWeatherData = useWeatherStore((state) => state.fetchWeatherData);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        try {
          const results = await weatherApi.searchCities(query);
          setSuggestions(results);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
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

  const handleSelect = (city) => {
    fetchWeatherData(city.lat, city.lon, city.name, city.country);
    setQuery('');
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
  };

  const getCountryFlag = (country) => {
    const codePoints = country
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div ref={searchRef} className="relative w-full z-[100]">
      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.01 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for any city..."
          className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all shadow-2xl text-sm"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
            />
          ) : (
            <FiSearch className="text-white/30 text-lg" />
          )}
        </div>
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-all"
          >
            <FiX className="text-white/30" />
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {isFocused && (suggestions.length > 0 || (query.length > 2 && !isLoading)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]"
          >
            {suggestions.length > 0 ? (
              suggestions.map((city, index) => (
                <button
                  key={`${city.lat}-${city.lon}-${index}`}
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/10 text-left transition-all border-b border-white/5 last:border-0 group"
                >
                  <div className="w-6 h-6 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-white/20 transition-all">
                    <FiMapPin className="text-white/40 group-hover:text-white group-transition-all text-sm"/>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-white font-medium text-sm truncate">
                      {city.name}
                    </div>
                    <div className="text-white/40 text-[11px] flex items-center gap-2 truncate">
                      {city.state && <span>{city.state},</span>}
                      <span>{city.country}</span>
                      <span>{getCountryFlag(city.country)}</span>
                    </div>
                  </div>
                  <div className="text-white/20 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-white/40 text-xs">No cities found for "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
