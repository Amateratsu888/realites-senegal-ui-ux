import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Crown, Calendar, X } from 'lucide-react';
import { Button } from '../Button';
import { properties } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PropertyType, FinancingOption, PropertyStatus, Property } from '../../types/index';

export function PropertiesAdmin() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [newProperty, setNewProperty] = useState({
    title: '',
    type: 'villa' as PropertyType,
    location: '',
    price: '',
    surface: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    imageUrl: '',
    financingOptions: [] as FinancingOption[],
    featured: false,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      villa: 'Villa',
      appartement: 'Appartement',
      terrain: 'Terrain',
      'espace-commercial': 'Espace commercial',
    };
    return labels[type] || type;
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      disponible: 'bg-green-100 text-green-700',
      réservé: 'bg-yellow-100 text-yellow-700',
      vendu: 'bg-neutral-100 text-neutral-700',
      nouveau: 'bg-blue-100 text-blue-700',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-700';
  };

  const handleFinancingToggle = (option: FinancingOption) => {
    setNewProperty(prev => ({
      ...prev,
      financingOptions: prev.financingOptions.includes(option)
        ? prev.financingOptions.filter(o => o !== option)
        : [...prev.financingOptions, option]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculer la date d'expiration VIP (1 mois à partir d'aujourd'hui)
    const vipExpiryDate = new Date();
    vipExpiryDate.setMonth(vipExpiryDate.getMonth() + 1);
    
    const propertyData = {
      ...newProperty,
      id: `new-${Date.now()}`,
      price: parseFloat(newProperty.price),
      surface: parseFloat(newProperty.surface),
      bedrooms: newProperty.bedrooms ? parseInt(newProperty.bedrooms) : undefined,
      bathrooms: newProperty.bathrooms ? parseInt(newProperty.bathrooms) : undefined,
      images: [newProperty.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'],
      status: 'disponible' as const,
      vipOnly: true, // Automatiquement en exclusivité VIP
      vipExclusivityEndDate: vipExpiryDate.toISOString(),
    };
    
    console.log('Nouveau bien créé avec exclusivité VIP jusqu\'au:', vipExpiryDate.toLocaleDateString('fr-FR'));
    console.log(propertyData);
    
    alert(`Bien ajouté avec succès !\n\nExclusivité VIP active jusqu'au ${vipExpiryDate.toLocaleDateString('fr-FR')}`);
    setShowAddModal(false);
    setNewProperty({
      title: '',
      type: 'villa',
      location: '',
      price: '',
      surface: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      imageUrl: '',
      financingOptions: [],
      featured: false,
    });
  };

  const financingOptionsData: { value: FinancingOption; label: string }[] = [
    { value: 'comptant', label: 'Comptant' },
    { value: 'échelonné', label: 'Échelonné' },
    { value: 'tontine', label: 'Tontine' },
    { value: 'location-vente', label: 'Location-vente' },
    { value: 'vefa', label: 'VEFA' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="mb-1">Gestion des biens</h3>
          <p className="text-neutral-600">{properties.length} biens au catalogue</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5" />
          Ajouter un bien
        </Button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {properties.map((property) => {
          const isVIPExclusive = property.vipOnly && property.vipExclusivityEndDate;
          const vipEndDate = isVIPExclusive ? new Date(property.vipExclusivityEndDate!) : null;
          const isVIPActive = vipEndDate && vipEndDate > new Date();
          
          return (
          <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex">
              <div className="w-48 h-48 flex-shrink-0 relative">
                <ImageWithFallback
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {isVIPActive && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                    <Crown className="w-3 h-3" />
                    VIP
                  </div>
                )}
              </div>
              
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-sm">
                        {getTypeLabel(property.type)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-sm ${getStatusColor(property.status)}`}>
                        {getStatusLabel(property.status)}
                      </span>
                    </div>
                    <h5 className="text-neutral-900 mb-1">{property.title}</h5>
                    <p className="text-sm text-neutral-600">{property.location}</p>
                    {isVIPActive && vipEndDate && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        VIP jusqu'au {vipEndDate.toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                  {property.featured && (
                    <Star className="w-5 h-5 fill-sand-500 text-sand-500" />
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-primary-700">{formatPrice(property.price)}</p>
                  <p className="text-sm text-neutral-600">{property.surface} m²</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-600 mb-3">
                  {property.financingOptions.slice(0, 2).map((option) => (
                    <span key={option} className="px-2 py-1 bg-neutral-100 rounded">
                      {option}
                    </span>
                  ))}
                  {property.financingOptions.length > 2 && (
                    <span className="px-2 py-1 bg-neutral-100 rounded">
                      +{property.financingOptions.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedProperty(property);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      {/* Add Property Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="mb-2">Ajouter un nouveau bien</h3>
              
              {/* VIP Exclusivity Notice */}
              <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-900 mb-1">
                      <strong>Exclusivité VIP automatique</strong>
                    </p>
                    <p className="text-xs text-red-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Ce bien sera réservé aux clients VIP pendant 1 mois
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="mb-4 text-neutral-900">Informations générales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2 text-neutral-700">Titre du bien *</label>
                      <input
                        type="text"
                        required
                        value={newProperty.title}
                        onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ex: Villa Moderne Almadies"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 text-neutral-700">Type de bien *</label>
                      <select
                        required
                        value={newProperty.type}
                        onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value as PropertyType })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="villa">Villa</option>
                        <option value="appartement">Appartement</option>
                        <option value="terrain">Terrain</option>
                        <option value="espace-commercial">Espace commercial</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 text-neutral-700">Localisation *</label>
                      <input
                        type="text"
                        required
                        value={newProperty.location}
                        onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ex: Almadies, Dakar"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 text-neutral-700">Prix (FCFA) *</label>
                      <input
                        type="number"
                        required
                        value={newProperty.price}
                        onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ex: 450000000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 text-neutral-700">Surface (m²) *</label>
                      <input
                        type="number"
                        required
                        value={newProperty.surface}
                        onChange={(e) => setNewProperty({ ...newProperty, surface: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ex: 350"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 text-neutral-700">Chambres</label>
                      <input
                        type="number"
                        value={newProperty.bedrooms}
                        onChange={(e) => setNewProperty({ ...newProperty, bedrooms: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ex: 4"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 text-neutral-700">Salles de bains</label>
                      <input
                        type="number"
                        value={newProperty.bathrooms}
                        onChange={(e) => setNewProperty({ ...newProperty, bathrooms: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ex: 3"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2 text-neutral-700">Description *</label>
                      <textarea
                        required
                        rows={4}
                        value={newProperty.description}
                        onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Décrivez les caractéristiques du bien..."
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2 text-neutral-700">URL de l'image principale</label>
                      <input
                        type="url"
                        value={newProperty.imageUrl}
                        onChange={(e) => setNewProperty({ ...newProperty, imageUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Si vide, une image par défaut sera utilisée</p>
                    </div>
                  </div>
                </div>

                {/* Financing Options */}
                <div>
                  <h4 className="mb-4 text-neutral-900">Options de financement *</h4>
                  <div className="flex flex-wrap gap-2">
                    {financingOptionsData.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleFinancingToggle(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          newProperty.financingOptions.includes(option.value) 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {newProperty.financingOptions.length === 0 && (
                    <p className="text-xs text-red-600 mt-2">Veuillez sélectionner au moins une option de financement</p>
                  )}
                </div>

                {/* Other Options */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProperty.featured}
                      onChange={(e) => setNewProperty({ ...newProperty, featured: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Mettre en vedette sur la page d'accueil
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-neutral-200">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={newProperty.financingOptions.length === 0}
                >
                  <Plus className="w-5 h-5" />
                  Créer le bien
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProperty({
                      title: '',
                      type: 'villa',
                      location: '',
                      price: '',
                      surface: '',
                      bedrooms: '',
                      bathrooms: '',
                      description: '',
                      imageUrl: '',
                      financingOptions: [],
                      featured: false,
                    });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {showEditModal && selectedProperty && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="mb-1">Modifier le bien</h3>
                <p className="text-sm text-neutral-600">{selectedProperty.title}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProperty(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div>
                <h4 className="mb-3 text-neutral-900">Statut du bien</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(['disponible', 'réservé', 'vendu', 'nouveau'] as PropertyStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        console.log(`Statut changé: ${status}`);
                        alert(`Statut changé en "${getStatusLabel(status)}"`);
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedProperty.status === status
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm px-2 py-0.5 rounded ${getStatusColor(status)}`}>
                          {getStatusLabel(status)}
                        </span>
                        {selectedProperty.status === status && (
                          <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* VIP Exclusivity Section */}
              <div>
                <h4 className="mb-3 text-neutral-900">Exclusivité VIP</h4>
                <div className="space-y-3">
                  {(() => {
                    const isVIPExclusive = selectedProperty.vipOnly && selectedProperty.vipExclusivityEndDate;
                    const vipEndDate = isVIPExclusive ? new Date(selectedProperty.vipExclusivityEndDate!) : null;
                    const isVIPActive = vipEndDate && vipEndDate > new Date();

                    return (
                      <>
                        {/* Current VIP Status */}
                        {isVIPActive && vipEndDate && (
                          <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Crown className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-red-900 mb-1">
                                  <strong>Exclusivité VIP active</strong>
                                </p>
                                <p className="text-xs text-red-700 flex items-center gap-2">
                                  <Calendar className="w-3 h-3" />
                                  Jusqu'au {vipEndDate.toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Toggle VIP */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              const vipExpiryDate = new Date();
                              vipExpiryDate.setMonth(vipExpiryDate.getMonth() + 1);
                              console.log('Activer exclusivité VIP jusqu\'au:', vipExpiryDate.toLocaleDateString('fr-FR'));
                              alert(`Exclusivité VIP activée jusqu'au ${vipExpiryDate.toLocaleDateString('fr-FR')}`);
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isVIPActive
                                ? 'border-red-600 bg-red-50'
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Crown className="w-4 h-4 text-red-600" />
                              <span className="text-sm">Activer VIP</span>
                            </div>
                            <p className="text-xs text-neutral-600">Exclusif pendant 1 mois</p>
                          </button>

                          <button
                            onClick={() => {
                              console.log('Désactiver exclusivité VIP');
                              alert('Exclusivité VIP désactivée');
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              !isVIPActive
                                ? 'border-neutral-400 bg-neutral-50'
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">Accès public</span>
                            </div>
                            <p className="text-xs text-neutral-600">Tous les clients</p>
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Featured Toggle */}
              <div>
                <h4 className="mb-3 text-neutral-900">Options d'affichage</h4>
                <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    defaultChecked={selectedProperty.featured}
                    onChange={(e) => {
                      console.log('Featured:', e.target.checked);
                      alert(`Mise en vedette: ${e.target.checked ? 'Oui' : 'Non'}`);
                    }}
                    className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-sand-500" />
                      <span className="text-sm">Mettre en vedette</span>
                    </div>
                    <p className="text-xs text-neutral-600">Afficher sur la page d'accueil</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => {
                    console.log('Modifications enregistrées pour:', selectedProperty.id);
                    alert('Modifications enregistrées avec succès !');
                    setShowEditModal(false);
                    setSelectedProperty(null);
                  }}
                >
                  Enregistrer les modifications
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProperty(null);
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}