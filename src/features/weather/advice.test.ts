import { describe, expect, it } from 'vitest';
import { adviseFor, windChill } from './advice';
import { parseForecast, type ForecastHour } from './smhi';

const hour = (overrides: Partial<ForecastHour> = {}): ForecastHour => ({
  time: '2026-10-14T12:00:00Z',
  temperature: 15,
  windSpeed: 2,
  windGust: 4,
  precipitationProbability: 0,
  precipitation: 0,
  precipitationType: 0,
  thunderProbability: 0,
  symbol: 3,
  ...overrides,
});

const hours = (overrides: Partial<ForecastHour>) =>
  Array.from({ length: 12 }, () => hour(overrides));

describe('windChill', () => {
  it('makes cold windy weather feel colder', () => {
    expect(windChill(0, 10)).toBeLessThan(-5);
  });

  it('leaves warm weather alone', () => {
    expect(windChill(20, 10)).toBe(20);
  });
});

describe('adviseFor', () => {
  it('returns null without a forecast', () => {
    expect(adviseFor([])).toBeNull();
  });

  it('asks for winter clothes when it is freezing', () => {
    expect(
      adviseFor(hours({ temperature: -8, windSpeed: 3 }))?.headline
    ).toMatch(/vinter/i);
  });

  it('asks for t-shirt when it is warm', () => {
    expect(adviseFor(hours({ temperature: 23 }))?.headline).toMatch(/t-shirt/i);
  });

  it('warns about rain', () => {
    const advice = adviseFor(
      hours({
        precipitationProbability: 80,
        precipitation: 1,
        precipitationType: 1,
      })
    );

    expect(advice?.extras.join(' ')).toMatch(/paraply/);
  });

  it('suggests a rain jacket when rain and wind come together', () => {
    const advice = adviseFor(
      hours({
        precipitationProbability: 80,
        precipitation: 1,
        precipitationType: 1,
        windGust: 15,
      })
    );

    expect(advice?.extras.join(' ')).toMatch(/regnjacka/);
  });

  it('warns about snow instead of rain', () => {
    const advice = adviseFor(
      hours({
        temperature: -2,
        precipitationProbability: 80,
        precipitation: 1,
        precipitationType: 5,
      })
    );

    expect(advice?.extras.join(' ')).toMatch(/snö/);
    expect(advice?.extras.join(' ')).not.toMatch(/paraply/);
  });

  it('only looks 12 hours ahead', () => {
    const forecast = [
      ...hours({ temperature: 22 }),
      ...hours({ temperature: -10 }),
    ];

    expect(adviseFor(forecast)?.summary.min).toBe(22);
  });
});

describe('parseForecast', () => {
  it('reads snow1g time series and skips missing values', () => {
    const forecast = parseForecast({
      timeSeries: [
        {
          time: '2026-10-14T21:00:00Z',
          data: {
            air_temperature: 7.8,
            wind_speed: 3.2,
            wind_speed_of_gust: 9999,
            probability_of_precipitation: 0,
            symbol_code: 1,
          },
        },
        { time: 'broken' },
      ],
    });

    expect(forecast).toHaveLength(1);
    expect(forecast[0]).toMatchObject({ temperature: 7.8, windGust: 0 });
  });

  it('handles garbage', () => {
    expect(parseForecast(null)).toEqual([]);
  });
});
