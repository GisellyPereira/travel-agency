import { searchExplorer } from "../../../lib/explore-providers";
import type { ExplorerPlace } from "../../../lib/explore-types";

const regions: Record<string, string[]> = {
  mundo: ["Paris", "Rio de Janeiro", "Kyoto", "Lisboa", "Cape Town", "Sydney", "Reykjavik", "Buenos Aires", "Barcelona", "Vancouver", "Marrakesh", "Bangkok", "Roma", "Salvador", "Seoul", "Cusco", "Prague", "Istanbul", "Edinburgh", "Cartagena", "Copenhagen", "Dubrovnik", "Lima", "Tokyo"],
  americas: ["Rio de Janeiro", "Salvador", "Buenos Aires", "Cusco", "Cartagena", "Vancouver", "Lima", "Mexico City", "Santiago", "New York", "Montreal", "Recife", "Fortaleza", "Bogota", "Quito", "San Francisco"],
  europa: ["Paris", "Lisboa", "Roma", "Barcelona", "Reykjavik", "Prague", "Edinburgh", "Copenhagen", "Dubrovnik", "Amsterdam", "Porto", "Vienna", "Florence", "Athens", "Madrid", "Berlin"],
  asia: ["Kyoto", "Tokyo", "Seoul", "Bangkok", "Singapore", "Hanoi", "Jaipur", "Osaka", "Taipei", "Ubud", "Kathmandu", "Hoi An", "Kuala Lumpur", "Yogyakarta", "Mumbai", "Beijing"],
  africa: ["Cape Town", "Marrakesh", "Cairo", "Nairobi", "Essaouira", "Dakar", "Fes", "Zanzibar", "Sydney", "Melbourne", "Auckland", "Queenstown", "Perth", "Wellington", "Adelaide", "Brisbane"],
};
const countrySets: Record<string, Set<string>> = {
  europa: new Set(["FR", "PT", "IT", "ES", "IS", "CZ", "GB", "DK", "HR", "NL", "AT", "GR", "DE"]),
  americas: new Set(["BR", "AR", "PE", "CO", "CA", "MX", "CL", "US", "EC"]),
  asia: new Set(["JP", "KR", "TH", "SG", "VN", "IN", "TW", "ID", "NP", "MY", "CN"]),
  africa: new Set(["ZA", "MA", "EG", "KE", "SN", "TZ", "AU", "NZ"]),
};
const cache = new Map<string, { expires: number; places: ExplorerPlace[] }>();
const pending = new Map<string, Promise<ExplorerPlace[]>>();
async function discover(region: string): Promise<ExplorerPlace[]> {
  const stored = cache.get(region);
  if (stored && stored.expires > Date.now()) return stored.places;
  if (pending.has(region)) return pending.get(region)!;
  const task = (async () => {
    const places: ExplorerPlace[] = [];
    const queries = regions[region];
    // Four concurrent geocoder requests, reused by the provider cache.
    for (let i = 0; i < queries.length; i += 4) {
      const batch = await Promise.all(queries.slice(i, i + 4).map(async query => {
        const result = await searchExplorer(query, "city");
        if (result.status !== "ready") return null;
        const candidates = result.data.places.filter(place => !countrySets[region] || countrySets[region].has(place.countryCode));
        return [...candidates].sort((a, b) => (b.population ?? 0) - (a.population ?? 0))[0] ?? null;
      }));
      for (const place of batch) if (place && !places.some(item => item.id === place.id)) places.push(place);
    }
    if (places.length) cache.set(region, { expires: Date.now() + (places.length === queries.length ? 3600_000 : 30_000), places });
    return places;
  })().finally(() => pending.delete(region));
  pending.set(region, task);
  return task;
}
export async function GET(request: Request) {
  const region = new URL(request.url).searchParams.get("region") ?? "mundo";
  if (!Object.hasOwn(regions, region)) return Response.json({ status: "unavailable", message: "Escolha uma região válida." }, { status: 400 });
  const places = await discover(region);
  return Response.json(places.length ? { status: "ready", data: { query: region, kind: "city", places, source: "geonames" } } : { status: "unavailable", message: "Os destinos não puderam ser carregados. Tente novamente." }, { headers: { "Netlify-Vary": "query", "Cache-Control": places.length ? "public, max-age=300" : "no-store" } });
}
