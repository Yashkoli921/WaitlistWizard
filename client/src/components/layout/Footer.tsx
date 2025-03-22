import { Link } from "wouter";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    features: [
      { name: "Basic Calculator", path: "/calculators" },
      { name: "Financial Calculator", path: "/calculators" },
      { name: "Scientific Calculator", path: "/calculators" },
      { name: "3D Graphing", path: "/calculators" },
      { name: "Formula Library", path: "/features" }
    ],
    resources: [
      { name: "Documentation", path: "#" },
      { name: "Tutorials", path: "#" },
      { name: "Formula Guide", path: "#" },
      { name: "API Reference", path: "#" },
      { name: "Release Notes", path: "#" }
    ],
    company: [
      { name: "About Us", path: "#" },
      { name: "Careers", path: "#" },
      { name: "Blog", path: "#" },
      { name: "Contact Us", path: "#" },
      { name: "Privacy Policy", path: "#" }
    ],
    legal: [
      { name: "Terms of Service", path: "#" },
      { name: "Privacy Policy", path: "#" },
      { name: "Cookie Policy", path: "#" }
    ]
  };

  return (
    <footer className="py-12 bg-[#1E201E]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center mb-6">
                <span className="font-playfair text-[#697565] text-2xl font-bold">Physics</span>
                <span className="font-playfair text-[#ECDFCC] text-2xl font-light">Calculator</span>
            </Link>
            <p className="text-[#ECDFCC] opacity-70 mb-6">
              Premium calculation suite designed for professionals who demand elegance and power.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#697565] hover:text-[#ECDFCC] transition" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-[#697565] hover:text-[#ECDFCC] transition" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-[#697565] hover:text-[#ECDFCC] transition" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-[#697565] hover:text-[#ECDFCC] transition" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[#ECDFCC] font-semibold mb-6">Features</h4>
            <ul className="space-y-3">
              {footerLinks.features.map((link, index) => (
                <li key={index}>
                  <Link href={link.path} className="text-[#ECDFCC] opacity-70 hover:text-[#697565] hover:opacity-100 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-[#ECDFCC] font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.path} className="text-[#ECDFCC] opacity-70 hover:text-[#697565] hover:opacity-100 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-[#ECDFCC] font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.path} className="text-[#ECDFCC] opacity-70 hover:text-[#697565] hover:opacity-100 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#3C3D37] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#ECDFCC] opacity-50 mb-4 md:mb-0">
              &copy; {currentYear} Physics Calculator. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {footerLinks.legal.map((link, index) => (
                <Link key={index} href={link.path} className="text-[#ECDFCC] opacity-50 hover:text-[#697565] hover:opacity-100 transition">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
