import { motion } from "framer-motion";
import GraphingCalculator from "@/components/calculator/GraphingCalculator";

const Demo = () => {
  const features = [
    {
      title: "Real-time manipulation",
      description: "Rotate, zoom, and pan to explore 3D models from any angle",
      delay: 0.1
    },
    {
      title: "Advanced function plotting",
      description: "Enter complex formulas and see them rendered instantly in 3D space",
      delay: 0.2
    },
    {
      title: "Export capabilities",
      description: "Save your visualizations as images or interactive models",
      delay: 0.3
    },
    {
      title: "Cross-device compatibility",
      description: "Visualize complex 3D models even on mobile devices",
      delay: 0.4
    }
  ];

  return (
    <section id="demo" className="py-16 md:py-24 bg-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">3D <span className="text-gold">Visualization</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience our powerful 3D graphing calculator with interactive models and stunning visual representations.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GraphingCalculator />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-playfair text-2xl font-bold mb-4">Interactive <span className="text-gold">3D Models</span></h3>
            <p className="text-gray-300 mb-6">
              Our 3D visualization engine allows you to plot complex mathematical functions and interact with them in real-time. Rotate, zoom, and explore your data from every angle.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                >
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center mr-4 text-dark mt-1">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">{feature.title}</h4>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
