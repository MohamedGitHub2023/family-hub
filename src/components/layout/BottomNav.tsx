"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  CheckSquare,
  Plane,
  Menu,
  FolderKanban,
  Settings,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Planning", href: "/planning", icon: Calendar },
  { label: "Taches", href: "/taches", icon: CheckSquare },
  { label: "Vacances", href: "/vacations", icon: Plane },
];

const subMenuItems: NavItem[] = [
  { label: "Projets", href: "/projets", icon: FolderKanban },
  { label: "Parametres", href: "/settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isSubMenuActive = subMenuItems.some((item) => isActive(item.href));

  return (
    <>
      {/* Backdrop for sub-menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto relative" ref={menuRef}>
          {/* Sub-menu popover */}
          {isMenuOpen && (
            <div className="absolute bottom-18 right-3 bg-white rounded-2xl shadow-lg border border-slate-100 py-2 min-w-48 animate-slide-up">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-700">
                  Plus d&apos;options
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              </div>
              {subMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      active
                        ? "text-indigo-500 bg-indigo-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Bottom navigation bar */}
          <div className="bg-white border-t border-slate-200 h-16 flex items-center justify-around px-2 safe-bottom">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 py-1 px-3 min-w-[3.5rem] transition-colors ${
                    active ? "text-indigo-500" : "text-slate-400"
                  }`}
                >
                  <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                  <span
                    className={`text-[10px] leading-none ${
                      active ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Plus / Menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 min-w-[3.5rem] transition-colors ${
                isMenuOpen || isSubMenuActive
                  ? "text-indigo-500"
                  : "text-slate-400"
              }`}
              aria-label="Plus d'options"
              aria-expanded={isMenuOpen}
            >
              <Menu
                size={22}
                strokeWidth={isMenuOpen || isSubMenuActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] leading-none ${
                  isMenuOpen || isSubMenuActive
                    ? "font-semibold"
                    : "font-medium"
                }`}
              >
                Plus
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
