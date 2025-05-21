// src/components/ButtonComponent.tsx
import React from 'react';
import styles from './ButtonComponent.module.css';

interface ButtonComponentProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  text,
  type = 'button',
}) => (
  <button className={styles.button} type={type}>
    {text}
  </button>
);

export default ButtonComponent;
