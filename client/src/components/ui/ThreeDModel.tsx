import { useRef, useEffect, useState, useCallback } from 'react';
import { evaluate } from 'mathjs';

interface ThreeDModelProps {
  formula?: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  resolution?: number;
}

const ThreeDModel = ({ 
  formula = "sin(sqrt(x**2+y**2))",
  xMin = -5,
  xMax = 5,
  yMin = -5,
  yMax = 5,
  resolution = 50
}: ThreeDModelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Generate and draw the graph
  const renderGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1E201E';
    ctx.fillRect(0, 0, width, height);

    try {
      // Parse formula
      const safeFormula = formula?.replace(/\^/g, '**') || '';

      // Generate data points
      const points: { x: number, y: number, z: number, screenX: number, screenY: number, depth: number }[] = [];
      const step = (xMax - xMin) / resolution;

      for (let i = 0; i <= resolution; i++) {
        for (let j = 0; j <= resolution; j++) {
          const x = xMin + i * step;
          const y = yMin + j * step;
          let z = 0;

          try {
            z = evaluate(safeFormula, { x, y });
            if (isNaN(z) || !isFinite(z)) z = 0;
            z = Math.min(Math.max(z, -10), 10); // Clamp extreme values
          } catch (e) {
            z = 0;
          }

          // 3D to 2D projection with basic rotation
          const rotX = x * Math.cos(angle) - y * Math.sin(angle);
          const rotY = x * Math.sin(angle) + y * Math.cos(angle);
          
          // Simple perspective projection
          const scale = 300 / (20 + rotY);
          const screenX = width / 2 + rotX * scale;
          const screenY = height / 2 - z * scale;
          const depth = rotY;  // Used for z-sorting

          points.push({
            x, y, z,
            screenX,
            screenY,
            depth
          });
        }
      }

      // Sort points by depth for basic z-buffering (back-to-front)
      points.sort((a, b) => b.depth - a.depth);

      // Draw points with color based on z value
      for (const point of points) {
        // Normalize z to [0,1] for color mapping
        const t = (point.z + 10) / 20;
        
        // Earth-tone gradient (sage to cream)
        const r = Math.floor((30 + (236 - 30) * t) / 255);
        const g = Math.floor((32 + (223 - 32) * t) / 255);
        const b = Math.floor((30 + (204 - 30) * t) / 255);
        
        // Blend between dark olive and sage
        const color = {
          r: Math.floor(60 + (105 - 60) * t), 
          g: Math.floor(61 + (117 - 61) * t),
          b: Math.floor(55 + (101 - 55) * t)
        };
        
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        
        // Size based on depth for perspective effect
        const size = Math.max(2, 6 - point.depth / 5);
        
        ctx.beginPath();
        ctx.arc(point.screenX, point.screenY, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw coordinate axes
      ctx.strokeStyle = '#ECDFCC';
      ctx.lineWidth = 2;
      
      // X axis
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      const axisXEnd = { 
        x: width / 2 + (xMax * Math.cos(angle)) * (300 / 20), 
        y: height / 2
      };
      ctx.lineTo(axisXEnd.x, axisXEnd.y);
      ctx.stroke();
      
      // Z axis (vertical)
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(width / 2, height / 2 - 150);
      ctx.stroke();
      
      // Y axis
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      const axisYEnd = { 
        x: width / 2 + (yMax * Math.sin(angle)) * (300 / 20), 
        y: height / 2 - (0 * (300 / 20))
      };
      ctx.lineTo(axisYEnd.x, axisYEnd.y);
      ctx.stroke();

      setError(null);
    } catch (err) {
      console.error("Error rendering graph:", err);
      setError("Error rendering graph. Try a different formula.");
    }
  }, [formula, xMin, xMax, yMin, yMax, resolution, angle]);

  // Initialize and animate
  useEffect(() => {
    // Set canvas size
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
    }

    // Auto-rotation animation
    const animationId = setInterval(() => {
      setAngle(prev => (prev + 0.01) % (Math.PI * 2));
    }, 50);

    return () => clearInterval(animationId);
  }, []);

  // Re-render when angle or formula changes
  useEffect(() => {
    renderGraph();
  }, [renderGraph, angle]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;
        renderGraph();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderGraph]);

  return (
    <div className="relative h-full w-full">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1E201E]">
          <div className="text-[#ECDFCC] text-lg mb-2">{error}</div>
          <div className="text-[#697565] text-sm">
            Try a different formula
          </div>
        </div>
      ) : (
        <>
          <canvas 
            ref={canvasRef} 
            className="w-full h-full cursor-move"
            onClick={() => setAngle(angle + Math.PI/8)} // Allow clicking to rotate
          />
          <div className="absolute bottom-2 left-2 text-[#ECDFCC] text-xs bg-[#1E201E] bg-opacity-70 p-1 rounded">
            Click to rotate
          </div>
        </>
      )}
    </div>
  );
};

export default ThreeDModel;
