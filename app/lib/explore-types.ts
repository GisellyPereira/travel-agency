import type { Place, PlaceCategory } from "./discovery-types";

export type ExplorerPlace = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  latitude: number;
  longitude: number;
  kind: string;
  timezone?: string;
  population?: number;
  source: "geonames" | "openstreetmap";
};
export type SearchKind = "city" | "place";
export type SearchData = { query: string; kind: SearchKind; places: ExplorerPlace[]; source: "geonames" | "openstreetmap" };
export type NearbyData = {
  city: string;
  category: PlaceCategory;
  radius: number;
  places: Place[];
  total: number;
  hasMore: boolean;
  source: "geoapify" | "openstreetmap";
};
export type ExplorerCoordinates = { latitude: number; longitude: number; name: string };
