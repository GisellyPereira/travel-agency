"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { destinations, type Destination } from "../../data/travel";
import styles from "./hero.module.css";

const scenes = [
  { id: "bali", image: "/images/travel/hero-bali.webp", position: "50% 55%" },
  { id: "alpes", image: "/images/travel/hero.webp", position: "50% 55%" },
  { id: "kyoto", image: "/images/travel/hero-kyoto.webp", position: "50% 40%" },
  { id: "islandia", image: "/images/travel/hero-iceland.webp", position: "50% 55%" },
].map(scene => ({ ...scene, place: destinations.find(place => place.id === scene.id)! }));

function Chevron({ previous = false }: { previous?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={previous ? "m14 5-7 7 7 7" : "m10 5 7 7-7 7"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Hero({ onExplore, onDestination }: { onExplore: () => void; onDestination: (d: Destination) => void }) {
  const [current, setCurrent] = useState(0);
  const reducedMotion = useReducedMotion();
  const touchStart = useRef<number | null>(null);
  const scene = scenes[current];
  const place = scene.place;
  const introductions: Record<string, string> = {
    bali: "Praias de Nusa Penida, templos e caminhos por Ubud. Encontre lugares para explorar a ilha no seu ritmo.",
    alpes: "O lago Oeschinen, trilhas de montanha e vilarejos suíços. Explore os caminhos entre os lagos e os Alpes.",
    kyoto: "Jardins, casas de chá e as ruas de Higashiyama. Conheça os lugares que guardam a história de Kyoto.",
    islandia: "A cachoeira Skógafoss, paisagens vulcânicas e praias de areia escura. Descubra os caminhos pela Islândia.",
  };
  const previews = [1, 2, 3].map(offset => ({ index: (current + offset) % scenes.length, scene: scenes[(current + offset) % scenes.length] }));
  function move(direction: number) { setCurrent(index => (index + direction + scenes.length) % scenes.length); }

  return <section className={styles.hero} id="inicio" aria-labelledby="hero-title" aria-roledescription="carrossel"
    onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}
    onTouchStart={event => { touchStart.current = event.touches[0].clientX; }}
    onTouchEnd={event => {
      if (touchStart.current === null) return;
      const distance = touchStart.current - event.changedTouches[0].clientX;
      if (Math.abs(distance) > 55) move(distance > 0 ? 1 : -1);
      touchStart.current = null;
    }}>
    <AnimatePresence initial={false}>
      <motion.div key={scene.id} className={styles.heroPhoto} initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .7 }}>
        <Image src={scene.image} alt={place.alt} fill preload={current === 0} sizes="100vw" className={styles.photo} style={{ objectPosition: scene.position }} />
      </motion.div>
    </AnimatePresence>
    <div className={styles.shade} aria-hidden="true" />
    <div className={styles.composition}>
      <div className={styles.heroContent}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={place.id} initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
            <p className={styles.heroEyebrow}>{place.country}</p>
            <h1 id="hero-title">{place.name}</h1>
            <p className={styles.heroDescription}>{introductions[place.id]}</p>
            <button className={styles.discover} onClick={() => onDestination(place)}>Conhecer {place.name}</button>
          </motion.div>
        </AnimatePresence>
        <button className={styles.searchLink} onClick={onExplore}>Pesquisar outro destino</button>
      </div>
      <div className={styles.previews} aria-label="Outros destinos do carrossel">
        {previews.map(({ index, scene: preview }) => <motion.button key={preview.id} type="button" className={styles.preview} aria-label={`Mostrar ${preview.place.name}`} onClick={() => setCurrent(index)} layout transition={{ duration: reducedMotion ? 0 : .45 }}>
          <span className={styles.previewCaption}><strong>{preview.place.name}</strong>{preview.place.country !== preview.place.name && <span>{preview.place.country}</span>}</span>
          <span className={styles.previewFrame}><Image src={preview.place.image} alt="" fill sizes="(max-width: 700px) 43vw, 260px" className={styles.previewPhoto} /></span>
        </motion.button>)}
      </div>
      <div className={styles.controls}>
        <button type="button" aria-label="Destino anterior" onClick={() => move(-1)}><Chevron previous /></button>
        <button type="button" aria-label="Próximo destino" onClick={() => move(1)}><Chevron /></button>
        <p role="status" aria-live="polite" aria-atomic="true">{place.name} · {place.country}</p>
      </div>
    </div>

  </section>;
}
