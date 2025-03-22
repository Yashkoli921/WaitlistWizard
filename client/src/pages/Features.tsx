import { motion } from "framer-motion";

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureProps) => {
  return (
    <motion.div 
      className="royal-gradient p-6 rounded-xl shadow-premium reflect-top"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      viewport={{ once: true }}
    >
      <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center mb-6 text-dark">
        <i className={`${icon} text-xl`}></i>
      </div>
      <h3 className="font-playfair text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: "fas fa-calculator",
      title: "Multiple Calculator Types",
      description: "Standard, financial, scientific, and graphing calculators with professional-grade functionality.",
      delay: 0.1
    },
    {
      icon: "fas fa-chart-line",
      title: "3D Visualization",
      description: "Interactive 3D graphs and financial models with zoom, rotation and exploration capabilities.",
      delay: 0.2
    },
    {
      icon: "fas fa-file-export",
      title: "Export Functionality",
      description: "Export your calculations and graphs as PDF or CSV files for professional reporting.",
      delay: 0.3
    },
    {
      icon: "fas fa-book",
      title: "Formula Library",
      description: "Access hundreds of pre-built formulas for finance, science, engineering, and more.",
      delay: 0.4
    },
    {
      icon: "fas fa-history",
      title: "Calculation History",
      description: "Review and reuse your previous calculations with automatic history tracking.",
      delay: 0.5
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Responsive Design",
      description: "Seamless experience across all devices, from desktop workstations to mobile devices.",
      delay: 0.6
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-dark to-navy-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Premium <span className="text-gold">Features</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Designed with professionals in mind, our calculator suite offers unparalleled functionality with a royal aesthetic.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
