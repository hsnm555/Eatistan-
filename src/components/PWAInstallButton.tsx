import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed, don't show prompt button
  if (isInstalled) {
    return (
      <div className={`flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installed App</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback instruction for browsers
      alert(
        'To install Eatistan POS as an app on your device:\n\n• On Chrome/Edge: Click the install icon in the URL address bar or Menu -> Install App.\n• On Android: Tap Menu (three dots) -> Add to Home screen.'
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all cursor-pointer ${className}`}
        title="Install Eatistan POS as an Offline App"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span>{variant === 'full' ? 'Install Offline POS App' : 'Install App'}</span>
      </button>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-neutral-700 text-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-amber-400">Install Eatistan on iPhone / iPad</h3>
            <p className="text-xs text-neutral-300 mt-1">
              Install the POS app to your Home Screen for seamless full-screen offline use:
            </p>

            <div className="mt-4 space-y-3 text-xs bg-black/50 p-3 rounded-2xl border border-neutral-800">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  Tap the <Share className="w-3.5 h-3.5 inline text-blue-400 mx-1" /> <strong>Share</strong> button at the bottom of Safari.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  Scroll down and select <strong>"Add to Home Screen"</strong>.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  Tap <strong>Add</strong>. The app will work instantly even without internet.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
