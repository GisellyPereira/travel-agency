import "server-only";
import { getWeatherAtCoordinates, isPlaceCategory } from "./discovery-providers";
import type { DiscoveryResult, Place, PlaceCategory, WeatherData } from "./discovery-types";
import type { ExplorerCoordinates, ExplorerPlace, NearbyData, SearchData, SearchKind } from "./explore-types";

type JsonObject = Record<string, unknown>;
type Fetcher = typeof fetch;
type Snapshot = { places: Place[]; source: NearbyData["source"] };
type CacheEntry = { expires: number; value: unknown };
const cache = new Map<string, CacheEntry>();
const pending = new Map<string, Promise<unknown>>();
const MAX_CACHE_ENTRIES = 180;
const MAX_PENDING = 24;
const RADIUS = 5_000;
const PAGE_SIZE = 12;
const PROVIDER_HEADERS = { "User-Agent": "Giselly-Travel-Agency/1.0 (+https://github.com/GisellyPereira; portfolio destination discovery)", "Accept": "application/json" };
const text = (value: unknown, max = 300): string | undefined => typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined;
const num = (value: unknown): number | undefined => typeof value === "number" && Number.isFinite(value) ? value : undefined;
const obj = (value: unknown): JsonObject => value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
const arr = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const normalize = (value: string): string => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt");
const validCoordinates = (latitude: number | undefined, longitude: number | undefined): boolean => latitude !== undefined && longitude !== undefined && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;

/** Inputs are bounded before being interpolated or sent to any provider. */
export function cleanExplorerText(value: string | null, min = 0, max = 100): string | undefined {
  if (value === null || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) return;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned.length >= min && cleaned.length <= max ? cleaned : undefined;
}
export function isSearchKind(value: string): value is SearchKind { return value === "city" || value === "place"; }
export function parseExplorerCoordinates(params: URLSearchParams): ExplorerCoordinates | undefined {
  const latitudeValue = params.get("lat"), longitudeValue = params.get("lon");
  if (!latitudeValue || !longitudeValue || !/^[+-]?\d{1,3}(?:\.\d{1,12})?$/.test(latitudeValue) || !/^[+-]?\d{1,3}(?:\.\d{1,12})?$/.test(longitudeValue)) return;
  const latitude = Number(latitudeValue), longitude = Number(longitudeValue), name = cleanExplorerText(params.get("name"), 1, 120);
  if (!validCoordinates(latitude, longitude) || !name) return;
  return { latitude, longitude, name };
}
export function parseExplorerOffset(value: string | null): number | undefined {
  if (value === null) return 0;
  if (!/^\d{1,5}$/.test(value)) return;
  const offset = Number(value);
  return offset <= 10_000 ? offset : undefined;
}
export { isPlaceCategory };

