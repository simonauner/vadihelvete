import { encode } from 'uqr';

type QrCodeProps = {
  value: string;
  className?: string;
};

/** Quiet zone around the code, in modules. The spec asks for four. */
const MARGIN = 4;

/**
 * Always dark on light, whatever the theme: plenty of scanners give up on
 * inverted codes.
 */
export const QrCode = ({ value, className }: QrCodeProps) => {
  const { data, size } = encode(value, { ecc: 'M' });
  const path = data
    .flatMap((row, y) =>
      row.map((dark, x) => (dark ? `M${x + MARGIN} ${y + MARGIN}h1v1h-1z` : ''))
    )
    .join('');
  const total = size + MARGIN * 2;

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      className={className}
      role="img"
      aria-label={`QR-kod för ${value}`}
      shapeRendering="crispEdges"
    >
      <rect width={total} height={total} fill="#fff" />
      <path d={path} fill="#000" />
    </svg>
  );
};
