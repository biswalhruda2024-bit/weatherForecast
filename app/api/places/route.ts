import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get("lat")), lon = Number(req.nextUrl.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  const url = new URL("https://en.wikipedia.org/w/api.php");
  Object.entries({ action: "query", format: "json", generator: "geosearch", ggsprimary: "all", ggsnamespace: "0", ggsradius: "10000", ggslimit: "18", ggscoord: `${lat}|${lon}`, prop: "coordinates|pageimages|extracts|info", inprop: "url", exintro: "1", explaintext: "1", exsentences: "2", piprop: "thumbnail", pithumbsize: "640", origin: "*" }).forEach(([k,v]) => url.searchParams.set(k,v));
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) return NextResponse.json({ error: "Places service is unavailable" }, { status: 502 });
  const data = await response.json();
  const pages = Object.values(data.query?.pages || {}) as any[];
  const places = pages.map(p => { const c=p.coordinates?.[0]; const d=c?.dist ?? 0; return { pageid:p.pageid,title:p.title,distance:d,lat:c?.lat,lon:c?.lon,extract:p.extract,thumbnail:p.thumbnail?.source,url:p.fullurl }; }).filter(p => p.lat && p.lon && !/list of|district|administrative|constituency/i.test(p.title)).sort((a,b)=>a.distance-b.distance).slice(0,12);
  return NextResponse.json({ places });
}
