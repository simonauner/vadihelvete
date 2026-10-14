import type { Metadata } from 'next';
import { AreaPage } from '@/components/AreaPage';
import { CreateRoomForm } from '@/features/decide/CreateRoomForm';
import { emojiIcon } from '@/lib/emojiIcon';
import { StoreMissing } from '@/lib/StoreMissing';
import { isStoreConfigured } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Vad i helvete ska vi göra?',
  description:
    'Skapa ett rum, skicka länken till gänget, rösta. Kan ni inte bestämma er så gör sajten det åt er.',
  icons: { icon: emojiIcon('🗳️') },
};

const BestamPage = () => {
  if (!isStoreConfigured()) return <StoreMissing />;

  return (
    <AreaPage
      title="Vad i helvete ska vi göra?"
      intro="Skapa ett rum och skicka länken till gänget. Alla röstar, och kan ni inte bestämma er så bestämmer jag åt er."
    >
      <CreateRoomForm />
    </AreaPage>
  );
};

export default BestamPage;
