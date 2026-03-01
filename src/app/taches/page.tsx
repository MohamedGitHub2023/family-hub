'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Check,
  BookOpen,
  Home,
  ShoppingCart,
  Gamepad2,
  MoreHorizontal,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { useAppData } from '@/hooks/useAppData';
import { Task, ShoppingItem, FamilyMember } from '@/lib/types';
import { shoppingCategories } from '@/data/dubaiInfo';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

// ---- Constants ----

type MainTab = 'tasks' | 'shopping';
type TaskFilter = 'all' | 'homework' | 'chores' | 'activity';

const TASK_FILTER_OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'homework', label: 'Devoirs' },
  { value: 'chores', label: 'Ménage' },
  { value: 'activity', label: 'Activités' },
];

const TASK_CATEGORY_META: Record<Task['category'], { label: string; icon: React.ElementType; badgeVariant: 'info' | 'warning' | 'success' | 'indigo' | 'default' }> = {
  homework: { label: 'Devoirs', icon: BookOpen, badgeVariant: 'info' },
  chores: { label: 'Ménage', icon: Home, badgeVariant: 'warning' },
  shopping: { label: 'Courses', icon: ShoppingCart, badgeVariant: 'success' },
  activity: { label: 'Activité', icon: Gamepad2, badgeVariant: 'indigo' },
  other: { label: 'Autre', icon: MoreHorizontal, badgeVariant: 'default' },
};

const PRIORITY_META: Record<Task['priority'], { label: string; badgeVariant: 'default' | 'warning' | 'danger' }> = {
  low: { label: 'Basse', badgeVariant: 'default' },
  medium: { label: 'Moyenne', badgeVariant: 'warning' },
  high: { label: 'Haute', badgeVariant: 'danger' },
};

const TASK_CATEGORIES_SELECT: { value: Task['category']; label: string }[] = [
  { value: 'homework', label: 'Devoirs' },
  { value: 'chores', label: 'Ménage' },
  { value: 'shopping', label: 'Courses' },
  { value: 'activity', label: 'Activité' },
  { value: 'other', label: 'Autre' },
];

const SHOPPING_CATEGORIES_SELECT = Object.entries(shoppingCategories).map(([key, val]) => ({
  value: key as ShoppingItem['category'],
  label: val.label,
  icon: val.icon,
}));

const UNITS = ['pcs', 'kg', 'g', 'L', 'mL', 'boîte', 'paquet', 'bouteille'];

// ---- Sub-components ----

