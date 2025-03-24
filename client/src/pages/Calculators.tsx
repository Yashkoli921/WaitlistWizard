import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BasicCalculator from "@/components/calculator/BasicCalculator";
import FinancialCalculator from "@/components/calculator/FinancialCalculator";
import ScientificCalculator from "@/components/calculator/ScientificCalculator";
import GraphingCalculator from "@/components/calculator/GraphingCalculator";
import PhysicsCalculator from "@/components/calculator/PhysicsCalculator";

const Calculators = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = [
    { id: "basic", name: "Basic" },
    { id: "financial", name: "Financial" },
    { id: "scientific", name: "Scientific" },
    { id: "graphing", name: "Graphing" },
    { id: "physics", name: "Physics" }
  ];

  const features = {
    basic: [
      "Standard arithmetic operations",
      "Percentage calculations",
      "Memory functions",
      "Elegant animations"
    ],
    financial: [
      "Mortgage calculations",
      "Investment returns",
      "Loan comparisons",
      "ROI analysis"
    ],
    scientific: [
      "Trigonometric functions",
      "Logarithmic calculations",
      "Advanced math operations",
      "Constants and conversions"
    ],
    graphing: [
      "3D function visualization",
      "Interactive manipulation",
      "Export capabilities",
      "Custom function input"
    ]
  };

  const tabDescriptions = {
    basic: "Our premium basic calculator offers all standard operations with an elegant, royal interface. Perfect for daily calculations with added style.",
    financial: "Make informed financial decisions with our suite of financial calculators. Model mortgages, investments, and more.",
    scientific: "Tackle advanced mathematical problems with our comprehensive scientific calculator. From trigonometry to logarithms.",
    graphing: "Visualize mathematical functions in stunning 3D. Rotate, zoom, and explore your graphs from any angle."
  };

  return (
    <section id="calculators" className="py-16 md:py-24 bg-navy">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Premium <span className="text-gold">Calculator Suite</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our different calculator types, each designed with precision, elegance, and powerful functionality.
          </p>
        </motion.div>
        
        {/* Calculator Tabs */}
        <div className="mb-10 flex justify-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl">
            <TabsList className="inline-flex rounded-md bg-navy-light p-1 shadow-md w-full justify-center">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  className={`px-5 py-2 rounded-md font-semibold ${
                    activeTab === tab.id 
                      ? 'bg-gold text-dark' 
                      : 'text-gray-300 hover:text-gold'
                  }`}
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Calculator Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-playfair text-2xl font-bold mb-4">
              {tabs.find(t => t.id === activeTab)?.name} <span className="text-gold">Calculator</span>
            </h3>
            <p className="text-gray-300 mb-6">
              {tabDescriptions[activeTab as keyof typeof tabDescriptions]}
            </p>
            
            <div className="space-y-4">
              {features[activeTab as keyof typeof features].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center mr-4 text-dark">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                  <span className="text-gray-200">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            layout
            key={activeTab}
          >
            {activeTab === "basic" && <BasicCalculator />}
            {activeTab === "financial" && <FinancialCalculator />}
            {activeTab === "scientific" && <ScientificCalculator />}
            {activeTab === "graphing" && <GraphingCalculator />}
            {activeTab === "physics" && <PhysicsCalculator />}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Calculators;
