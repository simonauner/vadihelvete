import React, { FC } from 'react';

import css from './Button.module.css';

type ButtonProps = {
  onClick: () => void;
};

export const Button: FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className={css.button} onClick={onClick}>
      {children}
    </button>
  );
};
