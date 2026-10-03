import { cleanExplorerText, isSearchKind, searchExplorer } from "../../../lib/explore-providers";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = cleanExplorerText(params.get("q"), 2, 100), kind = params.get("kind") ?? "city";
  if (!query || !isSearchKind(kind)) return Response.json({ status: "unavailable", message: "Digite ao menos duas letras e escolha uma busca válida." }, { status: 400 });
  const result = await searchExplorer(query, kind);
  return Response.json(result, { headers: { "Cache-Control": result.status === "ready" ? "public, max-age=300, s-maxage=1800" : "no-store" } });
}
