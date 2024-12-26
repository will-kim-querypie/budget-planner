import { ComponentProps, forwardRef } from 'react';
import styles from './button.module.css';
import cn from 'classnames';

type Props = ComponentProps<'button'> & {
  /**
   * @default 'primary'
   */
  variant?: 'primary' | 'danger';
  /**
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /**
   * @default false
   */
  square?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', square = false, className, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        styles.root,
        {
          [styles.primary]: variant === 'primary',
          [styles.danger]: variant === 'danger',
          [styles.sm]: size === 'sm',
          [styles.md]: size === 'md',
          [styles.square]: square,
        },
        className
      )}
      {...rest}
    />
  )
);

Button.displayName = 'Button';
