export type DiscoveryResult<T> =
  | { status: "ready"; data: T }
  | { status: "unavailable" | "not-configured"; message: string };

export type WeatherData = {
  city: string;
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  observedAt: string;
  timezone: string;
  days: { date: string; min: number; max: number; weatherCode: number; rainChance: number | null }[];
};
export const placeCategories = [
  { id: "eat", label: "Comer" },
  { id: "coffee", label: "Cafés" },
  { id: "culture", label: "Conhecer" },
  { id: "nature", label: "Natureza" },
  { id: "stay", label: "Ficar" },
] as const;
export type PlaceCategory = (typeof placeCategories)[number]["id"];
export type Place = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number | null;
};
export type PlacesData = { city: string; category: PlaceCategory; radius: number; places: Place[] };
export type DestinationPhoto = { id: number; image: string; alt: string; url: string; photographer: string; photographerUrl: string };
export type PhotosData = { city: string; photos: DestinationPhoto[] };

export function weatherDescription(code: number): string {
  if (code === 0) return "Céu aberto";
  if (code === 1) return "Quase sem nuvens";
  if (code === 2) return "Sol entre nuvens";
  if (code === 3) return "Nublado";
  if (code === 45 || code === 48) return "Neblina";
  if ([51, 53, 55, 56, 57].includes(code)) return "Garoa";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Chuva";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Neve";
  if ([95, 96, 99].includes(code)) return "Trovoadas";
  return "Condições variáveis";
}
