import { describe, it, expect } from 'vitest';
import { calculate, tokenize, toPostfix, formatResult, isValidInput } from './engine';
import { CalculatorError } from './types';

describe('Calculator Engine - Tokenizer', () => {
  it('should tokenize simple numbers', () => {
    const tokens = tokenize('123');
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toEqual({ type: 'NUMBER', value: '123' });
  });

  it('should tokenize decimal numbers', () => {
    const tokens = tokenize('3.14');
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toEqual({ type: 'NUMBER', value: '3.14' });
  });

  it('should tokenize operators', () => {
    const tokens = tokenize('+');
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toEqual({ type: 'OPERATOR', value: '+' });
  });

  it('should tokenize complex expressions', () => {
    const tokens = tokenize('5 + 3 * 2');
    expect(tokens).toHaveLength(5);
    expect(tokens[0]).toEqual({ type: 'NUMBER', value: '5' });
    expect(tokens[1]).toEqual({ type: 'OPERATOR', value: '+' });
    expect(tokens[2]).toEqual({ type: 'NUMBER', value: '3' });
    expect(tokens[3]).toEqual({ type: 'OPERATOR', value: '*' });
    expect(tokens[4]).toEqual({ type: 'NUMBER', value: '2' });
  });

  it('should handle parentheses', () => {
    const tokens = tokenize('(5 + 3) * 2');
    expect(tokens).toHaveLength(7);
    expect(tokens[0]).toEqual({ type: 'LPAREN', value: '(' });
    expect(tokens[4]).toEqual({ type: 'RPAREN', value: ')' });
  });

  it('should skip whitespace', () => {
    const tokens = tokenize('  5   +   3  ');
    expect(tokens).toHaveLength(3);
  });

  it('should throw error on invalid characters', () => {
    expect(() => tokenize('5 + a')).toThrow(CalculatorError);
  });
});

describe('Calculator Engine - Shunting Yard (toPostfix)', () => {
  it('should convert simple expression to postfix', () => {
    const tokens = tokenize('5 + 3');
    const postfix = toPostfix(tokens);
    expect(postfix.map(t => t.value)).toEqual(['5', '3', '+']);
  });

  it('should respect operator precedence', () => {
    const tokens = tokenize('5 + 3 * 2');
    const postfix = toPostfix(tokens);
    expect(postfix.map(t => t.value)).toEqual(['5', '3', '2', '*', '+']);
  });

  it('should handle parentheses correctly', () => {
    const tokens = tokenize('(5 + 3) * 2');
    const postfix = toPostfix(tokens);
    expect(postfix.map(t => t.value)).toEqual(['5', '3', '+', '2', '*']);
  });

  it('should throw error on mismatched parentheses', () => {
    expect(() => toPostfix(tokenize('(5 + 3'))).toThrow(CalculatorError);
    expect(() => toPostfix(tokenize('5 + 3)'))).toThrow(CalculatorError);
  });
});

describe('Calculator Engine - Calculate Function', () => {
  describe('Basic Operations', () => {
    it('should add two numbers', () => {
      const result = calculate('5 + 3');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(8);
      }
    });

    it('should subtract two numbers', () => {
      const result = calculate('10 - 4');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(6);
      }
    });

    it('should multiply two numbers', () => {
      const result = calculate('6 * 7');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(42);
      }
    });

    it('should divide two numbers', () => {
      const result = calculate('20 / 4');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(5);
      }
    });

    it('should handle operator precedence', () => {
      const result = calculate('5 + 3 * 2');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(11);
      }
    });

    it('should handle parentheses', () => {
      const result = calculate('(5 + 3) * 2');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(16);
      }
    });
  });

  describe('Decimal Precision', () => {
    it('should handle decimal numbers', () => {
      const result = calculate('3.14 + 2.86');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(6);
      }
    });

    it('should handle floating point precision issues', () => {
      const result = calculate('0.1 + 0.2');
      expect(result.success).toBe(true);
      if (result.success) {
        // Should be close to 0.3 despite floating point issues
        expect(Math.abs(result.value - 0.3)).toBeLessThan(0.0000001);
      }
    });
  });

  describe('Error Handling - Defensive Programming', () => {
    it('should handle division by zero', () => {
      const result = calculate('5 / 0');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('DIVISION_BY_ZERO');
      }
    });

    it('should handle modulo by zero', () => {
      const result = calculate('5 % 0');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('DIVISION_BY_ZERO');
      }
    });

    it('should handle empty expression', () => {
      const result = calculate('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('INVALID_INPUT');
      }
    });

    it('should handle whitespace-only expression', () => {
      const result = calculate('   ');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('INVALID_INPUT');
      }
    });

    it('should handle mismatched parentheses', () => {
      const result = calculate('(5 + 3');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('SYNTAX_ERROR');
      }
    });

    it('should handle invalid characters', () => {
      const result = calculate('5 + a');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('SYNTAX_ERROR');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative results', () => {
      const result = calculate('5 - 10');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-5);
      }
    });

    it('should handle exponentiation', () => {
      const result = calculate('2 ^ 3');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(8);
      }
    });

    it('should handle complex nested expressions', () => {
      const result = calculate('((5 + 3) * 2) - (10 / 2)');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(11);
      }
    });

    it('should handle multiple operations', () => {
      const result = calculate('1 + 2 + 3 + 4 + 5');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(15);
      }
    });
  });
});

describe('Calculator Engine - Helper Functions', () => {
  describe('formatResult', () => {
    it('should format integer results', () => {
      expect(formatResult(42)).toBe('42');
    });

    it('should format decimal results', () => {
      expect(formatResult(3.14159)).toBe('3.14159');
    });

    it('should handle floating point precision', () => {
      const result = formatResult(0.1 + 0.2);
      expect(result).toBe('0.3');
    });
  });

  describe('isValidInput', () => {
    it('should allow valid number input', () => {
      expect(isValidInput('5', '3')).toBe(true);
    });

    it('should prevent multiple decimal points', () => {
      expect(isValidInput('5.3', '.')).toBe(false);
    });

    it('should allow decimal after operator', () => {
      expect(isValidInput('5 +', '.')).toBe(true);
    });

    it('should prevent consecutive operators', () => {
      expect(isValidInput('5 +', '+')).toBe(false);
      expect(isValidInput('5 +', '*')).toBe(false);
    });

    it('should allow minus after operator (for negative numbers)', () => {
      expect(isValidInput('5 +', '-')).toBe(true);
    });
  });
});
