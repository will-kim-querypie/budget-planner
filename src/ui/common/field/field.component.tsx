import type { ReactNode } from 'react';
import styles from './field.module.css';

type Props = {
  label: string;
  children: ReactNode;
};

export default function Field({ label, children }: Props) {
  return (
    <label className={styles.root}>
      <p>{label}:</p>
      {children}
    </label>
  );
}
