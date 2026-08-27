// Mapas del juego. Cada fila es un string de igual longitud.
// '#' obstáculo (árbol) · '.' pasto · 'P' inicio del jugador · 'E' vecino · 'G' meta (casita)

export const LEVELS = [
  {
    difficulty: 1,
    label: 'Nivel 1 · Básico',
    rows: [
      '#########',
      '#P......#',
      '#.##.##.#',
      '#E.....E#',
      '#.#####.#',
      '#..E.E.G#',
      '#########',
    ],
  },
  {
    difficulty: 2,
    label: 'Nivel 2 · Intermedio',
    rows: [
      '#########',
      '#P......#',
      '#..E....#',
      '#.##.##.#',
      '#E.E.E.E#',
      '#......G#',
      '#########',
    ],
  },
  {
    difficulty: 3,
    label: 'Nivel 3 · Entrevista',
    rows: [
      '#########',
      '#P......#',
      '#.#.#.#.#',
      '#E..E..E#',
      '#.#.#.#.#',
      '#.E..E.G#',
      '#########',
    ],
  },
];

export function parseLevel(level) {
  const grid = level.rows.map((row) => row.split(''));
  let player = { row: 0, col: 0 };
  const enemies = [];
  let goal = { row: 0, col: 0 };

  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 'P') {
        player = { row: r, col: c };
        grid[r][c] = '.';
      } else if (cell === 'E') {
        enemies.push({ row: r, col: c });
      } else if (cell === 'G') {
        goal = { row: r, col: c };
      }
    });
  });

  return { grid, player, enemies, goal, rows: grid.length, cols: grid[0].length };
}

export function keyOf(row, col) {
  return `${row},${col}`;
}
