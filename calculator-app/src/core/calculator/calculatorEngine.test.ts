import { describe, it, expect } from 'vitest';
import { CalculatorEngine } from './calculatorEngine';

describe('CalculatorEngine', () => {
  const engine = new CalculatorEngine();

  describe('Basic Operations', () => {
    it('should add two numbers correctly', () => {
      expect(engine.evaluate('2 + 3')).toBe(5);
      expect(engine.evaluate('10 + 20.5')).toBe(30.5);
    });

    it('should subtract two numbers correctly', () => {
      expect(engine.evaluate('10 - 3')).toBe(7);
      expect(engine.evaluate('5.5 - 2.5')).toBe(3);
    });

    it('should multiply two numbers correctly', () => {
      expect(engine.evaluate('4 * 5')).toBe(20);
      expect(engine.evaluate('2.5 * 4')).toBe(10);
    });

    it('should divide two numbers correctly', () => {
      expect(engine.evaluate('20 / 4')).toBe(5);
      expect(engine.evaluate('7.5 / 2.5')).toBe(3);
    });
  });

  describe('Order of Operations (PEMDAS)', () => {
    it('should handle multiplication before addition', () => {
      expect(engine.evaluate('5 + 3 * 2')).toBe(11);
    });

    it('should handle division before subtraction', () => {
      expect(engine.evaluate('10 - 8 / 2')).toBe(6);
    });

    it('should handle parentheses correctly', () => {
      expect(engine.evaluate('(5 + 3) * 2')).toBe(16);
      expect(engine.evaluate('((2 + 3) * 4) - 5')).toBe(15);
    });
  });

  describe('Decimal Precision', () => {
    it('should handle floating point precision correctly', () => {
      // Classic floating point issue: 0.1 + 0.2 should be 0.3
      const result = engine.evaluate('0.1 + 0.2');
      expect(result).toBeCloseTo(0.3, 10);
    });

    it('should handle multiple decimal places', () => {
      const result = engine.evaluate('1.234 + 5.678');
      expect(result).toBeCloseTo(6.912, 10);
    });
  });

  describe('Error Handling', () => {
    it('should handle division by zero gracefully', () => {
      expect(() => engine.evaluate('10 / 0')).toThrow('Division by zero');
    });

    it('should handle invalid expressions', () => {
      expect(() => engine.evaluate('invalid')).toThrow('Invalid expression');
    });

    it('should handle empty input', () => {
      expect(() => engine.evaluate('')).toThrow('Invalid expression');
    });

    it('should handle multiple consecutive operators', () => {
      expect(() => engine.evaluate('5 ++ 3')).toThrow('Invalid expression');
    });

    it('should handle double decimals', () => {
      expect(() => engine.evaluate('5..3')).toThrow('Invalid expression');
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative numbers', () => {
      expect(engine.evaluate('-5 + 3')).toBe(-2);
      expect(engine.evaluate('5 + (-3)')).toBe(2);
    });

    it('should handle unary minus', () => {
      expect(engine.evaluate('-10')).toBe(-10);
    });

    it('should handle large numbers', () => {
      expect(engine.evaluate('1000000 + 2000000')).toBe(3000000);
    });

    it('should handle whitespace in expression', () => {
      expect(engine.evaluate('  5   +   3  ')).toBe(8);
    });
  });
});
