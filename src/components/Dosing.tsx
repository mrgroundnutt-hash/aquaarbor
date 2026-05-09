import React from 'react';
import { Droplets, Edit2, Timer, Settings2, Play, Save, Activity } from 'lucide-react';
import { AppConfig, DosingConfig } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DosingProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: Partial<AppConfig>) => void;
  onStartCalibration: (pump: number, duration: number) => void;
}

export const Dosing: React.FC<DosingProps> = ({ config, onUpdateConfig, onStartCalibration }) => {
  const [calPump, setCalPump] = React.useState(1);
  const [calDuration, setCalDuration] = React.useState(10);
  const [measuredMl, setMeasuredMl] = React.useState('');
  const [isCalibrating, setIsCalibrating] = React.useState(false);

  const handleCalibrationStart = () => {
    setIsCalibrating(true);
    onStartCalibration(calPump, calDuration);
    // Mimic timer for UI
    setTimeout(() => setIsCalibrating(false), calDuration * 1000);
  };

  const handleSaveVolume = () => {
      // Logic for saving and calculating flow rate would go here
      // For now we just reset
      setMeasuredMl('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="space-y-4">
        <DoseConfigCard 
          id="1" 
          config={config.dose1} 
          onUpdate={(val) => onUpdateConfig({ dose1: { ...config.dose1, ...val } })}
        />
        <DoseConfigCard 
          id="2" 
          config={config.dose2} 
          onUpdate={(val) => onUpdateConfig({ dose2: { ...config.dose2, ...val } })}
          variant="secondary"
        />
      </div>

      <div className="mb-4 mt-2">
        <h2 className="font-display font-semibold text-2xl text-secondary tracking-tight">CALIBRATION</h2>
      </div>

      <section className="glass-card rounded-xl overflow-hidden mb-2">
        <div className="bg-secondary/10 p-4 border-b border-white/5 flex items-center gap-3">
          <Settings2 className="text-secondary" size={20} />
          <span className="font-display font-bold text-[12px] text-secondary tracking-widest uppercase">PUMP CALIBRATION WIZARD</span>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Step 1 */}
          <CalibrationStep number={1} title="Select Pump" isActive={!isCalibrating}>
            <div className="flex gap-2">
              <button 
                onClick={() => setCalPump(1)}
                className={cn(
                  "px-4 py-2 rounded-lg font-display text-[10px] font-bold tracking-widest border transition-all",
                  calPump === 1 ? "bg-secondary/10 border-secondary text-secondary" : "bg-surface-container-low border-outline-variant text-on-surface-variant"
                )}
              >
                PUMP A (MAIN)
              </button>
              <button 
                onClick={() => setCalPump(2)}
                className={cn(
                    "px-4 py-2 rounded-lg font-display text-[10px] font-bold tracking-widest border transition-all",
                    calPump === 2 ? "bg-secondary/10 border-secondary text-secondary" : "bg-surface-container-low border-outline-variant text-on-surface-variant"
                  )}
              >
                PUMP B (AUX)
              </button>
            </div>
          </CalibrationStep>

          {/* Step 2 */}
          <CalibrationStep number={2} title="Run 10s Test" isActive={isCalibrating}>
            <p className="text-xs text-on-surface-variant mb-4">Place a measuring cup under the outlet and press start.</p>
            <div className="bg-surface-container-low rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className={cn("text-[10px] font-bold", isCalibrating ? "text-secondary" : "text-outline")}>
                  {isCalibrating ? "TEST IN PROGRESS..." : "READY TO TEST"}
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant">10s</span>
              </div>
              <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                {isCalibrating && <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 10, ease: "linear" }}
                   className="h-full bg-secondary" 
                />}
              </div>
              <button 
                onClick={handleCalibrationStart}
                disabled={isCalibrating}
                className="w-full mt-4 py-3 rounded-lg bg-secondary/20 border border-secondary/50 text-secondary font-display font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                <Play size={14} /> {isCalibrating ? "PUMPING..." : "START TEST"}
              </button>
            </div>
          </CalibrationStep>

          {/* Step 3 */}
          <CalibrationStep number={3} title="Enter Volume" isActive={!isCalibrating && measuredMl !== ''}>
            <div className="flex gap-3">
              <div className="flex-grow bg-surface-container-high rounded-lg p-3 border border-white/5 flex items-center justify-between">
                <input 
                  type="number"
                  value={measuredMl}
                  onChange={(e) => setMeasuredMl(e.target.value)}
                  className="bg-transparent border-none p-0 w-full font-display text-sm focus:ring-0 text-on-surface placeholder:text-outline" 
                  placeholder="Measured mL..."
                />
              </div>
              <button 
                onClick={handleSaveVolume}
                className="px-6 py-3 bg-secondary rounded-lg text-on-secondary font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                SAVE
              </button>
            </div>
          </CalibrationStep>
        </div>
      </section>

      {/* Technical Data Strip */}
      <div className="glass-card rounded-lg p-4 flex items-center justify-between border-l-4 border-l-primary mb-24">
        <div className="flex items-center gap-3">
          <Activity className="text-primary" size={20} />
          <div>
            <span className="font-display font-bold text-[10px] block text-on-surface-variant tracking-widest uppercase">CURRENT FLOW RATE</span>
            <span className="font-display text-sm font-semibold tracking-tighter">1.25 ML/SEC</span>
          </div>
        </div>
        <div className="h-2 w-2 rounded-full bg-primary led-glow-teal"></div>
      </div>
    </div>
  );
};

