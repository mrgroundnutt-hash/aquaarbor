import React from 'react';
import { Router, Wifi, Lock, X, Bolt, Cpu, ChevronDown, Copy, Eye, EyeOff, Network, CheckCircle2, QrCode, Camera } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Html5QrcodeScanner } from 'html5-qrcode';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SetupProps {
  onConnect: (config: any) => void;
  onCancel: () => void;
  isConnecting: boolean;
}

export const Setup: React.FC<SetupProps> = ({ onConnect, onCancel, isConnecting }) => {
  const [host, setHost] = React.useState('9120d007e77b404e87a99e092fac9f2c.s1.eu.hivemq.cloud');
  const [port, setPort] = React.useState('8884');
  const [user, setUser] = React.useState('ashok0393');
  const [pass, setPass] = React.useState('Ash@9393');
  const [ssid, setSsid] = React.useState('');
  const [wifiPass, setWifiPass] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);

  React.useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render((decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.host) setHost(data.host);
          if (data.port) setPort(data.port.toString());
          if (data.user) setUser(data.user);
          if (data.pass) setPass(data.pass);
          if (data.ssid) setSsid(data.ssid);
          if (data.wifiPass) setWifiPass(data.wifiPass);
          
          setIsScanning(false);
          scanner.clear();
        } catch (e) {
          console.error("Invalid QR format", e);
        }
      }, (error) => {
        // console.warn(error);
      });

      return () => {
        scanner.clear();
      };
    }
  }, [isScanning]);

  return (
    <div className="fixed inset-0 z-[100] bg-surface-container-lowest cyber-grid flex flex-col animate-in fade-in zoom-in-95 duration-300">
      <header className="bg-[#0a0f14]/80 backdrop-blur-md text-[#00d4aa] font-display font-bold tracking-tight uppercase border-b border-white/10 flex justify-between items-center px-6 py-4 w-full">
        <div className="flex items-center gap-2">
           <Bolt size={20} className="text-primary-container" />
           <span className="text-xl font-black text-[#00d4aa] drop-shadow-[0_0_8px_rgba(0,212,170,0.5)] font-display tracking-tight uppercase">AquaArbor</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-display font-bold tracking-widest text-slate-400 uppercase">NEW DEVICE</span>
          <button onClick={onCancel} className="hover:opacity-80 transition-all duration-300 ease-in-out">
            <X size={24} />
          </button>
        </div>
      </header>

      <main className="px-container-padding py-8 max-w-md mx-auto space-y-stack-gap overflow-y-auto w-full">
        {/* Hero Status Card */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-surface-container-low p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="font-display text-2xl font-semibold text-primary bloom-teal">Connect Device</h2>
              <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mt-2 flex items-center gap-2">
                <QrCode size={14} className="text-primary" />
                Quick Setup
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <button 
                onClick={() => setIsScanning(!isScanning)}
                className={cn(
                  "p-3 rounded-full transition-all active:scale-95 shadow-lg flex items-center gap-2 font-display text-[10px] font-bold tracking-widest uppercase",
                  isScanning ? "bg-error text-on-error" : "bg-primary text-on-primary ring-4 ring-primary/20"
                )}
              >
                {isScanning ? <X size={20} /> : <Camera size={20} />}
                <span>{isScanning ? "Stop" : "Scan QR"}</span>
              </button>
            </div>
          </div>

          {isScanning && (
            <div className="mb-6 rounded-lg overflow-hidden border border-primary/30 bg-black/40">
              <div id="qr-reader" className="w-full" />
              <p className="text-center py-2 text-[10px] text-primary/70 font-display uppercase tracking-widest bg-primary/5">
                Align QR code within the frame
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-surface-container-high/50 rounded-lg border border-white/5">
              <Network size={18} className="text-primary" />
              <div className="flex-grow">
                <p className="text-[10px] font-display font-bold text-on-surface-variant tracking-widest uppercase">STEP 1: ACCESS POINT</p>
                <p className="font-display text-primary font-bold">AquaArbor_6F92A1</p>
              </div>
              <CheckCircle2 size={16} className="text-primary-container" />
            </div>
          </div>
        </div>

        {/* WiFi Credentials */}
        <section className="space-y-4">
          <h3 className="font-display text-[12px] font-bold text-on-surface-variant flex items-center gap-2 tracking-widest uppercase mb-1">
            NETWORK CREDENTIALS
          </h3>
          <div className="space-y-3">
            <div className="group">
              <label className="text-[10px] font-display font-bold text-outline ml-2 mb-1 block uppercase tracking-widest">WIFI SSID</label>
              <div className="flex items-center bg-surface-container-high border border-outline-variant focus-within:border-primary transition-all rounded-xl px-4 py-3">
                <Wifi size={18} className="text-on-surface-variant mr-3" />
                <input 
                    type="text"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-sans text-sm placeholder:text-outline-variant" 
                    placeholder="Select or Enter Network"
                />
              </div>
            </div>
            <div className="group">
              <label className="text-[10px] font-display font-bold text-outline ml-2 mb-1 block uppercase tracking-widest">NETWORK PASSWORD</label>
              <div className="flex items-center bg-surface-container-high border border-outline-variant focus-within:border-primary transition-all rounded-xl px-4 py-3">
                <Lock size={18} className="text-on-surface-variant mr-3" />
                <input 
                    type={showPass ? "text" : "password"}
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-sans text-sm" 
                    placeholder="Wireless Password"
                />
                <button onClick={() => setShowPass(!showPass)}>
                    {showPass ? <Eye size={18} className="text-outline" /> : <EyeOff size={18} className="text-outline-variant" />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced MQTT */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex justify-between items-center px-2 py-1 text-outline hover:text-on-surface transition-all"
          >
            <h3 className="font-display text-[12px] font-bold flex items-center gap-2 tracking-widest uppercase">
              <Cpu size={16} /> ADVANCED MQTT SETTINGS
            </h3>
            <ChevronDown className={cn("transition-transform duration-300", showAdvanced && "rotate-180")} />
          </button>
          
          {showAdvanced && (
            <div className="grid grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-300">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-display font-bold text-outline px-2 uppercase tracking-tight">HOST</label>
                <input 
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/5 rounded-lg p-2 font-display text-sm text-secondary focus:ring-0" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-display font-bold text-outline px-2 uppercase tracking-tight">PORT</label>
                <input 
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/5 rounded-lg p-2 font-display text-sm text-secondary focus:ring-0" 
                />
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-[10px] font-display font-bold text-outline px-2 uppercase tracking-tight">DEVICE ID / USERNAME</label>
                <div className="bg-surface-container-low border border-white/5 rounded-lg p-3 font-display text-sm text-on-surface-variant flex justify-between items-center group">
                  <input 
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full p-0"
                  />
                  <Copy size={14} className="text-outline cursor-pointer hover:text-primary transition-all" />
                </div>
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-[10px] font-display font-bold text-outline px-2 uppercase tracking-tight">MQTT PASSWORD</label>
                <div className="bg-surface-container-low border border-white/5 rounded-lg p-3 font-display text-sm text-on-surface-variant flex justify-between items-center">
                  <input 
                    type={showPass ? "text" : "password"} 
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-display p-0" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-8 space-y-4">
          <button 
            disabled={isConnecting}
            onClick={() => onConnect({ host, port: parseInt(port), user, pass })}
            className="w-full bg-primary-container hover:bg-primary text-on-primary-container font-display text-[18px] font-bold py-5 rounded-full flex items-center justify-center gap-3 transition-all active:scale-95 glow-teal disabled:opacity-50"
          >
            <Bolt size={20} className="fill-current" />
            {isConnecting ? "CONNECTING..." : "PROVISION DEVICE"}
          </button>
          <button 
             onClick={onCancel}
             className="w-full text-on-surface-variant font-display text-[12px] font-bold py-2 hover:text-on-surface transition-colors uppercase tracking-widest"
          >
            CANCEL SETUP
          </button>
        </div>
      </main>
    </div>
  );
};
