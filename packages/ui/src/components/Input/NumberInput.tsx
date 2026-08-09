import { forwardRef, type ChangeEvent } from 'react';
import { TextInput, type TextInputProps } from './TextInput';
import { Icon } from '../Icon/Icon';

export interface NumberInputProps extends Omit<TextInputProps, 'type' | 'variant'> {
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  onNumberChange?: ((value: number | null) => void) | undefined;
}

/**
 * Compact NumberInput supporting min/max boundaries and step increments.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ min, max, step = 1, value, onChange, onNumberChange, disabled, size = 'md', ...props }, ref) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value ?? ''));

    const handleStep = (delta: number) => {
      if (disabled) return;
      const current = Number.isNaN(numericValue) ? 0 : numericValue;
      let newValue = current + delta;

      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);

      if (onNumberChange) {
        onNumberChange(newValue);
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onNumberChange) {
        const parsed = parseFloat(e.target.value);
        onNumberChange(Number.isNaN(parsed) ? null : parsed);
      }
    };

    return (
      <div className="relative flex items-center w-full">
        <TextInput
          ref={ref}
          type="number"
          variant="code"
          size={size}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          rightIcon={
            !disabled && (
              <div className="flex flex-col -mr-1">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleStep(step)}
                  className="p-0.5 hover:bg-workspace-hover text-gray-400 hover:text-white rounded-t"
                  aria-label="Increment value"
                >
                  <Icon name="chevron-up" size="xs" />
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleStep(-step)}
                  className="p-0.5 hover:bg-workspace-hover text-gray-400 hover:text-white rounded-b"
                  aria-label="Decrement value"
                >
                  <Icon name="chevron-down" size="xs" />
                </button>
              </div>
            )
          }
          {...props}
        />
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
