import React, { useState } from 'react';
import { MapPin, Maximize, Home, Bath, ChevronLeft, ChevronRight, CheckCircle2, X, Tag, DoorClosed, Layers, Mountain, Car, ParkingSquare } from 'lucide-react';
import { properties } from '../../data/mockData';
import { Button } from '../Button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PropertyMap } from '../PropertyMap';

interface PropertyDetailPageProps {
  propertyId: string;
  onNavigate: (page: string) => void;
}

export function PropertyDetailPage({ propertyId, onNavigate }: PropertyDetailPageProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const property = properties.find(p => p.id === propertyId);

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2>Bien non trouvé</h2>
          <Button onClick={() => onNavigate('properties')} className="mt-4">
            Retour aux biens
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getFinancingLabel = (option: string) => {
    const labels: Record<string, string> = {
      'comptant': 'Achat comptant',
      'échelonné': 'Plan d\'échelonnement',
      'tontine': 'Tontine',
      'location-vente': 'Location-vente',
      'vefa': 'VEFA',
    };
    return labels[option] || option;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demande envoyée ! Notre équipe vous contactera bientôt.');
    setShowContactForm(false);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => onNavigate('properties')} className="mb-6">
          <ChevronLeft className="w-4 h-4" />
          Retour aux biens
        </Button>

        {/* Image Gallery */}
        <div className="mb-8">
          {/* Bento Grid Layout */}
          {property.images.length === 1 ? (
            <div className="relative h-[300px] md:h-[500px] overflow-hidden rounded-lg">
              <ImageWithFallback
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedImage(property.images[0])}
              />
            </div>
          ) : property.images.length === 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[300px] md:h-[500px]">
              {property.images.map((image, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage(image)}
                  />
                </div>
              ))}
            </div>
          ) : property.images.length === 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[600px] md:h-[500px]">
              <div className="relative overflow-hidden rounded-lg h-[200px] md:h-full">
                <ImageWithFallback
                  src={property.images[0]}
                  alt={`${property.title} - Image 1`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(property.images[0])}
                />
              </div>
              <div className="grid grid-rows-2 gap-3">
                <div className="relative overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={property.images[1]}
                    alt={`${property.title} - Image 2`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage(property.images[1])}
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={property.images[2]}
                    alt={`${property.title} - Image 3`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage(property.images[2])}
                  />
                </div>
              </div>
            </div>
          ) : property.images.length === 4 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-[400px] md:h-[500px]">
              <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={property.images[0]}
                  alt={`${property.title} - Image 1`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(property.images[0])}
                />
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={property.images[1]}
                  alt={`${property.title} - Image 2`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(property.images[1])}
                />
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={property.images[2]}
                  alt={`${property.title} - Image 3`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(property.images[2])}
                />
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={property.images[3]}
                  alt={`${property.title} - Image 4`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(property.images[3])}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-[400px] md:h-[500px]">
              <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={property.images[0]}
                  alt={`${property.title} - Image 1`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(property.images[0])}
                />
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={property.images[1]}
                  alt={`${property.title} - Image 2`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(property.images[1])}
                />
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={property.images[2]}
                  alt={`${property.title} - Image 3`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(property.images[2])}
                />
              </div>
              <div className="relative overflow-hidden rounded-lg group">
                <ImageWithFallback
                  src={property.images[3]}
                  alt={`${property.title} - Image 4`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(property.images[3])}
                />
                {property.images.length > 4 && (
                  <div 
                    className="absolute inset-0 bg-neutral-900/70 flex items-center justify-center cursor-pointer hover:bg-neutral-900/80 transition-colors"
                    onClick={() => setSelectedImage(property.images[4])}
                  >
                    <span className="text-white text-2xl">+{property.images.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8">
              <div className="mb-6">
                <div className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full mb-3">
                  {property.type === 'villa' ? 'Villa' : 
                   property.type === 'appartement' ? 'Appartement' : 
                   property.type === 'terrain' ? 'Terrain' : 
                   'Espace commercial'}
                </div>
                <h2 className="mb-3">{property.title}</h2>
                <div className="flex items-center gap-2 text-neutral-600 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{property.location}</span>
                </div>
                <h3 className="text-primary-700">{formatPrice(property.price)}</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-neutral-200">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Surface</p>
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-primary-700" />
                    <span>{property.surface} m²</span>
                  </div>
                </div>
                {property.category && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Catégorie</p>
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary-700" />
                      <span className="capitalize">{property.category === 'vente' ? 'Vente' : property.category === 'location-vente' ? 'Location-vente' : 'Location'}</span>
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Chambres</p>
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary-700" />
                      <span>{property.bedrooms}</span>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Salles de bain</p>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-primary-700" />
                      <span>{property.bathrooms}</span>
                    </div>
                  </div>
                )}
                {property.guestToilet !== undefined && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Toilettes visiteur</p>
                    <div className="flex items-center gap-2">
                      <DoorClosed className="w-5 h-5 text-primary-700" />
                      <span>{property.guestToilet ? 'Oui' : 'Non'}</span>
                    </div>
                  </div>
                )}
                {property.floor && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Étage</p>
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-primary-700" />
                      <span>{property.floor}</span>
                    </div>
                  </div>
                )}
                {property.groundLevel && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Niveau du sol</p>
                    <div className="flex items-center gap-2">
                      <Mountain className="w-5 h-5 text-primary-700" />
                      <span>{property.groundLevel}</span>
                    </div>
                  </div>
                )}
                {property.parking && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Parking</p>
                    <div className="flex items-center gap-2">
                      <ParkingSquare className="w-5 h-5 text-primary-700" />
                      <span>{property.parking} places</span>
                    </div>
                  </div>
                )}
                {property.garageSpaces && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Garage</p>
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary-700" />
                      <span>{property.garageSpaces} places</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="mb-4">Description</h4>
                <p className="text-neutral-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-4">Commodités</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary-700" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map - Moved up after description */}
            {property.coordinates && (
              <div className="p-8">
                <h4 className="mb-4">Localisation</h4>
                <PropertyMap
                  coordinates={property.coordinates}
                  propertyName={property.title}
                  location={property.location}
                />
              </div>
            )}

            {/* Financing Options */}
            <div className="p-8">
              <h4 className="mb-4">Options de financement</h4>
              
              {/* Plans de paiement pour terrains */}
              {property.type === 'terrain' && property.paymentPlans && property.paymentPlans.length > 0 ? (
                <div className="bg-neutral-50 rounded-lg p-6 space-y-6">
                  {/* Paiement comptant */}
                  <div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-neutral-900 mb-2">Paiement Comptant</p>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">Prix total</span>
                            <span className="text-primary-700">{formatPrice(property.price)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600 mt-2">Paiement intégral au moment de l'achat</p>
                      </div>
                    </div>
                  </div>

                  {/* Plans d'échelonnement */}
                  {property.paymentPlans.map((plan) => (
                    <div key={plan.duration}>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-neutral-900 mb-2">Plan d'échelonnement {plan.duration} mois</p>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-600">Prix total</span>
                                <span className="text-neutral-900">{formatPrice(plan.totalPrice)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-600">Apport initial</span>
                                <span className="text-primary-700">{formatPrice(plan.downPayment)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-600">Mensualité</span>
                                <span className="text-primary-700">{formatPrice(plan.monthlyPayment)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600 mt-2">
                            {plan.duration} mensualités de {formatPrice(plan.monthlyPayment)} après un apport de {formatPrice(plan.downPayment)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Tontine si disponible */}
                  {property.financingOptions.includes('tontine') && (
                    <div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-neutral-900 mb-2">Système Tontine</p>
                          <p className="text-sm text-neutral-600">
                            Système de tontine collective pour terrains - Contactez-nous pour plus de détails
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Options de financement pour autres types de biens
                <div className="space-y-3">
                  {property.financingOptions.map((option) => (
                    <div key={option} className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-neutral-900">{getFinancingLabel(option)}</p>
                        <p className="text-sm text-neutral-600 mt-1">
                          {option === 'comptant' && 'Paiement intégral au moment de l\'achat'}
                          {option === 'échelonné' && 'Plans sur mesure de 12 à 36 mois'}
                          {option === 'tontine' && 'Système de tontine collective pour terrains'}
                          {option === 'location-vente' && 'Devenez propriétaire progressivement'}
                          {option === 'vefa' && 'Paiement par paliers d\'avancement des travaux'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-300 rounded-lg p-6 sticky top-24">
              <h4 className="mb-4">Intéressé par ce bien ?</h4>
              <p className="text-neutral-600 mb-6">
                Contactez notre équipe commerciale pour plus d'informations ou pour organiser une visite.
              </p>
              <Button className="w-full mb-4" onClick={() => setShowContactForm(true)}>
                Contacter notre équipe
              </Button>
              <button 
                onClick={() => onNavigate('login')}
                className="w-full text-center text-sm text-primary-700 hover:text-primary-800 transition-colors"
              >
                Déjà client ? Se connecter à votre espace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h3>Nous contacter</h3>
              <button onClick={() => setShowContactForm(false)} className="text-neutral-500 hover:text-neutral-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm mb-2 text-neutral-700">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-neutral-700">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-neutral-700">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-neutral-700">Bien concerné</label>
                <input
                  type="text"
                  value={property.title}
                  disabled
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-neutral-700">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Décrivez votre projet, vos questions..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Envoyer la demande
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowContactForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-neutral-900/95 flex items-center justify-center z-50 p-4">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {property.images.length > 1 && (
            <>
              <button
                onClick={() => {
                  const currentIndex = property.images.indexOf(selectedImage);
                  const prevIndex = (currentIndex - 1 + property.images.length) % property.images.length;
                  setSelectedImage(property.images[prevIndex]);
                }}
                className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  const currentIndex = property.images.indexOf(selectedImage);
                  const nextIndex = (currentIndex + 1) % property.images.length;
                  setSelectedImage(property.images[nextIndex]);
                }}
                className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <ImageWithFallback
              src={selectedImage}
              alt={property.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
            {property.images.indexOf(selectedImage) + 1} / {property.images.length}
          </div>
        </div>
      )}
    </div>
  );
}