async function memo<T>(key: string, ttl: number, work: () => Promise<DiscoveryResult<T>>): Promise<DiscoveryResult<T>> {
  const saved = cache.get(key);
  if (saved && saved.expires > Date.now()) { cache.delete(key); cache.set(key, saved); return saved.value as DiscoveryResult<T>; }
  cache.delete(key);
  const existing = pending.get(key);
  if (existing) return existing as Promise<DiscoveryResult<T>>;
  if (pending.size >= MAX_PENDING) return { status: "unavailable", message: "A busca está ocupada agora. Tente novamente em instantes." };
  const request = work().then(value => {
    for (const [entryKey, entry] of cache) if (entry.expires <= Date.now()) cache.delete(entryKey);
    while (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
    cache.set(key, { expires: Date.now() + (value.status === "ready" ? ttl : 30_000), value });
    return value;
  }).finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}
async function providerJson(url: URL, fetcher: Fetcher, options: RequestInit = {}, timeout = 12_000): Promise<unknown> {
  const response = await fetcher(url, { ...options, headers: { ...PROVIDER_HEADERS, ...options.headers }, signal: AbortSignal.timeout(timeout), cache: "no-store" });
  if (!response.ok) throw new Error("Provider unavailable");
  return response.json();
}
function cityResults(value: unknown): ExplorerPlace[] {
  const root = obj(value);
  if (root.error || (root.results !== undefined && !Array.isArray(root.results))) throw new Error("Invalid search response");
  const unique = new Set<string>();
  return arr(root.results).slice(0, 100).flatMap(raw => {
    const place = obj(raw), id = num(place.id), name = text(place.name), latitude = num(place.latitude), longitude = num(place.longitude);
    const country = text(place.country), countryCode = text(place.country_code), feature = text(place.feature_code);
    // The geocoder also indexes mountains, airports and postal codes. This mode is explicitly for settlements.
    if (id === undefined || !Number.isSafeInteger(id) || id < 1 || !name || !country || !countryCode || !/^[a-z]{2}$/i.test(countryCode) || !feature?.startsWith("PPL") || !validCoordinates(latitude, longitude)) return [];
    const resultId = `geonames:${id}`;
    if (unique.has(resultId)) return [];
    unique.add(resultId);
    const population = num(place.population);
    return [{ id: resultId, name, country, countryCode: countryCode.toUpperCase(), region: text(place.admin1), latitude: latitude!, longitude: longitude!, kind: "city", timezone: text(place.timezone), population: population !== undefined && Number.isSafeInteger(population) && population >= 0 ? population : undefined, source: "geonames" as const }];
  });
}
function photonResults(value: unknown): ExplorerPlace[] {
  const root = obj(value);
  if (!Array.isArray(root.features)) throw new Error("Invalid search response");
  const unique = new Set<string>();
  return arr(root.features).slice(0, 50).flatMap(raw => {
    const feature = obj(raw), place = obj(feature.properties), geometry = obj(feature.geometry), coordinates = arr(geometry.coordinates);
    const name = text(place.name), country = text(place.country), countryCode = text(place.countrycode), id = num(place.osm_id), type = text(place.osm_type);
    const longitude = num(coordinates[0]), latitude = num(coordinates[1]);
    if (!name || !country || !countryCode || !/^[a-z]{2}$/i.test(countryCode) || id === undefined || !Number.isSafeInteger(id) || id < 1 || !type || !/^[NWR]$/.test(type) || geometry.type !== "Point" || !validCoordinates(latitude, longitude)) return [];
    const resultId = `osm:${type}:${id}`;
    if (unique.has(resultId)) return [];
    unique.add(resultId);
    return [{ id: resultId, name, country, countryCode: countryCode.toUpperCase(), region: text(place.city) ?? text(place.state), latitude: latitude!, longitude: longitude!, kind: text(place.osm_value) ?? text(place.type) ?? "place", source: "openstreetmap" as const }];
  });
}
async function localizedPlaceAlias(query: string, fetcher: Fetcher): Promise<{ name: string; latitude: number; longitude: number } | undefined> {
  try {
    // A public interlanguage link resolves Portuguese landmark names; there is no hand-maintained destination alias list.
    const url = new URL("https://pt.wikipedia.org/w/api.php");
    url.search = new URLSearchParams({ action: "query", generator: "search", gsrsearch: query, gsrnamespace: "0", gsrlimit: "3", prop: "coordinates|langlinks", coprimary: "primary", lllang: "en", lllimit: "10", redirects: "1", format: "json", formatversion: "2" }).toString();
    const value = await providerJson(url, fetcher, {}, 5_000);
    for (const raw of arr(obj(obj(value).query).pages)) {
      const page = obj(raw), title = text(page.title), link = obj(arr(page.langlinks).find(rawLink => obj(rawLink).lang === "en"));
      const name = text(link.title) ?? text(link["*"]);
      if (page.ns !== 0 || !title || normalize(title.replace(/\s*\([^)]*\)\s*$/, "")) !== normalize(query) || !name || name.length > 100 || normalize(name) === normalize(query)) continue;
      let coordinate = obj(arr(page.coordinates)[0]);
      let latitude = num(coordinate.lat), longitude = num(coordinate.lon);
      // Some translated articles omit GeoData. Resolve coordinates from the linked original article rather than guessing.
      if (!validCoordinates(latitude, longitude)) {
        const englishUrl = new URL("https://en.wikipedia.org/w/api.php");
        englishUrl.search = new URLSearchParams({ action: "query", titles: name, prop: "coordinates", coprimary: "primary", redirects: "1", format: "json", formatversion: "2" }).toString();
        const englishValue = await providerJson(englishUrl, fetcher, {}, 5_000);
        const englishPage = arr(obj(obj(englishValue).query).pages).map(obj).find(article => article.ns === 0 && normalize(text(article.title) ?? "") === normalize(name));
        coordinate = obj(arr(englishPage?.coordinates)[0]);
        latitude = num(coordinate.lat); longitude = num(coordinate.lon);
      }
      if (!validCoordinates(latitude, longitude) || (coordinate.globe && coordinate.globe !== "earth")) continue;
      return { name, latitude: latitude!, longitude: longitude! };
    }
  } catch { /* Optional name localization never blocks the original geocoder. */ }
}
async function photonSearch(query: string, fetcher: Fetcher, focus?: { latitude: number; longitude: number }): Promise<ExplorerPlace[]> {
  const url = new URL("https://photon.komoot.io/api/");
  url.search = new URLSearchParams({ q: query, limit: "50", lang: "en", ...(focus ? { lat: String(focus.latitude), lon: String(focus.longitude), zoom: "16", location_bias_scale: "0" } : {}) }).toString();
  return photonResults(await providerJson(url, fetcher, {}, 10_000));
}
export async function searchExplorer(query: string, kind: SearchKind, fetcher: Fetcher = fetch): Promise<DiscoveryResult<SearchData>> {
  const cleaned = cleanExplorerText(query, 2, 100);
  if (!cleaned || !isSearchKind(kind)) return { status: "unavailable", message: "Digite ao menos duas letras para pesquisar." };
  const result = await memo(`search:${kind}:${normalize(cleaned)}`, 30 * 60_000, async () => {
    try {
      let places: ExplorerPlace[];
      if (kind === "city") {
        const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
        url.search = new URLSearchParams({ name: cleaned, count: "100", language: "pt", format: "json" }).toString();
        places = cityResults(await providerJson(url, fetcher));
      } else {
        const [original, aliasResult] = await Promise.allSettled([photonSearch(cleaned, fetcher), localizedPlaceAlias(cleaned, fetcher)]);
        const alias = aliasResult.status === "fulfilled" ? aliasResult.value : undefined;
        const originalPlaces = original.status === "fulfilled" ? original.value : [];
        let translated: ExplorerPlace[] = [];
        if (alias) {
          try {
            translated = await photonSearch(alias.name, fetcher, alias);
            const localMatches = translated.filter(place => distance(alias.latitude, alias.longitude, place.latitude, place.longitude) <= 10_000);
            if (localMatches.length) translated = localMatches;
          } catch { /* Keep successful original results. */ }
        }
        if (original.status === "rejected" && !translated.length) throw new Error("Search providers unavailable");
        const unique = new Set<string>();
        const realPlaces: ExplorerPlace[] = [];
        places = (translated.length ? translated : originalPlaces).filter(place => {
          if (unique.has(place.id) || realPlaces.some(existing => existing.countryCode === place.countryCode && normalize(existing.name) === normalize(place.name) && distance(existing.latitude, existing.longitude, place.latitude, place.longitude) < 100)) return false;
          unique.add(place.id); realPlaces.push(place); return true;
        }).slice(0, 100);
      }
      return { status: "ready" as const, data: { query: cleaned, kind, places, source: kind === "city" ? "geonames" as const : "openstreetmap" as const } };
    } catch {
      return { status: "unavailable" as const, message: "Não foi possível pesquisar agora. Tente novamente em instantes." };
    }
  });
  // Case/diacritic variants share data without returning another user's query string.
  return result.status === "ready" ? { status: "ready", data: { ...result.data, query: cleaned } } : result;
}
export async function getExplorerWeather(location: ExplorerCoordinates, fetcher: Fetcher = fetch): Promise<DiscoveryResult<WeatherData>> {
  if (!validCoordinates(location.latitude, location.longitude) || !cleanExplorerText(location.name, 1, 120)) return { status: "unavailable", message: "Localização inválida." };
  return getWeatherAtCoordinates(location.latitude, location.longitude, location.name, fetcher);
}
const overpassTags: Record<PlaceCategory, string[]> = {
  eat: ['["amenity"~"^(restaurant|fast_food|food_court)$"]'],
  coffee: ['["amenity"="cafe"]'],
  culture: ['["tourism"~"^(museum|gallery|attraction)$"]', '["historic"~"^(monument|memorial|castle|ruins|archaeological_site)$"]', '["amenity"~"^(theatre|arts_centre)$"]'],
  nature: ['["leisure"~"^(park|nature_reserve|garden)$"]', '["natural"~"^(beach|peak|waterfall|wood)$"]', '["tourism"="viewpoint"]'],
  stay: ['["tourism"~"^(hotel|hostel|guest_house|motel|apartment)$"]'],
};
const geoCategories: Record<PlaceCategory, string> = { eat: "catering.restaurant,catering.fast_food", coffee: "catering.cafe", culture: "entertainment.museum,tourism.sights", nature: "natural,leisure.park", stay: "accommodation" };
const photonTags: Record<PlaceCategory, string[]> = {
  eat: ["amenity:restaurant", "amenity:fast_food", "amenity:food_court"],
  coffee: ["amenity:cafe"],
  culture: ["tourism:museum", "tourism:gallery", "tourism:attraction", "historic:monument", "historic:memorial", "historic:castle", "historic:ruins", "historic:archaeological_site", "amenity:theatre", "amenity:arts_centre"],
  nature: ["leisure:park", "leisure:nature_reserve", "leisure:garden", "natural:beach", "natural:peak", "natural:waterfall", "natural:wood", "tourism:viewpoint"],
  stay: ["tourism:hotel", "tourism:hostel", "tourism:guest_house", "tourism:motel", "tourism:apartment"],
};
function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const radians = (value: number) => value * Math.PI / 180;
  const a = Math.sin(radians(lat2 - lat1) / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(radians(lon2 - lon1) / 2) ** 2;
  return Math.round(6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a))));
}
function dedupeSort(places: Place[]): Place[] {
  const uniqueIds = new Set<string>(), uniquePositions = new Set<string>();
  return places.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)).filter(place => {
    const position = `${normalize(place.name)}:${place.latitude.toFixed(4)}:${place.longitude.toFixed(4)}`;
    if (uniqueIds.has(place.id) || uniquePositions.has(position)) return false;
    uniqueIds.add(place.id); uniquePositions.add(position); return true;
  });
}
function osmPlaces(value: unknown, location: ExplorerCoordinates): Place[] {
  const root = obj(value);
  if (!Array.isArray(root.elements) || root.remark) throw new Error("Invalid or incomplete places response");
  return dedupeSort(arr(root.elements).slice(0, 5_000).flatMap(raw => {
    const entry = obj(raw), tags = obj(entry.tags), center = obj(entry.center), name = text(tags["name:pt"]) ?? text(tags.name) ?? text(tags["name:en"]);
    const latitude = num(entry.lat) ?? num(center.lat), longitude = num(entry.lon) ?? num(center.lon), id = num(entry.id), type = text(entry.type);
    if (!name || id === undefined || !Number.isSafeInteger(id) || !type || !["node", "way", "relation"].includes(type) || !validCoordinates(latitude, longitude)) return [];
    const meters = distance(location.latitude, location.longitude, latitude!, longitude!);
    if (meters > RADIUS) return [];
    const street = [text(tags["addr:street"]), text(tags["addr:housenumber"])].filter(Boolean).join(", ");
    const address = [street, text(tags["addr:suburb"]) ?? text(tags["addr:city"])].filter(Boolean).join(" · ") || "Veja a localização no mapa";
    return [{ id: `osm:${type}:${id}`, name, address, latitude: latitude!, longitude: longitude!, distance: meters }];
  }));
}
function geoPlaces(value: unknown, location: ExplorerCoordinates): Place[] {
  const root = obj(value);
  if (!Array.isArray(root.features)) throw new Error("Invalid places response");
  return dedupeSort(arr(root.features).flatMap(raw => {
    const place = obj(obj(raw).properties), name = text(place.name), id = text(place.place_id), latitude = num(place.lat), longitude = num(place.lon);
    if (!name || !id || !validCoordinates(latitude, longitude)) return [];
    const meters = distance(location.latitude, location.longitude, latitude!, longitude!);
    if (meters > RADIUS) return [];
    return [{ id: `geoapify:${id}`, name, address: text(place.address_line2) ?? text(place.formatted) ?? "Veja a localização no mapa", latitude: latitude!, longitude: longitude!, distance: meters }];
  }));
}
function photonNearbyPlaces(value: unknown, location: ExplorerCoordinates, category: PlaceCategory): Place[] {
  const root = obj(value);
  if (!Array.isArray(root.features)) throw new Error("Invalid places response");
  return dedupeSort(arr(root.features).slice(0, 100).flatMap(raw => {
    const feature = obj(raw), place = obj(feature.properties), geometry = obj(feature.geometry), coordinates = arr(geometry.coordinates);
    const name = text(place.name), id = num(place.osm_id), type = text(place.osm_type), latitude = num(coordinates[1]), longitude = num(coordinates[0]);
    if (!name || id === undefined || !Number.isSafeInteger(id) || id < 1 || !type || !/^[NWR]$/.test(type) || geometry.type !== "Point" || !validCoordinates(latitude, longitude) || !photonTags[category].includes(`${place.osm_key}:${place.osm_value}`)) return [];
    const meters = distance(location.latitude, location.longitude, latitude!, longitude!);
    if (meters > RADIUS) return [];
    const street = [text(place.street), text(place.housenumber)].filter(Boolean).join(", ");
    const address = [street, text(place.district) ?? text(place.city)].filter(Boolean).join(" · ") || "Veja a localização no mapa";
    return [{ id: `osm:${type}:${id}`, name, address, latitude: latitude!, longitude: longitude!, distance: meters }];
  }));
}
function explorerBounds(location: ExplorerCoordinates): string {
  const latitudeDelta = RADIUS / 111_000;
  const longitudeDelta = Math.min(180, RADIUS / (111_000 * Math.max(Math.abs(Math.cos(location.latitude * Math.PI / 180)), 0.0001)));
  const crossesDateLine = location.longitude - longitudeDelta < -180 || location.longitude + longitudeDelta > 180;
  return [crossesDateLine ? -180 : location.longitude - longitudeDelta, Math.max(-90, location.latitude - latitudeDelta), crossesDateLine ? 180 : location.longitude + longitudeDelta, Math.min(90, location.latitude + latitudeDelta)].join(",");
}
async function nearbySnapshot(location: ExplorerCoordinates, category: PlaceCategory, query: string, fetcher: Fetcher): Promise<DiscoveryResult<Snapshot>> {
  const geoKey = process.env.GEOAPIFY_API_KEY?.trim();
  return memo<Snapshot>(`nearby:${geoKey ? "geoapify" : "osm"}:${location.latitude}:${location.longitude}:${category}:${normalize(query)}`, 60 * 60_000, async () => {
    if (geoKey && !query) {
      try {
        const url = new URL("https://api.geoapify.com/v2/places");
        url.search = new URLSearchParams({ categories: geoCategories[category], filter: `circle:${location.longitude},${location.latitude},${RADIUS}`, bias: `proximity:${location.longitude},${location.latitude}`, limit: "100", apiKey: geoKey }).toString();
        return { status: "ready", data: { places: geoPlaces(await providerJson(url, fetcher, {}, 6_000), location), source: "geoapify" } };
      } catch { /* An optional account never blocks the keyless OSM guide. */ }
    }
    try {
      // Photon reverse supports category-filtered discovery, avoiding expensive global Overpass queries for each click.
      const url = new URL(query ? "https://photon.komoot.io/api/" : "https://photon.komoot.io/reverse");
      url.search = new URLSearchParams({ lat: String(location.latitude), lon: String(location.longitude), limit: "100", lang: "en", ...(query ? { q: query, bbox: explorerBounds(location), zoom: "12", location_bias_scale: "0" } : { radius: "5" }) }).toString();
      for (const tag of photonTags[category]) url.searchParams.append("osm_tag", tag);
      const value = await providerJson(url, fetcher, {}, 10_000);
      return { status: "ready", data: { places: photonNearbyPlaces(value, location, category), source: "openstreetmap" } };
    } catch { /* One permitted Overpass alternate keeps the guide usable if the geocoder is busy. */ }
    try {
      // Only validated numbers and a closed category allowlist enter Overpass QL. Name/query never enter this program.
      const program = `[out:json][timeout:18][maxsize:16777216];(${overpassTags[category].map(tags => `nwr(around:${RADIUS},${location.latitude},${location.longitude})${tags}["name"];`).join("")});out center tags 500;`;
      // VK Maps explicitly permits public project usage; its result is filtered back to the exact5km circle.
      const url = new URL("https://maps.mail.ru/osm/tools/overpass/api/interpreter");
      url.searchParams.set("data", program);
      const value = await providerJson(url, fetcher, {}, 22_000);
      const places = osmPlaces(value, location).filter(place => !query || normalize(`${place.name} ${place.address}`).includes(normalize(query)));
      return { status: "ready", data: { places, source: "openstreetmap" } };
    } catch {
      return { status: "unavailable", message: "Os lugares não puderam ser atualizados agora. Tente novamente em instantes." };
    }
  });
}
export async function getExplorerNearby(location: ExplorerCoordinates, category: PlaceCategory, offset = 0, query = "", fetcher: Fetcher = fetch): Promise<DiscoveryResult<NearbyData>> {
  const cleaned = cleanExplorerText(query, 0, 100);
  if (!validCoordinates(location.latitude, location.longitude) || !cleanExplorerText(location.name, 1, 120) || !isPlaceCategory(category) || !Number.isInteger(offset) || offset < 0 || offset > 10_000 || cleaned === undefined) return { status: "unavailable", message: "Busca de lugares inválida." };
  const snapshot = await nearbySnapshot(location, category, cleaned, fetcher);
  if (snapshot.status !== "ready") return snapshot;
  const filtered = snapshot.data.places;
  return { status: "ready", data: { city: location.name, category, radius: RADIUS, places: filtered.slice(offset, offset + PAGE_SIZE), total: filtered.length, hasMore: offset + PAGE_SIZE < filtered.length, source: snapshot.data.source } };
}
