"use client";

import { scrollToSection } from "../SmoothScroll";
import { MotionConfig } from "framer-motion";
import { useState } from "react";
import {
  type Destination,
  type Guide,
} from "../../data/travel";
import { Icon } from "./Primitives";
import { TravelDialogs } from "./Dialogs";
import { Header } from "./Header";
import { TravelSelect } from "./TravelSelect";
import { Hero } from "./Hero";
import {
  ExperienceSection,
  JournalSection,
  FAQSection,
  TravelCallout,
  Footer,
} from "./EditorialSections";
import { WorldDiscovery, useExplorerFavorites } from "./WorldDiscovery";
import styles from "./destinations.module.css";
import type { ExplorerPlace } from "../../lib/explore-types";

export function TravelExperience() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchKind, setSearchKind] = useState<"city" | "place">("city");
  const [worldRequest, setWorldRequest] = useState<{ query: string; kind: "city" | "place"; serial: number } | null>(null);
  const [worldSavedOnly, setWorldSavedOnly] = useState(false);
  const searchMonth = "";
  const [destination, setDestination] = useState<Destination | null>(null);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [initialExplorerPlace, setInitialExplorerPlace] = useState<ExplorerPlace | null>(null);
  const [initialDestinationId, setInitialDestinationId] = useState<
    string | undefined
  >();
  const { savedPlaces } = useExplorerFavorites();
  function scrollToDestinations() {
    scrollToSection("destinos");
  }
  function plan(id?: string) {
    setInitialExplorerPlace(null);
    setDestination(null);
    setGuide(null);
    setInitialDestinationId(id);
    setPlannerOpen(true);
  }
  function planPlace(place: ExplorerPlace) {
    setDestination(null);
    setGuide(null);
    setInitialExplorerPlace(place);
    setInitialDestinationId(undefined);
    setPlannerOpen(true);
  }
  function closeDialogs() {
    setDestination(null);
    setGuide(null);
    setPlannerOpen(false);
  }
  function showSaved() {
    setWorldRequest(null);
    setWorldSavedOnly(true);
    scrollToDestinations();
  }
  function reset() {
    setWorldRequest(null);
    setWorldSavedOnly(false);
    setSearchQuery("");
  }
  return (
    <MotionConfig reducedMotion="user">
      <a className={styles.skipLink} href="#destinos">
        Pular para os destinos
      </a>
      <Header
        onPlan={() => plan()}
        onSaved={showSaved}
        count={savedPlaces.length}
      />
      <main>
        <Hero onExplore={() => { scrollToSection("busca"); document.querySelector<HTMLInputElement>('[aria-label="Pesquisar cidade ou lugar"]')?.focus({ preventScroll: true }); }} onDestination={setDestination} />
        <div className={styles.searchWrapper} id="busca">
          <p className={styles.searchIntro}>Qual lugar você quer descobrir?</p>
          <form
            className={styles.searchBar}
            aria-label="Encontrar destinos"
            onSubmit={(e) => {
              e.preventDefault();
              const query = searchQuery.trim();
              setWorldSavedOnly(false);
              if (query.length >= 2) {
                setWorldRequest({ query, kind: searchKind, serial: Date.now() });
              } else {
                reset();
              }
              scrollToDestinations();
            }}
          >
            <label className={styles.searchField}>
              <Icon name="search" />
              <span>
                <small>Pesquise pelo nome</small>
                <input
                  type="search"
                  aria-label="Pesquisar cidade ou lugar"
                  value={searchQuery}
                  minLength={2}
                  maxLength={100}
                  placeholder={searchKind === "city" ? "Digite uma cidade: Paris, Salvador…" : "Digite uma praia, museu ou atração…"}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
              </span>
            </label>
            <div className={styles.searchField}>
              <span>
                <small>Tipo de lugar</small>
                <TravelSelect label="Tipo de busca" value={searchKind} onChange={value => setSearchKind(value as "city" | "place")} options={[{ value: "city", label: "Cidades pelo mundo" }, { value: "place", label: "Praias, museus e atrações" }]} />
              </span>
            </div>
            <button type="submit" className={styles.searchButton}>
              Pesquisar <Icon name="search" />
            </button>
          </form>
        </div>
        <div className={styles.container}>
          <section className={styles.destinations} id="destinos" aria-label={worldRequest ? "Resultados da busca mundial" : "Destinos da API para explorar"}>
            <WorldDiscovery request={worldRequest} savedOnly={worldSavedOnly} onDismiss={reset} onPlanPlace={planPlace} />
          </section>
        </div>
        <ExperienceSection onPlan={() => plan()} />
        <JournalSection onGuide={setGuide} />
        <FAQSection />
        <TravelCallout onPlan={() => plan()} />
      </main>
      <Footer onPlan={() => plan()} onSaved={showSaved} />
      <TravelDialogs
        destination={destination}
        guide={guide}
        plannerOpen={plannerOpen}
        initialDestinationId={initialDestinationId}
        initialMonth={searchMonth}
        explorerPlaces={savedPlaces}
        initialExplorerPlace={initialExplorerPlace}
        onClose={closeDialogs}
        onPlan={plan}
      />
    </MotionConfig>
  );
}
