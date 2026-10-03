import "server-only";
import type { DiscoveryResult } from "./discovery-types";
import type { ExplorerPhoto, ExplorerPhotoLocation } from "./explore-photo-types";

type JsonObject = Record<string, unknown>;
type Fetcher = typeof fetch;
type Language = "en" | "pt";
type Article = { title: string; image: string; url: string; description?: string; score: number };
const wikiEndpoints: Record<Language, string> = { en: "https://en.wikipedia.org/w/api.php", pt: "https://pt.wikipedia.org/w/api.php" };
const cache = new Map<string, { expires: number; value: DiscoveryResult<ExplorerPhoto> }>();
const pending = new Map<string, Promise<DiscoveryResult<ExplorerPhoto>>>();
const waiting: { enter: (ready: boolean) => void; timer: ReturnType<typeof setTimeout> }[] = [];
let active = 0;
const unavailable = (): DiscoveryResult<ExplorerPhoto> => ({ status: "unavailable", message: "Ainda não encontramos uma fotografia verificada deste lugar." });

function object(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
}
function array(value: unknown): unknown[] { return Array.isArray(value) ? value : []; }
function number(value: unknown): number | undefined { return typeof value === "number" && Number.isFinite(value) ? value : undefined; }
function string(value: unknown, max = 500): string | undefined { return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined; }
function plain(value: unknown, max = 240): string | undefined {
  const text = string(value, 8_000)?.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ")
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_match, entity: string) => {
      const code = entity[0].toLowerCase() === "x" ? parseInt(entity.slice(1), 16) : parseInt(entity, 10);
      return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : " ";
    }).replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;|&gt;/gi, " ").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, max) : undefined;
}
function normalize(value: string): string { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim(); }
function safeUrl(value: unknown, hosts: string[]): string | undefined {
  const text = string(value, 2_000);
  if (!text) return;
  try {
    const url = new URL(text);
    if (url.protocol === "https:" && hosts.includes(url.hostname) && !url.username && !url.password) {
      url.search = "";
      url.hash = "";
      return url.toString();
    }
  } catch { /* Provider links never become arbitrary fetch targets. */ }
}
function distance(a: number, b: number, c: number, d: number): number {
  const radians = Math.PI / 180;
  const h = Math.sin((c - a) * radians / 2) ** 2 + Math.cos(a * radians) * Math.cos(c * radians) * Math.sin((d - b) * radians / 2) ** 2;
  return 6_371_000 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}
