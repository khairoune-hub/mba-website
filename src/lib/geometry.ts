type Pt = [number, number, number?] // x, y, corner radius

const sub = (a: Pt, b: Pt): [number, number] => [a[0] - b[0], a[1] - b[1]]
const norm = (v: [number, number]): [number, number] => {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}
const f = (n: number) => Math.round(n * 100) / 100

/** SVG path for a polygon (closed) or polyline (open) with rounded corners. */
export function roundedPath(pts: Pt[], closed = true): string {
  const n = pts.length
  let d = ''
  pts.forEach((p, i) => {
    const r = p[2] ?? 0
    const isEnd = !closed && (i === 0 || i === n - 1)
    if (isEnd || r === 0) {
      d += `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`
      return
    }
    const prev = pts[(i - 1 + n) % n]
    const next = pts[(i + 1) % n]
    const v1 = norm(sub(prev, p))
    const v2 = norm(sub(next, p))
    const ang = Math.acos(Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1])))
    const t = r / Math.tan(ang / 2)
    const sweep = v1[0] * v2[1] - v1[1] * v2[0] < 0 ? 1 : 0
    d += `${i ? 'L' : 'M'}${f(p[0] + v1[0] * t)} ${f(p[1] + v1[1] * t)}`
    d += `A${r} ${r} 0 0 ${sweep} ${f(p[0] + v2[0] * t)} ${f(p[1] + v2[1] * t)}`
  })
  return closed ? d + 'Z' : d
}

/** Horizontal run of a 66° slant over a given height. */
export const slantDx = (h: number) => h * Math.tan((24 * Math.PI) / 180)
