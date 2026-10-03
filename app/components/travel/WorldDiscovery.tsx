"use client";

import { scrollToSection } from "../SmoothScroll";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { type DiscoveryResult, type WeatherData, type Place, type PlaceCategory, placeCategories, weatherDescription } from "../../lib/discovery-types";
import type { ExplorerPlace, SearchData, NearbyData } from "../../lib/explore-types";
import type { ExplorerPhoto } from "../../lib/explore-photo-types";
import { Modal } from "./Dialogs";
import { Icon } from "./Primitives";
import { TravelSelect } from "./TravelSelect";
import styles from "./world.module.css";

export type ExplorerRequest = { query: string; kind: "city" | "place"; serial: number; discover?: boolean };
const STORAGE_KEY = "travel-agency.explorer-favorites.v1";
const emptySaved: ExplorerPlace[] = [];
let savedSnapshot: ExplorerPlace[] = emptySaved;
let hydrated = false;
const subscribers = new Set<() => void>();

function validPlace(value: unknown): value is ExplorerPlace {
  if (!value || typeof value !== "object") return false;
  const place = value as Record<string, unknown>;
  return typeof place.id === "string" && place.id.length > 0 && place.id.length < 180 &&
    typeof place.name === "string" && place.name.length > 0 && place.name.length < 180 &&
    typeof place.country === "string" && place.country.length < 120 &&
    typeof place.countryCode === "string" && place.countryCode.length <= 3 &&
    typeof place.kind === "string" && place.kind.length < 60 &&
    typeof place.latitude === "number" && Number.isFinite(place.latitude) && Math.abs(place.latitude) <= 90 &&
    typeof place.longitude === "number" && Number.isFinite(place.longitude) && Math.abs(place.longitude) <= 180 &&
    (place.source === "geonames" || place.source === "openstreetmap") &&
    (place.region === undefined || typeof place.region === "string") &&
    (place.timezone === undefined || typeof place.timezone === "string");
}
function parseSaved(raw: string | null): ExplorerPlace[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    return value.filter(validPlace).filter(place => {
      const key = `${place.source}:${place.id}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).slice(-100).map(place => ({ id: place.id, name: place.name, country: place.country, countryCode: place.countryCode, kind: place.kind, latitude: place.latitude, longitude: place.longitude, source: place.source, ...(place.region ? { region: place.region.slice(0, 150) } : {}), ...(place.timezone ? { timezone: place.timezone.slice(0, 80) } : {}) }));
  } catch { return []; }
}
function publishSaved(next: ExplorerPlace[]) {
  savedSnapshot = next;
  subscribers.forEach(notify => notify());
}
function onStorage(event: StorageEvent) {
  if (event.key === STORAGE_KEY || event.key === null) publishSaved(parseSaved(event.key === null ? null : event.newValue));
}
function subscribeSaved(notify: () => void) {
  subscribers.add(notify);
  if (subscribers.size === 1) window.addEventListener("storage", onStorage);
  if (!hydrated) {
    hydrated = true;
    try { publishSaved(parseSaved(localStorage.getItem(STORAGE_KEY))); } catch { publishSaved([]); }
  }
  return () => { subscribers.delete(notify); if (!subscribers.size) window.removeEventListener("storage", onStorage); };
}
function toggleSaved(place: ExplorerPlace) {
  if (!validPlace(place)) return;
  const exists = savedSnapshot.some(item => item.id === place.id && item.source === place.source);
  const next = exists ? savedSnapshot.filter(item => item.id !== place.id || item.source !== place.source) : [...savedSnapshot, place].slice(-100);
  publishSaved(next);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Favorites remain available for this visit. */ }
}
export function useExplorerFavorites() {
  const savedPlaces = useSyncExternalStore(subscribeSaved, () => savedSnapshot, () => emptySaved);
  return { savedPlaces, toggle: toggleSaved };
}

function useResource<T>(url: string, timeout = 25_000) {
  const [attempt, setAttempt] = useState(0);
  const [resource, setResource] = useState<{ key: string; value: DiscoveryResult<T> } | null>(null);
  const key = `${url}#${attempt}`;
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(timeout)]) })
      .then(async response => {
        const value = await response.json() as DiscoveryResult<T>;
        if (!["ready", "unavailable", "not-configured"].includes(value.status)) throw new Error("Invalid response");
        if (!controller.signal.aborted) setResource({ key, value });
      })
      .catch(() => { if (!controller.signal.aborted) setResource({ key, value: { status: "unavailable", message: "Não conseguimos consultar estes lugares agora. Tente novamente em instantes." } }); });
    return () => controller.abort();
  }, [url, key, timeout]);
  return { result: resource?.key === key ? resource.value : null, retry: () => setAttempt(value => value + 1) };
}

