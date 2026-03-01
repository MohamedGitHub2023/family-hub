'use client';

import { AppData } from './types';
import { defaultAppData } from '@/data/defaultData';

const STORAGE_KEY = 'familyhub_data';

export function loadData(): AppData {
  if (typeof window === 'undefined') return defaultAppData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultAppData, ...parsed };
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return defaultAppData;
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

export function updateData<K extends keyof AppData>(key: K, value: AppData[K]): AppData {
  const data = loadData();
  data[key] = value;
  saveData(data);
  return data;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
