import { QR_LABEL, type QrStatusKey } from "@/lib/qr-status";

const STYLE: Record<QrStatusKey, { badge: string; dot: string }> = {
  ACTIVE: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  UNACTIVATED: { badge: "bg-amber-50 text-amber-700 ring-amber-600/20", dot: "bg-amber-500" },
  DISABLED: { badge: "bg-rose-50 text-rose-700 ring-rose-600/20", dot: "bg-rose-500" },
  ARCHIVED: { badge: "bg-slate-100 text-slate-600 ring-slate-500/20", dot: "bg-slate-400" },
};

export function StatusBadge({ status }: { status: QrStatusKey }) {
  const s = STYLE[status];
  return <span className={`badge ${s.badge}`}><span className={`size-1.5 rounded-full ${s.dot}`} />{QR_LABEL[status]}</span>;
}
