'use client';

import { Task, CalendarEvent } from '@/lib/types';
import Card from '@/components/ui/Card';
import { CheckCircle2, CalendarClock } from 'lucide-react';

interface DailySummaryProps {
  tasks: Task[];
  events: CalendarEvent[];
}

export default function DailySummary({ tasks, events }: DailySummaryProps) {
  const today = new Date().toISOString().split('T')[0];

  const pendingTasks = tasks.filter(
    (t) => !t.completed && (!t.dueDate || t.dueDate === today)
  );

  const todayEvents = events.filter((e) => e.date === today);

  return (
    <Card className="overflow-hidden">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Aujourd&apos;hui
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Pending tasks */}
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <CheckCircle2 size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{pendingTasks.length}</p>
            <p className="text-xs text-slate-500">
              {pendingTasks.length <= 1 ? 'tache' : 'taches'}
            </p>
          </div>
        </div>

        {/* Today events */}
        <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <CalendarClock size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{todayEvents.length}</p>
            <p className="text-xs text-slate-500">
              {todayEvents.length <= 1 ? 'evenement' : 'evenements'}
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming events list */}
      {todayEvents.length > 0 && (
        <div className="mt-3 space-y-2">
          {todayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span className="font-medium">{event.title}</span>
              {event.startTime && (
                <span className="text-slate-400 ml-auto text-xs">
                  {event.startTime}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
