import React, { useState } from 'react';
import { WifiOff, Wifi, CheckCircle, AlertTriangle, X, HardDrive } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline) {
    return null;
  }

  if (dismissed) {
    return (
      <div className="bg-amber-600 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between border-b border-amber-700">
        <div className="flex items-center gap-1.5 mx-auto">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>Offline Mode Active • Local POS Storage Active (Bills Safe)</span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(false)}
          className="text-white/80 hover:text-white underline text-[10px]"
        >
          Details
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black px-4 py-2.5 shadow-md border-b-2 border-amber-700 relative animate-fadeIn">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <WifiOff className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-xs uppercase tracking-wide bg-black text-amber-400 px-2 py-0.5 rounded-md">
                100% Offline POS Mode
              </span>
              <span className="text-xs font-bold text-black">
                No internet connection detected.
              </span>
            </div>
            <p className="text-[11px] text-amber-950 font-medium mt-0.5 leading-snug">
              Eatistan POS runs completely offline. You can create orders, punch custom items, calculate bills, print thermal receipts, and edit orders. All bills are securely saved locally.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg bg-black/10 hover:bg-black/20 text-black shrink-0 transition-colors cursor-pointer"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ConnectionStatusBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const isOnline = useOnlineStatus();

  return isOnline ? (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold ${className}`}
      title="Connected online • Local storage synced"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>Online POS</span>
    </div>
  ) : (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500 text-amber-300 text-[10px] font-black ${className}`}
      title="Offline Mode Active • Saved locally"
    >
      <WifiOff className="w-3 h-3 text-amber-400" />
      <span>Offline Ready</span>
    </div>
  );
};
