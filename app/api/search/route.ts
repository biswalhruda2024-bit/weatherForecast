import { NextRequest, NextResponse } from "next/server";

function coordinatesFromInput(input: string) {
  const direct = input.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*[,|]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
  const mapsAt = input.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const mapsQuery = input.match(/[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?)(?:%2C|,)(-?\d+(?:\.\d+)?)/i);
  const match = direct || mapsAt || mapsQuery;
  if (!match) return null;
  const latitude = Number(match[1]), longitude = Number(match[2]);
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180 ? { latitude, longitude } : null;
}

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("q")?.trim();
  if (!input) return NextResponse.json({ error: "Enter a place name, coordinates, or Google Maps URL." }, { status: 400 });
  const coords = coordinatesFromInput(input);
  if (coords) return NextResponse.json({ results: [{ name: "Selected map location", ...coords, timezone: "auto" }] });
  if (/google\.[^/]+\/maps|maps\.app\.goo\.gl/i.test(input)) {
    return NextResponse.json({ error: "This short Google Maps link does not expose coordinates. Open it, copy the expanded URL containing @latitude,longitude, or paste the coordinates." }, { status: 400 });
  }
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", input); url.searchParams.set("count", "6"); url.searchParams.set("language", "en"); url.searchParams.set("format", "json");
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) return NextResponse.json({ error: "Geocoding service is unavailable." }, { status: 502 });
  const data = await response.json();
  return NextResponse.json({ results: (data.results || []).map((x: any) => ({ name: x.name, admin1: x.admin1, country: x.country, latitude: x.latitude, longitude: x.longitude, timezone: x.timezone })) });
}
