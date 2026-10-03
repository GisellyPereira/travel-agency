import { getExplorerPhoto, validatePhotoLocation } from "../../../lib/explore-photo";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const latitude = params.get("lat"), longitude = params.get("lon");
  const location = { name: params.get("name") ?? "", country: params.get("country") ?? "", latitude: latitude?.trim() ? Number(latitude) : NaN, longitude: longitude?.trim() ? Number(longitude) : NaN, kind: params.get("kind") ?? "place" };
  if (!validatePhotoLocation(location)) return Response.json({ status: "unavailable", message: "Informe um lugar e coordenadas válidas." }, { status: 400 });
  const result = await getExplorerPhoto(location);
  return Response.json(result, { headers: { "Cache-Control": result.status === "ready" ? "public, max-age=300, s-maxage=86400" : "no-store" } });
}
