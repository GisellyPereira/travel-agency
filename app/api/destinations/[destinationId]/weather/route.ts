import { getDestinationLocation } from "../../../../data/destination-locations";
import { getWeather } from "../../../../lib/discovery-providers";

export async function GET(_request: Request, context: { params: Promise<{ destinationId: string }> }) {
  const { destinationId } = await context.params;
  const location = getDestinationLocation(destinationId);
  if (!location) return Response.json({ status: "unavailable", message: "Destino não encontrado." }, { status: 404 });
  const result = await getWeather(location);
  return Response.json(result, { headers: { "Netlify-Vary": "query", "Cache-Control": result.status === "ready" ? "public, max-age=60, s-maxage=900" : "no-store" } });
}
