"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Destination } from "../../data/travel";
import { Icon } from "./Primitives";
import styles from "./destinations.module.css";

export function DestinationCard({ destination, saved, onSave, onOpen, index }: {
  destination: Destination; saved: boolean; onSave: () => void; onOpen: () => void; index: number;
}) {
  return (
    <motion.article className={styles.destinationCard} layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .4, delay: Math.min(index, 3) * .06 }}>
      <button className={styles.destinationOpen} onClick={onOpen} aria-label={`Explorar ${destination.name}, ${destination.country}`}>
        <span className={styles.cardImage}>
          <Image src={destination.image} alt={destination.alt} fill sizes="(max-width: 600px) 50vw, (max-width: 1000px) 45vw, 25vw" className={styles.photo} />
          <span className={styles.cardTop}>{destination.days} dias de descobertas</span>
        </span>
        <span className={styles.cardCopy}><small>{destination.country}</small><strong>{destination.name}</strong><span>{destination.tagline}</span></span>
        <span className={styles.cardArrow}></span>
      </button>
      <button className={`${styles.favoriteButton} ${saved ? styles.favoriteActive : ""}`} aria-label={`${saved ? "Remover" : "Salvar"} ${destination.name}${saved ? " dos favoritos" : " nos favoritos"}`} aria-pressed={saved} onClick={onSave}><Icon name="heart" /></button>
    </motion.article>
  );
}
