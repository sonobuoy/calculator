import React from 'react';
import { Button } from './Button';

export interface KeyConfig {
  label: string;
  value: string;
  variant: ButtonVariant;
  ariaLabel?: string;
}

interface KeypadProps {
  keys: KeyConfig[];
  onKeyPress: (value: string) => void;
}

export const Keypad: React.FC<KeypadProps> = ({ keys, onKeyPress }) => {
  return (
    <div 
      className="grid grid-cols-4 gap-2"
      role="group"
      aria-label="Calculator keypad"
    >
      {keys.map((key, index) => (
        <Button
          key={index}
          label={key.label}
          variant={key.variant}
          onClick={() => onKeyPress(key.value)}
          ariaLabel={key.ariaLabel}
        />
      ))}
    </div>
  );
};
