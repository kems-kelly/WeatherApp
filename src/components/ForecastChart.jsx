import { useMemo } from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { format, parseISO } from 'date-fns';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const ForecastChart = () => {
  const { forecast } = useWeatherStore();

  const chartData = useMemo(() => {
    if (!forecast?.list) return [];
    // Get 6 days of forecast (approx 1 per day or simplified)
    const dailyMap = new Map();
    forecast.list.forEach(item => {
      const day = format(parseISO(item.dt_txt), 'EEEE');
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          day,
          temp: Math.round(item.main.temp),
          icon: item.weather[0].icon
        });
      }
    });
    return Array.from(dailyMap.values()).slice(0, 6);
  }, [forecast]);

  if (!chartData.length) return null;

  return (
    <div className="w-full h-48 mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-white text-sm font-bold">
                    {payload[0].value}°C
                  </div>
                );
              }
              return null;
            }}
          />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }}
            dy={15}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#ffffff"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWave)"
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomDot = ({ cx, cy, payload }) => {
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill="#fff" />
      <text x={cx} y={cy - 15} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="500">
        {payload.temp}°
      </text>
      <image 
        x={cx - 10} 
        y={cy - 45} 
        width="20" 
        height="20" 
        href={`https://openweathermap.org/img/wn/${payload.icon}.png`} 
      />
    </g>
  );
};

export default ForecastChart;
