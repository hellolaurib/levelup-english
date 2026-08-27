import { useCallback, useEffect, useRef, useState } from 'react';
import { QUESTIONS } from './data/questions';
import { LEVELS, parseLevel, keyOf } from './game/levels';
import Hearts from './components/Hearts';
import GameMap from './components/GameMap';
import Battle from './components/Battle';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';

const MAX_LIVES = 3;
const BEST_KEY = 'levelup.bestScore';
const MOVE_COOLDOWN = 130;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleQuestion(q) {
  const idx = shuffle(q.options.map((_, i) => i));
  return { ...q, options: idx.map((i) => q.options[i]), answerIndex: idx.indexOf(q.answerIndex) };
}

function buildEnemyQuestions(level, enemies) {
  const pool = shuffle(QUESTIONS.filter((q) => q.difficulty === level.difficulty)).slice(0, enemies.length);
  const map = {};
  enemies.forEach((pos, i) => {
    map[keyOf(pos.row, pos.col)] = pool[i % pool.length];
  });
  return map;
}

function readBest() {
  const raw = localStorage.getItem(BEST_KEY);
  return raw ? Number(raw) : 0;
}

export default function App() {
  const [phase, setPhase] = useState('start'); // start | playing | gameover | won
  const [levelIndex, setLevelIndex] = useState(0);
  const [parsed, setParsed] = useState(() => parseLevel(LEVELS[0]));
  const [enemyQuestions, setEnemyQuestions] = useState({});
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
  const [defeated, setDefeated] = useState(() => new Set());

  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [justLost, setJustLost] = useState(false);
  const [best, setBest] = useState(readBest);
  const [toast, setToast] = useState('');

  const [battle, setBattle] = useState(null); // { key, question }
  const [selectedIndex, setSelectedIndex] = useState(null);

  const lastMove = useRef(0);

  function loadLevel(index, keepStats) {
    const p = parseLevel(LEVELS[index]);
    setParsed(p);
    setPlayerPos(p.player);
    setDefeated(new Set());
    setEnemyQuestions(buildEnemyQuestions(LEVELS[index], p.enemies));
    setLevelIndex(index);
    if (!keepStats) {
      setLives(MAX_LIVES);
      setScore(0);
      setStreak(0);
      setCorrectCount(0);
    }
  }

  function startGame() {
    loadLevel(0, false);
    setBattle(null);
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

  const enemiesRemaining = parsed.enemies.length - defeated.size;
  const goalUnlocked = enemiesRemaining <= 0;

  const tryMove = useCallback(
    (dr, dc) => {
      if (phase !== 'playing' || battle) return;
      const now = Date.now();
      if (now - lastMove.current < MOVE_COOLDOWN) return;
      lastMove.current = now;

      const next = { row: playerPos.row + dr, col: playerPos.col + dc };
      if (next.row < 0 || next.row >= parsed.rows || next.col < 0 || next.col >= parsed.cols) return;
      const cell = parsed.grid[next.row][next.col];
      if (cell === '#') return;

      if (cell === 'E') {
        const key = keyOf(next.row, next.col);
        if (defeated.has(key)) {
          setPlayerPos(next);
          return;
        }
        const base = enemyQuestions[key];
        if (base) setBattle({ key, question: shuffleQuestion(base) });
        return;
      }

      setPlayerPos(next);

      if (cell === 'G') {
        const willUnlock = parsed.enemies.length - defeated.size <= 0;
        if (willUnlock) {
          if (levelIndex + 1 >= LEVELS.length) {
            setTimeout(() => finishGame(true), 150);
          } else {
            setToast('¡Pueblo despejado! Vas al siguiente 🎉');
            setTimeout(() => {
              setToast('');
              loadLevel(levelIndex + 1, true);
            }, 900);
          }
        }
      }
    },
    [phase, battle, playerPos, parsed, defeated, enemyQuestions, levelIndex, score],
  );

  useEffect(() => {
    function onKeyDown(e) {
      const map = {
        ArrowUp: [-1, 0],
        w: [-1, 0],
        W: [-1, 0],
        ArrowDown: [1, 0],
        s: [1, 0],
        S: [1, 0],
        ArrowLeft: [0, -1],
        a: [0, -1],
        A: [0, -1],
        ArrowRight: [0, 1],
        d: [0, 1],
        D: [0, 1],
      };
      const delta = map[e.key];
      if (!delta) return;
      e.preventDefault();
      tryMove(delta[0], delta[1]);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tryMove]);

  function handleBattleSelect(index) {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    const isCorrect = index === battle.question.answerIndex;
    const currentLevel = LEVELS[levelIndex];

    if (isCorrect) {
      const nextStreak = streak + 1;
      const bonus = nextStreak >= 3 ? 5 : 0;
      setScore((s) => s + 10 * currentLevel.difficulty + bonus);
      setStreak(nextStreak);
      setCorrectCount((c) => c + 1);
      setDefeated((prev) => new Set(prev).add(battle.key));
    } else {
      setStreak(0);
      setJustLost(true);
      setTimeout(() => setJustLost(false), 350);
    }

    const livesAfter = isCorrect ? lives : lives - 1;

    setTimeout(() => {
      if (!isCorrect) setLives(livesAfter);
      setBattle(null);
      setSelectedIndex(null);
      if (!isCorrect && livesAfter <= 0) finishGame(false);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-bg">
      {phase === 'start' && <StartScreen bestScore={best} onStart={startGame} />}

      {phase === 'playing' && (
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-4 py-8">
          <div className="mb-4 flex w-full max-w-xl items-center justify-between">
            <Hearts lives={lives} maxLives={MAX_LIVES} justLost={justLost} />
            <span className="rounded-full bg-accent-bg px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-accent-ink">
              {LEVELS[levelIndex].label}
            </span>
            <span className="text-[15px] font-bold text-ink">{score} pts</span>
          </div>

          <p className="mb-3 text-sm text-ink-3">
            {goalUnlocked ? '¡Ve a la casita! 🏡' : `Vecinos por saludar: ${enemiesRemaining}`}
          </p>

          {toast && (
            <p className="mb-3 rounded-full bg-good-bg px-4 py-1.5 text-sm font-semibold text-good">{toast}</p>
          )}

          <GameMap
            grid={parsed.grid}
            rows={parsed.rows}
            cols={parsed.cols}
            playerPos={playerPos}
            defeatedSet={defeated}
            goalPos={parsed.goal}
            goalUnlocked={goalUnlocked}
          />

          <p className="mt-4 text-xs text-ink-4">Flechas o WASD para caminar</p>

          {streak >= 3 && (
            <p className="mt-2 text-sm font-semibold text-accent-ink">🔥 Racha de {streak} — sigue así</p>
          )}
        </div>
      )}

      {battle && (
        <Battle
          question={battle.question}
          villagerSeed={battle.key.split(',').reduce((a, b) => a + Number(b), 0)}
          selectedIndex={selectedIndex}
          onSelect={handleBattleSelect}
        />
      )}

      {(phase === 'gameover' || phase === 'won') && (
        <EndScreen
          won={phase === 'won'}
          score={score}
          best={best}
          correctCount={correctCount}
          total={correctCount + (MAX_LIVES - lives)}
          onRestart={startGame}
        />
      )}
    </div>
  );
}
