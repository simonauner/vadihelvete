import type { Metadata } from 'next';
import { AreaPage } from '@/components/AreaPage';
import { FocusTimer } from '@/features/focus/FocusTimer';
import { emojiIcon } from '@/lib/emojiIcon';

export const metadata: Metadata = {
  title: 'Jobba för i helvete',
  description:
    'En arg pomodoro-timer: 25 minuter jobb, 5 minuter paus, och en utskällning emellan.',
  icons: { icon: emojiIcon('⏱️') },
};

const FokusPage = () => (
  <AreaPage title="Jobba för i helvete">
    <FocusTimer />
  </AreaPage>
);

export default FokusPage;
