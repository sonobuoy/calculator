/**
 * CalculatorEngine - Pure function-based calculation engine
 * 
 * Principles applied:
 * - Separation of Concerns: No React/DOM dependencies
 * - Single Responsibility: Only handles mathematical expressions
 * - Open/Closed: Uses OperationRegistry for extensibility
 * - Defensive Programming: Handles edge cases and errors gracefully
 */

import { basicOperations, unaryOperations } from './operations';

export class CalculatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculatorError';
  }
}

export class CalculatorEngine {
  /**
   * Validates the expression before evaluation
   */
  private validateExpression(expression: string): void {
    if (!expression || expression.trim() === '') {
      throw new CalculatorError('Invalid expression');
    }

    // Check for double decimals
    if (/\d+\.\d*\.\d+/.test(expression)) {
      throw new CalculatorError('Invalid expression');
    }

    // Check for consecutive operators (except valid ones like **- or +- for negative numbers)
    const cleanedExpr = expression.replace(/\s+/g, '');
    if (/[^0-9.](\+|-|\*|\/|\^|%){2,}/.test(cleanedExpr) && !/^\d+\.\d+$/.test(expression)) {
      // Allow patterns like (-3) but not ++
      if (/(\+|\*|\/|\^|%){2,}/.test(cleanedExpr)) {
        throw new CalculatorError('Invalid expression');
      }
    }

    // Check for invalid characters
    const validChars = /^[\d\s\+\-\*\/\^\%\.\(\)]+$/;
    if (!validChars.test(expression.replace(/\s+/g, ''))) {
      throw new CalculatorError('Invalid expression');
    }
  }

  /**
   * Evaluates a mathematical expression string
   * Uses a safe evaluation approach with proper error handling
   */
  evaluate(expression: string): number {
    try {
      this.validateExpression(expression);

      // Pre-process: Handle percentage operations
      let processedExpr = this.processPercentages(expression);

      // Use Function constructor with strict validation for safe evaluation
      // This is safer than eval() and allows proper operator precedence
      const sanitizedExpr = this.sanitizeExpression(processedExpr);
      
      // Check for division by zero before evaluation
      if (this.containsDivisionByZero(sanitizedExpr)) {
        throw new CalculatorError('Division by zero');
      }

      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitizedExpr})`)();

      if (!isFinite(result) || isNaN(result)) {
        throw new CalculatorError('Invalid result');
      }

      // Round to avoid floating point precision issues
      return Math.round(result * 1e10) / 1e10;
    } catch (error) {
      if (error instanceof CalculatorError) {
        throw error;
      }
      throw new CalculatorError('Invalid expression');
    }
  }

  /**
   * Process percentage operations in the expression
   */
  private processPercentages(expression: string): string {
    return expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
  }

  /**
   * Sanitize expression for safe evaluation
   */
  private sanitizeExpression(expression: string): string {
    // Replace ^ with ** for exponentiation
    return expression.replace(/\^/g, '**');
  }

  /**
   * Check if expression contains division by zero
   */
  private containsDivisionByZero(expression: string): boolean {
    // Simple check for /0 patterns (not perfect but catches common cases)
    const normalized = expression.replace(/\s+/g, '');
    return /\/0(?:[^\d]|$)/.test(normalized);
  }

  /**
   * Resets the engine state (if any stateful operations are added in future)
   */
  reset(): void {
    // Currently stateless, but provided for future extensibility
  }
}

// Export singleton instance for convenience
export const calculatorEngine = new CalculatorEngine();
