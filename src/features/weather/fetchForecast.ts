import { forecastUrl, parseForecast, type ForecastHour } from './smhi';

/** Server-side fetch, cached for 30 minutes per coordinate. */
export const fetchForecast = async (
  lat: number,
  lon: number
): Promise<ForecastHour[]> => {
  try {
    const response = await fetch(forecastUrl(lat, lon), {
      next: { revalidate: 1800 },
    });
    if (!response.ok) return [];

    return parseForecast(await response.json());
  } catch (error) {
    console.error('SMHI forecast failed', error);
    return [];
  }
};
