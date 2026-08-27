export default function EndScreen({ won, score, best, correctCount, total, onRestart }) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 text-5xl">{won ? '🏆' : '💛'}</span>
      <h1 className="text-[28px] font-bold tracking-[-0.02em] text-ink sm:text-[34px]">
        {won ? '¡Completaste el juego!' : 'Se acabaron las vidas'}
      </h1>
      <p className="mt-3 max-w-sm text-[15px] leading-[1.55] text-ink-3">
        {won
          ? 'Respondiste todas las preguntas. Tu inglés de entrevista está más listo de lo que crees.'
          : 'Cada error aquí es una palabra que ahora vas a recordar mejor. Inténtalo de nuevo.'}
      </p>

      <div className="mt-6 flex gap-3">
        <div className="rounded-xl border border-border bg-white px-6 py-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">Puntaje</p>
          <p className="mt-1 text-[22px] font-bold text-ink">{score}</p>
        </div>
        <div className="rounded-xl border border-border bg-white px-6 py-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">Correctas</p>
          <p className="mt-1 text-[22px] font-bold text-ink">
            {correctCount}/{total}
          </p>
        </div>
        <div className="rounded-xl border border-accent-border bg-accent-bg px-6 py-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-accent-ink">Mejor</p>
          <p className="mt-1 text-[22px] font-bold text-accent-ink">{best}</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 rounded-full bg-ink px-8 py-3.5 text-[15px] font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        Jugar de nuevo
      </button>
    </div>
  );
}
