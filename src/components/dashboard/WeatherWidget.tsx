'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '@/lib/types';
import { fetchWeather } from '@/lib/weather';
import { Droplets, Wind, MapPin } from 'lucide-react';

interface WeatherWidgetProps {
  city: string;
}

export default function WeatherWidget({ city }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);
      const data = await fetchWeather(city);
      setWeather(data);
      setLoading(false);
    }
    loadWeather();
  }, [city]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 text-white shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-white/20" />
          <div className="flex items-center justify-between">
            <div className="h-12 w-20 rounded bg-white/20" />
            <div className="h-12 w-12 rounded-full bg-white/20" />
          </div>
          <div className="h-3 w-32 rounded bg-white/20" />
          <div className="flex gap-4">
            <div className="h-3 w-16 rounded bg-white/20" />
            <div className="h-3 w-16 rounded bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 text-white shadow-sm">
        <p className="text-sm text-white/80">Impossible de charger la meteo</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 text-white shadow-sm">
      <div className="flex items-center gap-1.5 text-white/80 mb-3">
        <MapPin size={14} />
        <span className="text-sm font-medium">{weather.city}</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-4xl font-bold tracking-tight">{weather.temp}&deg;C</p>
          <p className="text-sm text-white/90 mt-1 capitalize">{weather.description}</p>
        </div>
        <span className="text-5xl">{weather.icon}</span>
      </div>

      <div className="flex items-center gap-5 text-sm text-white/80 mt-3 pt-3 border-t border-white/20">
        <div className="flex items-center gap-1.5">
          <Droplets size={14} />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind size={14} />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}
