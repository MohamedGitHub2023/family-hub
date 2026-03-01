'use client';

import { useState, useEffect, useMemo } from 'react';
import { Bell } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { Suggestion, WeatherData } from '@/lib/types';
import { fetchWeather } from '@/lib/weather';
import {
  getWeatherSuggestions,
  getSeasonalSuggestions,
  getDailySuggestions,
  getProjectSuggestions,
} from '@/data/suggestions';

import WeatherWidget from '@/components/dashboard/WeatherWidget';
import FamilyAvatars from '@/components/dashboard/FamilyAvatars';
import DailySummary from '@/components/dashboard/DailySummary';
import QuickActions from '@/components/dashboard/QuickActions';
import Suggestions from '@/components/dashboard/Suggestions';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon apres-midi';
  return 'Bonsoir';
}

export default function HomePage() {
  const { data, loaded } = useAppData();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function loadWeather() {
      const w = await fetchWeather(data.settings.city);
      setWeather(w);
    }
    if (loaded) {
      loadWeather();
    }
  }, [loaded, data.settings.city]);

  const suggestions = useMemo<Suggestion[]>(() => {
    const all: Suggestion[] = [];

    // Weather-based suggestions
    if (weather) {
      all.push(...getWeatherSuggestions(weather.temp, weather.description));
    }

    // Seasonal suggestions
    all.push(...getSeasonalSuggestions());

    // Daily suggestions
    all.push(...getDailySuggestions());

    // Project suggestions
    all.push(...getProjectSuggestions(data.projects));

    // Sort by priority and limit
    return all.sort((a, b) => a.priority - b.priority).slice(0, 5);
  }, [weather, data.projects]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-indigo-400">
          <div className="w-10 h-10 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 pt-6 pb-4 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{getGreeting()}</p>
            <h1 className="text-xl font-bold text-slate-800">{data.familyName}</h1>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-indigo-50">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>
        </div>

        {/* Family Avatars */}
        <FamilyAvatars members={data.family} />

        {/* Weather Widget */}
        <WeatherWidget city={data.settings.city} />

        {/* Daily Summary */}
        <DailySummary tasks={data.tasks} events={data.events} />

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
            Actions rapides
          </h3>
          <QuickActions />
        </div>

        {/* Suggestions */}
        <Suggestions suggestions={suggestions} />
      </div>
    </div>
  );
}
