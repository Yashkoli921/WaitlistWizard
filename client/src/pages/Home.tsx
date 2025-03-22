import { Link } from "wouter";
import BasicCalculator from "@/components/calculator/BasicCalculator";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#2E073F] opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D0A54] via-[#7A1CAC] to-[#2E073F] opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#EBD3F8] mb-6">
              Advanced <span className="text-[#AD49E1] inline-block">Physics</span> Calculator Suite
            </h1>
            <p className="text-[#EBD3F8] text-lg md:text-xl mb-8 max-w-2xl opacity-90">
              Experience the most comprehensive and visually stunning calculator suite. From basic operations to complex scientific modeling and 3D graphing – all in a beautifully designed interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/calculators" className="bg-[#7A1CAC] hover:bg-[#AD49E1] text-white px-8 py-3 rounded-md font-bold text-center transform transition hover:scale-105">
                Try Calculators
              </Link>
              <Link href="/demo" className="border border-[#AD49E1] text-[#AD49E1] hover:bg-[#AD49E1] hover:text-[#EBD3F8] px-8 py-3 rounded-md font-bold text-center transition">
                View Demo
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, rotateY: 30 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <BasicCalculator />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;
