export type LocationResult = { name: string; admin1?: string; country?: string; latitude: number; longitude: number; timezone?: string };
export type ForecastDay = { date: string; code: number; max: number; min: number; precipitation: number; wind: number; sunrise: string; sunset: string };
export type Place = { pageid: number; title: string; distance: number; lat: number; lon: number; extract?: string; thumbnail?: string; url: string };
export type ClimateMonth = { month: number; max: number; min: number; rain: number; score: number };
