import React from 'react';

export type ButtonVariant = 'number' | 'operator' | 'action' | 'danger';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  number: 'bg-gray-700 hover:bg-gray-600 text-white',
  operator: 'bg-orange-500 hover:bg-orange-400 text-white',
  action: 'bg-gray-500 hover:bg-gray-400 text-white',
  danger: 'bg-red-500 hover:bg-red-400 text-white',
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'number',
  className = '',
  ariaLabel,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${className}
        w-full h-14 rounded-lg font-semibold text-xl
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label={ariaLabel || label}
      type="button"
    >
      {label}
    </button>
  );
};
