import { cn } from '@/lib/utils';

interface CalculatorDisplayProps {
  input: string;
  result: string;
  className?: string;
}

const CalculatorDisplay = ({ input, result, className }: CalculatorDisplayProps) => {
  return (
    <div className={cn('calculator-screen mb-4 bg-navy-dark p-4 rounded-lg', className)}>
      <div className="text-right font-mono text-gray-400 text-sm overflow-x-auto whitespace-nowrap">
        {input || '\u00A0'}
      </div>
      <div className="text-right font-mono text-2xl text-gold overflow-x-auto whitespace-nowrap">
        {result || '0'}
      </div>
    </div>
  );
};

export default CalculatorDisplay;
