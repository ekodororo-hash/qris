"use client";
import { useState, useTransition } from "react";
import { Spinner } from "@/components/buttons";
import { IconTrash } from "@/components/icons";
import { deleteAuditLog, deleteAuditLogs } from "./actions";

export function DeleteLogButton({ id }: { id: string }) {
  const [ask, setAsk] = useState(false);
  const [pending, start] = useTransition();
  if (!ask) {
    return (
      <button type="button" onClick={() => setAsk(true)} aria-label="Hapus log" title="Hapus log" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">
        <IconTrash className="size-4" />
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <button type="button" disabled={pending} onClick={() => start(async () => { await deleteAuditLog(id); })} className="btn btn-sm !bg-rose-600 hover:!bg-rose-700">
        {pending && <Spinner className="size-3" />}Hapus
      </button>
      <button type="button" disabled={pending} onClick={() => setAsk(false)} className="btn-ghost btn-sm">Batal</button>
    </span>
  );
}

type Filter = { q: string; action: string; from: string; to: string };

export function DeleteAllButton({ filter, count, filtered }: { filter: Filter; count: number; filtered: boolean }) {
  const [ask, setAsk] = useState(false);
  const [pending, start] = useTransition();
  if (count === 0) return null;
  if (!ask) {
    return (
      <button type="button" onClick={() => setAsk(true)} className="btn-ghost btn-sm !text-rose-600">
        <IconTrash className="size-3.5" />{filtered ? `Hapus ${count} log hasil filter` : `Hapus semua log (${count})`}
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm">
      <span className="text-rose-700">{count} log {filtered ? "hasil filter " : ""}akan dihapus permanen. Lanjutkan?</span>
      <button type="button" disabled={pending} onClick={() => start(async () => { await deleteAuditLogs(filter); setAsk(false); })} className="btn btn-sm !bg-rose-600 hover:!bg-rose-700">
        {pending && <Spinner className="size-3" />}{pending ? "Menghapus…" : "Ya, hapus"}
      </button>
      <button type="button" disabled={pending} onClick={() => setAsk(false)} className="btn-ghost btn-sm">Batal</button>
    </div>
  );
}
