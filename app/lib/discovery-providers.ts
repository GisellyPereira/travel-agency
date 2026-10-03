import "server-only";
import type { DestinationLocation } from "../data/destination-locations";
import type { DiscoveryResult, WeatherData, Place, PlaceCategory, PlacesData, DestinationPhoto, PhotosData } from "./discovery-types";

// This module is imported by server Route Handlers only. Credentials never enter a client bundle.
type JsonObject = Record<string, unknown>;
type Fetcher = typeof fetch;
type Cached = { expires: number; value: unknown };
const cache = new Map<string, Cached>();
const pending = new Map<string, Promise<unknown>>();
const WEATHER_CACHE = 15 * 60_000;
const PLACES_CACHE = 60 * 60_000;
const PHOTOS_CACHE = 24 * 60 * 60_000;

function object(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
}
function number(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.slice(0, 1000) : undefined;
}
function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
function safeUrl(value: unknown, domain: string): string | undefined {
  const text = string(value);
  if (!text) return;
  try {
    const url = new URL(text);
    if (url.protocol === "https:" && (url.hostname === domain || url.hostname.endsWith(`.${domain}`))) return url.toString();
  } catch { /* Untrusted provider links are omitted. */ }
}
async function json(url: URL, revalidate: number, fetcher: Fetcher, headers?: Record<string, string>): Promise<unknown> {
  const response = await fetcher(url, { headers, signal: AbortSignal.timeout(8_000), next: { revalidate } });
  if (!response.ok) throw new Error("Provider request failed");
  return response.json();
}
async function cached<T>(key: string, ttl: number, work: () => Promise<DiscoveryResult<T>>): Promise<DiscoveryResult<T>> {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.value as DiscoveryResult<T>;
  const existing = pending.get(key);
  if (existing) return existing as Promise<DiscoveryResult<T>>;
  if (pending.size >= 24) return { status: "unavailable", message: "A busca está ocupada agora. Tente novamente em instantes." };
  const request = work().then(value => {
    // Brief failure caching prevents repeatedly hitting a provider during an outage.
    for (const [entryKey, entryValue] of cache) if (entryValue.expires <= Date.now()) cache.delete(entryKey);
    while (cache.size >= 180) cache.delete(cache.keys().next().value!);
    cache.set(key, { expires: Date.now() + (value.status === "ready" ? ttl : 30_000), value });
    return value;
  }).finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}
function parseWeather(value: unknown, city: string): WeatherData {
  const root = object(value), current = object(root.current), daily = object(root.daily);
  const temperature = number(current.temperature_2m), feelsLike = number(current.apparent_temperature), windSpeed = number(current.wind_speed_10m), weatherCode = number(current.weather_code), observedAt = string(current.time);
  if (temperature === undefined || feelsLike === undefined || windSpeed === undefined || weatherCode === undefined || !observedAt || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(observedAt)) throw new Error("Invalid weather response");
  const dates = list(daily.time), minimum = list(daily.temperature_2m_min), maximum = list(daily.temperature_2m_max), codes = list(daily.weather_code), rain = list(daily.precipitation_probability_max);
  const days = dates.slice(0, 5).flatMap((date, index) => {
    const min = number(minimum[index]), max = number(maximum[index]), code = number(codes[index]);
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || min === undefined || max === undefined || code === undefined) return [];
    return [{ date, min, max, weatherCode: code, rainChance: number(rain[index]) ?? null }];
  });
  if (!days.length) throw new Error("Invalid forecast response");
  return { city, temperature, feelsLike, windSpeed, weatherCode, observedAt, isDay: current.is_day === 1, timezone: string(root.timezone) ?? "Horário local", days };
}

export async function getWeather(location: DestinationLocation, fetcher: Fetcher = fetch): Promise<DiscoveryResult<WeatherData>> {
  return cached(`weather:${location.id}`, WEATHER_CACHE, async () => {
    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.search = new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude), current: "temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m", daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max", timezone: "auto", forecast_days: "5" }).toString();
      return { status: "ready", data: parseWeather(await json(url, 900, fetcher), location.city) };
    } catch {
      return { status: "unavailable", message: "O clima não pôde ser atualizado agora. Tente novamente em instantes." };
    }
  });
}

