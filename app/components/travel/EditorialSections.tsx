"use client";
import Image from "next/image";
import { faqs, guides, type Guide } from "../../data/travel";
import { Brand, Reveal } from "./Primitives";
import styles from "./editorial.module.css";

export function ExperienceSection({ onPlan }: { onPlan: () => void }) {
  return <section className={styles.experience} id="experiencia" aria-labelledby="experience-title"><div className={`${styles.container} ${styles.experienceInner}`}>
    <Reveal className={styles.collage}><figure className={styles.landscape}><Image src="/images/travel/lisbon.webp" alt="Bonde entre as ruas históricas de Lisboa" fill quality={90} sizes="(max-width:700px) 90vw, 48vw" className={styles.photo} /><figcaption>Lisboa, Portugal</figcaption></figure><figure className={styles.detailPicture}><Image src="/images/travel/coast.webp" alt="Barco na costa de Amalfi" fill quality={90} sizes="(max-width:700px) 35vw, 18vw" className={styles.photo} /><figcaption>Costa de Amalfi, Itália</figcaption></figure></Reveal>
    <Reveal className={styles.experienceCopy}><p className={styles.kicker}>Explorar a região</p><h2 id="experience-title">Conheça o que existe<br />ao redor do seu destino</h2><p>Abra uma cidade ou atração para descobrir o que existe por perto. Restaurantes, cafés, museus e parques aparecem no mapa, com a distância até o lugar que você escolheu.</p><p>Guarde seus favoritos e reúna destinos, duração e interesses em um planejamento que você pode baixar.</p><button className={styles.button} onClick={onPlan}>Organizar minha viagem</button></Reveal>
  </div></section>;
}
export function JournalSection({ onGuide }: { onGuide: (guide: Guide) => void }) {
  return <section className={`${styles.container} ${styles.journal}`} id="caderno" aria-labelledby="journal-title"><div className={styles.journalHeading}><div><p className={styles.kicker}>Caderno de viagem</p><h2 id="journal-title">Antes de fazer as malas</h2><p>Leituras sobre bagagem, tempo e escolhas de viagem.</p></div></div><div className={styles.journalLayout}>{guides.map((guide,i) => <Reveal key={guide.id} delay={i*.12}><button className={styles.guideCard} onClick={() => onGuide(guide)}><span className={styles.guideImage}><Image src={guide.image} alt={guide.alt} fill sizes="(max-width:700px) 90vw, 43vw" className={styles.photo} /></span><span className={styles.guideCopy}><small>{guide.kicker} · {guide.readTime}</small><strong>{guide.title}</strong><span>Ler o caderno</span></span></button></Reveal>)}</div></section>;
}
export function FAQSection() {
  return <section className={`${styles.container} ${styles.faq}`} id="duvidas" aria-labelledby="faq-title"><div className={styles.faqHeading}><p className={styles.kicker}>Informações úteis</p><h2 id="faq-title">Como funciona a descoberta</h2></div><div className={styles.faqItems}>{faqs.map(faq => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}</div></section>;
}
export function TravelCallout({ onPlan }: { onPlan: () => void }) {
  return <section className={styles.cta} id="planejar" aria-labelledby="plan-title"><Image src="/images/travel/ocean-hd.webp" alt="Vista aérea de uma praia, com água transparente e um barco junto à costa" fill sizes="100vw" quality={90} className={styles.oceanPhoto} /><span className={styles.tearTop} aria-hidden="true"/><span className={styles.tearBottom} aria-hidden="true"/><div className={styles.ctaCopy}><p className={styles.kicker}>Seu planejamento</p><h2 id="plan-title">Planeje sua próxima viagem</h2><p>Escolha o destino, a época e a duração. Reúna suas ideias em um planejamento que você pode baixar.</p><button className={styles.lightButton} onClick={onPlan}>Criar meu planejamento</button></div></section>;
}
export function Footer({ onPlan, onSaved }: { onPlan: () => void; onSaved: () => void }) {
  return <footer className={styles.footer}><div className={`${styles.container} ${styles.footerMain}`}><a href="#inicio" aria-label="Travel Agency — voltar ao início"><Brand /></a><nav aria-label="Links do rodapé"><a href="#busca">Pesquisar lugares</a><a href="#caderno">Caderno de viagem</a><button onClick={onSaved}>Meus lugares salvos</button><button onClick={onPlan}>Planejar viagem</button></nav></div><div className={`${styles.container} ${styles.footerBottom}`}><span>© 2026 Travel Agency</span><span>Projeto de portfólio por <a href="https://github.com/GisellyPereira/travel-agency" target="_blank" rel="noreferrer">Giselly Pereira</a></span><a href="#inicio">Voltar ao início</a></div></footer>;
}
