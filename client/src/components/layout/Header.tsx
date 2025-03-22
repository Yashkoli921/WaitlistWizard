import { useState } from "react";
import { Link, useLocation } from "wouter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { title: "Features", path: "/features" },
    { title: "Calculators", path: "/calculators" },
    { title: "Demo", path: "/demo" },
  ];

  return (
    <header className="glass-effect fixed w-full z-50 bg-opacity-70 backdrop-blur-md bg-navy-dark border-b border-gold border-opacity-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="font-playfair text-gold text-2xl font-bold">Physics</span>
              <span className="font-playfair text-white text-2xl font-light">Calculator</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <div className={`nav-link-hover text-gray-300 hover:text-gold-light cursor-pointer ${location === link.path ? 'text-gold' : ''}`}>
                  {link.title}
                </div>
              </Link>
            ))}
          </nav>
          
          {/* Empty space instead of CTA button */}
          <div className="hidden md:block"></div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gold"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <div 
                    className={`text-gray-300 hover:text-gold-light px-2 py-1 cursor-pointer ${location === link.path ? 'text-gold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.title}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
