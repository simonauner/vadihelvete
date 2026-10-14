import type { ForecastHour } from './smhi';

export type WeatherSummary = {
  now: number;
  feelsLike: number;
  min: number;
  max: number;
  maxGust: number;
  precipitationProbability: number;
};

export type WeatherAdvice = {
  headline: string;
  extras: string[];
  summary: WeatherSummary;
};

/** How many forecast hours the advice looks at. */
export const HOURS_AHEAD = 12;

const SNOW_TYPES = new Set([5, 6, 7, 8, 9]);
const FREEZING_TYPES = new Set([3, 12]);
const CLEAR_SYMBOLS = new Set([1, 2]);

/** SMHI's effective temperature (wind chill), valid at or below 10 °C. */
export const windChill = (temperature: number, windSpeed: number) => {
  if (temperature > 10 || windSpeed < 2) return temperature;

  const v = Math.pow(windSpeed, 0.16);
  return 13.12 + 0.6215 * temperature - 13.956 * v + 0.48669 * temperature * v;
};

const round = (n: number) => Math.round(n);

const clothing = (feelsLike: number, max: number): string => {
  const t = round(feelsLike);

  if (t <= -15)
    return `Ta på dig allt du äger. Det känns som ${t} grader för i helvete.`;
  if (t <= -5)
    return 'Vinterjacka, mössa, vantar och halsduk. Det är vinter för i helvete.';
  if (t <= 2) return 'Vinterjacka och mössa för i helvete. Det är kallt.';
  if (t <= 8)
    return `Ta på dig en riktig jacka för i helvete. Det känns som ${t} grader.`;
  if (t <= 14)
    return 'En tunn jacka räcker, men gå inte ut i t-shirt för i helvete.';
  if (max < 20) return 'En tröja räcker. Sluta överdriva för i helvete.';
  if (max < 26) return 'T-shirt för i helvete. Det är ju varmt.';
  return 'Shorts och linne. Och drick vatten för i helvete.';
};

export const adviseFor = (forecast: ForecastHour[]): WeatherAdvice | null => {
  const hours = forecast.slice(0, HOURS_AHEAD);
  if (!hours.length) return null;

  const [current] = hours;
  const feelsLike = Math.min(
    ...hours.map((h) => windChill(h.temperature, h.windSpeed))
  );
  const max = Math.max(...hours.map((h) => h.temperature));
  const min = Math.min(...hours.map((h) => h.temperature));
  const maxGust = Math.max(...hours.map((h) => h.windGust));
  const precipitationProbability = Math.max(
    ...hours.map((h) => h.precipitationProbability)
  );

  const wet = hours.filter(
    (h) => h.precipitationProbability >= 40 && h.precipitation >= 0.1
  );
  const snow = wet.some((h) => SNOW_TYPES.has(h.precipitationType));
  const freezing = wet.some((h) => FREEZING_TYPES.has(h.precipitationType));
  const rain = wet.length > 0 && !snow;
  const thunder = hours.some((h) => h.thunderProbability >= 30);
  const sunny =
    max >= 18 && hours.filter((h) => CLEAR_SYMBOLS.has(h.symbol)).length >= 4;

  const extras: string[] = [];

  if (thunder) extras.push('Det blir åska. Stanna inne för i helvete.');
  if (freezing)
    extras.push('Underkylt regn. Det blir halt som fan, så ta på broddar.');
  if (snow) extras.push('Det kommer snö. Vinterskor för i helvete.');
  if (rain && maxGust >= 12)
    extras.push(
      'Det regnar och blåser. Paraplyet går sönder, så ta en jävla regnjacka.'
    );
  else if (rain) extras.push('Ta med paraply för i helvete, det kommer regna.');
  if (!rain && maxGust >= 14)
    extras.push(`Byar på ${round(maxGust)} m/s. Håll i mössan för i helvete.`);
  if (sunny) extras.push('Och smörj in dig med solkräm för i helvete.');
  if (!extras.length)
    extras.push(
      'Inget regn på gång. Paraplyet kan för i helvete stanna hemma.'
    );

  return {
    headline: clothing(feelsLike, max),
    extras,
    summary: {
      now: current.temperature,
      feelsLike: windChill(current.temperature, current.windSpeed),
      min,
      max,
      maxGust,
      precipitationProbability,
    },
  };
};
