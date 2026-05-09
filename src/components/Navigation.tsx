import React from 'react';
import { LayoutGrid, SlidersHorizontal, FlaskConical, CalendarDays } from 'lucide-react';
import { TabState } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavigationProps {
  activeTab: TabState;
  setActiveTab: (tab: TabState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabState; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutGrid },
    { id: 'controls', label: 'CONTROLS', icon: SlidersHorizontal },
    { id: 'dosing', label: 'DOSING', icon: FlaskConical },
    { id: 'schedules', label: 'SCHEDULES', icon: CalendarDays },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 bg-[#111820]/90 backdrop-blur-xl border-t border-white/10 rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-200 active:scale-90",
              isActive ? "text-primary drop-shadow-[0_0_10px_rgba(70,241,197,0.6)]" : "text-slate-500 hover:text-primary/70"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="font-display text-[10px] font-bold tracking-widest mt-1">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
