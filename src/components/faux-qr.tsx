// QR dekoratif untuk mockup landing (bukan QR sungguhan).
const N = 15;
function filled(x: number, y: number) {
  const finders = [[0, 0], [8, 0], [0, 8]];
  for (const [fx, fy] of finders) {
    const dx = x - fx, dy = y - fy;
    if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) {
      const edge = dx === 0 || dx === 6 || dy === 0 || dy === 6;
      const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
      return edge || core;
    }
    if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) return false;
  }
  return (x * 7 + y * 13 + x * y) % 5 < 2;
}
export function FauxQr({ className = "" }: { className?: string }) {
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (filled(x, y)) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" rx="0.15" />);
  return <svg viewBox={`0 0 ${N} ${N}`} className={className} fill="currentColor" aria-hidden>{cells}</svg>;
}
