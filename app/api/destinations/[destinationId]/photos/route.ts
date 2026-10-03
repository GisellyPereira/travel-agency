import { getDestinationLocation } from "../../../../data/destination-locations";
import { getPhotos } from "../../../../lib/discovery-providers";

export async function GET(_request: Request, context: { params: Promise<{ destinationId: string }> }) {
  const { destinationId } = await context.params;
  const location = getDestinationLocation(destinationId);
  if (!location) return Response.json({ status: "unavailable", message: "Destino não encontrado." }, { status: 404 });
  const result = await getPhotos(location);
  return Response.json(result, { headers: { "Cache-Control": result.status === "ready" ? "public, max-age=60, s-maxage=86400" : "no-store" } });
}
