import Link from 'next/link';
import { AreaPage } from '@/components/AreaPage';

const NotFound = () => (
  <AreaPage
    title="Vad i helvete letar du efter?"
    intro="Den här sidan finns inte. Har du fått en länk till en lista eller ett rum så har den kanske gått ut."
  >
    <Link href="/" className="button button-primary">
      Till startsidan för i helvete
    </Link>
  </AreaPage>
);

export default NotFound;
