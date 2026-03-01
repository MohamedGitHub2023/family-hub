'use client';

import { Suggestion } from '@/lib/types';

interface SuggestionsProps {
  suggestions: Suggestion[];
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide px-1">
        Suggestions
      </h3>
      <div className="space-y-2 overflow-y-auto max-h-64">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm border-l-4 border-indigo-400"
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{suggestion.icon}</span>
            <p className="text-sm text-slate-700 leading-relaxed">{suggestion.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
