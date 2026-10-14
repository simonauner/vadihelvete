'use client';

import { useRef, useState } from 'react';
import { AdviceCard } from './AdviceCard';
import { adviseFor, type WeatherAdvice } from './advice';
import type { City } from './cities';
import { forecastUrl, parseForecast } from './smhi';
import styles from './Weather.module.css';

type WeatherViewProps = {
  city: City;
  cities: City[];
  initialAdvice: WeatherAdvice | null;
};

type LocationState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'done'; advice: WeatherAdvice }
  | { status: 'error'; message: string };

const locate = () =>
  new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      maximumAge: 10 * 60 * 1000,
      timeout: 10_000,
    })
  );

export const WeatherView = ({
  city,
  cities,
  initialAdvice,
}: WeatherViewProps) => {
  const [location, setLocation] = useState<LocationState>({ status: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);

  // The forecast is fetched straight from SMHI in the browser, so the
  // visitor's position never reaches our server.
  const showMyLocation = async () => {
    setLocation({ status: 'locating' });

    try {
      const { coords } = await locate();
      const response = await fetch(
        forecastUrl(coords.latitude, coords.longitude)
      );
      if (!response.ok) throw new Error(`SMHI ${response.status}`);

      const advice = adviseFor(parseForecast(await response.json()));
      if (!advice) throw new Error('empty forecast');

      setLocation({ status: 'done', advice });
    } catch (error) {
      const denied =
        error instanceof GeolocationPositionError &&
        error.code === error.PERMISSION_DENIED;

      setLocation({
        status: 'error',
        message: denied
          ? 'Du sa ju nej till platsen. Välj en jävla stad då.'
          : 'SMHI har ingen prognos för där du är, eller så gick något åt helvete. Välj en stad istället.',
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <form ref={formRef} method="get" className={styles.cityForm}>
          <label htmlFor="stad" className="visually-hidden">
            Stad
          </label>
          <select
            id="stad"
            name="stad"
            className="input"
            defaultValue={city.slug}
            onChange={() => {
              setLocation({ status: 'idle' });
              formRef.current?.requestSubmit();
            }}
          >
            {cities.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name}
              </option>
            ))}
          </select>
          <noscript>
            <button type="submit" className="button">
              Visa
            </button>
          </noscript>
        </form>
        <button
          type="button"
          className="button"
          onClick={showMyLocation}
          disabled={location.status === 'locating'}
        >
          {location.status === 'locating' ? 'Letar…' : '📍 Där jag är'}
        </button>
      </div>

      {location.status === 'error' && (
        <p className={styles.error}>{location.message}</p>
      )}

      {location.status === 'done' ? (
        <AdviceCard advice={location.advice} place="Där du är" />
      ) : initialAdvice ? (
        <AdviceCard advice={initialAdvice} place={city.name} />
      ) : (
        <p className={styles.error}>
          SMHI svarar inte. Titta ut genom fönstret för i helvete.
        </p>
      )}

      <p className={styles.credit}>
        Prognos från <a href="https://www.smhi.se">SMHI</a>.
      </p>
    </div>
  );
};
