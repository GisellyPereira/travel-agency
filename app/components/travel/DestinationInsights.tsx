"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { placeCategories, weatherDescription, type DiscoveryResult, type WeatherData, type PhotosData, type PlaceCategory } from "../../lib/discovery-types";
import styles from "./insights.module.css";
import type { NearbyData } from "../../lib/explore-types";

type Resource<T> = { url: string; value: DiscoveryResult<T> };
function useResource<T>(url: string) {
  const [resource, setResource] = useState<Resource<T> | null>(null);
  const [available, setAvailable] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(40_000)]) })
      .then(async response => {
        if (!response.ok) throw new Error("Discovery request failed");
        const value = await response.json() as DiscoveryResult<T>;
        if (!["ready", "unavailable", "not-configured"].includes(value.status)) throw new Error("Invalid discovery response");
        if (!controller.signal.aborted) { setResource({ url, value }); setAvailable(value.status !== "not-configured"); }
      })
      .catch(() => {
        if (!controller.signal.aborted) { setResource({ url, value: { status: "unavailable", message: "Não foi possível atualizar estas informações agora." } }); setAvailable(true); }
      });
    return () => controller.abort();
  }, [url, attempt]);
  return {
    result: resource?.url === url ? resource.value : null,
    available,
    retry: () => { setResource(null); setAttempt(value => value + 1); },
  };
}

