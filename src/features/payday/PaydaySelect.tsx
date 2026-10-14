'use client';

import { useRef } from 'react';

type Props = { dayOfMonth: number };

const days = Array.from({ length: 31 }, (_, index) => index + 1);

// 1:a, 2:a, 21:a, 22:a, 31:a but 11:e and 12:e.
const ordinal = (day: number): string =>
  [1, 2].includes(day % 10) && ![11, 12].includes(day)
    ? `${day}:a`
    : `${day}:e`;

export const PaydaySelect = ({ dayOfMonth }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} method="get">
      <label htmlFor="dag">Får du lön en annan dag? Den </label>
      <select
        id="dag"
        name="dag"
        defaultValue={dayOfMonth}
        onChange={() => formRef.current?.requestSubmit()}
      >
        {days.map((day) => (
          <option key={day} value={day}>
            {ordinal(day)}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit">Visa</button>
      </noscript>
    </form>
  );
};
