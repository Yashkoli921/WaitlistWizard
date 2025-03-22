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
    { title: "Pricing", path: "/pricing" },
    { title: "Demo", path: "/demo" },
  ];

  return (
    <header className="glass-effect fixed w-full z-50 bg-opacity-70 backdrop-blur-md bg-navy-dark border-b border-gold border-opacity-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center cursor-pointer">
              <span className="font-playfair text-gold text-2xl font-bold">Calculus</span>
              <span className="font-playfair text-white text-2xl font-light">Royal</span>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <a className={`nav-link-hover text-gray-300 hover:text-gold-light ${location === link.path ? 'text-gold' : ''}`}>
                  {link.title}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* CTA Button */}
          <Link href="/waitlist">
            <a className="hidden md:block px-5 py-2 rounded-md btn-gold text-dark font-semibold">
              Join Waitlist
            </a>
          </Link>
          
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
                  <a 
                    className={`text-gray-300 hover:text-gold-light px-2 py-1 ${location === link.path ? 'text-gold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.title}
                  </a>
                </Link>
              ))}
              <Link href="/waitlist">
                <a 
                  className="btn-gold px-5 py-2 rounded-md text-dark font-semibold inline-block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Waitlist
                </a>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