const photoCache = new Map<string, { promise: Promise<ExplorerPhoto | null>; expires: number }>();
const photoQueue: (() => void)[] = [];
let activePhotos = 0;
function loadPhoto(place: ExplorerPlace) {
  const key = `${place.source}:${place.id}`;
  const cached = photoCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.promise;
  photoCache.delete(key);
  const promise = new Promise<ExplorerPhoto | null>(resolve => {
    const run = async () => {
      activePhotos++;
      const params = new URLSearchParams({ name: place.name, country: place.country, lat: String(place.latitude), lon: String(place.longitude), kind: place.kind });
      try {
        const response = await fetch(`/api/explore/photo?${params}`, { signal: AbortSignal.timeout(25_000) });
        const result = await response.json() as DiscoveryResult<ExplorerPhoto>;
        resolve(result.status === "ready" ? result.data : null);
      } catch { resolve(null); }
      finally { activePhotos--; photoQueue.shift()?.(); }
    };
    if (activePhotos < 4) void run(); else photoQueue.push(() => { void run(); });
  });
  if (photoCache.size >= 200) photoCache.delete(photoCache.keys().next().value!);
  const entry = { promise, expires: Date.now() + 86_400_000 };
  photoCache.set(key, entry);
  void promise.then(photo => { entry.expires = Date.now() + (photo ? 86_400_000 : 60_000); });
  return promise;
}
function usePlacePhoto(place: ExplorerPlace, enabled: boolean) {
  const [resource, setResource] = useState<{ id: string; photo: ExplorerPhoto | null } | null>(null);
  const key = `${place.source}:${place.id}`;
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    void loadPhoto(place).then(photo => { if (live) setResource({ id: key, photo }); });
    return () => { live = false; };
  }, [place, key, enabled]);
  return resource?.id === key ? resource.photo : null;
}

function mapUrl(place: { latitude: number; longitude: number }) {
  return `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=15/${place.latitude}/${place.longitude}`;
}
function locationLabel(place: ExplorerPlace) {
  return [...new Set([place.region, place.country].filter(Boolean))].join(" · ");
}
function countryKey(place: ExplorerPlace) {
  return place.countryCode.toUpperCase() || place.country || "unknown";
}
function countryLabel(place: ExplorerPlace) {
  try { return new Intl.DisplayNames(["pt-BR"], { type: "region" }).of(place.countryCode.toUpperCase()) || place.country || "País não informado"; }
  catch { return place.country || "País não informado"; }
}
function PhotoCredit({ photo }: { photo: ExplorerPhoto }) {
  return <p className={styles.photoCredit}>Foto: <a href={photo.url} target="_blank" rel="noreferrer">{photo.attribution}</a>{" · "}<a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></p>;
}
function LocationArtwork({ place, large = false }: { place: ExplorerPlace; large?: boolean }) {
  return <div className={`${styles.artwork} ${large ? styles.artworkLarge : ""}`}><span className={styles.artworkCountry}>{place.country}</span><span className={styles.coordinates}>{Math.abs(place.latitude).toFixed(2)}°{place.latitude < 0 ? "S" : "N"} &nbsp; {Math.abs(place.longitude).toFixed(2)}°{place.longitude < 0 ? "W" : "E"}</span><span className={styles.artworkNote}>Localização no mapa</span></div>;
}
function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return <div className={styles.message} role="status"><p>{message}</p><button type="button" onClick={retry}>Tentar novamente</button></div>;
}

