"use client";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./select.module.css";

type Option = { value: string; label: string };
export function TravelSelect({ value, options, onChange, label, id, compact = false }: { value: string; options: Option[]; onChange: (value: string) => void; label: string; id?: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const generatedId = useId();
  const listId = `${id ?? generatedId}-options`;
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = options.find(option => option.value === value) ?? options[0];
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) { if (!root.current?.contains(event.target as Node)) setOpen(false); }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  function show() {
    setOpen(true);
    requestAnimationFrame(() => items.current[Math.max(0, options.findIndex(option => option.value === value))]?.focus());
  }
  return <div ref={root} className={`${styles.select} ${compact ? styles.compact : ""}`} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => {
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
  }}>
    <button ref={trigger} id={id} type="button" className={styles.trigger} aria-label={`${label}: ${selected.label}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined} onClick={() => open ? setOpen(false) : show()} onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); show(); } }}>
      <span>{selected.label}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    {open && <div id={listId} role="listbox" data-lenis-prevent aria-label={label} className={styles.options}>
      {options.map((option, index) => <button key={option.value} ref={element => { items.current[index] = element; }} role="option" tabIndex={-1} aria-selected={value === option.value} type="button" onClick={() => { onChange(option.value); setOpen(false); trigger.current?.focus(); }} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowDown") next = (index + 1) % options.length;
        else if (event.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = options.length - 1;
        else return;
        event.preventDefault(); items.current[next]?.focus();
      }}><span>{option.label}</span>{value === option.value && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}</button>)}
    </div>}
  </div>;
}
