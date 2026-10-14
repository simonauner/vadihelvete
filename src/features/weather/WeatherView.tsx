'use client';

import { useRef, useState } from 'react';
import { AdviceCard } from './AdviceCard';
import { adviseFor, type WeatherAdvice } from './advice';
import type { City } from './cities';
import { fetchPlaceName } from './placeName';
import { forecastUrl, parseForecast } from './smhi';
import styles from './Weather.module.css';

type WeatherViewProps = {
  city: City;
  cities: City[];
  initialAdvice: WeatherAdvice | null;
};

/** The forecast for the visitor's own position, once we have one. */
type Here = { advice: WeatherAdvice; place: string | null };

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
  const [here, setHere] = useState<Here | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // The forecast is fetched straight from SMHI (and the place name from
  // OpenStreetMap) in the browser, so the visitor's position never reaches
  // our server. Whatever is on screen stays there until the new answer is
  // in, so a quick second click doesn't make the card flash.
  const showMyLocation = async () => {
    if (locating) return;
    setLocating(true);
    setError(null);

    try {
      const { coords } = await locate();
      const [response, place] = await Promise.all([
        fetch(forecastUrl(coords.latitude, coords.longitude)),
        fetchPlaceName(coords.latitude, coords.longitude),
      ]);
      if (!response.ok) throw new Error(`SMHI ${response.status}`);

      const advice = adviseFor(parseForecast(await response.json()));
      if (!advice) throw new Error('empty forecast');

      setHere({ advice, place });
    } catch (error) {
      const denied =
        error instanceof GeolocationPositionError &&
        error.code === error.PERMISSION_DENIED;

      setHere(null);
      setError(
        denied
          ? 'Du sa ju nej till platsen. Välj en jävla stad då.'
          : 'SMHI har ingen prognos för där du är, eller så gick något åt helvete. Välj en stad istället.'
      );
    } finally {
      setLocating(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <form ref={formRef} method="get">
          <label htmlFor="stad" className="visually-hidden">
            Stad
          </label>
          <select
            id="stad"
            name="stad"
            className="input"
            defaultValue={city.slug}
            onChange={() => {
              setHere(null);
              setError(null);
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

        <div className={styles.hereRow}>
          <button
            type="button"
            className="button"
            onClick={showMyLocation}
            aria-busy={locating}
          >
            📍 Där jag är
          </button>
          <div aria-live="polite">
            {error ? (
              <p className={`${styles.error} ${styles.fadeUp}`}>{error}</p>
            ) : here?.place ? (
              <p key={here.place} className={`${styles.note} ${styles.fadeUp}`}>
                Du är visst i <strong>{here.place}</strong>.
              </p>
            ) : (
              locating && (
                // Only shows up if finding you takes a while, so a cached
                // position doesn't flash it.
                <p className={`${styles.note} ${styles.fadeUp} ${styles.slow}`}>
                  Letar…
                </p>
              )
            )}
          </div>
        </div>
      </div>

      <div aria-live="polite">
        {here ? (
          <AdviceCard
            key={`here:${here.place}`}
            advice={here.advice}
            place={here.place ?? 'Där du är'}
          />
        ) : initialAdvice ? (
          <AdviceCard
            key={city.slug}
            advice={initialAdvice}
            place={city.name}
          />
        ) : (
          <p className={styles.error}>
            SMHI svarar inte. Titta ut genom fönstret för i helvete.
          </p>
        )}
      </div>

      <p className={styles.credit}>
        Prognos från <a href="https://www.smhi.se">SMHI</a>, platsnamn från{' '}
        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>.
      </p>
    </div>
  );
};
