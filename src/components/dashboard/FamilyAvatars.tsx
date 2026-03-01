'use client';

import { FamilyMember } from '@/lib/types';

interface FamilyAvatarsProps {
  members: FamilyMember[];
}

export default function FamilyAvatars({ members }: FamilyAvatarsProps) {
  return (
    <div className="overflow-x-auto scrollbar-none -mx-1">
      <div className="flex gap-4 px-1 py-1">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center gap-1.5 min-w-[4.5rem]">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-white shadow-sm"
              style={{ border: `3px solid ${member.color}` }}
            >
              {member.avatar}
            </div>
            <span className="text-xs font-medium text-slate-600 truncate max-w-[4.5rem] text-center">
              {member.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
