import { useState } from 'react';
import { evaluate } from 'mathjs';

export function useCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [memory, setMemory] = useState<number | null>(null);

  const clearAll = () => {
    setInput('');
    setResult('');
  };

  const clearEntry = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const calculateResult = () => {
    try {
      // Replace × with * and ÷ with / for evaluation
      const sanitizedInput = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100');
      
      const calculatedResult = evaluate(sanitizedInput);
      setResult(calculatedResult.toString());
      return calculatedResult.toString();
    } catch (error) {
      setResult('Error');
      return 'Error';
    }
  };

  const handleButtonClick = (value: string) => {
    switch (value) {
      case 'AC':
        clearAll();
        break;
      case 'C':
        clearEntry();
        break;
      case '=':
        calculateResult();
        break;
      case '+/-':
        if (input) {
          if (input.startsWith('-')) {
            setInput(input.substring(1));
          } else {
            setInput('-' + input);
          }
        }
        break;
      case 'MS':
        const currentResult = result || calculateResult();
        if (currentResult !== 'Error') {
          setMemory(parseFloat(currentResult));
        }
        break;
      case 'MR':
        if (memory !== null) {
          setInput(prev => prev + memory.toString());
        }
        break;
      case 'MC':
        setMemory(null);
        break;
      case 'M+':
        if (memory !== null && result && result !== 'Error') {
          setMemory(memory + parseFloat(result));
        }
        break;
      case 'M-':
        if (memory !== null && result && result !== 'Error') {
          setMemory(memory - parseFloat(result));
        }
        break;
      default:
        setInput(prev => prev + value);
        break;
    }
  };

  return {
    input,
    setInput,
    result,
    setResult,
    memory,
    handleButtonClick,
    clearAll,
    clearEntry,
    calculateResult,
  };
}
