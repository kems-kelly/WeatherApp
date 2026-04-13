import { useEffect } from 'react';
import { useWeatherStore } from './store/weatherStore';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {
  const { initDefaultCity, error, isLoading, weatherConfig } = useWeatherStore();

  useEffect(() => {
    initDefaultCity();
  }, [initDefaultCity]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative selection:bg-orange-500/30 font-sans">
      {/* Outer blurred background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50 scale-110"
        style={{ backgroundImage: `url(${weatherConfig.bgImage})`, filter: 'blur(40px)' }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {error && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500/20 backdrop-blur-md border border-red-500/50 text-white px-6 py-3 rounded-2xl shadow-2xl">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            <p className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase">Atmosphere Loading</p>
          </div>
        </div>
      )}

      {/* Main Container - The App Window */}
      <div 
        className="relative z-10 w-full max-w-[1100px] h-full max-h-[700px] aspect-video md:aspect-auto md:h-[650px] flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-none overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${weatherConfig.bgImage})` }}
      >
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
