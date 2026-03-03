import React from 'react';
import { Building2, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import logo_footer from '../assets/image.png';
interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-neutral-800 text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logo_footer} 
                alt="RÉALITÉS SÉNÉGAL" 
                className="h-10 w-auto "
              />
            </div>
            <p className="text-sm !text-white">
              L'immobilier de qualité pour un investissement rentable.
            </p>
          </div>
          
          <div>
            <h4 className="text-white mb-4 !text-white">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate?.('properties')} 
                  className="hover:text-primary-400 transition-colors text-left"
                >
                  Biens
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('about')} 
                  className="hover:text-primary-400 transition-colors text-left"
                >
                  À propos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('contact')} 
                  className="hover:text-primary-400 transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white mb-4 !text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+221 33 868 43 09</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@realites-senegal.sn</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>Almadies / Route de Ngor<br/>Dakar 12000, Sénégal</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white mb-4 !text-white">Suivez-nous</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-neutral-700 hover:bg-primary-700 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-700 hover:bg-primary-700 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-700 hover:bg-primary-700 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-8 text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="!text-white">&copy; 2026 RÉALITÉS SÉNÉGAL. Tous droits réservés.</p>
            <p className="!text-white">Designé et construit avec ❤️ par Ñuul Technologies</p>
          </div>
          {onNavigate && (
            <div className="mt-4 text-center">
              <button
                onClick={() => onNavigate('style-guide')}
                className="text-neutral-500 hover:text-primary-400 transition-colors text-xs"
              >
                Style Guide
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}