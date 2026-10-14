import type { Metadata } from 'next';
import { AreaPage } from '@/components/AreaPage';
import { CreateHouseholdForm } from '@/features/chores/CreateHouseholdForm';
import { suggestions } from '@/features/suggestions/suggestions';
import { emojiIcon } from '@/lib/emojiIcon';
import { StoreMissing } from '@/lib/StoreMissing';
import { isStoreConfigured } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Vem i helvete ska göra vad?',
  description:
    'En delad sysslolista som håller koll på vems tur det är och skäller ut rätt person.',
  icons: { icon: emojiIcon('🧽') },
};

const ListaPage = () => {
  if (!isStoreConfigured()) return <StoreMissing />;

  return (
    <AreaPage
      title="Vem i helvete ska göra vad?"
      intro="Skapa en sysslolista för hushållet. Den håller koll på vems tur det är och skäller ut rätt person. Alla som har länken kan se och ändra listan."
    >
      <CreateHouseholdForm defaultChores={suggestions.hemma.join('\n')} />
    </AreaPage>
  );
};

export default ListaPage;
