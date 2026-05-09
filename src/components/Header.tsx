import React from 'react';
import { Leaf } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  connected: boolean;
  user: string;
}

export const Header: React.FC<HeaderProps> = ({ connected, user }) => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  }));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-4 w-full sticky top-0 z-50 bg-[#0a0f14]/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-2">
        <Leaf className="text-primary-container bloom-teal" size={24} />
        <h1 className="text-xl font-black text-primary-container drop-shadow-[0_0_8px_rgba(0,212,170,0.5)] font-display tracking-tight uppercase">
          AQUAARBOR
        </h1>
      </div>
      <div className="text-primary-container font-display font-bold tracking-tight uppercase text-sm flex items-center gap-2">
        <span>{time}</span>
        <span className="text-slate-500">•</span>
        <span className={cn(connected ? "text-primary" : "text-error")}>
          {connected ? "ONLINE" : "OFFLINE"}
        </span>
      </div>
    </header>
  );
};
