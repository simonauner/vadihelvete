'use client';

import { useId, useRef, useState } from 'react';
import { QrCode } from './QrCode';
import styles from './ShareButton.module.css';

type ShareButtonProps = {
  path: string;
  text: string;
  label?: string;
  /** Also offer a QR code, for when the people you share with are in the room. */
  qr?: boolean;
};

export const ShareButton = ({
  path,
  text,
  label = 'Skicka till någon som behöver det',
  qr = false,
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const share = async () => {
    const url = new URL(path, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showQr = () => {
    setQrUrl(new URL(path, window.location.origin).toString());
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" className="button" onClick={share}>
        {copied ? 'Länken är kopierad!' : label}
      </button>
      {qr && (
        <>
          <button type="button" className="button" onClick={showQr}>
            Visa QR-kod
          </button>
          <dialog
            ref={dialogRef}
            className={styles.dialog}
            aria-labelledby={titleId}
            // A click on the backdrop lands on the dialog element itself.
            onClick={(event) => event.target === event.currentTarget && close()}
          >
            <div className={styles.content}>
              <h2 id={titleId} className={styles.title}>
                Scanna för i helvete
              </h2>
              {qrUrl && (
                <>
                  <QrCode value={qrUrl} className={styles.qr} />
                  <p className={styles.url}>{qrUrl}</p>
                </>
              )}
              <button type="button" className="button" onClick={close}>
                Stäng
              </button>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};
