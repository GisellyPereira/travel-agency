"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Container } from "../components/Container";
import { Button } from "../components/Button";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <Container className="flex h-20 items-center justify-between">
        <Link href="#" className="flex items-center" aria-label="Início">
          <Image src="/Logo.svg" alt="Logo" width={114} height={32} />
        </Link>

        <nav className="font-volkhov hidden items-center gap-10 text-[15px] text-zinc-700 xl:flex">
          <Link href="#destinations" className="transition-colors hover:text-zinc-900">Destinations</Link>
          <Link href="#hotels" className="transition-colors hover:text-zinc-900">Hotels</Link>
          <Link href="#flights" className="transition-colors hover:text-zinc-900">Flights</Link>
          <Link href="#bookings" className="transition-colors hover:text-zinc-900">Bookings</Link>
          <Link href="#login" className="transition-colors hover:text-zinc-900">Login</Link>
          <Button size="sm" variant="outline" className="h-9 rounded-xl px-5">Sign up</Button>
          <button className="text-zinc-700">EN ▾</button>
        </nav>

        <button
          aria-label="Abrir menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white/70 backdrop-blur xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </Container>

      {open && (
        <div className="border-t border-zinc-200/60 bg-white/90 backdrop-blur xl:hidden">
          <Container className="font-volkhov flex flex-col gap-3 py-4 text-sm">
            <Link href="#destinations" onClick={() => setOpen(false)}>Destinations</Link>
            <Link href="#hotels" onClick={() => setOpen(false)}>Hotels</Link>
            <Link href="#flights" onClick={() => setOpen(false)}>Flights</Link>
            <Link href="#bookings" onClick={() => setOpen(false)}>Bookings</Link>
            <Link href="#login" onClick={() => setOpen(false)}>Login</Link>
            <Button size="sm" variant="outline" className="mt-2 w-full rounded-xl">Sign up</Button>
            <button className="text-left">EN ▾</button>
          </Container>
        </div>
      )}
    </header>
  );
}


