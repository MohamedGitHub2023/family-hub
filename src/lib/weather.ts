import { WeatherData } from './types';

export async function fetchWeather(city: string, apiKey?: string): Promise<WeatherData | null> {
  // Use a free weather API that doesn't require a key
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe/Paris`
    );
    if (!res.ok) return null;
    const json = await res.json();
    const current = json.current;

    return {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.temperature_2m),
      description: getWeatherDescription(current.weather_code),
      icon: getWeatherIcon(current.weather_code),
      city: city || 'Paris',
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
    };
  } catch {
    return null;
  }
}

function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Ciel dégagé',
    1: 'Principalement dégagé',
    2: 'Partiellement nuageux',
    3: 'Couvert',
    45: 'Brouillard',
    48: 'Brouillard givrant',
    51: 'Bruine légère',
    53: 'Bruine modérée',
    55: 'Bruine dense',
    61: 'Pluie légère',
    63: 'Pluie modérée',
    65: 'Pluie forte',
    71: 'Neige légère',
    73: 'Neige modérée',
    75: 'Neige forte',
    80: 'Averses légères',
    81: 'Averses modérées',
    82: 'Averses violentes',
    95: 'Orage',
    96: 'Orage avec grêle légère',
    99: 'Orage avec grêle forte',
  };
  return descriptions[code] || 'Variable';
}

function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 75) return '🌨️';
  if (code <= 82) return '🌧️';
  return '⛈️';
}