function PlaceCard({ place, saved, toggle, open, allowPhoto }: { place: ExplorerPlace; saved: boolean; toggle: () => void; open: () => void; allowPhoto: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [failedPhoto, setFailedPhoto] = useState(false);
  const photo = usePlacePhoto(place, allowPhoto && visible);
  useEffect(() => {
    if (!allowPhoto || !ref.current) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); } }, { rootMargin: "150px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [allowPhoto]);
  return <article ref={ref} className={styles.card}>
    <button type="button" className={styles.coverButton} onClick={open} aria-label={`Explorar ${place.name}, ${place.country}`}>
      {photo && !failedPhoto ? <Image src={photo.image} alt={photo.description || `Fotografia de ${place.name}`} width={600} height={450} unoptimized onError={() => setFailedPhoto(true)} /> : <LocationArtwork place={place} />}
    </button>
    <div className={styles.cardBody}><div><p className={styles.cardLocation}>{locationLabel(place) || "No mapa do mundo"}</p><h3><button type="button" onClick={open}>{place.name}</button></h3></div><button className={`${styles.save} ${saved ? styles.saved : ""}`} type="button" aria-label={`${saved ? "Remover" : "Salvar"} ${place.name} ${saved ? "dos" : "nos"} seus lugares`} aria-pressed={saved} onClick={toggle}><Icon name="heart" /></button></div>
    {photo && !failedPhoto && <PhotoCredit photo={photo} />}

  </article>;
}

function NearbyPlaces({ place }: { place: ExplorerPlace }) {
  const [category, setCategory] = useState<PlaceCategory>("culture");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [collection, setCollection] = useState<{ key: string; places: Place[]; data: NearbyData } | null>(null);
  const params = new URLSearchParams({ lat: String(place.latitude), lon: String(place.longitude), name: place.name, category, query, offset: String(offset) });
  const base = `${place.id}:${category}:${query}`;
  const [attempt, setAttempt] = useState(0);
  const [resource, setResource] = useState<{ key: string; value: DiscoveryResult<NearbyData> } | null>(null);
  const url = `/api/explore/nearby?${params}`;
  const resourceKey = `${url}#${attempt}`;
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(45_000)]) })
      .then(async response => {
        const value = await response.json() as DiscoveryResult<NearbyData>;
        if (!["ready", "unavailable", "not-configured"].includes(value.status)) throw new Error("Invalid response");
        if (controller.signal.aborted) return;
        setResource({ key: resourceKey, value });
        if (value.status === "ready") setCollection(previous => {
          const existing = offset > 0 && previous?.key === base ? previous.places : [];
          const unique = new Map([...existing, ...value.data.places].map(item => [item.id, item]));
          return { key: base, places: [...unique.values()], data: value.data };
        });
      })
      .catch(() => { if (!controller.signal.aborted) setResource({ key: resourceKey, value: { status: "unavailable", message: "Não conseguimos consultar os lugares desta região agora. Tente novamente em instantes." } }); });
    return () => controller.abort();
  }, [url, resourceKey, base, offset]);
  const result = resource?.key === resourceKey ? resource.value : null;
  const retry = () => setAttempt(value => value + 1);
  const current = collection?.key === base ? collection : null;
  const submit = (event: FormEvent) => { event.preventDefault(); setQuery(draft.trim()); setOffset(0); };
  return <section className={styles.nearby} aria-labelledby="world-nearby-title">
    <div className={styles.detailSectionHeading}><p>Saia para descobrir</p><h3 id="world-nearby-title">Por perto de {place.name}</h3></div>
    <div className={styles.categories} aria-label="Categorias de lugares">{placeCategories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => { setCategory(item.id); setOffset(0); }}>{item.label}</button>)}</div>
    <form className={styles.nearbySearch} onSubmit={submit}><label htmlFor="nearby-query">Procurar um lugar na região</label><div><input id="nearby-query" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Nome de um museu, café ou restaurante…" maxLength={100} /><button type="submit">Pesquisar</button></div></form>
    {!result && <p className={styles.loading} role="status">Consultando lugares reais na região…</p>}
    {result && result.status !== "ready" && <ErrorState message={result.message} retry={retry} />}
    {current && <><p className={styles.radius}>Em uma área de até {Math.round(current.data.radius / 1000)} km deste ponto.</p>{current.places.length ? <ul className={styles.nearbyGrid}>{current.places.map(item => <li key={item.id}><div><h4>{item.name}</h4>{item.address && <p>{item.address}</p>}{item.distance !== null && <small>{item.distance < 1000 ? `${Math.round(item.distance)} m` : `${(item.distance / 1000).toFixed(1).replace(".", ",")} km`} de distância</small>}</div><a href={mapUrl(item)} target="_blank" rel="noreferrer" aria-label={`Abrir ${item.name} no mapa`}>Mapa</a></li>)}</ul> : <p className={styles.empty}>Nenhum lugar encontrado nesta categoria{query ? ` com “${query}”` : ""}. Tente outro nome ou outra categoria.</p>}{current.data.hasMore && <button type="button" className={styles.more} disabled={result?.status !== "ready"} onClick={() => setOffset(value => value + 12)}>{!result ? "Buscando…" : "Mais lugares por perto"}</button>}<p className={styles.source}>{current.data.source === "geoapify" && <><a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a>{" · "}</>}Dados © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">colaboradores do OpenStreetMap</a>. A cobertura varia por região; confirme os horários antes de visitar.</p></>}
  </section>;
}
function WorldPlaceDetails({ place, saved, toggle, onPlan }: { place: ExplorerPlace; saved: boolean; toggle: () => void; onPlan?: () => void }) {
  const photo = usePlacePhoto(place, true);
  const [failedPhoto, setFailedPhoto] = useState(false);
  const params = new URLSearchParams({ lat: String(place.latitude), lon: String(place.longitude), name: place.name });
  const weather = useResource<WeatherData>(`/api/explore/weather?${params}`);
  const data = weather.result?.status === "ready" ? weather.result.data : null;
  return <div className={styles.details}>
    <div className={styles.detailIntro}>
      <figure className={styles.detailPhoto}>{photo && !failedPhoto ? <Image src={photo.image} alt={photo.description || `Fotografia de ${place.name}`} width={900} height={650} unoptimized onError={() => setFailedPhoto(true)} /> : <LocationArtwork place={place} large />}{photo && !failedPhoto && <PhotoCredit photo={photo} />}</figure>
      <div className={styles.detailTitle}><p className={styles.kicker}>Sobre o lugar</p><h2 id="travel-dialog-title" tabIndex={-1} data-initial-focus>{place.name}</h2><p className={styles.detailLocation}>{locationLabel(place)}</p><div className={styles.detailActions}><a href={mapUrl(place)} target="_blank" rel="noreferrer">Abrir no mapa</a><button type="button" aria-pressed={saved} onClick={toggle}><Icon name="heart" fill={saved ? "currentColor" : "none"} />{saved ? "Lugar salvo" : "Salvar lugar"}</button></div>{onPlan && <button type="button" className={styles.plan} onClick={onPlan}>Planejar por aqui</button>}<p className={styles.pointCredit}>Localização por {place.source === "geonames" ? <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a> : <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>}.</p></div>
    </div>
    <div className={styles.detailContent}><section className={styles.weather} aria-labelledby="world-weather-title"><div className={styles.detailSectionHeading}><p>Antes de sair</p><h3 id="world-weather-title">O clima agora</h3></div>{!weather.result && <p className={styles.loading} role="status">Buscando a previsão deste lugar…</p>}{weather.result && weather.result.status !== "ready" && <ErrorState message={weather.result.message} retry={weather.retry} />}{data && <><div className={styles.currentWeather}><strong>{Math.round(data.temperature)}<span>°C</span></strong><div><b>{weatherDescription(data.weatherCode)}</b><p>Sensação de {Math.round(data.feelsLike)}° · vento {Math.round(data.windSpeed)} km/h</p></div></div><ul className={styles.forecast} aria-label="Previsão dos próximos cinco dias">{data.days.map((day, index) => <li key={day.date}><span>{index === 0 ? "Hoje" : new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "UTC" }).format(new Date(`${day.date}T12:00:00Z`))}</span><b>{Math.round(day.max)}° <small>{Math.round(day.min)}°</small></b><p>{weatherDescription(day.weatherCode)}</p><small>{day.rainChance !== null ? `${Math.round(day.rainChance)}% chuva` : ""}</small></li>)}</ul><p className={styles.source}>Previsão de <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · atualização às {data.observedAt.slice(11, 16)}, horário local.</p></>}</section><NearbyPlaces place={place} /></div>
  </div>;
}

