"use client";
import { useState } from "react";
import { IconEye, IconEyeOff } from "./icons";

type Props = { name: string; defaultValue?: string; inputMode?: "numeric"; required?: boolean };

export function PasswordInput({ name, defaultValue, inputMode, required }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input name={name} type={show ? "text" : "password"} required={required} defaultValue={defaultValue} inputMode={inputMode} className="input pr-11" />
      <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Sembunyikan" : "Tampilkan"} aria-pressed={show}
        className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
        {show ? <IconEyeOff className="size-[18px]" /> : <IconEye className="size-[18px]" />}
      </button>
    </div>
  );
}
