import { useState } from 'react';
import CalculatorButton from './CalculatorButton';
import CalculatorDisplay from './CalculatorDisplay';
import { useCalculator } from '@/hooks/useCalculator';

const BasicCalculator = () => {
  const { input, result, handleButtonClick, clearAll } = useCalculator();
  const [rotation, setRotation] = useState(3);

  // Hover handlers for 3D effect
  const handleMouseEnter = () => setRotation(0);
  const handleMouseLeave = () => setRotation(3);

  return (
    <div 
      className="calculator-3d"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`reflect-top royal-gradient p-6 rounded-2xl shadow-calculator rotate-${rotation} transform transition-all duration-300 hover:rotate-0`}>
        <CalculatorDisplay input={input} result={result} />
        
        <div className="grid grid-cols-4 gap-3">
          {/* First row */}
          <CalculatorButton value="AC" onClick={() => clearAll()} type="clear" />
          <CalculatorButton value="+/-" onClick={handleButtonClick} type="function" />
          <CalculatorButton value="%" onClick={handleButtonClick} type="function" />
          <CalculatorButton value="÷" onClick={handleButtonClick} type="operator" />
          
          {/* Second row */}
          <CalculatorButton value="7" onClick={handleButtonClick} type="number" />
          <CalculatorButton value="8" onClick={handleButtonClick} type="number" />
          <CalculatorButton value="9" onClick={handleButtonClick} type="number" />
          <CalculatorButton value="×" onClick={handleButtonClick} type="operator" />
          
          {/* Third row */}
          <CalculatorButton value="4" onClick={handleButtonClick} type="number" />
          <CalculatorButton value="5" onClick={handleButtonClick} type="number" />
          <CalculatorButton value="6" onClick={handleButtonClick} type="number" />
          <CalculatorButton value="-" onClick={handleButtonClick} type="operator" />
          
          {/* Fourth row */}
          <CalculatorButton value="1" onClick={handleButtonClick} type="number" />
          <CalculatorButton value="2" onClick={handleButtonClick} type="number" />
          <CalculatorButton value="3" onClick={handleButtonClick} type="number" />
          <CalculatorButton value="+" onClick={handleButtonClick} type="operator" />
          
          {/* Fifth row */}
          <CalculatorButton value="0" onClick={handleButtonClick} type="number" width="double" />
          <CalculatorButton value="." onClick={handleButtonClick} type="number" />
          <CalculatorButton value="=" onClick={handleButtonClick} type="equals" />
        </div>
      </div>
    </div>
  );
};

export default BasicCalculator;
