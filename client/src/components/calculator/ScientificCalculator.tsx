import { useState } from 'react';
import CalculatorButton from './CalculatorButton';
import CalculatorDisplay from './CalculatorDisplay';
import { useCalculator } from '@/hooks/useCalculator';
import { motion } from 'framer-motion';

const ScientificCalculator = () => {
  const { input, result, handleButtonClick, clearAll, setInput, setResult } = useCalculator();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const evaluateScientific = (expression: string) => {
    try {
      // Replace scientific notation and functions with JavaScript equivalents
      let processedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      // Evaluate the expression
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${processedExpression})`)();
      
      return result.toString();
    } catch (error) {
      console.error('Error evaluating scientific expression:', error);
      return 'Error';
    }
  };

  const handleScientificButton = (value: string) => {
    if (value === '=') {
      try {
        const newResult = evaluateScientific(input);
        setResult(newResult);
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'DEG' || value === 'RAD') {
      // Toggle between degrees and radians
      // Implementation would depend on how you want to handle angle modes
    } else {
      // For functions that need parentheses
      if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(value)) {
        setInput((prev) => prev + value + '(');
      } else {
        handleButtonClick(value);
      }
    }
  };

  return (
    <div className="calculator-3d">
      <motion.div 
        className="reflect-top royal-gradient p-5 rounded-2xl shadow-calculator"
        initial={{ rotateY: 5, rotateX: 5 }}
        whileHover={{ rotateY: 0, rotateX: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CalculatorDisplay input={input} result={result} className="mb-5" />
        
        <div className="mb-3 flex justify-center">
          <button 
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${showAdvanced 
              ? 'bg-navy-light text-gold' 
              : 'bg-gold text-dark'}`}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Basic' : 'Advanced'}
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {showAdvanced ? (
            <>
              {/* Advanced buttons */}
              <CalculatorButton value="sin" onClick={handleScientificButton} type="function" />
              <CalculatorButton value="cos" onClick={handleScientificButton} type="function" />
              <CalculatorButton value="tan" onClick={handleScientificButton} type="function" />
              <CalculatorButton value="AC" onClick={() => clearAll()} type="clear" />
              
              <CalculatorButton value="log" onClick={handleScientificButton} type="function" />
              <CalculatorButton value="ln" onClick={handleScientificButton} type="function" />
              <CalculatorButton value="(" onClick={handleButtonClick} type="function" />
              <CalculatorButton value=")" onClick={handleButtonClick} type="function" />
              
              <CalculatorButton value="π" onClick={handleButtonClick} type="function" />
              <CalculatorButton value="e" onClick={handleButtonClick} type="function" />
              <CalculatorButton value="^" onClick={handleButtonClick} type="operator" />
              <CalculatorButton value="sqrt" onClick={handleScientificButton} type="function" />
              
              <CalculatorButton value="7" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="8" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="9" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="÷" onClick={handleButtonClick} type="operator" />
              
              <CalculatorButton value="4" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="5" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="6" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="×" onClick={handleButtonClick} type="operator" />
              
              <CalculatorButton value="1" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="2" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="3" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="-" onClick={handleButtonClick} type="operator" />
              
              <CalculatorButton value="0" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="." onClick={handleButtonClick} type="number" />
              <CalculatorButton value="=" onClick={handleScientificButton} type="equals" />
              <CalculatorButton value="+" onClick={handleButtonClick} type="operator" />
            </>
          ) : (
            <>
              {/* Basic buttons */}
              <CalculatorButton value="AC" onClick={() => clearAll()} type="clear" />
              <CalculatorButton value="+/-" onClick={handleButtonClick} type="function" />
              <CalculatorButton value="%" onClick={handleButtonClick} type="function" />
              <CalculatorButton value="÷" onClick={handleButtonClick} type="operator" />
              
              <CalculatorButton value="7" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="8" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="9" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="×" onClick={handleButtonClick} type="operator" />
              
              <CalculatorButton value="4" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="5" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="6" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="-" onClick={handleButtonClick} type="operator" />
              
              <CalculatorButton value="1" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="2" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="3" onClick={handleButtonClick} type="number" />
              <CalculatorButton value="+" onClick={handleButtonClick} type="operator" />
              
              <CalculatorButton value="0" onClick={handleButtonClick} type="number" width="double" />
              <CalculatorButton value="." onClick={handleButtonClick} type="number" />
              <CalculatorButton value="=" onClick={handleScientificButton} type="equals" />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ScientificCalculator;
