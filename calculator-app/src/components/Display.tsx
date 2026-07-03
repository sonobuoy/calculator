import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  error: string | null;
}

export const Display: React.FC<DisplayProps> = ({ expression, result, error }) => {
  return (
    <div 
      className="w-full bg-gray-800 rounded-lg p-4 mb-4 text-right"
      role="region"
      aria-label="Calculator display"
    >
      <div 
        className="text-gray-400 text-sm h-6 overflow-hidden text-ellipsis whitespace-nowrap"
        aria-live="polite"
      >
        {expression || '\u00A0'}
      </div>
      <div 
        className={`text-3xl font-bold ${error ? 'text-red-500' : 'text-white'}`}
        aria-live="assertive"
        aria-atomic="true"
      >
        {error || result || '0'}
      </div>
    </div>
  );
};