function SearchResults({ request, onDismiss, savedPlaces, toggle, onPlanPlace }: { request: ExplorerRequest; onDismiss: () => void; savedPlaces: ExplorerPlace[]; toggle: (place: ExplorerPlace) => void; onPlanPlace?: (place: ExplorerPlace) => void }) {
  const params = new URLSearchParams({ q: request.query, kind: request.kind });
  const resource = useResource<SearchData>(request.discover ? `/api/explore/discover?region=${request.query}` : `/api/explore/search?${params}&request=${request.serial}`);
  const [page, setPage] = useState(0);
  const pageSize = 8;
  const [savedTab, setSavedTab] = useState(false);
  const [selected, setSelected] = useState<ExplorerPlace | null>(null);
  const [country, setCountry] = useState("");
  const data = resource.result?.status === "ready" ? resource.result.data : null;
  const countryGroups = new Map<string, { label: string; count: number }>();
  for (const place of data?.places ?? []) {
    const key = countryKey(place);
    const existing = countryGroups.get(key);
    countryGroups.set(key, { label: existing?.label ?? countryLabel(place), count: (existing?.count ?? 0) + 1 });
  }
  const countries = [...countryGroups.entries()].sort(([, a], [, b]) => a.label.localeCompare(b.label, "pt-BR"));
  const places = savedTab ? savedPlaces : (data?.places ?? []).filter(place => !country || countryKey(place) === country);
  const currentPage = Math.min(page, Math.max(0, Math.ceil(places.length / pageSize) - 1));
  const start = currentPage * pageSize;
  function changePage(next: number) {
    setPage(next);
    scrollToSection("destinos");
  }
  return <div className={styles.world}>
    <div className={styles.heading}><div><p className={styles.kicker}>{savedTab ? "Guarde suas descobertas" : request.discover ? "Explore por região" : "Pesquisa de lugares"}</p><h2>{savedTab ? "Seus lugares salvos" : request.discover ? <>Destinos <span>para explorar</span></> : <>Explorando <span>{request.query}</span></>}</h2><p>{savedTab ? "Os lugares que você quer conhecer, reunidos aqui." : request.discover ? "Cidades, paisagens e novos caminhos. Abra um lugar para explorar a região e guardar sua próxima viagem." : request.kind === "city" ? "Encontre a cidade, abra o mapa e descubra o que existe por perto." : "Cafés, museus, praias e outros lugares para começar uma nova descoberta."}</p></div>{!request.discover && <button type="button" className={styles.back} onClick={onDismiss}>Ver outros destinos</button>}</div>
    <div className={styles.toolbar}><div className={styles.tabs} aria-label="Visualização dos resultados"><button type="button" aria-pressed={!savedTab} onClick={() => { setSavedTab(false); setPage(0); }}>Resultados da pesquisa</button><button type="button" aria-pressed={savedTab} onClick={() => { setSavedTab(true); setPage(0); }}>Meus lugares salvos <span>{savedPlaces.length}</span></button></div>{data && !savedTab && <div className={styles.refinements}>{countries.length > 1 && <div className={styles.countryFilter}><span>País</span><TravelSelect id="world-country" label="Filtrar por país" value={country} onChange={value => { setCountry(value); setPage(0); }} compact options={[{ value: "", label: "Todos os países" }, ...countries.map(([code, info]) => ({ value: code, label: `${info.label} (${info.count})` }))]} /></div>}<span className={styles.resultCount} aria-live="polite">{country ? `${places.length} de ${data.places.length} lugares` : `${data.places.length} ${data.places.length === 1 ? "lugar encontrado" : "lugares encontrados"}`}</span></div>}</div>
    {data && !savedTab && !request.discover && request.kind === "city" && countries.length > 1 && <p className={styles.refineHint}>Há cidades com nomes parecidos. Escolha um país para refinar a pesquisa.</p>}
    {!resource.result && !savedTab && <div className={styles.message} role="status"><span className={styles.handwritten}>Um instante, vamos encontrar esse lugar…</span><div className={styles.skeletonGrid} aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <div key={index} />)}</div></div>}
    {resource.result && resource.result.status !== "ready" && !savedTab && <ErrorState message={resource.result.message} retry={resource.retry} />}
    {(data || savedTab) && (places.length ? <><div className={styles.grid}>{places.slice(start, start + pageSize).map((place) => <PlaceCard key={`${place.source}:${place.id}`} place={place} saved={savedPlaces.some(item => item.id === place.id && item.source === place.source)} toggle={() => toggle(place)} open={() => setSelected(place)} allowPhoto={true} />)}</div>{places.length > pageSize && <nav className={styles.pager} aria-label="Páginas de destinos"><button type="button" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}>Lugares anteriores</button><span role="status" aria-live="polite">{start + 1}–{Math.min(start + pageSize, places.length)} de {places.length}</span><button type="button" disabled={start + pageSize >= places.length} onClick={() => changePage(currentPage + 1)}>Mostrar mais lugares</button></nav>}</> : <div className={styles.message} role="status"><span className={styles.handwritten}>{savedTab ? "Onde você quer chegar?" : "Vamos tentar outro caminho?"}</span><p>{savedTab ? "Toque no coração de um lugar para guardar sua próxima viagem." : "Não encontramos resultados para este nome. Tente uma cidade, o nome completo do lugar ou acrescente o país."}</p></div>)}
    {data && !savedTab && <p className={styles.source}>Resultados por {data.source === "geonames" ? <><a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>{" / "}<a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a></> : <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© colaboradores do OpenStreetMap</a>}. A busca consulta lugares do mundo inteiro; a quantidade de resultados varia conforme o nome e a cobertura.</p>}
    <Modal open={!!selected} viewKey={selected?.id ?? "world"} onClose={() => setSelected(null)}>{selected && <WorldPlaceDetails key={`${selected.source}:${selected.id}`} place={selected} saved={savedPlaces.some(item => item.id === selected.id && item.source === selected.source)} toggle={() => toggle(selected)} onPlan={onPlanPlace ? () => { const place = selected; setSelected(null); requestAnimationFrame(() => onPlanPlace(place)); } : undefined} />}</Modal>
  </div>;
}

