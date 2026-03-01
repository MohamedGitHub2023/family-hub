'use client';

import Link from 'next/link';
import { PlusCircle, ShoppingCart, CalendarPlus, FolderKanban } from 'lucide-react';

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

const actions: QuickAction[] = [
  {
    label: 'Nouvelle tache',
    href: '/taches',
    icon: PlusCircle,
    color: 'text-indigo-500',
  },
  {
    label: 'Liste de courses',
    href: '/taches?tab=shopping',
    icon: ShoppingCart,
    color: 'text-emerald-500',
  },
  {
    label: 'Ajouter evenement',
    href: '/planning',
    icon: CalendarPlus,
    color: 'text-blue-500',
  },
  {
    label: 'Mes Projets',
    href: '/projets',
    icon: FolderKanban,
    color: 'text-amber-500',
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-colors hover:bg-indigo-50 active:scale-[0.98]"
          >
            <Icon size={22} className={action.color} />
            <span className="text-sm font-medium text-slate-700">
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
