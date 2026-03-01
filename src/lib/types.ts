export interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child';
  avatar: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  category: 'homework' | 'chores' | 'shopping' | 'activity' | 'other';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'fruits' | 'vegetables' | 'dairy' | 'meat' | 'bakery' | 'drinks' | 'hygiene' | 'other';
  quantity: number;
  unit: string;
  checked: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category: 'school' | 'sport' | 'medical' | 'leisure' | 'family' | 'other';
  memberId: string;
  color?: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
}

export interface VacationProject {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: 'planning' | 'booked' | 'ongoing' | 'completed';
  activities: VacationActivity[];
  checklist: ChecklistItem[];
  notes?: string;
  image?: string;
}

export interface VacationActivity {
  id: string;
  name: string;
  date?: string;
  cost?: number;
  booked: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category?: string;
}

export type ProjectType = 'expatriation' | 'demenagement' | 'renovation' | 'mariage' | 'naissance';

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  order: number;
  subSteps: ChecklistItem[];
}

export interface FamilyProject {
  id: string;
  name: string;
  type: ProjectType;
  description?: string;
  icon: string;
  color: string;
  steps: ProjectStep[];
  createdAt: string;
  targetDate?: string;
  status: 'active' | 'completed' | 'paused';
  metadata?: Record<string, string>;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  city: string;
  humidity: number;
  windSpeed: number;
}

export interface Suggestion {
  id: string;
  text: string;
  category: 'weather' | 'activity' | 'task' | 'project' | 'vacation' | 'seasonal';
  icon: string;
  priority: number;
}

export interface AppData {
  familyName: string;
  family: FamilyMember[];
  tasks: Task[];
  shoppingList: ShoppingItem[];
  events: CalendarEvent[];
  vacations: VacationProject[];
  projects: FamilyProject[];
  settings: AppSettings;
}

export interface AppSettings {
  city: string;
  weatherApiKey: string;
  language: string;
  theme: 'light' | 'dark';
}
