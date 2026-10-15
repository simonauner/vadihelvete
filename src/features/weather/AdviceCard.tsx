import { HOURS_AHEAD, type WeatherAdvice } from './advice';
import styles from './Weather.module.css';

const degrees = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 });

// Adding 0 turns -0 into 0 so we never print "−0°".
const formatDegrees = (n: number) => `${degrees.format(Math.round(n) + 0)}°`;

type AdviceCardProps = {
  advice: WeatherAdvice;
  /** Null when we know where you are but not what the place is called. */
  place: string | null;
  isHere?: boolean;
};

export const AdviceCard = ({ advice, place, isHere }: AdviceCardProps) => {
  const { summary } = advice;

  return (
    <section className={`${styles.card} ${styles.fadeUp}`}>
      <p className={styles.place}>
        {isHere ? <>📍 Där du är{place && <>: {place}</>}</> : place}
      </p>
      <p className={styles.headline}>{advice.headline}</p>
      <ul className={styles.extras}>
        {advice.extras.map((extra) => (
          <li key={extra}>{extra}</li>
        ))}
      </ul>
      <p className={styles.summary}>
        {place ?? 'Där du är'} just nu: {formatDegrees(summary.now)}
        {Math.round(summary.feelsLike) !== Math.round(summary.now) &&
          ` (känns som ${formatDegrees(summary.feelsLike)})`}
        . Kommande {HOURS_AHEAD} timmarna: {formatDegrees(summary.min)} till{' '}
        {formatDegrees(summary.max)},{' '}
        {Math.round(summary.precipitationProbability)} % risk för nederbörd och
        byvind upp till {Math.round(summary.maxGust)} m/s.
      </p>
    </section>
  );
};