export function WorldDiscovery({ request, onDismiss, savedOnly = false, onPlanPlace }: { request: ExplorerRequest | null; onDismiss: () => void; savedOnly?: boolean; onPlanPlace?: (place: ExplorerPlace) => void }) {
  const { savedPlaces, toggle } = useExplorerFavorites();
  const [selected, setSelected] = useState<ExplorerPlace | null>(null);
  if (request) return <SearchResults key={request.serial} request={request} onDismiss={onDismiss} savedPlaces={savedPlaces} toggle={toggle} onPlanPlace={onPlanPlace} />;
  if (!savedOnly) return <DiscoveryFeed onDismiss={onDismiss} savedPlaces={savedPlaces} toggle={toggle} onPlanPlace={onPlanPlace} />;
  return <div className={styles.world}><div className={styles.heading}><div><p className={styles.kicker}>Sua próxima viagem começa aqui</p><h2>Lugares que você guardou</h2></div><button type="button" className={styles.back} onClick={onDismiss}>Explorar o mundo</button></div>{savedPlaces.length ? <div className={styles.grid}>{savedPlaces.map((place) => <PlaceCard key={`${place.source}:${place.id}`} place={place} saved toggle={() => toggle(place)} open={() => setSelected(place)} allowPhoto={true} />)}</div> : <p className={styles.empty}>Os lugares encontrados na pesquisa que você salvar aparecerão aqui.</p>}<Modal open={!!selected} viewKey={selected?.id ?? "saved"} onClose={() => setSelected(null)}>{selected && <WorldPlaceDetails key={`${selected.source}:${selected.id}`} place={selected} saved={savedPlaces.some(item => item.id === selected.id && item.source === selected.source)} toggle={() => toggle(selected)} onPlan={onPlanPlace ? () => { const place = selected; setSelected(null); requestAnimationFrame(() => onPlanPlace(place)); } : undefined} />}</Modal></div>;
}

function DiscoveryFeed({ onDismiss, savedPlaces, toggle, onPlanPlace }: { onDismiss: () => void; savedPlaces: ExplorerPlace[]; toggle: (place: ExplorerPlace) => void; onPlanPlace?: (place: ExplorerPlace) => void }) {
  const [region, setRegion] = useState("mundo");
  return <><div className={styles.regions} aria-label="Explorar por região">{[["mundo", "Pelo mundo"], ["americas", "Américas"], ["europa", "Europa"], ["asia", "Ásia"], ["africa", "África & Oceania"]].map(([value, label]) => <button key={value} type="button" aria-pressed={region === value} onClick={() => setRegion(value)}>{label}</button>)}</div><SearchResults key={region} request={{ query: region, kind: "city", serial: 0, discover: true }} onDismiss={onDismiss} savedPlaces={savedPlaces} toggle={toggle} onPlanPlace={onPlanPlace} /></>;
}
