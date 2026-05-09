import React from 'react';
import { Thermometer, Timer, FlaskConical, Wifi, CheckCircle2, Sun, Droplets, Router, LayoutGrid, Edit2, Plus } from 'lucide-react';
import { DeviceStatus } from '../types';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  status: DeviceStatus | null;
  devices: { id: string; name: string }[];
  activeDeviceId: string;
  onSelectDevice: (id: string) => void;
  onAddDevice: () => void;
  onToggleLED: () => void;
  onToggleCO2: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  status, 
  devices, 
  activeDeviceId, 
  onSelectDevice, 
  onAddDevice, 
  onToggleLED, 
  onToggleCO2 
}) => {
  const relays = status?.relays || { temp: false, t1: false, t2: false, d1: false, d2: false };
  
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Active Nodes */}
      <section>
        <h2 className="font-display text-[12px] font-semibold text-on-surface-variant uppercase mb-3 ml-1 tracking-widest">
          Active Nodes
        </h2>
        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
          {devices.map((device) => (
            <button
              key={device.id}
              onClick={() => onSelectDevice(device.id)}
              className={cn(
                "flex-shrink-0 glass-card rounded-lg px-4 py-3 flex items-center gap-3 border-l-2 transition-all active:scale-95",
                activeDeviceId === device.id ? "border-l-primary-container bg-primary-container/5" : "border-l-transparent"
              )}
            >
              <div className={cn(
                "w-2 h-2 rounded-full",
                activeDeviceId === device.id ? "bg-primary-container led-glow-teal" : "bg-outline-variant"
              )}></div>
              <div className="flex items-center gap-1.5 transition-colors">
                <span className={cn(
                  "font-display text-sm font-bold tracking-tight",
                  activeDeviceId === device.id ? "text-on-surface" : "text-on-surface-variant"
                )}>
                  {device.name.toUpperCase()}
                </span>
                <Edit2 size={12} className="opacity-30" />
              </div>
            </button>
          ))}

          <button 
            onClick={onAddDevice}
            className="flex-shrink-0 glass-card rounded-lg px-6 py-3 flex items-center justify-center border-dashed border-white/20 hover:border-primary/50 transition-colors"
          >
            <Plus size={18} className="text-on-surface-variant" />
          </button>
        </div>
      </section>

      {/* Live Status Hero */}
      <section className="glass-card rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Thermometer size={64} className="text-primary" strokeWidth={1} />
        </div>
        <div className="flex flex-col gap-1 relative z-10">
          <span className="font-display text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">Live Status</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[42px] font-bold text-primary-container drop-shadow-[0_0_15px_rgba(0,212,170,0.6)]">
              {status?.temp?.toFixed(1) || '--.-'}°C
            </span>
            {relays.temp && (
              <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 px-3 py-1 rounded-full ml-4 self-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(70,241,197,0.8)]"></span>
                <span className="text-[11px] font-bold text-primary tracking-widest uppercase">HEATING</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-primary-container led-glow-teal"></div>
            <span className="font-sans text-[14px] text-primary-container font-medium uppercase tracking-widest">
              Stable Connection
            </span>
          </div>
        </div>
      </section>

      {/* Relay Indicators Grid */}
      <section>
        <h2 className="font-display text-[12px] font-semibold text-on-surface-variant uppercase mb-3 ml-1 tracking-widest">
          Relay Indicators
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <RelayCard icon={Timer} label="Timer 1" isActive={relays.t1} />
          <RelayCard icon={Timer} label="Timer 2" isActive={relays.t2} />
          <RelayCard icon={FlaskConical} label="Dose 1" isActive={relays.d1} />
          <RelayCard icon={Droplets} label="Dose 2" isActive={relays.d2} />
        </div>
      </section>

      {/* Connection Health */}
      <section className="glass-card rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-high w-12 h-12 rounded-lg flex items-center justify-center">
            <Wifi className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="font-display text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">Connection Health</h3>
            <div className="flex gap-4 mt-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">RSSI</span>
                <span className="font-display text-sm text-on-surface">{status?.rssi || '--'} dBm</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-4">
                <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Uptime</span>
                <span className="font-display text-sm text-on-surface">{status?.uptime || '--d --h'}</span>
              </div>
            </div>
          </div>
        </div>
        <CheckCircle2 className="text-primary-container bloom-teal" size={24} />
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="font-display text-[12px] font-semibold text-on-surface-variant uppercase mb-3 ml-1 tracking-widest">
          Quick Actions
        </h2>
        <div className="flex gap-2">
          <button 
                onClick={onToggleLED}
                className={cn(
                  "flex-1 glass-card text-on-surface rounded-xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95 border-primary/20 hover:bg-primary/5 group",
                  relays.t1 && "border-primary/60 bg-primary/10 shadow-[0_0_30px_rgba(70,241,197,0.3)] ring-1 ring-primary/20"
                )}
            >
            <Sun className={cn("transition-all duration-300", relays.t1 ? "text-primary bloom-teal drop-shadow-[0_0_8px_rgba(70,241,197,0.8)] scale-110" : "text-slate-500")} size={24} />
            <span className={cn("font-display text-[10px] font-bold uppercase tracking-widest text-center transition-colors", relays.t1 ? "text-primary" : "text-on-surface-variant")}>
              Toggle LED
            </span>
          </button>
          <button 
                onClick={onToggleCO2}
                className={cn(
                  "flex-1 glass-card text-on-surface rounded-xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95 border-secondary/20 hover:bg-secondary/5 group",
                  relays.t2 && "border-secondary/60 bg-secondary/10 shadow-[0_0_30px_rgba(159,202,255,0.3)] ring-1 ring-secondary/20"
                )}
            >
            <Droplets className={cn("transition-all duration-300", relays.t2 ? "text-secondary bloom-secondary drop-shadow-[0_0_8px_rgba(159,202,255,0.8)] scale-110" : "text-slate-500")} size={24} />
            <span className={cn("font-display text-[10px] font-bold uppercase tracking-widest text-center transition-colors", relays.t2 ? "text-secondary" : "text-on-surface-variant")}>
              Toggle CO2
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

const RelayCard = ({ icon: Icon, label, isActive }: { icon: any, label: string, isActive: boolean }) => (
  <div className={cn(
    "glass-card rounded-xl p-4 flex flex-col justify-between h-28 border-l-4 transition-all duration-300 relative overflow-hidden",
    isActive 
      ? "border-l-primary-container bg-primary-container/5 shadow-[inset_0_0_20px_rgba(70,241,197,0.05)]" 
      : "border-l-surface-variant bg-surface-container/20 opacity-60"
  )}>
    {isActive && (
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-[30px] -mr-8 -mt-8 animate-pulse" />
    )}
    
    <div className="flex justify-between items-start relative z-10">
      <div className={cn(
        "p-2 rounded-lg transition-colors",
        isActive ? "bg-primary/20" : "bg-surface-container-high"
      )}>
        <Icon className={cn("transition-all", isActive ? "text-primary scale-110" : "text-on-surface-variant")} size={16} />
      </div>
      <div className="flex flex-col items-end">
        <div className={cn(
          "w-2 h-2 rounded-full mb-1 transition-all",
          isActive ? "bg-primary-container led-glow-teal animate-indicator-pulse" : "bg-surface-variant"
        )}></div>
        <span className={cn(
          "text-[8px] font-bold tracking-tighter uppercase transition-colors",
          isActive ? "text-primary-container" : "text-on-surface-variant"
        )}>
          {isActive ? 'Active' : 'Idle'}
        </span>
      </div>
    </div>
    <div className="relative z-10">
      <p className="font-display text-[9px] text-on-surface-variant uppercase tracking-widest">{label}</p>
      <p className={cn(
        "font-display text-xl leading-none mt-1 transition-all",
        isActive ? "text-on-surface font-bold drop-shadow-[0_0_8px_rgba(70,241,197,0.4)]" : "text-on-surface-variant"
      )}>{isActive ? 'ON' : 'OFF'}</p>
    </div>
  </div>
);
