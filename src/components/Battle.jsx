import villager1 from '../assets/tiles/villager1.png';
import villager2 from '../assets/tiles/villager2.png';

const VILLAGERS = [villager1, villager2];

const TYPE_LABEL = {
  term: 'Vocabulario',
  phrase: 'Entrevista',
  fill: 'Completa la oración',
};

export default function Battle({ question, villagerSeed, selectedIndex, onSelect }) {
  const answered = selectedIndex !== null;
  const villager = VILLAGERS[villagerSeed % VILLAGERS.length];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl border-4 border-white bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border bg-accent-bg px-5 py-3">
          <img src={villager} alt="Vecino" className="h-10 w-10 object-contain" style={{ imageRendering: 'pixelated' }} />
          <div>
            <p className="text-[13px] font-bold text-accent-ink">Un vecino te saluda</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent-ink/70">
              {TYPE_LABEL[question.type]}
            </p>
          </div>
        </div>

        <div className="p-5">
          <p className="text-[17px] font-[650] leading-snug text-ink">{question.prompt}</p>

          <div className="mt-4 flex flex-col gap-2">
            {question.options.map((opt, i) => {
              let stateClasses = 'border-border hover:border-ink';
              if (answered) {
                if (i === question.answerIndex) stateClasses = 'border-good bg-good-bg text-good';
                else if (i === selectedIndex) stateClasses = 'border-bad bg-bad-bg text-bad';
                else stateClasses = 'border-border opacity-50';
              }
              return (
                <button
                  key={opt}
                  disabled={answered}
                  onClick={() => onSelect(i)}
                  className={`rounded-xl border px-4 py-3 text-left text-[14.5px] font-medium text-ink transition-colors ${stateClasses}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
