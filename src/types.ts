export interface RelayStatus {
  temp: boolean;
  t1: boolean;
  t2: boolean;
  d1: boolean;
  d2: boolean;
}

export interface DeviceStatus {
  temp: number;
  time: string;
  rssi: number;
  relays: RelayStatus;
  uptime?: string;
}

export interface DosingConfig {
  hour: number;
  minute: number;
  volume_ml: number;
  duration: number;
  days: boolean[];
}

export interface TimerConfig {
  manual: boolean;
  start: string;
  stop: string;
}

export interface AppConfig {
  temp: {
    low: number;
    high: number;
    mode: number; // 0: heater, 1: chiller
  };
  t1: TimerConfig;
  t2: TimerConfig;
  dose1: DosingConfig;
  dose2: DosingConfig;
}

export interface DeviceAccount {
  id: string;
  name: string;
  mqttConfig: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}

export type TabState = 'dashboard' | 'controls' | 'dosing' | 'schedules' | 'setup';
