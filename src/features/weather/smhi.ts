/** One forecast step from SMHI's snow1g point forecast. */
export type ForecastHour = {
  time: string;
  temperature: number;
  windSpeed: number;
  windGust: number;
  /** Chance (0–100) of at least 0.1 mm precipitation. */
  precipitationProbability: number;
  /** Mean precipitation in mm/h. */
  precipitation: number;
  /** ECMWF precipitation type, 0 = none, 1 = rain, 5 = snow, … */
  precipitationType: number;
  thunderProbability: number;
  /** Wsymb2 weather symbol, 1–27. */
  symbol: number;
};

const MISSING = 9999;

export const forecastUrl = (lat: number, lon: number) =>
  `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon.toFixed(4)}/lat/${lat.toFixed(4)}/data.json?timeseries=24`;

const value = (data: Record<string, unknown>, key: string, fallback = 0) => {
  const raw = data[key];
  return typeof raw === 'number' && raw !== MISSING ? raw : fallback;
};

export const parseForecast = (json: unknown): ForecastHour[] => {
  const series = (json as { timeSeries?: unknown })?.timeSeries;
  if (!Array.isArray(series)) return [];

  return series.flatMap((step) => {
    const { time, data } = (step ?? {}) as {
      time?: unknown;
      data?: Record<string, unknown>;
    };
    if (typeof time !== 'string' || !data) return [];
    if (typeof data.air_temperature !== 'number') return [];

    return [
      {
        time,
        temperature: value(data, 'air_temperature'),
        windSpeed: value(data, 'wind_speed'),
        windGust: value(data, 'wind_speed_of_gust'),
        precipitationProbability: value(data, 'probability_of_precipitation'),
        precipitation: value(data, 'precipitation_amount_mean'),
        precipitationType: value(
          data,
          'predominant_precipitation_type_at_surface'
        ),
        thunderProbability: value(data, 'thunderstorm_probability'),
        symbol: value(data, 'symbol_code', 1),
      },
    ];
  });
};
