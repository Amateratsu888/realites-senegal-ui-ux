import React, { useState, useEffect } from 'react';
import { Home, Building2, User, Phone, Menu, X } from 'lucide-react';
import { Button } from './Button';
import logo_navbar from '../assets/logo.png';


interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  transparentOnTop?: boolean;
}

export function Navbar({ onNavigate, currentPage, transparentOnTop = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: null },
    { id: 'properties', label: 'Biens', icon: null },
    { id: 'about', label: 'À propos', icon: null },
    { id: 'contact', label: 'Contact', icon: null },
  ];

  const isTransparent = transparentOnTop && !isScrolled;

  const handleMenuItemClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`${isTransparent ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? 'bg-transparent' : 'bg-white shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <img 
                src={logo_navbar} 
                alt="RÉALITÉS SÉNÉGAL" 
                className={`h-10 w-auto transition-all duration-300 ${isTransparent ? 'brightness-0 invert' : ''}`}
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    currentPage === item.id 
                      ? isTransparent ? 'text-white' : 'text-primary-700'
                      : isTransparent ? 'text-white hover:text-neutral-200' : 'text-neutral-700 hover:text-primary-600'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            
            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                onClick={() => onNavigate('login')}
                className={isTransparent ? '!bg-white !text-primary-700 hover:!bg-neutral-100' : ''}
              >
                <User className="w-4 h-4" />
                Espace client
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isTransparent 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="h-full overflow-y-auto">
          <nav className="py-6 px-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    currentPage === item.id 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <button
                onClick={() => handleMenuItemClick('login')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  currentPage === 'login' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <User className="w-4 h-4" />
                Espace client
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}