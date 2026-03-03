import React from 'react';
import { MapPin, Home, Maximize, Crown, Calendar } from 'lucide-react';
import { Property } from '../types';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface PropertyCardProps {
  property: Property;
  onViewDetails: () => void;
  hideButton?: boolean;
}

export function PropertyCard({ property, onViewDetails, hideButton = false }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: Property['type']) => {
    const labels = {
      villa: 'Villa',
      appartement: 'Appartement',
      terrain: 'Terrain',
      'espace-commercial': 'Espace commercial',
    };
    return labels[type];
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      disponible: 'Disponible',
      réservé: 'Réservé',
      vendu: 'Vendu',
      nouveau: 'Nouveau',
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'gold' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'gold'> = {
      disponible: 'default',
      réservé: 'secondary',
      vendu: 'outline',
      nouveau: 'default',
    };
    return variants[status] || 'secondary';
  };

  // Check if VIP exclusivity is still active
  const isVIPExclusive = property.vipOnly && property.vipExclusivityEndDate;
  const vipEndDate = isVIPExclusive ? new Date(property.vipExclusivityEndDate!) : null;
  const isVIPActive = vipEndDate && vipEndDate > new Date();

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-64 overflow-hidden flex-shrink-0">
        <ImageWithFallback
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {isVIPActive && (
          <Badge variant="gold" className="absolute top-4 right-4 shadow-lg">
            <Crown className="w-3 h-3" />
            Exclusivité VIP
          </Badge>
        )}
        
        {/* Badges alignés en haut à gauche */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge variant="secondary">
            {getPropertyTypeLabel(property.type)}
          </Badge>
          
          {/* Status Badge */}
          <Badge 
            variant={getStatusVariant(property.status)}
            className={`
              ${property.status === 'disponible' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              ${property.status === 'réservé' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}
              ${property.status === 'vendu' ? 'bg-slate-400 hover:bg-slate-500 text-white' : ''}
              ${property.status === 'nouveau' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            `}
          >
            {getStatusLabel(property.status)}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="mb-2">{property.title}</h3>
        
        <div className="flex items-center gap-2 text-slate-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        {/* VIP Expiry Date if active */}
        {isVIPActive && vipEndDate && (
          <div className="flex items-center gap-2 text-red-600 mb-3 text-xs">
            <Calendar className="w-3 h-3" />
            <span>VIP jusqu'au {vipEndDate.toLocaleDateString('fr-FR')}</span>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4" />
            <span>{property.surface} m²</span>
          </div>
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <Home className="w-4 h-4" />
              <span>{property.bedrooms} ch.</span>
            </div>
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-200">
          <p className="text-primary-700 mb-4">{formatPrice(property.price)}</p>
          {!hideButton && (
            <Button onClick={onViewDetails} className="w-full">
              Voir les détails
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}