import React, { useEffect, useCallback } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { Display } from '../components/Display';
import { Keypad, KeyConfig } from '../components/Keypad';

/**
 * Main Calculator Component
 * Single Responsibility: Orchestrates UI components and handles keyboard events
 * Zero business logic - all calculations delegated to useCalculator hook
 */
export const Calculator: React.FC = () => {
  const {
    state,
    appendNumber,
    appendOperator,
    performCalculation,
    clear,
    clearEntry,
    toggleSign,
    percentage,
    backspace,
  } = useCalculator();

  // Keyboard support for accessibility
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;

    // Numbers
    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      appendNumber(key);
      return;
    }

    // Operators
    if (['+', '-', '*', '/', '%', '^'].includes(key)) {
      event.preventDefault();
      appendOperator(key);
      return;
    }

    // Decimal point
    if (key === '.') {
      event.preventDefault();
      appendNumber('.');
      return;
    }

    // Enter or Equals
    if (key === 'Enter' || key === '=') {
      event.preventDefault();
      performCalculation();
      return;
    }

    // Escape (Clear)
    if (key === 'Escape') {
      event.preventDefault();
      clear();
      return;
    }

    // Backspace
    if (key === 'Backspace') {
      event.preventDefault();
      backspace();
      return;
    }

    // Delete (Clear Entry)
    if (key === 'Delete') {
      event.preventDefault();
      clearEntry();
      return;
    }

    // Parentheses
    if (key === '(' || key === ')') {
      event.preventDefault();
      appendNumber(key);
      return;
    }
  }, [appendNumber, appendOperator, performCalculation, clear, clearEntry, backspace]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Define keypad layout
  const keys: KeyConfig[] = [
    { label: 'C', value: 'clear', variant: 'danger', ariaLabel: 'Clear all' },
    { label: 'CE', value: 'clearEntry', variant: 'action', ariaLabel: 'Clear entry' },
    { label: '⌫', value: 'backspace', variant: 'action', ariaLabel: 'Backspace' },
    { label: '÷', value: '/', variant: 'operator', ariaLabel: 'Divide' },
    { label: '7', value: '7', variant: 'number' },
    { label: '8', value: '8', variant: 'number' },
    { label: '9', value: '9', variant: 'number' },
    { label: '×', value: '*', variant: 'operator', ariaLabel: 'Multiply' },
    { label: '4', value: '4', variant: 'number' },
    { label: '5', value: '5', variant: 'number' },
    { label: '6', value: '6', variant: 'number' },
    { label: '−', value: '-', variant: 'operator', ariaLabel: 'Subtract' },
    { label: '1', value: '1', variant: 'number' },
    { label: '2', value: '2', variant: 'number' },
    { label: '3', value: '3', variant: 'number' },
    { label: '+', value: '+', variant: 'operator', ariaLabel: 'Add' },
    { label: '±', value: 'negate', variant: 'action', ariaLabel: 'Toggle sign' },
    { label: '0', value: '0', variant: 'number' },
    { label: '.', value: '.', variant: 'number', ariaLabel: 'Decimal point' },
    { label: '=', value: 'calculate', variant: 'operator', ariaLabel: 'Equals' },
  ];

  const handleKeyPress = (value: string) => {
    switch (value) {
      case 'clear':
        clear();
        break;
      case 'clearEntry':
        clearEntry();
        break;
      case 'backspace':
        backspace();
        break;
      case 'calculate':
        performCalculation();
        break;
      case 'negate':
        toggleSign();
        break;
      case '%':
        percentage();
        break;
      case '/':
      case '*':
      case '-':
      case '+':
        appendOperator(value);
        break;
      default:
        appendNumber(value);
    }
  };

  return (
    <div 
      className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 shadow-2xl"
      role="application"
      aria-label="Calculator"
    >
      <Display
        expression={state.expression}
        result={state.result}
        error={state.error}
      />
      <Keypad keys={keys} onKeyPress={handleKeyPress} />
      
      {/* Keyboard instructions for accessibility */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Keyboard supported: 0-9, +, -, *, /, Enter, Escape, Backspace</p>
      </div>
    </div>
  );
};
