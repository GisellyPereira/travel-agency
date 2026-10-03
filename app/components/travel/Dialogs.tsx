"use client";

import { lockPageScroll } from "../SmoothScroll";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { destinations, type Destination, type Guide } from "../../data/travel";
import { Icon } from "./Primitives";
import styles from "./dialogs.module.css";
import { DestinationInsights } from "./DestinationInsights";
import type { ExplorerPlace } from "../../lib/explore-types";

type TravelDialogsProps = {
  destination: Destination | null;
  guide: Guide | null;
  plannerOpen: boolean;
  initialDestinationId?: string;
  initialMonth?: string;
  explorerPlaces?: ExplorerPlace[];
  initialExplorerPlace?: ExplorerPlace | null;
  onClose: () => void;
  onPlan: (destinationId?: string) => void;
};

export function Modal({
  open,
  viewKey,
  onClose,
  children,
}: {
  open: boolean;
  viewKey: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const unlockScroll = lockPageScroll();
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
    }
    return () => {
      dialog.close();
      unlockScroll();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      ref.current
        ?.querySelector<HTMLElement>("[data-initial-focus]")
        ?.focus({ preventScroll: true });
      if (ref.current) ref.current.scrollTop = 0;
    });
    return () => cancelAnimationFrame(frame);
  }, [open, viewKey]);

  return (
    <dialog
      ref={ref}
      data-lenis-prevent
      className={styles.dialog}
      aria-labelledby="travel-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const dialog = event.currentTarget;
        const focusable = [
          ...dialog.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
          ),
        ].filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) {
          event.preventDefault();
          return;
        }
        const active = document.activeElement;
        if (active && !focusable.includes(active as HTMLElement)) {
          const next = event.shiftKey
            ? [...focusable]
                .reverse()
                .find((element) =>
                  Boolean(
                    active.compareDocumentPosition(element) &
                    Node.DOCUMENT_POSITION_PRECEDING,
                  ),
                )
            : focusable.find((element) =>
                Boolean(
                  active.compareDocumentPosition(element) &
                  Node.DOCUMENT_POSITION_FOLLOWING,
                ),
              );
          event.preventDefault();
          (next ?? (event.shiftKey ? last : first)).focus();
        } else if (
          (!event.shiftKey && active === last) ||
          (event.shiftKey && active === first)
        ) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }}
      onPointerDown={(event) => {
        backdropPress.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (backdropPress.current && event.target === event.currentTarget)
          onClose();
        backdropPress.current = false;
      }}
    >
      {open && (
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar janela"
          >
            <Icon name="close" />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}

function DestinationDetails({
  destination,
  onPlan,
}: {
  destination: Destination;
  onPlan: (id: string) => void;
}) {
  return (
    <div className={styles.destination}>
      <div className={styles.destinationPhoto}>
        <Image
          src={destination.image}
          alt={destination.alt}
          fill
          sizes="(max-width: 700px) 95vw, 440px"
          className={styles.image}
        />
        <div className={styles.photoCaption}>
          <span>
            <Icon name="pin" /> {destination.country}
          </span>
          <p>{destination.tagline}</p>
        </div>
      </div>
      <div className={styles.destinationContent}>
        <p className={styles.eyebrow}>Um lugar, muitas possibilidades</p>
        <h2
          id="travel-dialog-title"
          className={styles.title}
          tabIndex={-1}
          data-initial-focus
        >
          {destination.name}
        </h2>
        <div className={styles.meta}>
          <span>
            <Icon name="calendar" /> {destination.days} dias de inspiração
          </span>
          <span>
            <Icon name="sun" /> {destination.bestTime}
          </span>
        </div>
        <p className={styles.description}>{destination.description}</p>
        <div className={styles.highlights}>
          {destination.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
        <DestinationInsights key={destination.id} destinationId={destination.id} />
        <h3 className={styles.subheading}>Um caminho possível</h3>
        <ol className={styles.itinerary}>
          {destination.itinerary.map((stop) => (
            <li key={`${stop.day}-${stop.title}`}>
              <span className={styles.day}>{stop.day}</span>
              <div>
                <h4>{stop.title}</h4>
                <p>{stop.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className={styles.primary}
          onClick={() => onPlan(destination.id)}
        >
          Montar meu roteiro
        </button>
        <p className={styles.note}>
          Ideias para a sua viagem. Você escolhe o ritmo.
        </p>
      </div>
    </div>
  );
}

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const interests = [
  "Natureza e trilhas",
  "Arte e cultura",
  "Gastronomia",
  "Praias",
  "Vida local",
  "Descanso",
];

type PlanningDestination = Pick<Destination, "id" | "name" | "country" | "days" | "highlights"> & {
  category?: Destination["category"];
  bestTime?: string;
  latitude?: number;
  longitude?: number;
};
type PlanningBrief = {
  destination: PlanningDestination;
  month: string;
  travelers: number;
  duration: number;
  interests: string[];
};

function Planner({
  initialDestinationId,
  initialMonth,
  explorerPlaces = [],
  initialExplorerPlace,
}: {
  initialDestinationId?: string;
  initialMonth?: string;
  explorerPlaces?: ExplorerPlace[];
  initialExplorerPlace?: ExplorerPlace | null;
}) {
  const extraPlaces = [...new Map([...(initialExplorerPlace ? [initialExplorerPlace] : []), ...explorerPlaces].map(place => [place.id, place])).values()];
  const planningDestinations: PlanningDestination[] = [
    ...destinations,
    ...extraPlaces.map(place => ({ id: place.id, name: place.name, country: place.country, days: 7, highlights: [], latitude: place.latitude, longitude: place.longitude })),
  ];
  const initialDestination =
    planningDestinations.find((item) => item.id === (initialExplorerPlace?.id ?? initialDestinationId)) ??
    planningDestinations[0];
  const [destinationId, setDestinationId] = useState(initialDestination.id);
  const [brief, setBrief] = useState<PlanningBrief | null>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const durationOptions = [
    ...new Set([5, 7, 10, 14, 21, initialDestination.days]),
  ].sort((a, b) => a - b);

  function createBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const chosenDestination =
      planningDestinations.find((item) => item.id === data.get("destination")) ??
      initialDestination;
    setBrief({
      destination: chosenDestination,
      month: String(data.get("month")),
      travelers: Number(data.get("travelers")),
      duration: Number(data.get("duration")),
      interests: data.getAll("interest").map(String),
    });
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  function downloadBrief() {
    if (!brief) return;
    const content = [
      "Travel Agency — Seu ponto de partida",
      "",
      `Destino: ${brief.destination.name}, ${brief.destination.country}`,
      `Quando: ${brief.month}`,
      `Duração: ${brief.duration} dias`,
      `Viajantes: ${brief.travelers}`,
      `Interesses: ${brief.interests.join(", ") || "Aberto a descobertas"}`,
      "",
      ...(brief.destination.highlights.length ? ["IDEIAS PARA INCLUIR", ...brief.destination.highlights.map((highlight) => `• ${highlight}`), ""] : []),
      ...(brief.destination.bestTime ? [`Melhor época sugerida: ${brief.destination.bestTime}`] : []),
      ...(brief.destination.latitude !== undefined && brief.destination.longitude !== undefined ? [`Mapa: https://www.openstreetmap.org/?mlat=${brief.destination.latitude}&mlon=${brief.destination.longitude}#map=13/${brief.destination.latitude}/${brief.destination.longitude}`] : []),
      "",
      "Um rascunho para começar a imaginar. Ajuste datas, ritmo e escolhas antes de reservar.",
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `travel-agency-${brief.destination.id}-planejamento.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className={styles.planner}>
      <p className={styles.eyebrow}>A próxima história começa aqui</p>
      <h2 id="travel-dialog-title" className={styles.title}>
        Vamos tirar a viagem
        <br />
        do papel?
      </h2>
      <p className={styles.description}>
        Conte um pouco do que você imagina. A gente organiza as primeiras ideias
        para você explorar.
      </p>
      <form onSubmit={createBrief} onChange={() => setBrief(null)}>
        <div className={styles.fields}>
          <label className={styles.field} htmlFor="plan-destination">
            <span>Para onde?</span>
            <select
              id="plan-destination"
              name="destination"
              value={destinationId}
              onChange={(event) => setDestinationId(event.target.value)}
              data-initial-focus
            >
              {planningDestinations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}, {item.country}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field} htmlFor="plan-month">
            <span>Quando você quer ir?</span>
            <select
              id="plan-month"
              name="month"
              defaultValue={
                months.includes(initialMonth ?? "")
                  ? initialMonth
                  : "Datas flexíveis"
              }
            >
              <option>Datas flexíveis</option>
              {months.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
          </label>
          <label className={styles.field} htmlFor="plan-travelers">
            <span>Quem vai com você?</span>
            <select id="plan-travelers" name="travelers" defaultValue="2">
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count === 1 ? "Só eu" : `${count} pessoas`}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field} htmlFor="plan-duration">
            <span>Quanto tempo por lá?</span>
            <select
              id="plan-duration"
              name="duration"
              defaultValue={initialDestination.days}
            >
              {durationOptions.map((days) => (
                <option key={days} value={days}>
                  {days} dias
                </option>
              ))}
            </select>
          </label>
        </div>
        <fieldset className={styles.interests}>
          <legend>O que faz a viagem valer a pena para você?</legend>
          <div>
            {interests.map((interest) => (
              <label key={interest}>
                <input
                  type="checkbox"
                  name="interest"
                  value={interest}
                  defaultChecked={
                    interest === "Gastronomia" ||
                    (initialDestination.category === "natureza" &&
                      interest === "Natureza e trilhas") ||
                    (initialDestination.category === "praia" &&
                      interest === "Praias") ||
                    (initialDestination.category === "cultura" &&
                      interest === "Arte e cultura")
                  }
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button className={styles.primary} type="submit">
          Criar meu ponto de partida
        </button>
      </form>
      <div aria-live="polite" aria-atomic="true">
        {brief && (
          <section
            className={styles.summary}
            aria-labelledby="planning-summary"
          >
            <p className={styles.eyebrow}>
              <Icon name="check" /> Seu ponto de partida
            </p>
            <h3 id="planning-summary" ref={summaryRef} tabIndex={-1}>
              {brief.duration} dias em {brief.destination.name}
            </h3>
            <p>
              {brief.month} ·{" "}
              {brief.travelers === 1
                ? "Uma viagem só sua"
                : `${brief.travelers} viajantes`}
            </p>
            <p className={styles.summaryInterests}>
              {brief.interests.length
                ? brief.interests.join(" · ")
                : "Deixe espaço para as descobertas."}
            </p>
            {brief.destination.highlights.length > 0 && <ul>
              {brief.destination.highlights.map((highlight) => (
                <li key={highlight}>
                  <Icon name="check" /> {highlight}
                </li>
              ))}
            </ul>}
            {brief.destination.latitude !== undefined && brief.destination.longitude !== undefined && <a className={styles.secondary} href={`https://www.openstreetmap.org/?mlat=${brief.destination.latitude}&mlon=${brief.destination.longitude}#map=13/${brief.destination.latitude}/${brief.destination.longitude}`} target="_blank" rel="noreferrer">Explorar o destino no mapa</a>}
            <button
              type="button"
              className={styles.secondary}
              onClick={downloadBrief}
            >
              <Icon name="download" /> Baixar planejamento
            </button>
            <p className={styles.note}>
              Um rascunho para começar a imaginar. Ajuste datas, ritmo e
              escolhas antes de reservar.
            </p>
          </section>
        )}
      </div>
      {!brief && (
        <p className={styles.note}>
          Sem pressa. Você pode mudar de ideia quantas vezes quiser.
        </p>
      )}
    </div>
  );
}

function GuideArticle({ guide }: { guide: Guide }) {
  return (
    <article className={styles.guide}>
      <div className={styles.guidePhoto}>
        <Image
          src={guide.image}
          alt={guide.alt}
          fill
          sizes="(max-width: 700px) 95vw, 1000px"
          className={styles.image}
        />
      </div>
      <div className={styles.guideContent}>
        <p className={styles.eyebrow}>
          {guide.kicker} <span>· {guide.readTime}</span>
        </p>
        <h2
          id="travel-dialog-title"
          className={styles.title}
          tabIndex={-1}
          data-initial-focus
        >
          {guide.title}
        </h2>
        <div className={styles.article}>
          {guide.paragraphs.map((paragraph, index) => (
            <p key={`${guide.id}-${index}`}>{paragraph}</p>
          ))}
        </div>
        <p className={styles.articleSignature}>
          Boa viagem, boa descoberta. <strong>Travel Agency</strong>
        </p>
      </div>
    </article>
  );
}

export function TravelDialogs({
  destination,
  guide,
  plannerOpen,
  initialDestinationId,
  initialMonth,
  explorerPlaces,
  initialExplorerPlace,
  onClose,
  onPlan,
}: TravelDialogsProps) {
  const viewKey = plannerOpen
    ? "planner"
    : (destination?.id ?? guide?.id ?? "closed");
  return (
    <Modal
      open={plannerOpen || Boolean(destination) || Boolean(guide)}
      viewKey={viewKey}
      onClose={onClose}
    >
      {plannerOpen ? (
        <Planner
          key={`${initialExplorerPlace?.id ?? initialDestinationId ?? "all"}-${initialMonth ?? ""}`}
          initialDestinationId={initialDestinationId ?? destination?.id}
          initialMonth={initialMonth}
          explorerPlaces={explorerPlaces}
          initialExplorerPlace={initialExplorerPlace}
        />
      ) : destination ? (
        <DestinationDetails destination={destination} onPlan={onPlan} />
      ) : guide ? (
        <GuideArticle guide={guide} />
      ) : null}
    </Modal>
  );
}
