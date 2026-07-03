import { Operation, basicOperations, unaryOperations } from './operations';
import { CalculatorError, CalculatorErrorType, CalculationResult } from './types';

/**
 * Token types for the expression parser
 */
export type TokenType = 'NUMBER' | 'OPERATOR' | 'LPAREN' | 'RPAREN' | 'UNARY';

export interface Token {
  type: TokenType;
  value: string;
}

/**
 * Pure function to tokenize an input string
 * Single Responsibility: Only handles tokenization, not evaluation
 */
export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < expression.length) {
    const char = expression[i];
    
    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    
    // Numbers (including decimals)
    if (/\d/.test(char) || (char === '.' && /\d/.test(expression[i + 1]))) {
      let numStr = '';
      let hasDecimal = false;
      
      while (i < expression.length && (/\d/.test(expression[i]) || (expression[i] === '.' && !hasDecimal))) {
        if (expression[i] === '.') {
          hasDecimal = true;
        }
        numStr += expression[i];
        i++;
      }
      
      // Handle leading decimal point (e.g., ".5" -> "0.5")
      if (numStr.startsWith('.')) {
        numStr = '0' + numStr;
      }
      
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }
    
    // Operators
    if (['+', '-', '*', '/', '%', '^'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }
    
    // Parentheses
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: char });
      i++;
      continue;
    }
    
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: char });
      i++;
      continue;
    }
    
    // Unknown character
    throw new CalculatorError('SYNTAX_ERROR', `Unexpected character: ${char}`);
  }
  
  return tokens;
}

/**
 * Shunting Yard Algorithm - converts infix to postfix (RPN)
 * Pure function with no side effects
 */
export function toPostfix(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operatorStack: Token[] = [];
  
  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '%': 2,
    '^': 3,
  };
  
  const rightAssociative: Record<string, boolean> = {
    '^': true,
  };
  
  for (const token of tokens) {
    switch (token.type) {
      case 'NUMBER':
        output.push(token);
        break;
        
      case 'OPERATOR': {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].type === 'OPERATOR'
        ) {
          const topOp = operatorStack[operatorStack.length - 1];
          const topPrec = precedence[topOp.value];
          const currPrec = precedence[token.value];
          
          if (
            (rightAssociative[token.value] && currPrec < topPrec) ||
            (!rightAssociative[token.value] && currPrec <= topPrec)
          ) {
            output.push(operatorStack.pop()!);
          } else {
            break;
          }
        }
        operatorStack.push(token);
        break;
      }
        
      case 'LPAREN':
        operatorStack.push(token);
        break;
        
      case 'RPAREN':
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].type !== 'LPAREN'
        ) {
          output.push(operatorStack.pop()!);
        }
        if (operatorStack.length === 0) {
          throw new CalculatorError('SYNTAX_ERROR', 'Mismatched parentheses');
        }
        operatorStack.pop(); // Remove the LPAREN
        break;
    }
  }
  
  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op.type === 'LPAREN' || op.type === 'RPAREN') {
      throw new CalculatorError('SYNTAX_ERROR', 'Mismatched parentheses');
    }
    output.push(op);
  }
  
  return output;
}

/**
 * Evaluates a postfix (RPN) expression
 * Pure function - no side effects
 */
export function evaluatePostfix(tokens: Token[]): CalculationResult {
  const stack: number[] = [];
  
  for (const token of tokens) {
    switch (token.type) {
      case 'NUMBER':
        stack.push(parseFloat(token.value));
        break;
        
      case 'OPERATOR': {
        if (stack.length < 2) {
          return { 
            success: false, 
            error: new CalculatorError('SYNTAX_ERROR', 'Invalid expression') 
          };
        }
        
        const b = stack.pop()!;
        const a = stack.pop()!;
        const operation = basicOperations[token.value];
        
        if (!operation) {
          return { 
            success: false, 
            error: new CalculatorError('SYNTAX_ERROR', `Unknown operator: ${token.value}`) 
          };
        }
        
        try {
          const result = operation.execute(a, b);
          
          // Check for overflow/invalid numbers
          if (!isFinite(result) || isNaN(result)) {
            return { 
              success: false, 
              error: new CalculatorError('OVERFLOW', 'Result overflow or invalid') 
            };
          }
          
          stack.push(result);
        } catch (error) {
          if (error instanceof CalculatorError) {
            return { success: false, error };
          }
          if (error instanceof Error) {
            if (error.message.includes('zero')) {
              return { 
                success: false, 
                error: new CalculatorError('DIVISION_BY_ZERO', error.message) 
              };
            }
          }
          return { 
            success: false, 
            error: new CalculatorError('INVALID_INPUT', 'Calculation failed') 
          };
        }
        break;
      }
    }
  }
  
  if (stack.length !== 1) {
    return { 
      success: false, 
      error: new CalculatorError('SYNTAX_ERROR', 'Invalid expression') 
    };
  }
  
  return { success: true, value: stack[0] };
}

/**
 * Main calculation function - pure function that orchestrates the calculation pipeline
 * Separation of Concerns: This is the business logic layer, completely independent of UI
 */
export function calculate(expression: string): CalculationResult {
  try {
    // Handle empty expression
    if (!expression.trim()) {
      return { 
        success: false, 
        error: new CalculatorError('INVALID_INPUT', 'Empty expression') 
      };
    }
    
    // Tokenize
    const tokens = tokenize(expression);
    
    if (tokens.length === 0) {
      return { 
        success: false, 
        error: new CalculatorError('INVALID_INPUT', 'No valid tokens') 
      };
    }
    
    // Convert to postfix
    const postfix = toPostfix(tokens);
    
    // Evaluate
    return evaluatePostfix(postfix);
  } catch (error) {
    if (error instanceof CalculatorError) {
      return { success: false, error };
    }
    return { 
      success: false, 
      error: new CalculatorError('SYNTAX_ERROR', 'Failed to parse expression') 
    };
  }
}

/**
 * Validates if adding a character would create an invalid expression
 * Defensive programming helper
 */
export function isValidInput(currentExpression: string, newChar: string): boolean {
  // Prevent multiple decimal points in a single number
  if (newChar === '.') {
    const parts = currentExpression.split(/[\+\-\*\/\^\(\)]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) {
      return false;
    }
  }
  
  // Prevent multiple consecutive operators (except minus for negative numbers)
  const operators = ['+', '*', '/', '%', '^'];
  if (operators.includes(newChar)) {
    const lastChar = currentExpression.trim().slice(-1);
    if (operators.includes(lastChar) || lastChar === '(') {
      return false;
    }
  }
  
  return true;
}

/**
 * Formats a number for display, handling precision issues
 */
export function formatResult(value: number): string {
  // Handle floating point precision issues
  const precision = 10;
  const rounded = Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  
  // Convert to string and remove trailing zeros after decimal
  return rounded.toString();
}