function WeatherIcon({ code, isDay = true }: { code: number; isDay?: boolean }) {
  const rain = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code);
  const snow = [71, 73, 75, 77, 85, 86].includes(code);
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {code <= 1 && isDay ? <><circle cx="20" cy="20" r="7" /><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5 32 32M8 32l3.5-3.5M28.5 11.5 32 8" /></> : code <= 1 ? <path d="M28 28A13 13 0 0 1 12 8a13 13 0 1 0 16 20Z" /> : <><path d="M10 28a7 7 0 0 1-1-14 10 10 0 0 1 19 0 7 7 0 1 1 1 14H10Z" />{rain && <path d="m13 32-2 4m10-4-2 4m10-4-2 4" />}{snow && <path d="M12 32v5m-2.5-2.5h5M26 32v5m-2.5-2.5h5" />}{code >= 95 && <path d="m22 23-5 8h6l-4 7" />}</>}
    </svg>
  );
}
function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return <div className={styles.error} role="status"><p>{message}</p><button type="button" onClick={retry}>Tentar novamente <span aria-hidden="true">↻</span></button></div>;
}
function forecastDay(date: string, index: number): string {
  if (index === 0) return "Hoje";
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`)).replace(".", "");
}

export function DestinationInsights({ destinationId }: { destinationId: string }) {
  const [category, setCategory] = useState<PlaceCategory>("culture");
  const [offset, setOffset] = useState(0);
  const path = `/api/destinations/${encodeURIComponent(destinationId)}`;
  const weather = useResource<WeatherData>(`${path}/weather`);
  const places = useResource<NearbyData>(`${path}/places?category=${category}&offset=${offset}`);
  const photos = useResource<PhotosData>(`${path}/photos`);
  const weatherData = weather.result?.status === "ready" ? weather.result.data : null;
  const placesData = places.result?.status === "ready" ? places.result.data : null;
  const photosData = photos.result?.status === "ready" ? photos.result.data : null;

  return (
    <div className={styles.insights}>
      <section className={styles.weather} aria-labelledby={`weather-${destinationId}`}>
        <div className={styles.heading}><span className={styles.kicker}>Olhe pela janela</span><h3 id={`weather-${destinationId}`}>O clima por lá.</h3></div>
        {!weather.result && <p className={styles.loading} role="status">Buscando o clima do destino<span aria-hidden="true">…</span></p>}
        {weather.result && weather.result.status !== "ready" && <ErrorState message={weather.result.message} retry={weather.retry} />}
        {weatherData && <>
          <div className={styles.current}>
            <div className={styles.temperature}><WeatherIcon code={weatherData.weatherCode} isDay={weatherData.isDay} /><strong>{Math.round(weatherData.temperature)}<span>°C</span></strong></div>
            <div className={styles.conditions}><strong>{weatherDescription(weatherData.weatherCode)}</strong><span>Agora em {weatherData.city}</span><span>Sensação de {Math.round(weatherData.feelsLike)}° · vento {Math.round(weatherData.windSpeed)} km/h</span></div>
          </div>
          <ul className={styles.forecast} aria-label="Previsão para os próximos cinco dias">
            {weatherData.days.map((day, index) => <li key={day.date}>
              <span>{forecastDay(day.date, index)}</span><WeatherIcon code={day.weatherCode} />
              <p><strong>{Math.round(day.max)}°</strong><span>{Math.round(day.min)}°</span></p>
              <small>{day.rainChance !== null ? `${Math.round(day.rainChance)}% chuva` : weatherDescription(day.weatherCode)}</small>
            </li>)}
          </ul>
          <p className={styles.credit}>Previsão de <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · condições às {weatherData.observedAt.slice(11, 16)}, horário local.</p>
        </>}
      </section>

      {places.available && <section className={styles.places} aria-labelledby={`places-${destinationId}`}>
        <div className={styles.heading}><span className={styles.kicker}>Saia do roteiro</span><h3 id={`places-${destinationId}`}>Descubra por perto.</h3></div>
        <div className={styles.categories} aria-label="Tipos de lugares">
          {placeCategories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => { setCategory(item.id); setOffset(0); }}>{item.label}</button>)}
        </div>
        {!places.result && <p className={styles.loading} role="status">Buscando lugares na região…</p>}
        {placesData && <>
          <p className={styles.location}>{placesData.total} lugares encontrados · até {Math.round(placesData.radius / 1000)} km de {placesData.city}</p>
          {placesData.places.length ? <ul className={styles.placeList}>{placesData.places.map((place) => <li key={place.id}>
            <div><h4>{place.name}</h4><p>{place.address}</p></div>
            <a href={`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=17/${place.latitude}/${place.longitude}`} target="_blank" rel="noreferrer" aria-label={`Ver ${place.name} no mapa`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg></a>
          </li>)}</ul> : <p className={styles.empty}>Ainda não encontramos lugares desta categoria na área. Explore outra opção.</p>}
          {(offset > 0 || placesData.hasMore) && <div className={styles.paging}>
            {offset > 0 && <button type="button" onClick={() => setOffset(Math.max(0, offset - 12))}>Voltar aos lugares anteriores</button>}
            {placesData.hasMore && <button type="button" onClick={() => setOffset(offset + 12)}>Ver outros lugares <span aria-hidden="true">→</span></button>}
          </div>}
          <p className={styles.credit}>{placesData.source === "geoapify" && <>Lugares por <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a> · </>}Dados © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>. Confirme os horários antes de visitar.</p>
        </>}
        {places.result?.status === "unavailable" && <ErrorState message={places.result.message} retry={places.retry} />}
      </section>}

      {photos.available && <section className={styles.photos} aria-labelledby={`photos-${destinationId}`}>
        <div className={styles.heading}><span className={styles.kicker}>Outros olhares</span><h3 id={`photos-${destinationId}`}>Para se imaginar lá.</h3></div>
        {!photos.result && <p className={styles.loading} role="status">Buscando fotografias da região…</p>}
        {photosData && <>
          {photosData.photos.length ? <div className={styles.photoGrid}>{photosData.photos.map(photo => <figure key={photo.id}>
            <a href={photo.url} target="_blank" rel="noreferrer"><Image src={photo.image} alt={photo.alt} width={600} height={400} unoptimized sizes="(max-width: 600px) 45vw, 220px" /></a>
            <figcaption>Foto de <a href={photo.photographerUrl} target="_blank" rel="noreferrer">{photo.photographer}</a></figcaption>
          </figure>)}</div> : <p className={styles.empty}>Ainda não encontramos fotografias deste destino.</p>}
          <p className={styles.credit}>Busca de imagens em <a href="https://www.pexels.com/" target="_blank" rel="noreferrer">Pexels</a>. As fotos são referências visuais da região.</p>
        </>}
        {photos.result?.status === "unavailable" && <ErrorState message={photos.result.message} retry={photos.retry} />}
      </section>}
    </div>
  );
}
