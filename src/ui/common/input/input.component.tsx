import { ComponentProps, forwardRef } from 'react';
import styles from './input.module.css';
import cn from 'classnames';

type Props = ComponentProps<'input'>;

export const Input = forwardRef<HTMLInputElement, Props>(({ className, ...rest }, ref) => (
  <input ref={ref} className={cn(styles.root, className)} {...rest} />
));

Input.displayName = 'Input';
