'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppData, Task, CalendarEvent, ShoppingItem, VacationProject, FamilyProject, FamilyMember, ProjectType } from '@/lib/types';
import { loadData, saveData, generateId } from '@/lib/storage';
import { defaultAppData } from '@/data/defaultData';
import { getProjectTemplate } from '@/data/projectTemplates';

export function useAppData() {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(loadData());
    setLoaded(true);
  }, []);

  const persist = useCallback((newData: AppData) => {
    setData(newData);
    saveData(newData);
  }, []);

  // Family
  const updateFamilyName = useCallback((name: string) => {
    persist({ ...data, familyName: name });
  }, [data, persist]);

  const updateMember = useCallback((member: FamilyMember) => {
    const newData = { ...data, family: data.family.map(m => m.id === member.id ? member : m) };
    persist(newData);
  }, [data, persist]);

  // Tasks
  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...task, id: generateId(), createdAt: new Date().toISOString() };
    persist({ ...data, tasks: [...data.tasks, newTask] });
  }, [data, persist]);

  const updateTask = useCallback((task: Task) => {
    persist({ ...data, tasks: data.tasks.map(t => t.id === task.id ? task : t) });
  }, [data, persist]);

  const deleteTask = useCallback((id: string) => {
    persist({ ...data, tasks: data.tasks.filter(t => t.id !== id) });
  }, [data, persist]);

  const toggleTask = useCallback((id: string) => {
    persist({ ...data, tasks: data.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) });
  }, [data, persist]);

  // Shopping
  const addShoppingItem = useCallback((item: Omit<ShoppingItem, 'id'>) => {
    persist({ ...data, shoppingList: [...data.shoppingList, { ...item, id: generateId() }] });
  }, [data, persist]);

  const toggleShoppingItem = useCallback((id: string) => {
    persist({ ...data, shoppingList: data.shoppingList.map(i => i.id === id ? { ...i, checked: !i.checked } : i) });
  }, [data, persist]);

  const deleteShoppingItem = useCallback((id: string) => {
    persist({ ...data, shoppingList: data.shoppingList.filter(i => i.id !== id) });
  }, [data, persist]);

  const clearCheckedItems = useCallback(() => {
    persist({ ...data, shoppingList: data.shoppingList.filter(i => !i.checked) });
  }, [data, persist]);

  // Events
  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    persist({ ...data, events: [...data.events, { ...event, id: generateId() }] });
  }, [data, persist]);

  const updateEvent = useCallback((event: CalendarEvent) => {
    persist({ ...data, events: data.events.map(e => e.id === event.id ? event : e) });
  }, [data, persist]);

  const deleteEvent = useCallback((id: string) => {
    persist({ ...data, events: data.events.filter(e => e.id !== id) });
  }, [data, persist]);

  // Vacations
  const addVacation = useCallback((vacation: Omit<VacationProject, 'id'>) => {
    persist({ ...data, vacations: [...data.vacations, { ...vacation, id: generateId() }] });
  }, [data, persist]);

  const updateVacation = useCallback((vacation: VacationProject) => {
    persist({ ...data, vacations: data.vacations.map(v => v.id === vacation.id ? vacation : v) });
  }, [data, persist]);

  const deleteVacation = useCallback((id: string) => {
    persist({ ...data, vacations: data.vacations.filter(v => v.id !== id) });
  }, [data, persist]);

  // Projects
  const addProject = useCallback((type: ProjectType, name: string, metadata?: Record<string, string>) => {
    const project = getProjectTemplate(type, name, metadata);
    persist({ ...data, projects: [...data.projects, project] });
    return project;
  }, [data, persist]);

  const updateProject = useCallback((project: FamilyProject) => {
    persist({ ...data, projects: data.projects.map(p => p.id === project.id ? project : p) });
  }, [data, persist]);

  const deleteProject = useCallback((id: string) => {
    persist({ ...data, projects: data.projects.filter(p => p.id !== id) });
  }, [data, persist]);

  const toggleProjectSubStep = useCallback((projectId: string, stepId: string, subStepId: string) => {
    persist({
      ...data,
      projects: data.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          steps: p.steps.map(s => {
            if (s.id !== stepId) return s;
            return {
              ...s,
              subSteps: s.subSteps.map(ss =>
                ss.id === subStepId ? { ...ss, checked: !ss.checked } : ss
              ),
            };
          }),
        };
      }),
    });
  }, [data, persist]);

  // Settings
  const updateSettings = useCallback((settings: Partial<AppData['settings']>) => {
    persist({ ...data, settings: { ...data.settings, ...settings } });
  }, [data, persist]);

  return {
    data,
    loaded,
    updateFamilyName,
    updateMember,
    addTask, updateTask, deleteTask, toggleTask,
    addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCheckedItems,
    addEvent, updateEvent, deleteEvent,
    addVacation, updateVacation, deleteVacation,
    addProject, updateProject, deleteProject, toggleProjectSubStep,
    updateSettings,
  };
}
