import React, { useState } from 'react';
import { Search, SlidersHorizontal, Building2, Home, MapPin, Bed, Bath, Maximize, Euro, Send, Crown, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '../Button';
import { properties } from '../../data/mockData';
import { vefaProjects } from '../../data/vefaData';
import { PropertyType } from '../../types';
import { PropertyRequestModal, RequestFormData } from './PropertyRequestModal';
import { Badge } from '../ui/badge';

interface ClientCatalogPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
  isVIP?: boolean;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}

// Type étendu pour inclure VEFA
type ExtendedPropertyType = PropertyType | 'vefa';

export function ClientCatalogPage({ onNavigate, isVIP = false, userEmail, userPhone, userName }: ClientCatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ExtendedPropertyType | 'all'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<{
    id: string;
    title: string;
    image: string;
    price: number;
  } | null>(null);

  // Filtrer les biens VIP exclusifs pour les clients simples
  const availableProperties = isVIP 
    ? properties // Les VIP voient tout
    : properties.filter(p => {
        // Check if VIP exclusivity is still active
        if (p.vipOnly && p.vipExclusivityEndDate) {
          const vipEndDate = new Date(p.vipExclusivityEndDate);
          return vipEndDate <= new Date(); // Show only if VIP period has ended
        }
        return true; // Show non-VIP properties
      });

  const filteredProperties = availableProperties.filter(property => {
    // Si on filtre par VEFA, pas de propriétés classiques
    if (typeFilter === 'vefa') {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && property.type !== typeFilter) {
      return false;
    }

    // Price range
    if (priceRange !== 'all') {
      const price = property.price;
      if (priceRange === 'low' && price > 100000000) return false;
      if (priceRange === 'mid' && (price <= 100000000 || price > 300000000)) return false;
      if (priceRange === 'high' && price <= 300000000) return false;
    }

    // Location filter
    if (locationFilter !== 'all') {
      if (!property.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Filtrer les projets VEFA
  const filteredVEFAProjects = vefaProjects.filter(vefa => {
    // Exclure les VEFA déjà en cours (en-construction, presque-termine, termine)
    // Seuls les projets en planification sont disponibles dans le catalogue
    if (vefa.status !== 'planification') {
      return false;
    }

    // Si on ne filtre pas par VEFA et qu'on n'est pas en mode "all", pas de VEFA
    if (typeFilter !== 'vefa' && typeFilter !== 'all') {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        vefa.name.toLowerCase().includes(query) ||
        vefa.location.toLowerCase().includes(query) ||
        vefa.description.toLowerCase().includes(query) ||
        vefa.tags?.some(tag => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Location filter
    if (locationFilter !== 'all') {
      if (!vefa.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
    }

    // Price range (based on total budget)
    if (priceRange !== 'all') {
      const price = vefa.totalBudget;
      if (priceRange === 'low' && price > 100000000) return false;
      if (priceRange === 'mid' && (price <= 100000000 || price > 300000000)) return false;
      if (priceRange === 'high' && price <= 300000000) return false;
    }

    return true;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeIcon = (type: PropertyType) => {
    if (type === 'villa') return <Home className="w-4 h-4" />;
    if (type === 'appartement') return <Building2 className="w-4 h-4" />;
    return <Building2 className="w-4 h-4" />;
  };

  // Combiner les locations des propriétés et des VEFA
  const allLocations = [
    ...availableProperties.map(p => p.location.split(',')[1]?.trim() || p.location),
    ...vefaProjects.map(v => v.location.split(',')[1]?.trim() || v.location)
  ];
  const locations = ['all', ...Array.from(new Set(allLocations))];

  const handleRequestSubmit = (data: RequestFormData) => {
    console.log('Demande envoyée:', data, 'pour le bien:', selectedProperty);
    // TODO: Envoyer la demande au backend
    alert('Demande envoyée avec succès ! Vous pouvez suivre son état dans "Mes demandes"');
  };

  const handleVEFARequest = (vefaProject: any) => {
    alert(`Demande de VEFA pour "${vefaProject.name}" envoyée ! Vous pouvez suivre son état dans "Mes demandes"`);
    onNavigate('my-requests');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900">Catalogue des biens</h2>
        <p className="text-sm text-slate-600 mt-1">
          {isVIP 
            ? 'Découvrez tous nos biens immobiliers et projets VEFA disponibles'
            : 'Découvrez nos biens immobiliers et projets VEFA disponibles'}
        </p>
        {!isVIP && (
          <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              💎 Passez au statut VIP pour accéder aux biens exclusifs et bénéficier d'avantages premium
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Biens disponibles</p>
              <p className="text-2xl font-medium text-slate-900 mt-1">
                {availableProperties.length}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Building2 className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Villas</p>
              <p className="text-2xl font-medium text-slate-900 mt-1">
                {availableProperties.filter(p => p.type === 'villa').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Home className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Appartements</p>
              <p className="text-2xl font-medium text-slate-900 mt-1">
                {availableProperties.filter(p => p.type === 'appartement').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Projets VEFA</p>
              <p className="text-2xl font-medium text-slate-900 mt-1">
                {vefaProjects.length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Filtres</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ExtendedPropertyType | 'all')}
            className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tous les types</option>
            <option value="villa">Villa</option>
            <option value="appartement">Appartement</option>
            <option value="terrain">Terrain</option>
            <option value="vefa">🏗️ VEFA</option>
          </select>

          {/* Price Range */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tous les prix</option>
            <option value="low">Moins de 100M FCFA</option>
            <option value="mid">100M - 300M FCFA</option>
            <option value="high">Plus de 300M FCFA</option>
          </select>

          {/* Location */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Toutes les villes</option>
            {locations.filter(loc => loc !== 'all').map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Quick filter buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              typeFilter === 'all'
                ? 'bg-primary-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setTypeFilter('villa')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              typeFilter === 'villa'
                ? 'bg-primary-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            Villas
          </button>
          <button
            onClick={() => setTypeFilter('appartement')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              typeFilter === 'appartement'
                ? 'bg-primary-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Appartements
          </button>
          <button
            onClick={() => setTypeFilter('terrain')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              typeFilter === 'terrain'
                ? 'bg-primary-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Terrains
          </button>
          <button
            onClick={() => setTypeFilter('vefa')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              typeFilter === 'vefa'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            VEFA
          </button>
        </div>
      </div>

      {/* Combined Grid for Properties and VEFA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Properties */}
        {(typeFilter === 'all' || (typeFilter !== 'vefa')) && filteredProperties.map((property) => {
          // Check if VIP exclusivity is still active
          const isVIPExclusive = property.vipOnly && property.vipExclusivityEndDate;
          const vipEndDate = isVIPExclusive ? new Date(property.vipExclusivityEndDate) : null;
          const isVIPActive = vipEndDate && vipEndDate > new Date();
          
          const getPropertyTypeLabel = (type: PropertyType) => {
            const labels: Record<PropertyType, string> = {
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
          
          return (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all group cursor-pointer"
              onClick={() => onNavigate('property-detail-client', property.id)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge VIP en haut à droite */}
                {isVIPActive && (
                  <Badge variant="gold" className="absolute top-3 right-3 shadow-lg">
                    <Crown className="w-3 h-3" />
                    VIP
                  </Badge>
                )}
                
                {/* Badges alignés en haut à gauche */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white text-slate-900">
                    {getPropertyTypeLabel(property.type)}
                  </Badge>
                  
                  {/* Status Badge */}
                  <Badge 
                    className={`
                      ${property.status === 'disponible' ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : ''}
                      ${property.status === 'réservé' ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500' : ''}
                      ${property.status === 'vendu' ? 'bg-slate-400 hover:bg-slate-500 text-white border-slate-400' : ''}
                      ${property.status === 'nouveau' ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' : ''}
                    `}
                  >
                    {getStatusLabel(property.status)}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-medium text-slate-900 mb-2 line-clamp-1">
                  {property.title}
                </h3>
                
                <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>
                
                {/* VIP Expiry Date if active */}
                {isVIPActive && vipEndDate && (
                  <div className="flex items-center gap-2 text-red-600 mb-3 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>VIP jusqu'au {vipEndDate.toLocaleDateString('fr-FR')}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    <span>{property.surface} m²</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <p className="text-xl font-medium text-primary-700">
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {property.financingOptions?.includes('échelonné') 
                      ? 'Financement disponible'
                      : 'Comptant uniquement'}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty({
                        id: property.id,
                        title: property.title,
                        image: property.images[0],
                        price: property.price,
                      });
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Faire une demande
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {/* VEFA Projects */}
        {(typeFilter === 'all' || typeFilter === 'vefa') && filteredVEFAProjects.map((vefa) => {
          const statusColors: Record<string, string> = {
            'planification': 'bg-blue-100 text-blue-900',
            'en-construction': 'bg-yellow-100 text-yellow-900',
            'termine': 'bg-green-100 text-green-900',
          };

          const progressColor = vefa.status === 'planification' ? 'bg-blue-500' :
                               vefa.status === 'en-construction' ? 'bg-yellow-500' : 'bg-green-500';

          const getProgress = () => {
            if (!vefa.milestones || vefa.milestones.length === 0) return 0;
            const avgProgress = vefa.milestones.reduce((sum, m) => sum + (m.completionPercentage || 0), 0) / vefa.milestones.length;
            return Math.round(avgProgress);
          };

          return (
            <div 
              key={vefa.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => onNavigate('vefa-tracking', vefa.id)}
            >
              {/* Header with gradient background based on status */}
              <div className={`${statusColors[vefa.status]} p-6`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium line-clamp-2">{vefa.name}</h3>
                  <div className="flex flex-col gap-1">
                    <Badge variant="default" className="whitespace-nowrap ml-2 bg-amber-600 text-white border-amber-600">
                      VEFA
                    </Badge>
                    <Badge variant="secondary" className="whitespace-nowrap ml-2">
                      {vefa.status === 'planification' && 'Planification'}
                      {vefa.status === 'en-construction' && 'En construction'}
                      {vefa.status === 'termine' && 'Terminé'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{vefa.location}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Description */}
                <p className="text-sm text-slate-600 line-clamp-2">{vefa.description}</p>

                {/* Tags */}
                {vefa.tags && vefa.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {vefa.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Progression</span>
                    <span className="font-medium">{getProgress()}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${progressColor} transition-all`}
                      style={{ width: `${getProgress()}%` }}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded">
                  <span className="text-slate-600">Budget</span>
                  <span className="font-medium text-slate-900">{formatPrice(vefa.totalBudget)}</span>
                </div>

                {/* Units */}
                <div className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">{vefa.totalUnits}</span> unités disponibles
                </div>

                {/* Button */}
                <Button
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVEFARequest(vefa);
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Faire une demande
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredProperties.length === 0 && filteredVEFAProjects.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">Aucun résultat trouvé</h3>
          <p className="text-slate-600 text-sm">
            Essayez de modifier vos filtres pour voir plus de résultats
          </p>
        </div>
      )}

      {/* Request Modal */}
      {selectedProperty && (
        <PropertyRequestModal
          propertyId={selectedProperty.id}
          propertyTitle={selectedProperty.title}
          propertyImage={selectedProperty.image}
          propertyPrice={selectedProperty.price}
          onClose={() => setSelectedProperty(null)}
          onSubmit={handleRequestSubmit}
          userEmail={userEmail}
          userPhone={userPhone}
          userName={userName}
        />
      )}
    </div>
  );
}