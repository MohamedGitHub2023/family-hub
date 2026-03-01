'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Check,
  MapPin,
  Calendar,
  DollarSign,
  Sun,
  Compass,
  ChevronRight,
  X,
  StickyNote,
  ListChecks,
  Activity,
  Sparkles,
  Plane,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { useAppData } from '@/hooks/useAppData';
import { VacationProject, VacationActivity, ChecklistItem } from '@/lib/types';
import { vacationDestinations } from '@/data/dubaiInfo';
import { generateId } from '@/lib/storage';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

// ---- Types ----

type MainTab = 'explore' | 'trips';

type Destination = (typeof vacationDestinations)[number];

// ---- Status helpers ----

const STATUS_META: Record<VacationProject['status'], { label: string; variant: 'default' | 'info' | 'warning' | 'success' }> = {
  planning: { label: 'En planification', variant: 'info' },
  booked: { label: 'Reservé', variant: 'warning' },
  ongoing: { label: 'En cours', variant: 'success' },
  completed: { label: 'Terminé', variant: 'default' },
};

// ---- Default checklist items ----

const DEFAULT_CHECKLIST: Omit<ChecklistItem, 'id'>[] = [
  { text: 'Passeports valides', checked: false, category: 'documents' },
  { text: 'Billets d\'avion réservés', checked: false, category: 'transport' },
  { text: 'Assurance voyage', checked: false, category: 'documents' },
  { text: 'Hôtel / hébergement réservé', checked: false, category: 'logement' },
  { text: 'Valises préparées', checked: false, category: 'préparation' },
  { text: 'Devises / carte bancaire', checked: false, category: 'finance' },
  { text: 'Médicaments / trousse de secours', checked: false, category: 'santé' },
  { text: 'Chargeurs et adaptateurs', checked: false, category: 'préparation' },
];

// ---- Sub-components ----

