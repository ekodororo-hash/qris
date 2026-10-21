// QR dekoratif untuk mockup landing (bukan QR sungguhan): titik bulat, mata berwarna Google, logo ReviewQR di tengah.
const N = 33;
const LOGO_CLEAR = 9; // kotak tengah yang dikosongkan untuk logo (jumlah modul)
const LO = (N - LOGO_CLEAR) / 2;
const EYES: [number, number, string][] = [[0, 0, "#4285F4"], [N - 7, 0, "#EA4335"], [0, N - 7, "#34A853"]];

function inEye(x: number, y: number) {
  return (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
}
function filled(x: number, y: number) {
  if (inEye(x, y)) return false;
  if (x >= LO && x < LO + LOGO_CLEAR && y >= LO && y < LO + LOGO_CLEAR) return false;
  if (y === 6) return x % 2 === 0;
  if (x === 6) return y % 2 === 0;
  const h = (Math.imul(x + 1, 374761393) + Math.imul(y + 1, 668265263)) ^ Math.imul((x + 3) * (y + 7), 2246822519);
  return ((h >>> 9) % 100) < 48;
}

const DOTS: [number, number][] = [];
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (filled(x, y)) DOTS.push([x, y]);

const RING = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
const STAR = "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

export function FauxQr({ className = "" }: { className?: string }) {
  const s = 7.8;
  const o = (N - s) / 2;
  return (
    <svg viewBox={`0 0 ${N} ${N}`} className={className} aria-hidden>
      <g fill="currentColor">
        {DOTS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r="0.47" />)}
      </g>
      {EYES.map(([x, y, c]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 0.5} y={y + 0.5} width="6" height="6" rx="1.9" fill="none" stroke={c} strokeWidth="1" />
          <rect x={x + 2} y={y + 2} width="3" height="3" rx="1" fill={c} />
        </g>
      ))}
      <g transform={`translate(${o} ${o}) scale(${s / 52})`}>
        <rect x="1.5" y="1.5" width="49" height="49" rx="13" fill="#fff" />
        {RING.map((c, i) => (
          <rect key={c} x="1.5" y="1.5" width="49" height="49" rx="13" fill="none" stroke={c} strokeWidth="3" strokeDasharray="43.42 130.26" strokeDashoffset={-43.42 * i} />
        ))}
        <g transform="translate(12.8 12.8) scale(1.1)" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="5" height="5" x="3" y="3" rx="1" />
          <rect width="5" height="5" x="16" y="3" rx="1" />
          <rect width="5" height="5" x="3" y="16" rx="1" />
          <path d="M12 3h.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M16 12h1M21 12v.01M12 16v.01M12 21v-1" />
          <path d={STAR} transform="translate(12.4 12.4) scale(.5)" fill="#111" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
