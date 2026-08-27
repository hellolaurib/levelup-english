import { useMemo, useState } from 'react';
import { QUESTIONS, DIFFICULTY_LEVEL_LABEL } from './data/questions';
import Hearts from './components/Hearts';
import QuestionCard from './components/QuestionCard';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';

const MAX_LIVES = 3;
const BEST_KEY = 'levelup.bestScore';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQueue() {
  const byDifficulty = [1, 2, 3].map((d) => shuffle(QUESTIONS.filter((q) => q.difficulty === d)));
  return byDifficulty.flat();
}

function readBest() {
  const raw = localStorage.getItem(BEST_KEY);
  return raw ? Number(raw) : 0;
}

export default function App() {
  const [phase, setPhase] = useState('start'); // start | playing | gameover | won
  const [queue, setQueue] = useState(() => buildQueue());
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [justLost, setJustLost] = useState(false);
  const [best, setBest] = useState(readBest);

  const question = queue[qIndex];

  function startGame() {
    setQueue(buildQueue());
    setQIndex(0);
    setLives(MAX_LIVES);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setSelectedIndex(null);
    setPhase('playing');
  }

  function finishGame(won) {
    setBest((prevBest) => {
      const next = Math.max(prevBest, score);
      localStorage.setItem(BEST_KEY, String(next));
      return next;
    });
    setPhase(won ? 'won' : 'gameover');
  }

  function handleSelect(index) {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    const isCorrect = index === question.answerIndex;

    if (isCorrect) {
      const nextStreak = streak + 1;
      const bonus = nextStreak >= 3 ? 5 : 0;
      setScore((s) => s + 10 * question.difficulty + bonus);
      setStreak(nextStreak);
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
      setJustLost(true);
      setTimeout(() => setJustLost(false), 350);
    }

    const livesAfter = isCorrect ? lives : lives - 1;

    setTimeout(() => {
      if (!isCorrect) setLives(livesAfter);

      if (!isCorrect && livesAfter <= 0) {
        finishGame(false);
        return;
      }
      if (qIndex + 1 >= queue.length) {
        finishGame(true);
        return;
      }
      setQIndex((i) => i + 1);
      setSelectedIndex(null);
    }, 900);
  }

  const level = question ? Math.min(question.difficulty, 3) : 1;

  return (
    <div className="min-h-screen bg-bg">
      {phase === 'start' && <StartScreen bestScore={best} onStart={startGame} />}

      {phase === 'playing' && question && (
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-6 py-10">
          <div className="mb-8 flex w-full max-w-xl items-center justify-between">
            <Hearts lives={lives} maxLives={MAX_LIVES} justLost={justLost} />
            <span className="rounded-full bg-accent-bg px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-accent-ink">
              {DIFFICULTY_LEVEL_LABEL[level]}
            </span>
            <span className="text-[15px] font-bold text-ink">{score} pts</span>
          </div>

          <div className="mb-4 w-full max-w-xl">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${(qIndex / queue.length) * 100}%` }}
              />
            </div>
          </div>

          <QuestionCard question={question} selectedIndex={selectedIndex} onSelect={handleSelect} />

          {streak >= 3 && selectedIndex === null && (
            <p className="mt-4 text-sm font-semibold text-accent-ink">🔥 Racha de {streak} — sigue así</p>
          )}
        </div>
      )}

      {(phase === 'gameover' || phase === 'won') && (
        <EndScreen
          won={phase === 'won'}
          score={score}
          best={best}
          correctCount={correctCount}
          total={queue.length}
          onRestart={startGame}
        />
      )}
    </div>
  );
}
