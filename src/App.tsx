import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Controls } from './components/Controls';
import { Dosing } from './components/Dosing';
import { Schedules } from './components/Schedules';
import { Setup } from './components/Setup';
import { TabState, AppConfig, DeviceStatus, DeviceAccount } from './types';
import { mqttService } from './mqttService';

const DEFAULT_CONFIG: AppConfig = {
  temp: { low: 24, high: 25, mode: 0 },
  t1: { manual: false, start: '08:00', stop: '20:00' },
  t2: { manual: false, start: '09:00', stop: '18:00' },
  dose1: { hour: 8, minute: 0, volume_ml: 15, duration: 12, days: [false, true, true, true, true, true, false] },
  dose2: { hour: 18, minute: 0, volume_ml: 10, duration: 8, days: [false, true, true, true, true, true, false] }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabState>('dashboard');
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [devices, setDevices] = useState<DeviceAccount[]>(() => {
    const saved = localStorage.getItem('aqua_devices');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeDeviceId, setActiveDeviceId] = useState<string>(() => {
    return localStorage.getItem('aqua_active_device') || '';
  });
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [showSetup, setShowSetup] = useState(devices.length === 0);

  useEffect(() => {
    if (activeDeviceId) {
      const activeDevice = devices.find(d => d.id === activeDeviceId);
      if (activeDevice) {
        handleConnect(activeDevice.mqttConfig);
      }
    }
  }, [activeDeviceId]);

  const handleConnect = (mqttConfig: any) => {
    setIsConnecting(true);
    mqttService.disconnect(); // Ensure fresh connection
    mqttService.connect(
      mqttConfig,
      (newStatus) => setStatus(newStatus),
      (newConfig) => setConfig(newConfig),
      (isConnected) => {
        setConnected(isConnected);
        setIsConnecting(false);
        if (isConnected) {
          setShowSetup(false);
          // If this is a new device flow, add it to list
          const existing = devices.find(d => d.mqttConfig.user === mqttConfig.user);
          if (!existing) {
             const newDevice: DeviceAccount = {
               id: crypto.randomUUID(),
               name: mqttConfig.user,
               mqttConfig
             };
             const updatedDevices = [...devices, newDevice];
             setDevices(updatedDevices);
             setActiveDeviceId(newDevice.id);
             localStorage.setItem('aqua_devices', JSON.stringify(updatedDevices));
             localStorage.setItem('aqua_active_device', newDevice.id);
          }
          mqttService.requestConfig();
        }
      }
    );
  };

  const handleSelectDevice = (id: string) => {
    setActiveDeviceId(id);
    localStorage.setItem('aqua_active_device', id);
  };

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    mqttService.sendConfig(updated);
  };

  const toggleRelay = (relay: 't1' | 't2') => {
    const newConfig = { ...config[relay], manual: !config[relay].manual };
    updateConfig({ [relay]: newConfig });
  };

  const activeDevice = devices.find(d => d.id === activeDeviceId);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden -z-10">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '24px 24px' 
          }}
        ></div>
      </div>

      <Header connected={connected} user={activeDevice?.name || ''} />

      <main className="flex-1 px-4 py-6 mb-24 overflow-y-auto w-full max-w-lg mx-auto">
        {activeTab === 'dashboard' && (
          <Dashboard 
            status={status} 
            devices={devices}
            activeDeviceId={activeDeviceId}
            onSelectDevice={handleSelectDevice}
            onAddDevice={() => setShowSetup(true)}
            onToggleLED={() => toggleRelay('t1')}
            onToggleCO2={() => toggleRelay('t2')}
          />
        )}
        {activeTab === 'controls' && (
          <Controls 
            status={status} 
            config={config} 
            onUpdateConfig={updateConfig} 
          />
        )}
        {activeTab === 'dosing' && (
          <Dosing 
            config={config} 
            onUpdateConfig={updateConfig}
            onStartCalibration={(pump, duration) => mqttService.sendCommand({ cmd: 'cal_run', pump, duration })}
          />
        )}
        {activeTab === 'schedules' && (
          <Schedules 
            config={config} 
            onUpdateConfig={updateConfig} 
          />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {showSetup && (
        <Setup 
          onConnect={handleConnect} 
          onCancel={() => activeDevice ? setShowSetup(false) : null}
          isConnecting={isConnecting}
        />
      )}
    </div>
  );
}
