import { getExplorerWeather, parseExplorerCoordinates } from "../../../lib/explore-providers";

export async function GET(request: Request) {
  const location = parseExplorerCoordinates(new URL(request.url).searchParams);
  if (!location) return Response.json({ status: "unavailable", message: "Localização inválida." }, { status: 400 });
  const result = await getExplorerWeather(location);
  return Response.json(result, { headers: { "Netlify-Vary": "query", "Cache-Control": result.status === "ready" ? "public, max-age=60, s-maxage=900" : "no-store" } });
}
