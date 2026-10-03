import { getDestinationLocation } from "../../../../data/destination-locations";
import { cleanExplorerText, getExplorerNearby, isPlaceCategory, parseExplorerOffset } from "../../../../lib/explore-providers";

export async function GET(request: Request, context: { params: Promise<{ destinationId: string }> }) {
  const { destinationId } = await context.params;
  const location = getDestinationLocation(destinationId);
  if (!location) return Response.json({ status: "unavailable", message: "Destino não encontrado." }, { status: 404 });
  const params = new URL(request.url).searchParams;
  const category = params.get("category") ?? "culture", offset = parseExplorerOffset(params.get("offset")), query = cleanExplorerText(params.get("query") ?? "", 0, 100);
  if (!isPlaceCategory(category) || offset === undefined || query === undefined) return Response.json({ status: "unavailable", message: "Categoria ou busca inválida." }, { status: 400 });
  const result = await getExplorerNearby({ latitude: location.latitude, longitude: location.longitude, name: location.city }, category, offset, query);
  return Response.json(result, { headers: { "Netlify-Vary": "query", "Cache-Control": result.status === "ready" ? "public, max-age=60, s-maxage=3600" : "no-store" } });
}
