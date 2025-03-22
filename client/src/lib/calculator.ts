import { create } from 'zustand';
import * as math from 'mathjs';
import { apiRequest } from './queryClient';

// Define types
export type CalculatorType = 'basic' | 'financial' | 'scientific' | 'graphing';

export type FinancialCalculationType = 'loan' | 'investment' | 'roi' | 'mortgage';

interface CalculatorState {
  display: string;
  expression: string;
  memory: number;
  history: Array<{ expression: string; result: string }>;
  calculatorType: CalculatorType;
  isError: boolean;
  
  // Basic operations
  appendValue: (value: string) => void;
  clear: () => void;
  clearEntry: () => void;
  calculate: () => void;
  toggleSign: () => void;
  percentage: () => void;
  
  // Memory operations
  memoryAdd: () => void;
  memorySubtract: () => void;
  memoryRecall: () => void;
  memoryClear: () => void;
  
  // Scientific operations
  applyFunction: (func: string) => void;
  
  // State management
  setCalculatorType: (type: CalculatorType) => void;
  
  // Financial calculations
  calculateFinancial: (type: FinancialCalculationType, params: Record<string, number>) => Promise<number>;

  // Support functions
  exportToCSV: () => void;
}

export const useCalculator = create<CalculatorState>((set, get) => ({
  display: '0',
  expression: '',
  memory: 0,
  history: [],
  calculatorType: 'basic',
  isError: false,
  
  appendValue: (value) => {
    set((state) => {
      if (state.isError) {
        return {
          display: value === '.' ? '0.' : value,
          expression: value === '.' ? '0.' : value,
          isError: false
        };
      }
      
      // Handle operators
      if (['+', '-', '*', '/', '^'].includes(value)) {
        return {
          display: value,
          expression: state.expression + value
        };
      }
      
      // Handle numbers and decimals
      if (state.display === '0' && value !== '.') {
        return {
          display: value,
          expression: state.expression === '0' ? value : state.expression + value
        };
      }
      
      // Prevent multiple decimals in a number
      if (value === '.' && state.display.includes('.')) {
        return state;
      }
      
      return {
        display: state.display + value,
        expression: state.expression + value
      };
    });
  },
  
  clear: () => {
    set({
      display: '0',
      expression: '',
      isError: false
    });
  },
  
  clearEntry: () => {
    set((state) => ({
      display: '0',
      expression: state.expression.slice(0, -state.display.length),
      isError: false
    }));
  },
  
  calculate: async () => {
    const { expression, calculatorType } = get();
    
    if (!expression) return;
    
    try {
      // For basic calculation, evaluate client-side
      if (calculatorType === 'basic') {
        const result = math.evaluate(expression);
        set((state) => ({
          display: String(result),
          expression: String(result),
          history: [
            ...state.history, 
            { expression: state.expression, result: String(result) }
          ]
        }));
      } else {
        // For more complex calculations, send to server
        const response = await apiRequest('POST', '/api/calculate', {
          expression,
          type: calculatorType
        });
        
        const data = await response.json();
        
        set((state) => ({
          display: String(data.result),
          expression: String(data.result),
          history: [
            ...state.history, 
            { expression: state.expression, result: String(data.result) }
          ]
        }));
      }
    } catch (error) {
      set({
        display: 'Error',
        isError: true
      });
    }
  },
  
  toggleSign: () => {
    set((state) => {
      if (state.display === '0') return state;
      
      const newDisplay = state.display.startsWith('-') 
        ? state.display.substring(1) 
        : '-' + state.display;
      
      // Update expression by replacing the last number
      const expressionParts = state.expression.split(/([+\-*\/])/);
      const lastPart = expressionParts.pop() || '';
      const newLastPart = lastPart.startsWith('-') 
        ? lastPart.substring(1) 
        : '-' + lastPart;
      
      return {
        display: newDisplay,
        expression: [...expressionParts, newLastPart].join('')
      };
    });
  },
  
  percentage: () => {
    set((state) => {
      try {
        // Evaluate the expression so far
        const currentExpr = state.expression || '0';
        let baseValue = 0;
        
        // If there's an operation in progress, calculate percentage of previous value
        const match = currentExpr.match(/(.+)([\+\-\*\/])(.+)/);
        
        if (match) {
          const [, leftPart, operator, rightPart] = match;
          const leftValue = math.evaluate(leftPart);
          const percentValue = math.evaluate(rightPart) / 100;
          
          let result;
          switch (operator) {
            case '+':
            case '-':
              result = leftValue * percentValue;
              break;
            case '*':
            case '/':
              result = percentValue;
              break;
            default:
              result = percentValue;
          }
          
          return {
            display: String(result),
            expression: leftPart + operator + String(result)
          };
        }
        
        // Simple percentage of the current value
        const value = math.evaluate(currentExpr) / 100;
        return {
          display: String(value),
          expression: String(value)
        };
      } catch (error) {
        return {
          display: 'Error',
          isError: true
        };
      }
    });
  },
  
  memoryAdd: () => {
    set((state) => {
      try {
        const value = state.display === 'Error' ? 0 : parseFloat(state.display);
        return { memory: state.memory + value };
      } catch (e) {
        return state;
      }
    });
  },
  
  memorySubtract: () => {
    set((state) => {
      try {
        const value = state.display === 'Error' ? 0 : parseFloat(state.display);
        return { memory: state.memory - value };
      } catch (e) {
        return state;
      }
    });
  },
  
  memoryRecall: () => {
    set((state) => ({
      display: String(state.memory),
      expression: state.expression + state.memory
    }));
  },
  
  memoryClear: () => {
    set({ memory: 0 });
  },
  
  applyFunction: (func) => {
    set((state) => {
      try {
        const value = state.display === 'Error' ? 0 : parseFloat(state.display);
        let result;
        
        switch (func) {
          case 'sin':
            result = Math.sin(value);
            break;
          case 'cos':
            result = Math.cos(value);
            break;
          case 'tan':
            result = Math.tan(value);
            break;
          case 'log':
            result = Math.log10(value);
            break;
          case 'ln':
            result = Math.log(value);
            break;
          case 'sqrt':
            result = Math.sqrt(value);
            break;
          case 'square':
            result = value * value;
            break;
          case 'exp':
            result = Math.exp(value);
            break;
          case 'pi':
            result = Math.PI;
            break;
          case 'e':
            result = Math.E;
            break;
          default:
            result = value;
        }
        
        return {
          display: String(result),
          expression: `${func}(${state.display})`,
          history: [
            ...state.history, 
            { expression: `${func}(${state.display})`, result: String(result) }
          ]
        };
      } catch (error) {
        return {
          display: 'Error',
          isError: true
        };
      }
    });
  },
  
  setCalculatorType: (type) => {
    set({ calculatorType: type, display: '0', expression: '' });
  },
  
  calculateFinancial: async (type, params) => {
    try {
      const response = await apiRequest('POST', '/api/financial-calculate', {
        type,
        params
      });
      
      const data = await response.json();
      const result = data.result;
      
      set((state) => ({
        display: String(result),
        history: [
          ...state.history, 
          { 
            expression: `${type}(${JSON.stringify(params)})`, 
            result: String(result) 
          }
        ]
      }));
      
      return result;
    } catch (error) {
      set({
        display: 'Error',
        isError: true
      });
      throw error;
    }
  },
  
  exportToCSV: () => {
    const { history } = get();
    if (history.length === 0) return;
    
    const csvData = history.map((entry, index) => ({
      id: index + 1,
      expression: entry.expression,
      result: entry.result,
      timestamp: new Date().toISOString()
    }));
    
    const a = document.createElement('a');
    const blob = new Blob([
      'id,expression,result,timestamp\n' +
      csvData.map(row => 
        `${row.id},"${row.expression}","${row.result}","${row.timestamp}"`
      ).join('\n')
    ], { type: 'text/csv' });
    
    a.href = URL.createObjectURL(blob);
    a.download = `calculator-history-${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}));
