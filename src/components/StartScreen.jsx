import playerGif from '../assets/tiles/player.gif';

export default function StartScreen({ bestScore, onStart }) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <img src={playerGif} alt="" className="mb-4 h-16 w-16" style={{ imageRendering: 'pixelated' }} />
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.09em] text-accent-ink">
        Inglés de diseño · para tus entrevistas
      </p>
      <h1 className="max-w-lg text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[40px]">
        Level Up
      </h1>
      <p className="mt-4 max-w-sm text-[15px] leading-[1.55] text-ink-3">
        Camina por el pueblo con las flechas del teclado. Cada vecino que encuentres te hace una pregunta de
        inglés — acierta y sigues, falla y pierdes una vida. Despeja el pueblo para llegar a la casita.
      </p>
      {bestScore > 0 && (
        <p className="mt-4 rounded-full bg-accent-bg px-4 py-1.5 text-sm font-semibold text-accent-ink">
          Tu mejor puntaje: {bestScore}
        </p>
      )}
      <button
        onClick={onStart}
        className="mt-8 rounded-full bg-ink px-8 py-3.5 text-[15px] font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        Empezar a jugar
      </button>
      <p className="mt-4 text-xs text-ink-4">Usa las flechas ← ↑ → ↓ o WASD para caminar</p>
    </div>
  );
}