/** Coordinate weather extends the guide to any searched location without growing a static destination list. */
export async function getWeatherAtCoordinates(latitude: number, longitude: number, city: string, fetcher: Fetcher = fetch): Promise<DiscoveryResult<WeatherData>> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return { status: "unavailable", message: "Localização inválida." };
  const result = await getWeather({ id: `coordinates:${latitude}:${longitude}`, latitude, longitude, city: "", country: "", radius: 5000, photoQuery: "" }, fetcher);
  return result.status === "ready" ? { status: "ready", data: { ...result.data, city } } : result;
}

const categories: Record<PlaceCategory, string> = { eat: "catering.restaurant", coffee: "catering.cafe", culture: "entertainment.museum,tourism.sights", nature: "natural,leisure.park", stay: "accommodation.hotel" };
export function isPlaceCategory(value: string): value is PlaceCategory {
  return Object.hasOwn(categories, value);
}
function parsePlaces(value: unknown): Place[] {
  const unique = new Set<string>();
  return list(object(value).features).flatMap(feature => {
    const properties = object(object(feature).properties);
    const name = string(properties.name), id = string(properties.place_id), latitude = number(properties.lat), longitude = number(properties.lon);
    if (!name || !id || latitude === undefined || longitude === undefined || Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || unique.has(id)) return [];
    unique.add(id);
    return [{ id, name, latitude, longitude, address: string(properties.address_line2) ?? string(properties.formatted) ?? "Endereço não informado", distance: number(properties.distance) ?? null }];
  }).slice(0, 6);
}
export async function getPlaces(location: DestinationLocation, category: PlaceCategory, fetcher: Fetcher = fetch): Promise<DiscoveryResult<PlacesData>> {
  const key = process.env.GEOAPIFY_API_KEY?.trim();
  if (!key) return { status: "not-configured", message: "A busca de lugares ainda não está disponível neste guia." };
  return cached(`places:${location.id}:${category}`, PLACES_CACHE, async () => {
    try {
      const url = new URL("https://api.geoapify.com/v2/places");
      url.search = new URLSearchParams({ categories: categories[category], filter: `circle:${location.longitude},${location.latitude},${location.radius}`, bias: `proximity:${location.longitude},${location.latitude}`, limit: "12", apiKey: key }).toString();
      const result = await json(url, 3600, fetcher);
      if (!Array.isArray(object(result).features)) throw new Error("Invalid places response");
      return { status: "ready", data: { city: location.city, category, radius: location.radius, places: parsePlaces(result) } };
    } catch {
      return { status: "unavailable", message: "Não foi possível buscar os lugares agora. Tente novamente em instantes." };
    }
  });
}
function parsePhotos(value: unknown): DestinationPhoto[] {
  const unique = new Set<number>();
  return list(object(value).photos).flatMap(photo => {
    const entry = object(photo), source = object(entry.src);
    const id = number(entry.id), image = safeUrl(source.large, "images.pexels.com"), url = safeUrl(entry.url, "pexels.com"), photographerUrl = safeUrl(entry.photographer_url, "pexels.com"), photographer = string(entry.photographer);
    if (id === undefined || !image || !url || !photographerUrl || !photographer || unique.has(id)) return [];
    unique.add(id);
    return [{ id, image, url, photographer, photographerUrl, alt: string(entry.alt) ?? "Fotografia do destino no Pexels" }];
  }).slice(0, 4);
}
export async function getPhotos(location: DestinationLocation, fetcher: Fetcher = fetch): Promise<DiscoveryResult<PhotosData>> {
  const key = process.env.PEXELS_API_KEY?.trim();
  if (!key) return { status: "not-configured", message: "Novas fotografias deste destino estarão disponíveis em breve." };
  return cached(`photos:${location.id}`, PHOTOS_CACHE, async () => {
    try {
      const url = new URL("https://api.pexels.com/v1/search");
      url.search = new URLSearchParams({ query: location.photoQuery, orientation: "landscape", per_page: "4" }).toString();
      const result = await json(url, 86400, fetcher, { Authorization: key });
      if (!Array.isArray(object(result).photos)) throw new Error("Invalid photos response");
      return { status: "ready", data: { city: location.city, photos: parsePhotos(result) } };
    } catch {
      return { status: "unavailable", message: "As fotografias não puderam ser carregadas agora. Tente novamente em instantes." };
    }
  });
}
