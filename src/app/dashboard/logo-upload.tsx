"use client";
import { useRef, useState } from "react";
import { IconStore } from "@/components/icons";

const SIZE = 256;
const MAX_FILE = 8 * 1024 * 1024;

// Foto dipotong persegi dari tengah, diperkecil ke 256px, lalu disimpan sebagai JPEG kecil (data URL).
async function resize(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(bmp.width, bmp.height);
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) / 2, s, s, 0, 0, SIZE, SIZE);
  bmp.close();
  return c.toDataURL("image/jpeg", 0.88);
}

export function LogoUpload({ name = "logoUrl", defaultValue = "" }: { name?: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr("");
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setErr("Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.");
    if (file.size > MAX_FILE) return setErr("Ukuran foto terlalu besar. Maksimal 8 MB.");
    setBusy(true);
    try { setValue(await resize(file)); }
    catch { setErr("Foto tidak dapat diproses. Coba foto lain."); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <span className="label">Logo bisnis</span>
      <div className="flex items-center gap-4">
        {value
          ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={value} alt="Logo bisnis" className="size-16 rounded-2xl object-cover shadow-sm ring-1 ring-slate-200" />
          : <span className="grid size-16 place-items-center rounded-2xl bg-slate-100 text-slate-400"><IconStore className="size-7" /></span>}
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn-ghost btn-sm" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? "Memproses…" : value ? "Ganti foto" : "Unggah foto"}
          </button>
          {value && <button type="button" className="btn-ghost btn-sm text-rose-600" onClick={() => { setValue(""); setErr(""); }}>Hapus</button>}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">JPG, PNG, atau WebP. Foto otomatis dipotong persegi.</p>
      {err && <p role="alert" className="mt-1.5 text-xs text-rose-600">{err}</p>}
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onPick} />
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
