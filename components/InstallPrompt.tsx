import React, { useState, useEffect } from 'react';

const InstallPrompt: React.FC = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    console.log('[InstallPrompt] Iniciando detección de dispositivo...');
    
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
    console.log('[InstallPrompt] ¿Es iOS?', isIOSDevice);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[InstallPrompt] App ya instalada (standalone mode)');
      setInstalled(true);
    }

    // Listen for beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[InstallPrompt] Evento beforeinstallpreneur disparado!', e);
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      console.log('[InstallPrompt] App instalada exitosamente');
      setInstalled(true);
      setShowInstallPrompt(false);
    });

    // Debug: check if service worker is supported
    console.log('[InstallPrompt] ¿Service Worker soportado?', 'serviceWorker' in navigator);

    if (!isIOSDevice) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      console.log('[InstallPrompt] Listener de beforeinstallprompt agregado');
    } else {
      console.log('[InstallPrompt] Dispositivo iOS detectado, saltando listener de Android');
    }

    return () => {
      if (!isIOSDevice) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (installed) {
    return null;
  }

  if (isIOS) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-[#5e72e4]/10 to-[#435ad8]/10 rounded-xl border border-[#5e72e4]/20">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-[#5e72e4] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#32325d]">Instala la app</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Toca <span className="font-bold">Compartir</span> → <span className="font-bold">Agregar a pantalla de inicio</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showInstallPrompt) {
    return (
      <div className="mb-6">
        <button
          onClick={handleInstall}
          className="w-full bg-[#5e72e4] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-[#435ad8] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Instalar App
        </button>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;
