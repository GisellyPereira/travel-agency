import { cleanExplorerText, getExplorerNearby, isPlaceCategory, parseExplorerCoordinates, parseExplorerOffset } from "../../../lib/explore-providers";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const location = parseExplorerCoordinates(params), category = params.get("category") ?? "culture", offset = parseExplorerOffset(params.get("offset")), query = cleanExplorerText(params.get("query") ?? "", 0, 100);
  if (!location || !isPlaceCategory(category) || offset === undefined || query === undefined) return Response.json({ status: "unavailable", message: "Localização ou categoria inválida." }, { status: 400 });
  const result = await getExplorerNearby(location, category, offset, query);
  return Response.json(result, { headers: { "Cache-Control": result.status === "ready" ? "public, max-age=300, s-maxage=3600" : "no-store" } });
}
