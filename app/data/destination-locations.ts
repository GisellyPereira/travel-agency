export type DestinationLocation = {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  radius: number;
  photoQuery: string;
};

const locations: Record<string, DestinationLocation> = {
  alpes: { id: "alpes", city: "Kandersteg", country: "Suíça", latitude: 46.4945, longitude: 7.6745, radius: 15000, photoQuery: "Kandersteg Switzerland Alps" },
  lisboa: { id: "lisboa", city: "Lisboa", country: "Portugal", latitude: 38.7223, longitude: -9.1393, radius: 7000, photoQuery: "Lisbon Portugal" },
  kyoto: { id: "kyoto", city: "Kyoto", country: "Japão", latitude: 35.0116, longitude: 135.7681, radius: 7000, photoQuery: "Kyoto Japan" },
  bali: { id: "bali", city: "Ubud, Bali", country: "Indonésia", latitude: -8.5069, longitude: 115.2625, radius: 15000, photoQuery: "Bali Indonesia" },
  islandia: { id: "islandia", city: "Reykjavík", country: "Islândia", latitude: 64.1466, longitude: -21.9426, radius: 10000, photoQuery: "Iceland Reykjavik" },
  rio: { id: "rio", city: "Rio de Janeiro", country: "Brasil", latitude: -22.9068, longitude: -43.1729, radius: 12000, photoQuery: "Rio de Janeiro Brazil" },
};

/** Only the curated destinations can call an external provider. */
export function getDestinationLocation(id: string): DestinationLocation | undefined {
  return Object.hasOwn(locations, id) ? locations[id] : undefined;
}
