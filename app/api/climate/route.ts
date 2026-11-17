import { NextRequest, NextResponse } from "next/server";
export const maxDuration = 30;
export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get("lat")), lon = Number(req.nextUrl.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  const end = new Date(); end.setUTCDate(end.getUTCDate()-7); const start = new Date(end); start.setUTCFullYear(end.getUTCFullYear()-3);
  const iso=(d:Date)=>d.toISOString().slice(0,10); const url=new URL("https://archive-api.open-meteo.com/v1/archive");
  Object.entries({latitude:String(lat),longitude:String(lon),start_date:iso(start),end_date:iso(end),daily:"temperature_2m_max,temperature_2m_min,precipitation_sum",timezone:"auto"}).forEach(([k,v])=>url.searchParams.set(k,v));
  const response=await fetch(url,{next:{revalidate:2592000}}); if(!response.ok) return NextResponse.json({error:"Climate history unavailable"},{status:502});
  const d=await response.json(); const bins=Array.from({length:12},()=>({n:0,max:0,min:0,rain:0}));
  d.daily.time.forEach((date:string,i:number)=>{const b=bins[new Date(date+"T00:00:00Z").getUTCMonth()]; b.n++; b.max+=d.daily.temperature_2m_max[i]??0; b.min+=d.daily.temperature_2m_min[i]??0; b.rain+=d.daily.precipitation_sum[i]??0;});
  const months=bins.map((b,i)=>{const max=b.max/b.n,min=b.min/b.n,rain=b.rain/(b.n/30.44); const comfort=Math.max(0,100-Math.abs(((max+min)/2)-22)*5); const score=Math.round(comfort-Math.min(55,rain/6)); return {month:i+1,max:+max.toFixed(1),min:+min.toFixed(1),rain:+rain.toFixed(0),score};});
  return NextResponse.json({months,best:[...months].sort((a,b)=>b.score-a.score).slice(0,3)});
}
