"use client";

import { useEffect, useRef, useState } from "react";
import { Brand, Icon } from "./Primitives";
import styles from "./header.module.css";

export function Header({
  onPlan,
  onSaved,
  count,
}: {
  onPlan: () => void;
  onSaved: () => void;
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  useEffect(() => {
    const updateHeader = () => setOverHero(window.scrollY < 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function close(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuRef.current?.focus();
      }
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className={`${styles.header} ${overHero && !open ? styles.overHero : ""}`}>
      <div className={styles.headerInner}>
        <a href="#inicio" aria-label="Travel Agency — início" className={styles.logo}>
          <Brand />

        </a>
        <nav
          id="main-navigation"
          aria-label="Navegação principal"
          className={`${styles.navigation} ${open ? styles.navigationOpen : ""}`}
        >
          {[
            { href: "#busca", text: "Pesquisar" },
            { href: "#destinos", text: "Destinos" },
            { href: "#experiencia", text: "Nosso jeito" },
            { href: "#caderno", text: "Caderno de viagem" },
          ].map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.text}
            </a>
          ))}
          <button
            className={`${styles.button} ${styles.mobilePlan}`}
            onClick={() => {
              setOpen(false);
              onPlan();
            }}
          >
            Planejar minha viagem
          </button>
        </nav>
        <div className={styles.headerActions}>
          <button
            className={styles.saveHeader}
            aria-label={`Ver destinos salvos${count ? `, ${count} ${count === 1 ? "destino" : "destinos"}` : ""}`}
            onClick={() => {
              setOpen(false);
              onSaved();
            }}
          >
            <Icon name="heart" />
            {count > 0 && <span>{count}</span>}
          </button>
          <button
            className={`${styles.button} ${styles.headerPlan}`}
            onClick={onPlan}
          >
            Vamos viajar
          </button>
          <button
            ref={menuRef}
            className={styles.menuToggle}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
