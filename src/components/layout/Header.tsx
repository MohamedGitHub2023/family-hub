"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  rightAction,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Retour"
            >
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-slate-900 truncate">
            {title}
          </h1>
        </div>

        {/* Right section */}
        {rightAction && <div className="flex items-center">{rightAction}</div>}
      </div>
    </header>
  );
}
