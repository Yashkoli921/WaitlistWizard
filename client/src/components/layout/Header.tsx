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
    { title: "Login", path: "/auth" },
  ];

  return (
    <header className="glass-effect fixed w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="font-playfair text-[#697565] text-2xl font-bold">Physics</span>
              <span className="font-playfair text-[#ECDFCC] text-2xl font-light">Calculator</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <div className={`nav-link-hover text-[#ECDFCC] hover:text-[#697565] cursor-pointer ${location === link.path ? 'text-[#697565]' : ''}`}>
                  {link.title}
                </div>
              </Link>
            ))}
          </nav>
          
          {/* Empty space instead of CTA button */}
          <div className="hidden md:block"></div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#697565]"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#697565] border-opacity-30">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <div 
                    className={`text-[#ECDFCC] hover:text-[#697565] px-2 py-1 cursor-pointer ${location === link.path ? 'text-[#697565]' : ''}`}
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
