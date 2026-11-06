/* Decorative, per-project signature graphics. All aria-hidden and painted behind card content. */

// Research Agent: 18 dots that move from a scatter into four ranked rows (5, 5, 4, 4).
const SCATTER = [[8, 40], [96, 6], [40, 58], [120, 30], [70, 18], [18, 12], [104, 60], [56, 4], [30, 30], [84, 44], [124, 8], [4, 62], [62, 34], [110, 18], [44, 14], [92, 26], [22, 50], [76, 62]]
const ROWS = [5, 5, 4, 4]
const RANKED = ROWS.flatMap((n, r) => Array.from({ length: n }, (_, c) => [c * 14, r * 18 + 4]))

export function SortingDots() {
  return (
    <span className="sig sig-dots" aria-hidden="true">
      {SCATTER.map(([x, y], k) => (
        <i
          key={k}
          style={{
            ['--k' as string]: k,
            ['--x0' as string]: `${x}px`, ['--y0' as string]: `${y}px`,
            ['--x1' as string]: `${RANKED[k][0]}px`, ['--y1' as string]: `${RANKED[k][1]}px`,
          }}
        />
      ))}
    </span>
  )
}