export function validatePhotoLocation(value: ExplorerPhotoLocation): boolean {
  return typeof value.name === "string" && value.name.trim().length >= 2 && value.name.length <= 160 && !/[|\u0000-\u001f\u007f]/.test(value.name)
    && typeof value.country === "string" && value.country.length <= 120 && !/[|\u0000-\u001f\u007f]/.test(value.country)
    && Number.isFinite(value.latitude) && Math.abs(value.latitude) <= 90 && Number.isFinite(value.longitude) && Math.abs(value.longitude) <= 180
    && typeof value.kind === "string" && value.kind.length <= 40 && !/[|\u0000-\u001f\u007f]/.test(value.kind);
}
async function json(endpoint: string, params: Record<string, string>, fetcher: Fetcher): Promise<unknown> {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({ action: "query", format: "json", formatversion: "2", ...params }).toString();
  const response = await fetcher(url, { headers: { "User-Agent": "TravelAgencyPortfolio/1.0 (destination discovery; https://github.com/GisellyPereira/travel-agency)", Accept: "application/json" }, signal: AbortSignal.timeout(5_000), next: { revalidate: 86400 } });
  if (!response.ok) throw new Error("Photo source unavailable");
  const data = await response.json();
  if (object(data).error) throw new Error("Photo source unavailable");
  return data;
}
function matchArticles(data: unknown, location: ExplorerPhotoLocation, language: Language): Article[] {
  const query = object(object(data).query);
  const aliases = new Map<string, string>();
  for (const redirect of [...array(query.normalized), ...array(query.redirects)]) {
    const entry = object(redirect), from = string(entry.from), to = string(entry.to);
    if (from && to) aliases.set(normalize(from), normalize(to));
  }
  let requested = normalize(location.name);
  for (let index = 0; index < 4 && aliases.has(requested); index++) requested = aliases.get(requested)!;
  const kind = normalize(location.kind);
  const city = ["city", "town", "village", "municipality", "administrative", "cidade"].includes(kind);
  const region = ["region", "state", "country", "island", "regiao", "pais"].includes(kind);
  const maximumDistance = city ? 35_000 : region ? 1_500_000 : 3_000;
  return array(query.pages).flatMap(raw => {
    const page = object(raw), title = string(page.title, 180), image = string(page.pageimage, 300);
    const url = safeUrl(page.fullurl, [`${language}.wikipedia.org`]);
    if (page.ns !== 0 || page.missing || !title || !image || !url || /\.(svg|gif|webm|pdf)$/i.test(image) || /(?:^|[_\s])(?:flag|coat.of.arms|logo|map)(?:[_\s.]|$)/i.test(image)) return [];
    const titleName = normalize(title), baseName = normalize(title.replace(/\s*\([^)]*\)\s*$/, "").split(",")[0]);
    const inputName = normalize(location.name);
    const exact = titleName === requested || baseName === requested || baseName === inputName;
    if (!exact) return [];
    const coord = array(page.coordinates).map(object).find(item => item.primary !== false && (!item.globe || item.globe === "earth"));
    const latitude = number(coord?.lat), longitude = number(coord?.lon);
    if (latitude === undefined || longitude === undefined || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return [];
    const separation = distance(location.latitude, location.longitude, latitude, longitude);
    if (separation > maximumDistance) return [];
    const coordinateCountry = string(coord?.country, 4);
    if (/^[A-Z]{2}$/i.test(location.country) && coordinateCountry && coordinateCountry.toUpperCase() !== location.country.toUpperCase()) return [];
    // A city's name and position must match; nearby landmarks never stand in for the city.
    if (city && string(coord?.type) && !["city", "adm1st", "adm2nd", "adm3rd"].includes(String(coord?.type))) return [];
    const description = language === "pt" ? plain(page.extract, 450) : undefined;
    return [{ title, image, url, description, score: (titleName === requested ? 100 : 80) - separation / maximumDistance }];
  }).sort((a, b) => b.score - a.score);
}
async function findArticle(location: ExplorerPhotoLocation, language: Language, fetcher: Fetcher): Promise<Article | undefined> {
  const props = { prop: "coordinates|pageimages|extracts|info", redirects: "1", coprop: "type|country", coprimary: "primary", colimit: "max", piprop: "name", pilicense: "free", exintro: "1", explaintext: "1", exchars: "450", exlimit: "max", inprop: "url" };
  const titles = [location.name, ...(location.country ? [`${location.name} (${location.country})`, `${location.name}, ${location.country}`] : [])];
  const direct = await json(wikiEndpoints[language], { ...props, titles: titles.join("|") }, fetcher);
  const article = matchArticles(direct, location, language)[0];
  if (article) return article;
  const searchName = location.name.replace(/["\\]/g, " ").trim();
  const country = location.country.replace(/["\\]/g, " ").trim();
  const searched = await json(wikiEndpoints[language], { ...props, generator: "search", gsrsearch: `"${searchName}" ${country}`, gsrnamespace: "0", gsrlimit: "4" }, fetcher);
  return matchArticles(searched, location, language)[0];
}
async function photograph(article: Article, fetcher: Fetcher): Promise<ExplorerPhoto | undefined> {
  const result = await json("https://commons.wikimedia.org/w/api.php", { prop: "imageinfo", titles: `File:${article.image}`, iiprop: "url|mime|extmetadata", iiurlwidth: "1200", iiextmetadatafilter: "Artist|Credit|LicenseShortName|LicenseUrl|AttributionRequired", iiextmetadatalanguage: "pt" }, fetcher);
  const page = object(array(object(object(result).query).pages)[0]);
  const info = object(array(page.imageinfo)[0]), metadata = object(info.extmetadata);
  if (!["image/jpeg", "image/png", "image/webp"].includes(String(info.mime))) return;
  // Use the provider's actual scaled image URL; no guessed paths or huge originals.
  const image = safeUrl(info.thumburl, ["upload.wikimedia.org", "thumb.wikimedia.org"]);
  const url = safeUrl(info.descriptionurl, ["commons.wikimedia.org"]);
  const license = plain(object(metadata.LicenseShortName).value, 80);
  const licenseUrl = safeUrl(object(metadata.LicenseUrl).value, ["creativecommons.org", "www.gnu.org", "gnu.org", "opensource.org"])
    // Commons omits LicenseUrl for some public-domain images. The file page is
    // their source of record for that status, rather than an invented license.
    ?? (license && /^(?:public domain|cc0(?: 1\.0)?)$/i.test(license) ? url : undefined);
  const artist = plain(object(metadata.Artist).value, 300);
  if (!image || !url || !license || !licenseUrl || !artist) return;
  return { image, url, attribution: artist, license, licenseUrl, articleUrl: article.url, ...(article.description ? { description: article.description } : {}) };
}
async function reserve(): Promise<(() => void) | undefined> {
  if (active >= 4) {
    if (waiting.length >= 16) return;
    const entered = await new Promise<boolean>(resolve => {
      const waiter = { enter: resolve, timer: setTimeout(() => {
        const index = waiting.indexOf(waiter);
        if (index >= 0) waiting.splice(index, 1);
        resolve(false);
      }, 10_000) };
      waiting.push(waiter);
    });
    if (!entered) return;
  } else active++;
  return () => {
    const next = waiting.shift();
    if (next) { clearTimeout(next.timer); next.enter(true); }
    else active--;
  };
}
export async function getExplorerPhoto(location: ExplorerPhotoLocation, fetcher: Fetcher = fetch): Promise<DiscoveryResult<ExplorerPhoto>> {
  if (!validatePhotoLocation(location)) return unavailable();
  const key = JSON.stringify([normalize(location.name), normalize(location.country), location.latitude.toFixed(4), location.longitude.toFixed(4), normalize(location.kind)]);
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.value;
  const existing = pending.get(key);
  if (existing) return existing;
  if (pending.size >= 24) return unavailable();
  // One deadline includes queue time and every fallback language/metadata request.
  const deadline = AbortSignal.timeout(18_000);
  const boundedFetch: Fetcher = (input, init) => fetcher(input, { ...init, signal: init?.signal ? AbortSignal.any([deadline, init.signal]) : deadline });
  const request = (async (): Promise<DiscoveryResult<ExplorerPhoto>> => {
    const release = await reserve();
    if (!release) return unavailable();
    try {
      if (deadline.aborted) return unavailable();
      const article = await findArticle(location, "en", boundedFetch) ?? await findArticle(location, "pt", boundedFetch);
      if (!article) return unavailable();
      const photo = await photograph(article, boundedFetch);
      return photo ? { status: "ready", data: photo } : unavailable();
    } catch { return unavailable(); }
    finally { release(); }
  })().then(value => {
    for (const [existingKey, item] of cache) if (item.expires <= Date.now()) cache.delete(existingKey);
    if (cache.size >= 256) cache.delete(cache.keys().next().value!);
    cache.set(key, { expires: Date.now() + (value.status === "ready" ? 86_400_000 : 60_000), value });
    return value;
  }).finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}