function TabBar({ activeTab, onTabChange }: { activeTab: MainTab; onTabChange: (t: MainTab) => void }) {
  return (
    <div className="flex bg-white border-b border-slate-100">
      {[
        { key: 'tasks' as MainTab, label: 'Tâches' },
        { key: 'shopping' as MainTab, label: 'Courses' },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors relative ${
            activeTab === tab.key ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          {tab.label}
          {activeTab === tab.key && (
            <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

function TaskFilterBar({ active, onChange }: { active: TaskFilter; onChange: (f: TaskFilter) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
      {TASK_FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            active === opt.value
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function TaskCard({
  task,
  member,
  onToggle,
  onDelete,
}: {
  task: Task;
  member?: FamilyMember;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const catMeta = TASK_CATEGORY_META[task.category];
  const priMeta = PRIORITY_META[task.priority];

  return (
    <Card className={`flex items-start gap-3 transition-opacity ${task.completed ? 'opacity-50' : ''}`}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
          task.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-slate-300 hover:border-indigo-400'
        }`}
        aria-label={task.completed ? 'Marquer comme non fait' : 'Marquer comme fait'}
      >
        {task.completed && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className={`text-sm font-semibold truncate ${
            task.completed ? 'line-through text-slate-400' : 'text-slate-800'
          }`}
        >
          {task.title}
        </h4>
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <Badge variant={catMeta.badgeVariant} size="sm">
            {catMeta.label}
          </Badge>
          <Badge variant={priMeta.badgeVariant} size="sm">
            {priMeta.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          {member && (
            <div className="flex items-center gap-1">
              <span className="text-sm">{member.avatar}</span>
              <span className="text-xs text-slate-500">{member.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <CalendarIcon size={11} />
              <span>{format(new Date(task.dueDate), 'd MMM', { locale: fr })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className="p-1.5 rounded-full hover:bg-red-50 transition-colors shrink-0"
        aria-label="Supprimer"
      >
        <Trash2 size={16} className="text-slate-400 hover:text-red-500" />
      </button>
    </Card>
  );
}

function TaskForm({
  members,
  onSubmit,
  onClose,
}: {
  members: FamilyMember[];
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Task['category']>('other');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [assigneeId, setAssigneeId] = useState(members[0]?.id ?? '');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      assigneeId,
      completed: false,
      dueDate: dueDate || undefined,
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
          placeholder="Nom de la tâche"
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          required
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optionnel)"
          rows={2}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Task['category'])}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white"
        >
          {TASK_CATEGORIES_SELECT.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Assignee */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Assigné à</label>
        <div className="grid grid-cols-2 gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setAssigneeId(m.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                assigneeId === m.id
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

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as Task['priority'][]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                priority === p
                  ? p === 'low'
                    ? 'border-slate-400 bg-slate-50 text-slate-700'
                    : p === 'medium'
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-red-400 bg-red-50 text-red-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {PRIORITY_META[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Due date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date limite</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 active:scale-[0.98] transition-all"
      >
        Ajouter la tâche
      </button>
    </form>
  );
}

// ---- Shopping Sub-components ----

function ShoppingItemRow({
  item,
  onToggle,
  onDelete,
}: {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 py-2.5 transition-opacity ${
        item.checked ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={() => onToggle(item.id)}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
          item.checked
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-300 hover:border-emerald-400'
        }`}
        aria-label={item.checked ? 'Décocher' : 'Cocher'}
      >
        {item.checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <span
          className={`text-sm ${
            item.checked ? 'line-through text-slate-400' : 'text-slate-700'
          }`}
        >
          {item.name}
        </span>
      </div>

      <span className="text-xs text-slate-400 whitespace-nowrap">
        {item.quantity} {item.unit}
      </span>

      <button
        onClick={() => onDelete(item.id)}
        className="p-1 rounded-full hover:bg-red-50 transition-colors shrink-0"
        aria-label="Supprimer"
      >
        <Trash2 size={14} className="text-slate-300 hover:text-red-500" />
      </button>
    </div>
  );
}

function ShoppingForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (item: Omit<ShoppingItem, 'id'>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ShoppingItem['category']>('other');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      category,
      quantity,
      unit,
      checked: false,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l&apos;article</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Tomates, Lait..."
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          required
          autoFocus
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ShoppingItem['category'])}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white"
        >
          {SHOPPING_CATEGORIES_SELECT.map((c) => (
            <option key={c.value} value={c.value}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Quantité</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Unité</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 active:scale-[0.98] transition-all"
      >
        Ajouter l&apos;article
      </button>
    </form>
  );
}

// ---- Tab Contents ----

function TasksTab({
  tasks,
  family,
  onToggle,
  onDelete,
  onAddClick,
}: {
  tasks: Task[];
  family: FamilyMember[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}) {
  const [filter, setFilter] = useState<TaskFilter>('all');

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filter !== 'all') {
      if (filter === 'activity') {
        result = result.filter((t) => t.category === 'activity');
      } else {
        result = result.filter((t) => t.category === filter);
      }
    }

    // Incomplete first, then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return result;
  }, [tasks, filter]);

  const getMember = (id: string) => family.find((m) => m.id === id);

  return (
    <div className="space-y-4">
      <TaskFilterBar active={filter} onChange={setFilter} />

      <div className="px-4 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm">Aucune tâche</p>
            <button
              onClick={onAddClick}
              className="mt-3 text-indigo-500 text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              + Ajouter une tâche
            </button>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              member={getMember(t.assigneeId)}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ShoppingTab({
  items,
  onToggle,
  onDelete,
  onClearChecked,
  onAddClick,
}: {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClearChecked: () => void;
  onAddClick: () => void;
}) {
  const checkedCount = items.filter((i) => i.checked).length;

  // Group items by category
  const grouped = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};
    items.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [items]);

  const categoryOrder = Object.keys(shoppingCategories);

  return (
    <div className="space-y-4">
      {/* Clear checked button */}
      {checkedCount > 0 && (
        <div className="px-4">
          <button
            onClick={onClearChecked}
            className="w-full py-2.5 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
          >
            Supprimer les articles cochés ({checkedCount})
          </button>
        </div>
      )}

      <div className="px-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm">La liste est vide</p>
            <button
              onClick={onAddClick}
              className="mt-3 text-indigo-500 text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              + Ajouter un article
            </button>
          </div>
        ) : (
          categoryOrder
            .filter((cat) => grouped[cat]?.length)
            .map((cat) => {
              const catInfo = shoppingCategories[cat as keyof typeof shoppingCategories];
              return (
                <Card key={cat}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{catInfo.icon}</span>
                    <h4 className="text-sm font-semibold text-slate-700">{catInfo.label}</h4>
                    <span className="text-xs text-slate-400">({grouped[cat].length})</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {grouped[cat].map((item) => (
                      <ShoppingItemRow
                        key={item.id}
                        item={item}
                        onToggle={onToggle}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                </Card>
              );
            })
        )}
      </div>
    </div>
  );
}

// ---- Main Page ----

export default function TachesPage() {
  const {
    data,
    loaded,
    addTask,
    toggleTask,
    deleteTask,
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    clearCheckedItems,
  } = useAppData();

  const [activeTab, setActiveTab] = useState<MainTab>('tasks');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title="Tâches & Listes" showBack />

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'tasks' ? (
          <TasksTab
            tasks={data.tasks}
            family={data.family}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onAddClick={() => setShowTaskModal(true)}
          />
        ) : (
          <ShoppingTab
            items={data.shoppingList}
            onToggle={toggleShoppingItem}
            onDelete={deleteShoppingItem}
            onClearChecked={clearCheckedItems}
            onAddClick={() => setShowShoppingModal(true)}
          />
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          if (activeTab === 'tasks') setShowTaskModal(true);
          else setShowShoppingModal(true);
        }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-600 active:scale-95 transition-all z-30"
        aria-label="Ajouter"
      >
        <Plus size={24} />
      </button>

      {/* Add Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Nouvelle tâche"
        size="full"
      >
        <TaskForm
          members={data.family}
          onSubmit={addTask}
          onClose={() => setShowTaskModal(false)}
        />
      </Modal>

      {/* Add Shopping Item Modal */}
      <Modal
        isOpen={showShoppingModal}
        onClose={() => setShowShoppingModal(false)}
        title="Nouvel article"
        size="md"
      >
        <ShoppingForm
          onSubmit={addShoppingItem}
          onClose={() => setShowShoppingModal(false)}
        />
      </Modal>
    </div>
  );
}
