import grassTile from '../assets/tiles/grass.png';
import treeRed from '../assets/tiles/tree-red.png';
import treeYellow from '../assets/tiles/tree-yellow.png';
import houseImg from '../assets/tiles/house.png';
import villager1 from '../assets/tiles/villager1.png';
import villager2 from '../assets/tiles/villager2.png';
import playerGif from '../assets/tiles/player.gif';
import { keyOf } from '../game/levels';

const VILLAGERS = [villager1, villager2];

export const CELL = 48;

export default function GameMap({ grid, rows, cols, playerPos, defeatedSet, goalPos, goalUnlocked }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border-4 border-white shadow-[0_10px_30px_-12px_rgba(20,22,28,0.35)]"
      style={{ width: cols * CELL, height: rows * CELL }}
    >
      {grid.map((rowArr, r) =>
        rowArr.map((cell, c) => {
          const isGoal = r === goalPos.row && c === goalPos.col;
          const isWall = cell === '#';
          const isEnemy = cell === 'E';
          const defeated = isEnemy && defeatedSet.has(keyOf(r, c));

          return (
            <div
              key={keyOf(r, c)}
              className="absolute flex items-center justify-center"
              style={{
                left: c * CELL,
                top: r * CELL,
                width: CELL,
                height: CELL,
                backgroundImage: isWall ? undefined : `url(${grassTile})`,
                backgroundSize: 'cover',
                imageRendering: 'pixelated',
              }}
            >
              {isWall && (
                <img
                  src={(r + c) % 2 === 0 ? treeYellow : treeRed}
                  alt=""
                  className="h-full w-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              )}
              {isGoal && (
                <div className="relative flex h-full w-full items-center justify-center">
                  <img
                    src={houseImg}
                    alt="Meta"
                    className="h-[92%] w-[92%] object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  {!goalUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/35">
                      <span className="text-lg">🔒</span>
                    </div>
                  )}
                  {goalUnlocked && (
                    <span className="absolute -top-1 right-0 animate-pulse text-base">✨</span>
                  )}
                </div>
              )}
              {isEnemy && !defeated && (
                <img
                  src={VILLAGERS[(r * 7 + c) % VILLAGERS.length]}
                  alt="Vecino"
                  className="h-[85%] w-[85%] object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              )}
            </div>
          );
        }),
      )}

      <img
        src={playerGif}
        alt="Tú"
        className="pointer-events-none absolute left-0 top-0 object-contain transition-transform duration-150 ease-out"
        style={{
          width: CELL,
          height: CELL,
          transform: `translate(${playerPos.col * CELL}px, ${playerPos.row * CELL}px)`,
          imageRendering: 'pixelated',
          zIndex: 10,
        }}
      />
    </div>
  );
}
