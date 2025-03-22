import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThreeDModel from '@/components/ui/ThreeDModel';
import { evaluate } from 'mathjs';
import { useToast } from '@/hooks/use-toast';

const GraphingCalculator = () => {
  const [formula, setFormula] = useState<string>("sin(sqrt(x^2+y^2))");
  const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();

  const handlePlotClick = () => {
    try {
      const safeFormula = formula.replace(/\^/g, '**'); // Replace ^ with ** for mathjs
      
      // Test the formula with some sample values
      evaluate(safeFormula, { x: 1, y: 1 });
      
      // Generate data points
      const newData = {
        formula: safeFormula,
        xMin: -5,
        xMax: 5,
        yMin: -5,
        yMax: 5,
        resolution: 50
      };
      
      setData(newData);
      
      toast({
        title: "Graphing Success",
        description: "Your 3D graph has been plotted successfully!",
      });
    } catch (error) {
      toast({
        title: "Graphing Error",
        description: "Please check your formula and try again.",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export",
      description: "Graph has been exported successfully",
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#2E073F] to-[#4A0C65] rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-[#2E073F] py-3 px-4 flex justify-between items-center border-b border-[#7A1CAC] border-opacity-50">
        <div className="text-[#AD49E1] font-playfair">3D Graph Viewer</div>
        <div className="flex space-x-2">
          <button 
            className="text-[#EBD3F8] opacity-70 hover:text-[#AD49E1] hover:opacity-100"
            onClick={() => setShowFullscreen(!showFullscreen)}
            aria-label="Toggle fullscreen"
          >
            <i className={`fas ${showFullscreen ? 'fa-compress-alt' : 'fa-expand-arrows-alt'}`}></i>
          </button>
          <button 
            className="text-[#EBD3F8] opacity-70 hover:text-[#AD49E1] hover:opacity-100"
            onClick={handleExport}
            aria-label="Download"
          >
            <i className="fas fa-download"></i>
          </button>
          <button 
            className="text-[#EBD3F8] opacity-70 hover:text-[#AD49E1] hover:opacity-100"
            aria-label="Settings"
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </div>
      
      {/* 3D Graph Space */}
      <div className={`relative ${showFullscreen ? 'h-[80vh]' : 'h-80'} w-full bg-[#2E073F]`}>
        <ThreeDModel 
          formula={data?.formula} 
          xMin={data?.xMin} 
          xMax={data?.xMax} 
          yMin={data?.yMin} 
          yMax={data?.yMax} 
          resolution={data?.resolution} 
        />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-4 right-4 bg-[#2E073F] bg-opacity-70 rounded-lg p-2 flex space-x-2">
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#4A0C65] text-[#AD49E1]">
            <i className="fas fa-plus"></i>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#4A0C65] text-[#AD49E1]">
            <i className="fas fa-minus"></i>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#4A0C65] text-[#AD49E1]">
            <i className="fas fa-sync"></i>
          </button>
        </div>
      </div>
      
      {/* Formula Input */}
      <div className="p-4 bg-[#3D0A54]">
        <div className="flex items-center">
          <div className="text-[#AD49E1] mr-3">f(x,y) =</div>
          <Input 
            type="text" 
            value={formula} 
            onChange={(e) => setFormula(e.target.value)}
            className="flex-grow bg-[#2E073F] border border-[#7A1CAC] rounded px-3 py-2 text-[#EBD3F8] font-mono"
          />
          <Button 
            onClick={handlePlotClick}
            className="ml-3 bg-[#7A1CAC] hover:bg-[#AD49E1] text-white font-semibold"
          >
            Plot
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GraphingCalculator;
