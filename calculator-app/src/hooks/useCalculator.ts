import { useState, useCallback } from 'react';
import { calculate, formatResult, isValidInput } from '../core/calculator/engine';
import { CalculatorError } from '../core/calculator/types';

export interface CalculatorState {
  expression: string;
  result: string;
  error: string | null;
  history: string[];
}

export interface UseCalculatorReturn {
  state: CalculatorState;
  appendNumber: (num: string) => void;
  appendOperator: (op: string) => void;
  clear: () => void;
  clearEntry: () => void;
  performCalculation: () => void;
  toggleSign: () => void;
  percentage: () => void;
  backspace: () => void;
}

/**
 * Custom hook for calculator logic
 * Acts as the bridge between UI and Core Engine (Separation of Concerns)
 * Single Responsibility: Manages calculator state and delegates calculations to pure functions
 */
export const useCalculator = (): UseCalculatorReturn => {
  const [state, setState] = useState<CalculatorState>({
    expression: '',
    result: '0',
    error: null,
    history: [],
  });

  const appendNumber = useCallback((num: string) => {
    setState(prev => {
      // If there's an error or we just calculated, start fresh
      if (prev.error || (prev.result !== '0' && !prev.expression)) {
        return {
          ...prev,
          expression: num,
          result: '0',
          error: null,
        };
      }

      // Validate input using defensive programming helper
      if (!isValidInput(prev.expression, num)) {
        return prev;
      }

      return {
        ...prev,
        expression: prev.expression + num,
      };
    });
  }, []);

  const appendOperator = useCallback((op: string) => {
    setState(prev => {
      if (prev.error) {
        return prev;
      }

      const trimmedExpr = prev.expression.trim();
      
      // If expression is empty but we have a result, continue with result
      if (!trimmedExpr && prev.result !== '0') {
        return {
          ...prev,
          expression: prev.result + op,
          result: '0',
        };
      }

      // Prevent operator at start except minus
      if (!trimmedExpr && op !== '-') {
        return prev;
      }

      // Replace last operator if needed
      const lastChar = trimmedExpr.slice(-1);
      if (['+', '-', '*', '/', '%', '^'].includes(lastChar)) {
        return {
          ...prev,
          expression: trimmedExpr.slice(0, -1) + op,
        };
      }

      return {
        ...prev,
        expression: trimmedExpr + ' ' + op + ' ',
      };
    });
  }, []);

  const performCalculation = useCallback(() => {
    setState(prev => {
      if (!prev.expression.trim()) {
        return prev;
      }

      const calcResult = calculate(prev.expression);

      if (calcResult.success) {
        const formattedResult = formatResult(calcResult.value);
        return {
          ...prev,
          result: formattedResult,
          error: null,
          history: [...prev.history, `${prev.expression} = ${formattedResult}`].slice(-10),
        };
      } else {
        return {
          ...prev,
          error: getErrorMessage(calcResult.error),
          result: '0',
        };
      }
    });
  }, []);

  const clear = useCallback(() => {
    setState({
      expression: '',
      result: '0',
      error: null,
      history: [],
    });
  }, []);

  const clearEntry = useCallback(() => {
    setState(prev => ({
      ...prev,
      expression: '',
      result: '0',
      error: null,
    }));
  }, []);

  const toggleSign = useCallback(() => {
    setState(prev => {
      if (prev.error) return prev;

      const trimmed = prev.expression.trim();
      if (!trimmed) {
        if (prev.result !== '0') {
          const negated = parseFloat(prev.result) * -1;
          return { ...prev, result: formatResult(negated) };
        }
        return prev;
      }

      // Find the last number in the expression and negate it
      const match = trimmed.match(/(-?\d+\.?\d*)\s*$/);
      if (match) {
        const num = parseFloat(match[1]);
        const negated = -num;
        const newExpr = trimmed.slice(0, match.index) + negated.toString();
        return { ...prev, expression: newExpr };
      }

      return prev;
    });
  }, []);

  const percentage = useCallback(() => {
    setState(prev => {
      if (prev.error) return prev;

      const trimmed = prev.expression.trim();
      if (!trimmed) {
        const percentaged = parseFloat(prev.result) / 100;
        return { ...prev, result: formatResult(percentaged) };
      }

      // Find the last number and apply percentage
      const match = trimmed.match(/(\d+\.?\d*)\s*$/);
      if (match) {
        const num = parseFloat(match[1]);
        const percentaged = num / 100;
        const newExpr = trimmed.slice(0, match.index) + percentaged.toString();
        return { ...prev, expression: newExpr };
      }

      return prev;
    });
  }, []);

  const backspace = useCallback(() => {
    setState(prev => {
      if (prev.error) return prev;

      const newExpr = prev.expression.slice(0, -1);
      return {
        ...prev,
        expression: newExpr,
      };
    });
  }, []);

  return {
    state,
    appendNumber,
    appendOperator,
    performCalculation,
    clear,
    clearEntry,
    toggleSign,
    percentage,
    backspace,
  };
};

function getErrorMessage(error: CalculatorError): string {
  switch (error.type) {
    case 'DIVISION_BY_ZERO':
      return 'Cannot divide by zero';
    case 'MODULO_BY_ZERO':
      return 'Cannot modulo by zero';
    case 'SYNTAX_ERROR':
      return 'Invalid expression';
    case 'OVERFLOW':
      return 'Result too large';
    case 'NEGATIVE_SQRT':
      return 'Invalid square root';
    default:
      return 'Error';
  }
}
