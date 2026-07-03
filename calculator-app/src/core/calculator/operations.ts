/**
 * Operation interface following Strategy Pattern
 * Allows adding new operations without modifying existing code (OCP)
 */
export interface Operation {
  execute(...args: number[]): number;
}

/**
 * Registry for mathematical operations
 * Implements Open/Closed Principle - new operations can be registered without modifying core logic
 */
export class OperationRegistry {
  private operations: Map<string, Operation> = new Map();

  register(name: string, operation: Operation): void {
    this.operations.set(name, operation);
  }

  get(name: string): Operation | undefined {
    return this.operations.get(name);
  }

  has(name: string): boolean {
    return this.operations.has(name);
  }
}

/**
 * Basic arithmetic operations implementing the Operation interface
 */
export const basicOperations: Record<string, Operation> = {
  '+': {
    execute: (a: number, b: number): number => a + b,
  },
  '-': {
    execute: (a: number, b: number): number => a - b,
  },
  '*': {
    execute: (a: number, b: number): number => a * b,
  },
  '/': {
    execute: (a: number, b: number): number => {
      if (b === 0) {
        throw new Error('Division by zero');
      }
      return a / b;
    },
  },
  '%': {
    execute: (a: number, b: number): number => {
      if (b === 0) {
        throw new Error('Modulo by zero');
      }
      return a % b;
    },
  },
  '^': {
    execute: (a: number, b: number): number => Math.pow(a, b),
  },
};

/**
 * Unary operations (single operand)
 */
export const unaryOperations: Record<string, Operation> = {
  'negate': {
    execute: (a: number): number => -a,
  },
  'percent': {
    execute: (a: number): number => a / 100,
  },
  'sqrt': {
    execute: (a: number): number => {
      if (a < 0) {
        throw new Error('Cannot calculate square root of negative number');
      }
      return Math.sqrt(a);
    },
  },
};
