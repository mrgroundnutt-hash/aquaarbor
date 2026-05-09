import React from 'react';
import { Sun, Droplets, History, Clock } from 'lucide-react';
import { AppConfig, TimerConfig } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SchedulesProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: Partial<AppConfig>) => void;
}

export const Schedules: React.FC<SchedulesProps> = ({ config, onUpdateConfig }) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <TimerScheduleCard 
        icon={Sun}
        label="Timer 1 (LED)"
        sublabel="Active • Photon Cycle"
        config={config.t1}
        onUpdate={(val) => onUpdateConfig({ t1: { ...config.t1, ...val } })}
        variant="primary"
      />
      
      <TimerScheduleCard 
        icon={Droplets}
        label="Timer 2 (CO2)"
        sublabel="Standby • Atmospheric Cycle"
        config={config.t2}
        onUpdate={(val) => onUpdateConfig({ t2: { ...config.t2, ...val } })}
        variant="secondary"
      />
    </div>
  );
};

const TimerScheduleCard = ({ icon: Icon, label, sublabel, config, onUpdate, variant }: { 
    icon: any, label: string, sublabel: string, config: TimerConfig, onUpdate: (val: any) => void, variant: 'primary' | 'secondary'
}) => {
    const isPrimary = variant === 'primary';
    const accentColor = isPrimary ? "primary" : "secondary";

    return (
        <div className="bg-surface-container-high border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", 
                        isPrimary ? "bg-primary-container/20 border-primary-container/30 text-primary-container" : "bg-secondary-container/20 border-secondary-container/30 text-secondary-container"
                    )}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-xs text-on-surface uppercase tracking-widest">{label}</h3>
                        <p className={cn("font-sans text-[10px] uppercase tracking-widest font-semibold", isPrimary ? "text-primary" : "text-on-surface-variant")}>
                            {sublabel}
                        </p>
                    </div>
                </div>
                

            </div>

            <div className="p-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <TimePicker label="START TIME" value={config.start} icon={Clock} accent={accentColor} onChange={(val) => onUpdate({ start: val })} />
                    <TimePicker label="STOP TIME" value={config.stop} icon={History} accent={accentColor} onChange={(val) => onUpdate({ stop: val })} />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between font-display text-[9px] text-on-surface-variant font-bold tracking-widest">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                    </div>
                    <div className="h-8 bg-surface-container-lowest rounded-md relative border border-white/5 overflow-hidden">
                        {/* Shading for night/inactive */}
                        <div className="absolute left-0 top-0 h-full w-[25%] bg-black/20 border-r border-white/10" />
                        
                        {/* Active range visualization */}
                        <TimelineRange start={config.start} stop={config.stop} accent={accentColor} label={isPrimary ? "16H PHOTOPERIOD" : "12H ENRICHMENT"} />
                        
                        {/* Current time marker (fixed for demo) */}
                        <div className="absolute left-[58%] top-0 h-full w-0.5 bg-error glow-orange z-10" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimePicker = ({ label, value, icon: Icon, accent, onChange }: { label: string, value: string, icon: any, accent: string, onChange: (val: string) => void }) => (
    <div className="bg-surface-container-lowest border border-white/5 px-2 py-3 rounded-lg group focus-within:border-primary/30 transition-all flex flex-col">
        <label className="font-display text-[9px] text-on-surface-variant block mb-1 font-bold tracking-widest uppercase opacity-70">{label}</label>
        <div className="flex items-center gap-1 overflow-hidden">
            <Icon className="text-on-surface-variant flex-shrink-0 opacity-50" size={10} />
            <input 
                type="time" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "bg-transparent border-none p-0 font-display text-base focus:ring-0 w-full min-w-0 font-bold [color-scheme:dark]",
                    accent === 'primary' ? 'text-primary' : 'text-secondary'
                )}
            />
        </div>
    </div>
);

const TimelineRange = ({ start, stop, accent, label }: { start: string, stop: string, accent: string, label: string }) => {
    // Basic calculation for range display
    const hToP = (h: string) => {
        const [hour, min] = h.split(':').map(Number);
        return ((hour + min/60) / 24) * 100;
    };
    
    const left = hToP(start);
    const right = hToP(stop);
    const width = right - left;

    return (
        <div 
            style={{ left: `${left}%`, width: `${width}%` }}
            className={cn("absolute top-0 h-full border-x flex items-center justify-center transition-all",
                accent === 'primary' 
                    ? "bg-primary-container/30 border-primary-container/50 shadow-[0_0_15px_rgba(0,212,170,0.2)]" 
                    : "bg-secondary-container/20 border-secondary-container/40"
            )}
        >
            <span className={cn("font-display text-[9px] font-black tracking-tighter text-center px-1 truncate",
                accent === 'primary' ? "text-primary-container" : "text-secondary-container"
            )}>
                {label}
            </span>
        </div>
    );
};
