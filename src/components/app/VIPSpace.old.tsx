import React, { useState } from 'react';
import { Crown, Star, Search, Calendar, Send } from 'lucide-react';
import { Button } from '../Button';
import { PropertyCard } from '../PropertyCard';
import { properties } from '../../data/mockData';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

interface VIPSpaceProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

export function VIPSpace({ onNavigate }: VIPSpaceProps) {
  const [searchForm, setSearchForm] = useState({
    propertyType: '',
    budget: '',
    location: '',
    description: '',
  });

  const vipProperties = properties.filter(p => p.vipOnly);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Votre demande a été envoyée à notre service VIP. Un conseiller vous contactera sous 24h.');
    setSearchForm({ propertyType: '', budget: '', location: '', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* VIP Welcome Banner */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <h2 className="!text-white">Espace VIP</h2>
            </div>
            <p className="!text-white mb-6 max-w-2xl">
              Profitez de vos avantages exclusifs : accès prioritaire aux nouveaux biens, conseiller dédié, 
              recherche personnalisée et événements privés.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Star className="w-5 h-5 text-white" />
                <span className="text-white">Accès prioritaire</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Star className="w-5 h-5 text-white" />
                <span className="text-white">Conseiller dédié</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Star className="w-5 h-5 text-white" />
                <span className="text-white">Événements exclusifs</span>
              </div>
            </div>
          </div>
          <Crown className="w-24 h-24 text-gold-300 opacity-30" />
        </div>
      </div>

      {/* Exclusive Properties */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <h3 className="mb-2">Biens exclusifs VIP</h3>
          <p className="text-neutral-600">
            Découvrez en avant-première nos propriétés les plus prestigieuses
          </p>
        </div>

        {vipProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vipProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={() => onNavigate('property-detail', property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Crown className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600">Aucun bien exclusif disponible pour le moment</p>
          </div>
        )}
      </div>

      {/* Personalized Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-primary-700" />
            <h3>Recherche personnalisée</h3>
          </div>
          <p className="text-neutral-600">
            Décrivez-nous le bien de vos rêves, notre service VIP se charge de le trouver pour vous
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm mb-2 text-neutral-700">Type de bien</label>
              <select
                value={searchForm.propertyType}
                onChange={(e) => setSearchForm({ ...searchForm, propertyType: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionner</option>
                <option value="villa">Villa</option>
                <option value="appartement">Appartement</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-neutral-700">Budget maximum</label>
              <input
                type="text"
                value={searchForm.budget}
                onChange={(e) => setSearchForm({ ...searchForm, budget: e.target.value })}
                placeholder="Ex: 500 000 000 FCFA"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-neutral-700">Localisation souhaitée</label>
              <input
                type="text"
                value={searchForm.location}
                onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
                placeholder="Ex: Almadies, Dakar"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-neutral-700">Description de vos besoins</label>
            <textarea
              value={searchForm.description}
              onChange={(e) => setSearchForm({ ...searchForm, description: e.target.value })}
              rows={4}
              placeholder="Décrivez en détail le bien que vous recherchez : nombre de chambres, équipements souhaités, proximité de services..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Button type="submit">
            <Send className="w-5 h-5" />
            Envoyer ma demande au service VIP
          </Button>
        </form>
      </div>

      {/* Advisor Appointment */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-primary-700" />
            <h3>Rendez-vous avec votre conseiller</h3>
          </div>
          <p className="text-neutral-600">
            Planifiez un rendez-vous personnalisé avec votre conseiller VIP dédié
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-neutral-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
            <h5 className="mb-2 text-neutral-900">Rendez-vous physique</h5>
            <p className="text-sm text-neutral-600 mb-4">
              Rencontrez votre conseiller dans nos bureaux ou sur le site d'un bien
            </p>
            <Button 
              variant="outline" 
              className="w-full" 
              type="button"
              onClick={() => alert('Fonctionnalité de réservation bientôt disponible')}
            >
              Planifier un rendez-vous
            </Button>
          </div>

          <div className="border-2 border-neutral-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
            <h5 className="mb-2 text-neutral-900">Visio-conférence</h5>
            <p className="text-sm text-neutral-600 mb-4">
              Échangez avec votre conseiller en ligne depuis votre domicile
            </p>
            <Button 
              variant="outline" 
              className="w-full" 
              type="button"
              onClick={() => alert('Fonctionnalité de réservation bientôt disponible')}
            >
              Réserver un créneau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}