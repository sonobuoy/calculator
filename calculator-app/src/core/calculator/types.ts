/**
 * CalculatorError types for defensive programming
 */
export type CalculatorErrorType = 
  | 'DIVISION_BY_ZERO'
  | 'MODULO_BY_ZERO'
  | 'INVALID_INPUT'
  | 'OVERFLOW'
  | 'SYNTAX_ERROR'
  | 'NEGATIVE_SQRT';

export class CalculatorError extends Error {
  constructor(
    public readonly type: CalculatorErrorType,
    message: string
  ) {
    super(message);
    this.name = 'CalculatorError';
  }
}

/**
 * Result type that encapsulates both success and error states
 */
export type CalculationResult<T = number> = 
  | { success: true; value: T }
  | { success: false; error: CalculatorError };
