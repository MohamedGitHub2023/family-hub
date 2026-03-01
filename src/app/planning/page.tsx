'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  GraduationCap,
  Dumbbell,
  Stethoscope,
  Gamepad2,
  Heart,
  MoreHorizontal,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { fr } from 'date-fns/locale';

import { useAppData } from '@/hooks/useAppData';
import { CalendarEvent, FamilyMember } from '@/lib/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

// ---- Constants ----

const EVENT_CATEGORIES = [
  { value: 'school', label: 'École', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50', icon: GraduationCap },
  { value: 'sport', label: 'Sport', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50', icon: Dumbbell },
  { value: 'medical', label: 'Médical', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', icon: Stethoscope },
  { value: 'leisure', label: 'Loisirs', color: 'bg-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50', icon: Gamepad2 },
  { value: 'family', label: 'Famille', color: 'bg-pink-500', textColor: 'text-pink-700', bgLight: 'bg-pink-50', icon: Heart },
  { value: 'other', label: 'Autre', color: 'bg-slate-400', textColor: 'text-slate-700', bgLight: 'bg-slate-50', icon: MoreHorizontal },
] as const;

function getCategoryMeta(category: CalendarEvent['category']) {
  return EVENT_CATEGORIES.find((c) => c.value === category) ?? EVENT_CATEGORIES[5];
}

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// ---- Sub-components ----

function MemberFilter({
  members,
  selectedId,
  onSelect,
}: {
  members: FamilyMember[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 no-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          selectedId === null
            ? 'bg-indigo-500 text-white'
            : 'bg-white text-slate-600 border border-slate-200'
        }`}
      >
        Tous
      </button>
      {members.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedId === m.id
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <span className="text-base">{m.avatar}</span>
          {m.name}
        </button>
      ))}
    </div>
  );
}

function CalendarGrid({
  currentMonth,
  selectedDate,
  eventDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  currentMonth: Date;
  selectedDate: Date;
  eventDates: Set<string>;
  onSelectDate: (d: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  return (
    <Card className="mx-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <h2 className="text-base font-semibold text-slate-800 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <button
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronRight size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((day) => (
          <div key={day} className="text-center text-[11px] font-medium text-slate-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const dateKey = format(day, 'yyyy-MM-dd');
          const hasEvents = eventDates.has(dateKey);

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(day)}
              className={`relative flex flex-col items-center justify-center h-10 rounded-xl transition-all ${
                !isCurrentMonth
                  ? 'text-slate-300'
                  : isSelected
                  ? 'bg-indigo-500 text-white'
                  : isToday
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {hasEvents && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400" />
              )}
              {hasEvents && isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function EventCard({
  event,
  member,
  onDelete,
}: {
  event: CalendarEvent;
  member?: FamilyMember;
  onDelete: (id: string) => void;
}) {
  const cat = getCategoryMeta(event.category);
  const Icon = cat.icon;

  return (
    <Card className="flex items-start gap-3">
      {/* Category color bar */}
      <div className={`w-1 self-stretch rounded-full ${cat.color} shrink-0`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={14} className={cat.textColor} />
          <Badge
            variant={
              event.category === 'school'
                ? 'info'
                : event.category === 'sport'
                ? 'success'
                : event.category === 'medical'
                ? 'danger'
                : event.category === 'leisure'
                ? 'indigo'
                : 'default'
            }
            size="sm"
          >
            {cat.label}
          </Badge>
        </div>
        <h4 className="text-sm font-semibold text-slate-800 truncate">{event.title}</h4>
        {(event.startTime || event.endTime) && (
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
            <Clock size={12} />
            <span>
              {event.startTime || ''}
              {event.startTime && event.endTime ? ' - ' : ''}
              {event.endTime || ''}
            </span>
          </div>
        )}
        {member && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-sm">{member.avatar}</span>
            <span className="text-xs text-slate-500">{member.name}</span>
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(event.id)}
        className="p-1.5 rounded-full hover:bg-red-50 transition-colors shrink-0"
        aria-label="Supprimer"
      >
        <Trash2 size={16} className="text-slate-400 hover:text-red-500" />
      </button>
    </Card>
  );
}

function EventForm({
  members,
  initialDate,
  onSubmit,
  onClose,
}: {
  members: FamilyMember[];
  initialDate: Date;
  onSubmit: (event: Omit<CalendarEvent, 'id'>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(initialDate, 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState<CalendarEvent['category']>('other');
  const [memberId, setMemberId] = useState(members[0]?.id ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      category,
      memberId,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nom de l'événement"
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          required
          autoFocus
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          required
        />
      </div>

      {/* Time row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Début</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fin</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white"
        >
          {EVENT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Member */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Membre</label>
        <div className="grid grid-cols-2 gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMemberId(m.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                memberId === m.id
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className="text-lg">{m.avatar}</span>
              <span className="font-medium truncate">{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 active:scale-[0.98] transition-all"
      >
        Ajouter l&apos;événement
      </button>
    </form>
  );
}

// ---- Main Page ----

export default function PlanningPage() {
  const { data, loaded, addEvent, deleteEvent } = useAppData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Events filtered by member
  const filteredEvents = useMemo(() => {
    return data.events.filter((ev) => (selectedMember ? ev.memberId === selectedMember : true));
  }, [data.events, selectedMember]);

  // Set of date strings that have events (for calendar dots)
  const eventDates = useMemo(() => {
    const set = new Set<string>();
    filteredEvents.forEach((ev) => set.add(ev.date));
    return set;
  }, [filteredEvents]);

  // Events for the selected date
  const dayEvents = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return filteredEvents
      .filter((ev) => ev.date === dateStr)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [filteredEvents, selectedDate]);

  const getMember = (id: string) => data.family.find((m) => m.id === id);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header
        title="Planning Familial"
        showBack
        rightAction={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition-colors"
          >
            <Plus size={16} />
            Ajouter
          </button>
        }
      />

      <div className="py-4 space-y-4">
        {/* Member filter */}
        <MemberFilter
          members={data.family}
          selectedId={selectedMember}
          onSelect={setSelectedMember}
        />

        {/* Calendar */}
        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          eventDates={eventDates}
          onSelectDate={setSelectedDate}
          onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
          onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
        />

        {/* Selected date label */}
        <div className="px-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
          </h3>
        </div>

        {/* Events list */}
        <div className="px-4 space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm">Aucun événement ce jour</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 text-indigo-500 text-sm font-medium hover:text-indigo-600 transition-colors"
              >
                + Ajouter un événement
              </button>
            </div>
          ) : (
            dayEvents.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                member={getMember(ev.memberId)}
                onDelete={deleteEvent}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvel événement" size="full">
        <EventForm
          members={data.family}
          initialDate={selectedDate}
          onSubmit={addEvent}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}