const DoseConfigCard = ({ id, config, onUpdate, variant = "primary" }: { id: string, config: DosingConfig, onUpdate: (val: any) => void, variant?: "primary" | "secondary" }) => {
    const daysArr = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const isPrimary = variant === "primary";

    return (
        <section className={cn("glass-card rounded-xl p-5", isPrimary ? "glow-teal border-primary/20 shadow-[0_0_15px_rgba(0,212,170,0.1)]" : "border-white/10 opacity-60")}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className={cn("font-display font-bold text-[10px] tracking-[0.2em] mb-1 block", isPrimary ? "text-primary" : "text-on-surface-variant")}>
                        CONFIGURATION
                    </span>
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <h3 className="font-display font-semibold text-xl text-on-surface">Dose {id}</h3>
                        <Edit2 size={16} className="text-on-surface-variant opacity-50 group-hover:opacity-100 transition-all" />
                    </div>
                </div>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", isPrimary ? "bg-primary/10 border-primary/30 text-primary" : "bg-surface-variant border-surface-variant/30 text-on-surface-variant")}>
                    <Droplets size={20} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                    <label className="font-display text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">TRIGGER TIME</label>
                    <div className="bg-surface-container-high rounded-lg p-3 border border-white/5 flex items-center justify-between">
                        <input 
                            type="time" 
                            className="bg-transparent border-none p-0 w-full font-display text-sm focus:ring-0 text-on-surface"
                            value={`${String(config.hour).padStart(2,'0')}:${String(config.minute).padStart(2,'0')}`}
                            onChange={(e) => {
                                const [h, m] = e.target.value.split(':');
                                onUpdate({ hour: parseInt(h), minute: parseInt(m) });
                            }}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="font-display text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">VOLUME (ML)</label>
                    <div className="bg-surface-container-high rounded-lg p-3 border border-white/5 flex items-center justify-between">
                        <input 
                            type="number" 
                            className="bg-transparent border-none p-0 w-16 font-display text-sm focus:ring-0 text-on-surface"
                            value={config.volume_ml}
                            onChange={(e) => onUpdate({ volume_ml: parseFloat(e.target.value) })}
                        />
                        <span className="text-primary text-[10px] font-bold">ML</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="font-display text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">ACTIVE DAYS</label>
                <div className="flex justify-between gap-1">
                    {daysArr.map((day, i) => (
                        <button 
                            key={i}
                            onClick={() => {
                                const newDays = [...config.days];
                                newDays[i] = !newDays[i];
                                onUpdate({ days: newDays });
                            }}
                            className={cn(
                                "w-8 h-8 rounded-full border text-[10px] font-bold transition-all",
                                config.days[i] 
                                    ? "bg-primary border-primary text-on-primary" 
                                    : "border-outline-variant text-on-surface-variant"
                            )}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                <Timer size={16} className="text-secondary" />
                <span className="font-sans text-xs text-on-surface-variant">
                    Estimated run duration: <span className="text-secondary font-bold">{config.duration}s</span>
                </span>
            </div>
        </section>
    );
};

const CalibrationStep = ({ number, title, children, isActive }: { number: number, title: string, children: React.ReactNode, isActive: boolean }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black z-10 border transition-all",
                isActive ? "bg-secondary text-on-secondary border-secondary shadow-[0_0_10px_rgba(159,202,255,0.4)]" : "bg-surface-container-highest border-outline-variant text-on-surface-variant"
            )}>
                {number}
            </div>
            <div className="w-[px] h-full bg-outline-variant/30 mt-2"></div>
        </div>
        <div className="pb-4 w-full">
            <h4 className={cn("font-display font-bold text-sm mb-2 uppercase tracking-widest", isActive ? "text-on-surface" : "text-on-surface-variant/50")}>
                {title}
            </h4>
            {children}
        </div>
    </div>
);
