import React, { useEffect, useState, useRef } from "react";

// Audio file path - handle special characters in filename
const AUDIO_PATH = '/sound/sonido cema loading .mp3';

const FORMULAS = [
  "F = m × a",
  "τ = r × F",
  "Q = mcΔT",
  "μ = 0.35",
  "V = IR",
  "P = ρgh",
  "σ = F/A",
  "E = mc²",
  "KE = ½mv²",
  "PE = mgh",
  "ρ = m/V",
  "a = v²/r",
  "∆TIB = Rb × W × h",
  "CEMA 576 • Class 4",
  "γm = 1.85 t/m³",
  "Q = 3200 tph",
  "Te = T1 - T2",                  // Tensión efectiva de la correa
  "η = (Pout / Pin) × 100%",       // Eficiencia mecánica
  "Fc = m × ω² × r",               // Fuerza centrífuga
  "W = F × d",                     // Trabajo mecánico
  "v = ω × r",                     // Velocidad lineal
  "Q = A × v",                     // Flujo volumétrico
  "θ = tan⁻¹(h / L)",              // Ángulo de inclinación
  "Ff = μ × N",                    // Fricción
  "Pb = (Te × V) / 6120",          // Potencia de la banda (en HP)
  "ρbulk = 1850 kg/m³",            // Densidad aparente del material
  "Class = f(V, W, Abr, Moist)"    // Pseudofórmula tipo CEMA 576
];

interface CEMALoadingProps {
  onFinish: () => void;
}

const CEMALoading: React.FC<CEMALoadingProps> = ({ onFinish }) => {
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const startLoading = () => {
    setStarted(true);
  };

  // Auto-start after a brief delay to satisfy browser autoplay requirements
  useEffect(() => {
    const timer = setTimeout(() => {
      if (startButtonRef.current) {
        startButtonRef.current.click();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started) return;

    // Initialize and play audio
    audioRef.current = new Audio(AUDIO_PATH);
    audioRef.current.volume = 0.5;

    const playAudio = async () => {
      try {
        await audioRef.current?.play();
      } catch (err) {
        console.log('Audio playback failed:', err);
      }
    };
    playAudio();

    // Finish after 4 seconds (matches audio duration)
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onFinish();
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [started, onFinish]);

  // Start screen component (briefly shown, then auto-starts)
  if (!started) {
    return (
      <div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center">
        {/* Central content */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-white text-sm tracking-[0.25em] font-black uppercase">
            CEMA Standard
          </h1>
          <p className="text-gray-500 text-xs tracking-[0.2em] mt-1 uppercase">
            Sistema de Evaluación
          </p>
          
          {/* Start button - auto-clicked after brief delay */}
          <button
            ref={startButtonRef}
            onClick={startLoading}
            className="mt-8 px-6 py-2 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
          >
            Iniciar Sistema
          </button>
        </div>
      </div>
    );
  }

  // Loading screen component - full screen warp tunnel
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Full screen warp tunnel formulas - formulas fly toward viewer */}
      <div className="absolute inset-0 w-full h-full" style={{ perspective: "800px" }}>
        {FORMULAS.map((formula, i) => {
          const delay = i * 0.2;
          const x = Math.random() * 100 - 50; // -50 to 50vw
          const y = Math.random() * 100 - 50; // -50 to 50vh
          const size = Math.random() * 1.5 + 1; // Random size 1rem to 2.5rem (larger for better visibility)
          const startZ = Math.random() * 200 + 100; // Start position: 100-300px (close to camera)
          const endZ = -Math.random() * 1500 + 800; // End position: -700 to -1500px (far from camera)

          return (
            <span
              key={i}
              className="absolute text-white font-mono font-bold"
              style={{
                fontSize: `${size}rem`,
                left: "50%",
                top: "50%",
                textShadow: "0 0 12px rgba(255,255,255,0.8)",
                filter: "blur(0.1px)",
                animation: `warpFormula ${3 + Math.random()}s ease-out ${delay}s infinite`,
                zIndex: Math.floor(startZ),
                opacity: 0,
                ["--x" as string]: `${x}vw`,
                ["--y" as string]: `${y}vh`,
                ["--start-z" as string]: `${startZ}px`,
                ["--end-z" as string]: `${endZ}px`,
                ["--start-scale" as string]: `${2.5 - (startZ / 200) * 0.5}`,
                ["--end-scale" as string]: "0.08",
              }}
            >
              {formula}
            </span>
          );
        })}
      </div>

      {/* Text at the bottom of the screen */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <h1 className="text-white text-sm tracking-[0.25em] font-black uppercase">
          Iniciando Sistema CEMA…
        </h1>
      </div>

      {/* Radial glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />

      <style>{`
        @keyframes warpFormula {
          0% {
            opacity: 1;
            transform: translate3d(var(--x), var(--y), var(--start-z)) scale(var(--start-scale));
          }
          20% {
            opacity: 0.95;
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--x), var(--y), var(--end-z)) scale(var(--end-scale));
          }
        }
      `}</style>
    </div>
  );
};

export default CEMALoading;
