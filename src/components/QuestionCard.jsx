const TYPE_LABEL = {
  term: 'Vocabulario',
  phrase: 'Entrevista',
  fill: 'Completa la oración',
};

export default function QuestionCard({ question, selectedIndex, onSelect }) {
  const answered = selectedIndex !== null;

  return (
    <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-6 sm:p-8">
      <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.08em] text-accent-ink">
        {TYPE_LABEL[question.type]}
      </p>
      <p className="text-[19px] font-[650] leading-snug text-ink sm:text-[21px]">{question.prompt}</p>

      <div className="mt-6 flex flex-col gap-2.5">
        {question.options.map((opt, i) => {
          let stateClasses = 'border-border hover:border-ink';
          if (answered) {
            if (i === question.answerIndex) {
              stateClasses = 'border-good bg-good-bg text-good';
            } else if (i === selectedIndex) {
              stateClasses = 'border-bad bg-bad-bg text-bad';
            } else {
              stateClasses = 'border-border opacity-50';
            }
          }
          return (
            <button
              key={opt}
              disabled={answered}
              onClick={() => onSelect(i)}
              className={`rounded-xl border px-4 py-3.5 text-left text-[15px] font-medium text-ink transition-colors ${stateClasses}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
