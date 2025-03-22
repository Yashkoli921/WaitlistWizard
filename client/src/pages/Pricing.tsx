import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Link } from "wouter";

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: Array<{ name: string; included: boolean }>;
  popular?: boolean;
  delay: number;
}

const PricingTier = ({ name, price, description, features, popular = false, delay }: PricingTierProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`royal-gradient rounded-xl overflow-hidden shadow-premium reflect-top ${popular ? 'transform scale-105 z-10' : ''}`}
    >
      {popular && (
        <div className="bg-gold text-dark text-center py-2 font-bold text-sm">
          MOST POPULAR
        </div>
      )}
      <div className="p-6">
        <h3 className="font-playfair text-xl font-bold mb-2">{name}</h3>
        <div className="text-gold text-3xl font-bold mb-2">{price}<span className="text-sm text-gray-400 font-normal">/month</span></div>
        <p className="text-gray-300 mb-6">{description}</p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <>
                  <Check className="text-gold mt-1 mr-3 h-4 w-4" />
                  <span className="text-gray-300">{feature.name}</span>
                </>
              ) : (
                <>
                  <X className="mt-1 mr-3 h-4 w-4 opacity-50" />
                  <span className="text-gray-300 opacity-50">{feature.name}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="px-6 pb-6">
        <Link href="/waitlist">
          <Button 
            className={popular 
              ? "block btn-gold text-dark text-center py-6 w-full rounded-lg font-bold transition" 
              : "block bg-navy-light hover:bg-navy text-gray-200 text-center py-6 w-full rounded-lg font-semibold transition"
            }
          >
            Join Waitlist
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const pricingTiers = [
    {
      name: "Standard",
      price: "$9.99",
      description: "Perfect for basic calculation needs",
      features: [
        { name: "Basic Calculator", included: true },
        { name: "Financial Calculator", included: true },
        { name: "Calculation History", included: true },
        { name: "Basic Export (PDF)", included: true },
        { name: "Scientific Calculator", included: false },
        { name: "3D Graphing", included: false }
      ],
      popular: false,
      delay: 0.1
    },
    {
      name: "Professional",
      price: "$19.99",
      description: "Advanced calculations for professionals",
      features: [
        { name: "All Standard Features", included: true },
        { name: "Scientific Calculator", included: true },
        { name: "Basic 3D Graphing", included: true },
        { name: "Advanced Export Options", included: true },
        { name: "Formula Library", included: true },
        { name: "Advanced 3D Visualization", included: false }
      ],
      popular: true,
      delay: 0.2
    },
    {
      name: "Enterprise",
      price: "$39.99",
      description: "Ultimate calculation power",
      features: [
        { name: "All Professional Features", included: true },
        { name: "Advanced 3D Visualization", included: true },
        { name: "Custom Formula Creation", included: true },
        { name: "Cloud Synchronization", included: true },
        { name: "Priority Support", included: true },
        { name: "API Access", included: true }
      ],
      popular: false,
      delay: 0.3
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-dark relative">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-dark opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Premium <span className="text-gold">Pricing</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your calculation needs with our premium options.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={index}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              popular={tier.popular}
              delay={tier.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
