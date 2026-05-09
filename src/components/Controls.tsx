import React from 'react';
import { Thermometer, Snowflake, Flame, Maximize2, ChartLine } from 'lucide-react';
import { DeviceStatus, AppConfig } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ControlsProps {
  status: DeviceStatus | null;
  config: AppConfig;
  onUpdateConfig: (newConfig: Partial<AppConfig>) => void;
}

const mockChartData = [
  { time: '00:00', temp: 24.2 },
  { time: '04:00', temp: 24.0 },
  { time: '08:00', temp: 24.5 },
  { time: '12:00', temp: 25.2 },
  { time: '16:00', temp: 25.8 },
  { time: '20:00', temp: 25.1 },
  { time: 'NOW', temp: 24.8 },
];

export const Controls: React.FC<ControlsProps> = ({ status, config, onUpdateConfig }) => {
  const currentTemp = status?.temp || 24.8;
  const isHeater = config.temp.mode === 0;

  return (
    <div className="flex flex-col gap-stack-gap animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Relay & Mode Hero */}
      <div className="grid grid-cols-2 gap-grid-gutter">
        <div className="bg-surface-container border border-white/10 p-4 rounded-xl flex flex-col justify-between aspect-square relative overflow-hidden">
          <div className="z-10">
            <span className="font-display text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">RELAY STATUS</span>
            <div className="mt-2 flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_#46f1c5] ${status?.relays.temp ? 'bg-primary' : 'bg-outline-variant'}`}></div>
              <span className="font-display text-[18px] font-bold text-primary uppercase">{status?.relays.temp ? 'ACTIVE' : 'IDLE'}</span>
            </div>
          </div>
          <div className="z-10">
            <span className="font-display text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">CURRENT TEMP</span>
            <div className="font-display text-[42px] font-bold text-on-surface leading-tight">{currentTemp.toFixed(1)}°</div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container/10 blur-3xl rounded-full"></div>
        </div>

        <div className="bg-surface-container border border-white/10 p-4 rounded-xl flex flex-col justify-between aspect-square">
          <span className="font-display text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">SYSTEM MODE</span>
          <div className="space-y-3">
            <button 
              onClick={() => onUpdateConfig({ temp: { ...config.temp, mode: 1 } })}
              className={`w-full py-2 rounded font-display text-[12px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                !isHeater ? 'bg-primary-container/10 border border-primary-container text-primary-container' : 'bg-surface-variant/20 border border-white/5 text-slate-500'
              }`}
            >
              <Snowflake size={14} /> CHILLER
            </button>
            <button 
              onClick={() => onUpdateConfig({ temp: { ...config.temp, mode: 0 } })}
              className={`w-full py-2 rounded font-display text-[12px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isHeater ? 'bg-primary-container/10 border border-primary-container text-primary-container' : 'bg-surface-variant/20 border border-white/5 text-slate-500'
              }`}
            >
              <Flame size={14} /> HEATER
            </button>
          </div>
        </div>
      </div>

      {/* Thresholds Card */}
      <section className="bg-surface-container border border-white/10 p-6 rounded-xl space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-display font-semibold text-xl text-on-surface flex items-center gap-2 tracking-tight">
            <Thermometer className="text-primary" size={24} />
            Thresholds
          </h2>
          <span className="font-display text-[10px] text-primary-container bg-primary-container/10 px-2 py-1 rounded font-bold">
            AUTO-LEVELING ON
          </span>
        </div>

        <div className="space-y-8">
          <DualRangeSlider 
            low={config.temp.low}
            high={config.temp.high}
            min={18}
            max={32}
            onChange={(low, high) => onUpdateConfig({ temp: { ...config.temp, low, high } })}
          />
        </div>
      </section>

      {/* 24h Fluctuations */}
      <section className="bg-surface-container border border-white/10 rounded-xl overflow-hidden pb-4">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <span className="font-display text-[12px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
            <ChartLine size={14} /> 24H Fluctuations
          </span>
          <Maximize2 className="text-slate-500" size={16} />
        </div>
        <div className="h-48 w-full pr-4 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="5%" stopColor="#46f1c5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#46f1c5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600, fontFamily: 'Space Grotesk' }}
                interval="preserveStartEnd"
              />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1b2025', border: '1px solid #ffffff14', borderRadius: '8px' }}
                itemStyle={{ color: '#46f1c5', fontFamily: 'Space Grotesk' }}
                labelStyle={{ color: '#bacac2', fontSize: '10px', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#46f1c5" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

const DualRangeSlider = ({ low, high, min, max, onChange }: { low: number, high: number, min: number, max: number, onChange: (low: number, high: number) => void }) => {
  const lowPercent = ((low - min) / (max - min)) * 100;
  const highPercent = ((high - min) / (max - min)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="font-display text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">MIN TEMP</span>
          <span className="font-display text-2xl font-bold text-primary">{low.toFixed(1)}°C</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-display text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">MAX TEMP</span>
          <span className="font-display text-2xl font-bold text-tertiary-container">{high.toFixed(1)}°C</span>
        </div>
      </div>

      <div className="relative h-12 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-1.5 bg-surface-variant rounded-full" />
        
        {/* Active Track Overlay */}
        <div 
          className="absolute h-1.5 bg-primary/40 rounded-full"
          style={{ 
            left: `${lowPercent}%`, 
            width: `${highPercent - lowPercent}%` 
          }}
        />

        {/* Dual Inputs */}
        <input 
          type="range"
          min={min}
          max={max}
          step={0.1}
          value={low}
          onChange={(e) => {
            const val = Math.min(parseFloat(e.target.value), high - 0.5);
            onChange(val, high);
          }}
          className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-surface-container [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(70,241,197,0.5)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-none shadow-none focus:outline-none"
        />
        <input 
          type="range"
          min={min}
          max={max}
          step={0.1}
          value={high}
          onChange={(e) => {
            const val = Math.max(parseFloat(e.target.value), low + 0.5);
            onChange(low, val);
          }}
          className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-tertiary-container [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-surface-container [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,165,135,0.5)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-tertiary-container [&::-moz-range-thumb]:border-none shadow-none focus:outline-none"
        />
      </div>

      <div className="flex justify-between text-[10px] font-display font-medium text-slate-500 uppercase tracking-widest">
        <span>{min}°C</span>
        <span>Ideal Range</span>
        <span>{max}°C</span>
      </div>
    </div>
  );
};

