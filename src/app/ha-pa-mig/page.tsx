import type { Metadata } from 'next';
import { AreaPage } from '@/components/AreaPage';
import { adviseFor } from '@/features/weather/advice';
import { cities, cityBySlug } from '@/features/weather/cities';
import { fetchForecast } from '@/features/weather/fetchForecast';
import { WeatherView } from '@/features/weather/WeatherView';
import { emojiIcon } from '@/lib/emojiIcon';

export const metadata: Metadata = {
  title: 'Vad i helvete ska jag ha på mig?',
  description: 'Väderprognos från SMHI, fast med en åsikt.',
  icons: { icon: emojiIcon('🧥') },
};

type Props = { searchParams: Promise<{ stad?: string | string[] }> };

const HaPaMigPage = async ({ searchParams }: Props) => {
  const { stad } = await searchParams;
  const city = cityBySlug(typeof stad === 'string' ? stad : undefined);
  const advice = adviseFor(await fetchForecast(city.lat, city.lon));

  return (
    <AreaPage title="Vad i helvete ska jag ha på mig?">
      <WeatherView city={city} cities={cities} initialAdvice={advice} />
    </AreaPage>
  );
};

export default HaPaMigPage;
