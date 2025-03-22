import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/lib/calculator';
import { cn } from '@/lib/utils';

interface CalcButtonProps {
  value: string;
  onClick: () => void;
  variant?: 'default' | 'gold' | 'operator' | 'function';
  className?: string;
  colSpan?: number;
}

const CalcButton = ({ value, onClick, variant = 'default', className, colSpan = 1 }: CalcButtonProps) => {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'calc-button h-10 rounded-md font-mono text-sm transition-all',
        colSpan === 2 ? 'col-span-2' : '',
        variant === 'default' && 'bg-navy/50 border border-gold/20 text-white',
        variant === 'gold' && 'bg-gold text-navy font-bold',
        variant === 'operator' && 'bg-gold/80 text-navy font-bold',
        variant === 'function' && 'bg-navy/50 border border-gold/20 text-gold',
        className
      )}
    >
      {value}
    </motion.button>
  );
};

const ScientificCalculator = () => {
  const {
    display,
    appendValue,
    clear,
    calculate,
    toggleSign,
    percentage,
    applyFunction,
    history,
    exportToCSV
  } = useCalculator();

  const [showHistory, setShowHistory] = useState(false);
  const [degreeMode, setDegreeMode] = useState(true);

  const handleFunctionClick = (func: string) => {
    applyFunction(func);
  };

  return (
    <div className="calculator-3d perspective-1000">
      <motion.div
        initial={{ rotateX: 20, rotateY: -10 }}
        animate={{ rotateX: 5, rotateY: 10 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="transform-style-3d"
      >
        <Card className="relative bg-darkCard border border-gold/30 p-6 shadow-lg overflow-hidden">
          <div className="card-shine absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-playfair text-2xl font-bold text-gold">Scientific Calculator</h3>
            <div className="flex gap-2">
              <Button 
                variant="royal-outline" 
                size="sm" 
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs"
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </Button>
              <Button 
                variant="royal-outline" 
                size="sm" 
                onClick={exportToCSV}
                className="text-xs"
              >
                Export
              </Button>
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-navy border border-gold/30 rounded-md">
            <motion.p 
              key={display}
              initial={{ opacity: 0.8, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-right text-xl text-gold calculator-display overflow-x-auto whitespace-nowrap"
            >
              {display}
            </motion.p>
          </div>
          
          {showHistory && (
            <div className="mb-4 max-h-32 overflow-auto bg-navy/30 border border-gold/20 rounded-md p-2">
              <ul className="text-sm">
                {history.map((item, index) => (
                  <li key={index} className="mb-1 font-mono text-lightGray">
                    <span className="text-gold">{item.expression}</span> = {item.result}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-5 gap-2">
            <CalcButton value="sin" onClick={() => handleFunctionClick('sin')} variant="function" />
            <CalcButton value="cos" onClick={() => handleFunctionClick('cos')} variant="function" />
            <CalcButton value="tan" onClick={() => handleFunctionClick('tan')} variant="function" />
            <CalcButton value="log" onClick={() => handleFunctionClick('log')} variant="function" />
            <CalcButton value="ln" onClick={() => handleFunctionClick('ln')} variant="function" />
            
            <CalcButton value="π" onClick={() => handleFunctionClick('pi')} variant="function" />
            <CalcButton value="e" onClick={() => handleFunctionClick('e')} variant="function" />
            <CalcButton value="√" onClick={() => handleFunctionClick('sqrt')} variant="function" />
            <CalcButton value="x²" onClick={() => handleFunctionClick('square')} variant="function" />
            <CalcButton value="x^y" onClick={() => appendValue('^')} variant="function" />
            
            <CalcButton value="(" onClick={() => appendValue('(')} variant="operator" />
            <CalcButton value=")" onClick={() => appendValue(')')} variant="operator" />
            <CalcButton value="C" onClick={clear} variant="operator" />
            <CalcButton value="±" onClick={toggleSign} variant="operator" />
            <CalcButton value="%" onClick={percentage} variant="operator" />
            
            <CalcButton value="7" onClick={() => appendValue('7')} variant="default" />
            <CalcButton value="8" onClick={() => appendValue('8')} variant="default" />
            <CalcButton value="9" onClick={() => appendValue('9')} variant="default" />
            <CalcButton value="÷" onClick={() => appendValue('/')} variant="operator" />
            <CalcButton 
              value={degreeMode ? "DEG" : "RAD"} 
              onClick={() => setDegreeMode(!degreeMode)} 
              variant="function" 
            />
            
            <CalcButton value="4" onClick={() => appendValue('4')} variant="default" />
            <CalcButton value="5" onClick={() => appendValue('5')} variant="default" />
            <CalcButton value="6" onClick={() => appendValue('6')} variant="default" />
            <CalcButton value="×" onClick={() => appendValue('*')} variant="operator" />
            <CalcButton value="1/x" onClick={() => appendValue('1/')} variant="function" />
            
            <CalcButton value="1" onClick={() => appendValue('1')} variant="default" />
            <CalcButton value="2" onClick={() => appendValue('2')} variant="default" />
            <CalcButton value="3" onClick={() => appendValue('3')} variant="default" />
            <CalcButton value="-" onClick={() => appendValue('-')} variant="operator" />
            <CalcButton value="|x|" onClick={() => appendValue('abs(')} variant="function" />
            
            <CalcButton value="0" onClick={() => appendValue('0')} variant="default" />
            <CalcButton value="." onClick={() => appendValue('.')} variant="default" />
            <CalcButton value="EXP" onClick={() => appendValue('e')} variant="function" />
            <CalcButton value="+" onClick={() => appendValue('+')} variant="operator" />
            <CalcButton value="=" onClick={calculate} variant="gold" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScientificCalculator;