function TabBar({ activeTab, onTabChange }: { activeTab: MainTab; onTabChange: (t: MainTab) => void }) {
  return (
    <div className="flex bg-white border-b border-slate-100">
      {([
        { key: 'explore' as MainTab, label: 'Explorer', icon: Compass },
        { key: 'trips' as MainTab, label: 'Mes Voyages', icon: Plane },
      ]).map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors relative flex items-center justify-center gap-1.5 ${
            activeTab === tab.key ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <tab.icon size={16} />
          {tab.label}
          {activeTab === tab.key && (
            <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

// ---- Destination Card ----

function DestinationCard({
  destination,
  onCreateTrip,
}: {
  destination: Destination;
  onCreateTrip: (dest: Destination) => void;
}) {
  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header with emoji */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 text-center">
        <span className="text-5xl block mb-2">{destination.image}</span>
        <h3 className="text-lg font-bold text-white">{destination.name}</h3>
        <p className="text-indigo-200 text-sm">{destination.country}</p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">{destination.description}</p>

        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={14} className="text-emerald-500" />
          <span className="text-slate-700 font-medium">{destination.budget}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Sun size={14} className="text-amber-500" />
          <span className="text-slate-600">{destination.bestSeason}</span>
        </div>

        {/* Activities */}
        <div className="flex flex-wrap gap-1.5">
          {destination.activities.map((act, i) => (
            <Badge key={i} variant="indigo" size="sm">
              {act}
            </Badge>
          ))}
        </div>

        {/* Quick create button */}
        <button
          onClick={() => onCreateTrip(destination)}
          className="w-full mt-2 py-2.5 bg-indigo-50 text-indigo-600 font-semibold text-sm rounded-xl hover:bg-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
        >
          <Plus size={16} />
          Planifier ce voyage
        </button>
      </div>
    </Card>
  );
}

// ---- Trip Card ----

function TripCard({
  trip,
  onClick,
}: {
  trip: VacationProject;
  onClick: () => void;
}) {
  const budgetPercent = trip.budget > 0 ? (trip.spent / trip.budget) * 100 : 0;
  const statusMeta = STATUS_META[trip.status];
  const activitiesDone = trip.activities.filter(a => a.booked).length;
  const checklistDone = trip.checklist.filter(c => c.checked).length;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMM yyyy', { locale: fr });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card onClick={onClick} className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
            <MapPin size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{trip.destination}</h3>
            <p className="text-xs text-slate-500">{trip.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusMeta.variant} size="sm">{statusMeta.label}</Badge>
          <ChevronRight size={16} className="text-slate-400" />
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Calendar size={14} />
        <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
      </div>

      {/* Budget progress */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-600">Budget</span>
          <span className="font-semibold text-slate-700">{trip.spent.toLocaleString('fr-FR')} / {trip.budget.toLocaleString('fr-FR')} &euro;</span>
        </div>
        <ProgressBar
          value={budgetPercent}
          color={budgetPercent > 90 ? 'red' : budgetPercent > 70 ? 'amber' : 'indigo'}
          size="sm"
          showLabel={false}
        />
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Activity size={12} />
          {activitiesDone}/{trip.activities.length} activités
        </span>
        <span className="flex items-center gap-1">
          <ListChecks size={12} />
          {checklistDone}/{trip.checklist.length} checklist
        </span>
      </div>
    </Card>
  );
}

// ---- Trip Detail View ----

function TripDetail({
  trip,
  onUpdate,
  onDelete,
  onClose,
}: {
  trip: VacationProject;
  onUpdate: (trip: VacationProject) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [newActivity, setNewActivity] = useState('');
  const [newActivityCost, setNewActivityCost] = useState('');
  const [newCheckItem, setNewCheckItem] = useState('');
  const [addSpent, setAddSpent] = useState('');

  const budgetPercent = trip.budget > 0 ? (trip.spent / trip.budget) * 100 : 0;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMMM yyyy', { locale: fr });
    } catch {
      return dateStr;
    }
  };

  const handleToggleActivity = (actId: string) => {
    const updated = {
      ...trip,
      activities: trip.activities.map(a =>
        a.id === actId ? { ...a, booked: !a.booked } : a
      ),
    };
    onUpdate(updated);
  };

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    const act: VacationActivity = {
      id: generateId(),
      name: newActivity.trim(),
      cost: newActivityCost ? parseFloat(newActivityCost) : undefined,
      booked: false,
    };
    onUpdate({ ...trip, activities: [...trip.activities, act] });
    setNewActivity('');
    setNewActivityCost('');
  };

  const handleDeleteActivity = (actId: string) => {
    onUpdate({
      ...trip,
      activities: trip.activities.filter(a => a.id !== actId),
    });
  };

  const handleToggleCheckItem = (itemId: string) => {
    const updated = {
      ...trip,
      checklist: trip.checklist.map(c =>
        c.id === itemId ? { ...c, checked: !c.checked } : c
      ),
    };
    onUpdate(updated);
  };

  const handleAddCheckItem = () => {
    if (!newCheckItem.trim()) return;
    const item: ChecklistItem = {
      id: generateId(),
      text: newCheckItem.trim(),
      checked: false,
    };
    onUpdate({ ...trip, checklist: [...trip.checklist, item] });
    setNewCheckItem('');
  };

  const handleDeleteCheckItem = (itemId: string) => {
    onUpdate({
      ...trip,
      checklist: trip.checklist.filter(c => c.id !== itemId),
    });
  };

  const handleAddSpent = () => {
    const amount = parseFloat(addSpent);
    if (isNaN(amount) || amount <= 0) return;
    onUpdate({ ...trip, spent: trip.spent + amount });
    setAddSpent('');
  };

  const handleNotesChange = (notes: string) => {
    onUpdate({ ...trip, notes });
  };

  const handleStatusChange = (status: VacationProject['status']) => {
    onUpdate({ ...trip, status });
  };

  return (
    <div className="space-y-5">
      {/* Header info */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <MapPin size={28} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{trip.destination}</h2>
        <p className="text-slate-500 text-sm">{trip.country}</p>
        <p className="text-slate-400 text-xs mt-1">
          {formatDate(trip.startDate)} &rarr; {formatDate(trip.endDate)}
        </p>
      </div>

      {/* Status selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
        <div className="flex gap-2 flex-wrap">
          {(Object.entries(STATUS_META) as [VacationProject['status'], { label: string; variant: 'default' | 'info' | 'warning' | 'success' }][]).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => handleStatusChange(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                trip.status === key
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget tracker */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-800">Budget</h3>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Dépensé</span>
          <span className="font-bold text-slate-800">{trip.spent.toLocaleString('fr-FR')} / {trip.budget.toLocaleString('fr-FR')} &euro;</span>
        </div>
        <ProgressBar
          value={budgetPercent}
          color={budgetPercent > 90 ? 'red' : budgetPercent > 70 ? 'amber' : 'indigo'}
          size="md"
          showLabel={false}
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={addSpent}
            onChange={(e) => setAddSpent(e.target.value)}
            placeholder="Montant"
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={handleAddSpent}
            className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </Card>

      {/* Activities */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-800">
            Activités ({trip.activities.filter(a => a.booked).length}/{trip.activities.length})
          </h3>
        </div>

        {trip.activities.length > 0 && (
          <div className="space-y-2">
            {trip.activities.map((act) => (
              <div key={act.id} className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleActivity(act.id)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    act.booked
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-300 hover:border-emerald-400'
                  }`}
                >
                  {act.booked && <Check size={12} className="text-white" strokeWidth={3} />}
                </button>
                <span className={`flex-1 text-sm ${act.booked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {act.name}
                </span>
                {act.cost !== undefined && (
                  <span className="text-xs text-slate-400">{act.cost}&euro;</span>
                )}
                <button
                  onClick={() => handleDeleteActivity(act.id)}
                  className="p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <X size={14} className="text-slate-300 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="Nouvelle activité"
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
          />
          <input
            type="number"
            value={newActivityCost}
            onChange={(e) => setNewActivityCost(e.target.value)}
            placeholder="Coût"
            className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={handleAddActivity}
            className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </Card>

      {/* Checklist */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <ListChecks size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-800">
            Checklist ({trip.checklist.filter(c => c.checked).length}/{trip.checklist.length})
          </h3>
        </div>

        {trip.checklist.length > 0 && (
          <div className="space-y-2">
            {trip.checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleCheckItem(item.id)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    item.checked
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'border-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {item.checked && <Check size={12} className="text-white" strokeWidth={3} />}
                </button>
                <span className={`flex-1 text-sm ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => handleDeleteCheckItem(item.id)}
                  className="p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <X size={14} className="text-slate-300 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newCheckItem}
            onChange={(e) => setNewCheckItem(e.target.value)}
            placeholder="Nouvel élément"
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCheckItem()}
          />
          <button
            onClick={handleAddCheckItem}
            className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </Card>

      {/* Notes */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <StickyNote size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-800">Notes</h3>
        </div>
        <textarea
          value={trip.notes || ''}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Ajoutez vos notes ici..."
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
        />
      </Card>

      {/* Delete */}
      <button
        onClick={() => {
          onDelete(trip.id);
          onClose();
        }}
        className="w-full py-3 border border-red-200 text-red-500 font-semibold text-sm rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
      >
        <Trash2 size={16} />
        Supprimer ce voyage
      </button>
    </div>
  );
}

// ---- Create Trip Form ----

function CreateTripForm({
  onSubmit,
  onClose,
  prefill,
}: {
  onSubmit: (trip: Omit<VacationProject, 'id'>) => void;
  onClose: () => void;
  prefill?: { destination: string; country: string };
}) {
  const [destination, setDestination] = useState(prefill?.destination || '');
  const [country, setCountry] = useState(prefill?.country || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !country.trim() || !startDate || !endDate || !budget) return;

    const checklist: ChecklistItem[] = DEFAULT_CHECKLIST.map(item => ({
      ...item,
      id: generateId(),
    }));

    onSubmit({
      destination: destination.trim(),
      country: country.trim(),
      startDate,
      endDate,
      budget: parseFloat(budget),
      spent: 0,
      status: 'planning',
      activities: [],
      checklist,
      notes: '',
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Destination */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Ex: Marrakech, Barcelone..."
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          required
          autoFocus
        />
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Ex: Maroc, Espagne..."
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          required
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Départ</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Retour</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            required
          />
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Budget (&euro;)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Ex: 3000"
          min={0}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 active:scale-[0.98] transition-all"
      >
        Créer le voyage
      </button>
    </form>
  );
}

// ---- Explore Tab ----

function ExploreTab({ onCreateFromDest }: { onCreateFromDest: (dest: Destination) => void }) {
  return (
    <div className="px-4 space-y-4">
      {/* Hero card */}
      <Card padding="none" className="overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={24} className="text-indigo-200" />
            <h2 className="text-lg font-bold text-white">Destinations suggérées</h2>
          </div>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Découvrez des destinations idéales pour votre famille. Cliquez sur &quot;Planifier&quot; pour créer un voyage rapidement.
          </p>
        </div>
      </Card>

      {/* Destination grid */}
      <div className="grid grid-cols-1 gap-4">
        {vacationDestinations.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onCreateTrip={onCreateFromDest}
          />
        ))}
      </div>
    </div>
  );
}

// ---- My Trips Tab ----

function TripsTab({
  trips,
  onTripClick,
  onAddClick,
}: {
  trips: VacationProject[];
  onTripClick: (trip: VacationProject) => void;
  onAddClick: () => void;
}) {
  if (trips.length === 0) {
    return (
      <div className="px-4">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane size={36} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun voyage planifié</h3>
          <p className="text-sm text-slate-400 mb-4 max-w-xs mx-auto">
            Commencez par explorer les destinations suggérées ou créez votre propre voyage.
          </p>
          <button
            onClick={onAddClick}
            className="px-5 py-2.5 bg-indigo-500 text-white font-semibold text-sm rounded-xl hover:bg-indigo-600 active:scale-[0.98] transition-all"
          >
            + Nouveau voyage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-3">
      {/* Stats summary */}
      <Card className="flex items-center justify-around py-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">{trips.length}</p>
          <p className="text-xs text-slate-500">Voyages</p>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {trips.filter(t => t.status === 'completed').length}
          </p>
          <p className="text-xs text-slate-500">Terminés</p>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">
            {trips.reduce((sum, t) => sum + t.budget, 0).toLocaleString('fr-FR')}&euro;
          </p>
          <p className="text-xs text-slate-500">Budget total</p>
        </div>
      </Card>

      {/* Trip cards */}
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onClick={() => onTripClick(trip)}
        />
      ))}
    </div>
  );
}

// ---- Main Page ----

export default function VacancesPage() {
  const {
    data,
    loaded,
    addVacation,
    updateVacation,
    deleteVacation,
  } = useAppData();

  const [activeTab, setActiveTab] = useState<MainTab>('explore');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<VacationProject | null>(null);
  const [prefillDest, setPrefillDest] = useState<{ destination: string; country: string } | undefined>(undefined);

  // Keep selected trip in sync with data
  const currentTrip = useMemo(() => {
    if (!selectedTrip) return null;
    return data.vacations.find(v => v.id === selectedTrip.id) || null;
  }, [data.vacations, selectedTrip]);

  const handleCreateFromDest = (dest: Destination) => {
    setPrefillDest({ destination: dest.name, country: dest.country });
    setShowCreateModal(true);
  };

  const handleTripClick = (trip: VacationProject) => {
    setSelectedTrip(trip);
    setShowDetailModal(true);
  };

  const handleCreateTrip = (trip: Omit<VacationProject, 'id'>) => {
    addVacation(trip);
    setActiveTab('trips');
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title="Vacances" showBack />

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'explore' ? (
          <ExploreTab onCreateFromDest={handleCreateFromDest} />
        ) : (
          <TripsTab
            trips={data.vacations}
            onTripClick={handleTripClick}
            onAddClick={() => {
              setPrefillDest(undefined);
              setShowCreateModal(true);
            }}
          />
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          setPrefillDest(undefined);
          setShowCreateModal(true);
        }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-600 active:scale-95 transition-all z-30"
        aria-label="Nouveau voyage"
      >
        <Plus size={24} />
      </button>

      {/* Create Trip Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setPrefillDest(undefined);
        }}
        title="Nouveau voyage"
        size="full"
      >
        <CreateTripForm
          onSubmit={handleCreateTrip}
          onClose={() => {
            setShowCreateModal(false);
            setPrefillDest(undefined);
          }}
          prefill={prefillDest}
        />
      </Modal>

      {/* Trip Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTrip(null);
        }}
        title={currentTrip?.destination || 'Détails du voyage'}
        size="full"
      >
        {currentTrip && (
          <TripDetail
            trip={currentTrip}
            onUpdate={updateVacation}
            onDelete={deleteVacation}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedTrip(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
