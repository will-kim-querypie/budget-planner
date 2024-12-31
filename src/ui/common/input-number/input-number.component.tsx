import combineRef from '@/utils/combine-ref';
import { ChangeEventHandler, ComponentProps, useState, forwardRef, useRef } from 'react';
import { Input } from '../input';

type InputNumberProps = Omit<
  ComponentProps<'input'>,
  'type' | 'value' | 'onChange' | 'defaultValue' | 'max' | 'min'
> & {
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  min?: number;
  locale?: boolean;
};

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  ({ defaultValue, value, onChange, max, min = 0, locale = true, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = combineRef([ref, inputRef]);

    const [localValue, setLocalValue] = useState(defaultValue);

    const displayValue = (() => {
      const _value = value ?? localValue;

      if (typeof _value === 'undefined' || _value === 0) {
        return '';
      }

      return locale ? _value?.toLocaleString() : _value;
    })();

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const targetValue = Number(e.target.value.replace(/[^0-9-.]/g, ''));

      if (Number.isNaN(targetValue)) {
        return;
      }

      const nextValue = (() => {
        if (typeof max !== 'undefined' && targetValue > max) {
          return max;
        }

        if (typeof min !== 'undefined' && targetValue < min) {
          return min;
        }

        return targetValue;
      })();

      setLocalValue(nextValue);
      onChange?.(nextValue);
    };

    return <Input ref={combinedRef} type='text' value={displayValue} onChange={handleChange} {...rest} />;
  }
);

export default InputNumber;
