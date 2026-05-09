import mqtt, { MqttClient } from 'mqtt';
import { AppConfig, DeviceStatus } from './types';

export class MQTTService {
  private client: MqttClient | null = null;
  private user: string = '';

  connect(config: { host: string; port: number; user: string; pass: string }, 
          onStatus: (status: DeviceStatus) => void,
          onConfigEcho: (config: AppConfig) => void,
          onConnectionChange: (connected: boolean) => void) {
    
    this.user = config.user;
    const url = `wss://${config.host}:${config.port}/mqtt`;
    
    this.client = mqtt.connect(url, {
      username: config.user,
      password: config.pass,
      clientId: 'web_' + Math.random().toString(16).slice(2, 8),
      reconnectPeriod: 2000,
      connectTimeout: 5000
    });

    this.client.on('connect', () => {
      onConnectionChange(true);
      if (this.client) {
        this.client.subscribe(`aquaarbor/${this.user}/status`);
        this.client.subscribe(`aquaarbor/${this.user}/cfg_echo`);
      }
    });

    this.client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        if (topic === `aquaarbor/${this.user}/status`) {
          onStatus(data);
        } else if (topic === `aquaarbor/${this.user}/cfg_echo`) {
          onConfigEcho(data);
        }
      } catch (e) {
        console.error('MQTT Parse Error:', e);
      }
    });

    this.client.on('close', () => onConnectionChange(false));
    this.client.on('error', (err) => console.error('MQTT Error:', err));
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  sendConfig(config: AppConfig) {
    if (this.client && this.client.connected) {
      this.client.publish(`aquaarbor/${this.user}/config`, JSON.stringify(config), { qos: 1 });
    }
  }

  sendCommand(cmd: any) {
    if (this.client && this.client.connected) {
      this.client.publish(`aquaarbor/${this.user}/cmd`, JSON.stringify(cmd), { qos: 1 });
    }
  }

  requestConfig() {
    this.sendCommand({ cmd: 'get_cfg' });
  }
}

export const mqttService = new MQTTService();
