import { useWeatherStore } from '../store/weatherStore';
import { format } from 'date-fns';
import { BsCloudSun, BsCloudRain, BsSnow, BsSun, BsCloudMoon, BsMoon, BsLightning } from 'react-icons/bs';

export default function LeftPanel() {
  const { currentWeather, location, weatherConfig } = useWeatherStore();

  if (!currentWeather || !location) return null;

  const {
    main: { temp },
    weather
  } = currentWeather;

  const weatherMain = weather[0]?.main;
  const weatherIcon = weather[0]?.icon;

  // Format date like "06:09 - Monday, 9 Sep '19"
  // Note: We don't have exact accurate local time for the city immediately, 
  // but let's use the local time formatted for now.
  const timeString = format(new Date(), "HH:mm - eeee, d MMM ''yy");

  const getWeatherIcon = () => {
    const code = weather[0]?.id;
    if (code >= 200 && code < 300) return <BsLightning className="w-10 h-10" />;
    if (code >= 300 && code < 600) return <BsCloudRain className="w-10 h-10" />;
    if (code >= 600 && code < 700) return <BsSnow className="w-10 h-10" />;
    if (code === 800) {
      return weatherIcon?.includes('n') ? <BsMoon className="w-10 h-10" /> : <BsSun className="w-10 h-10" />;
    }
    if (code > 800) {
      if (code === 801 || code === 802) {
        return weatherIcon?.includes('n') ? <BsCloudMoon className="w-10 h-10" /> : <BsCloudSun className="w-10 h-10" />;
      }
      return weatherIcon?.includes('n') ? <BsCloudMoon className="w-10 h-10" /> : <BsCloudSun className="w-10 h-10" />;
    }
    return <BsCloudSun className="w-10 h-10" />;
  };

  return (
    <div className="relative w-full md:w-3/5 h-full overflow-hidden flex flex-col justify-between p-10 text-white">
      {/* Dark tint mapping to the original image's natural shading */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Top Left Logo */}
      <div className="relative z-10 font-bold text-sm tracking-widest uppercase">
        the.weather
      </div>

      {/* Bottom Information */}
      <div className="relative z-10 flex items-end justify-between">
        <div className="flex items-center gap-6">
          <div className="text-8xl font-medium tracking-tighter leading-none">
            {Math.round(temp)}°
          </div>
          <div className="flex flex-col justify-end pb-2">
            <h1 className="text-4xl font-normal tracking-wide mb-1">
              {location.name}
            </h1>
            <p className="text-sm text-white/80 font-light">
              {timeString}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-end pb-2">
          {getWeatherIcon()}
          <span className="text-sm font-medium mt-2 capitalize">{weatherMain}</span>
        </div>
      </div>
    </div>
  );
}
