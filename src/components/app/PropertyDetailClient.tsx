import React, { useState } from 'react';
import { 
  MapPin, 
  Maximize, 
  Home, 
  Bath, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Tag, 
  DoorClosed, 
  Layers, 
  Mountain, 
  Car, 
  ParkingSquare,
  ArrowLeft,
  Crown,
  Send,
  Calendar
} from 'lucide-react';
import { properties } from '../../data/mockData';
import { Button } from '../Button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PropertyMap } from '../PropertyMap';
import { PropertyRequestModal, RequestFormData } from './PropertyRequestModal';
import { Badge } from '../ui/badge';

interface PropertyDetailClientProps {
  propertyId: string;
  onNavigate: (page: string, propertyId?: string) => void;
  isVIP?: boolean;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}

export function PropertyDetailClient({ 
  propertyId, 
  onNavigate, 
  isVIP = false, 
  userEmail, 
  userPhone, 
  userName 
}: PropertyDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const property = properties.find(p => p.id === propertyId);

  if (!property) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('catalog')}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h2 className="text-slate-900">Bien introuvable</h2>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-slate-600 mb-6">Le bien demandé n'existe pas ou vous n'y avez pas accès.</p>
          <Button onClick={() => onNavigate('catalog')}>
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  // Vérifier si le client a accès au bien
  // Check if VIP exclusivity is still active
  const isVIPExclusive = property.vipOnly && property.vipExclusivityEndDate;
  const vipEndDate = isVIPExclusive ? new Date(property.vipExclusivityEndDate!) : null;
  const isVIPActive = vipEndDate && vipEndDate > new Date();
  
  if (isVIPActive && !isVIP) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('catalog')}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h2 className="text-slate-900">Accès restreint</h2>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="mb-2">Bien exclusif VIP</h3>
          <p className="text-slate-600 mb-6">Ce bien est réservé aux clients VIP. Passez au statut VIP pour y accéder.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => onNavigate('catalog')}>
              Retour au catalogue
            </Button>
            <Button variant="outline" onClick={() => onNavigate('book-call')}>
              Devenir VIP
            </Button>
          </div>
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

  const handleRequestSubmit = (data: RequestFormData) => {
    console.log('Demande envoyée:', data, 'pour le bien:', property);
    // TODO: Envoyer la demande au backend
    alert('Demande envoyée avec succès ! Vous pouvez suivre son état dans "Mes demandes"');
    setShowRequestModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('catalog')}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h2 className="text-slate-900">{property.title}</h2>
          <div className="flex items-center gap-2 text-slate-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.location}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {property.images.length === 1 ? (
          <div className="relative h-[300px] md:h-[500px] overflow-hidden">
            <ImageWithFallback
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage(property.images[0])}
            />
          </div>
        ) : property.images.length === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[300px] md:h-[500px] p-3">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[600px] md:h-[500px] p-3">
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
        ) : property.images.length >= 4 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-[400px] md:h-[500px] p-3">
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
                  className="absolute inset-0 bg-slate-900/70 flex items-center justify-center cursor-pointer hover:bg-slate-900/80 transition-colors"
                  onClick={() => setSelectedImage(property.images[4])}
                >
                  <span className="text-white text-2xl">+{property.images.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                  {property.type === 'villa' ? 'Villa' : 
                   property.type === 'appartement' ? 'Appartement' : 
                   property.type === 'terrain' ? 'Terrain' : 
                   'Espace commercial'}
                </span>
                {isVIPActive && (
                  <Badge variant="gold" className="shadow-md">
                    <Crown className="w-4 h-4" />
                    Exclusivité VIP
                  </Badge>
                )}
                {/* Status Badge */}
                <Badge 
                  className={`
                    ${property.status === 'disponible' ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : ''}
                    ${property.status === 'réservé' ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500' : ''}
                    ${property.status === 'vendu' ? 'bg-slate-400 hover:bg-slate-500 text-white border-slate-400' : ''}
                    ${property.status === 'nouveau' ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' : ''}
                  `}
                >
                  {property.status === 'disponible' && 'Disponible'}
                  {property.status === 'réservé' && 'Réservé'}
                  {property.status === 'vendu' && 'Vendu'}
                  {property.status === 'nouveau' && 'Nouveau'}
                </Badge>
              </div>
              {isVIPActive && vipEndDate && (
                <div className="flex items-center gap-2 text-primary-700 mb-3 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>Exclusivité VIP jusqu'au {vipEndDate.toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              <h3 className="text-primary-700 mb-2">{formatPrice(property.price)}</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-200">
              <div>
                <p className="text-sm text-slate-600 mb-1">Surface</p>
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-primary-700" />
                  <span className="text-slate-900">{property.surface} m²</span>
                </div>
              </div>
              {property.category && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Catégorie</p>
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary-700" />
                    <span className="text-slate-900 capitalize">{property.category === 'vente' ? 'Vente' : property.category === 'location-vente' ? 'Location-vente' : 'Location'}</span>
                  </div>
                </div>
              )}
              {property.bedrooms && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Chambres</p>
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary-700" />
                    <span className="text-slate-900">{property.bedrooms}</span>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Salles de bain</p>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-primary-700" />
                    <span className="text-slate-900">{property.bathrooms}</span>
                  </div>
                </div>
              )}
              {property.guestToilet !== undefined && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Toilettes visiteur</p>
                  <div className="flex items-center gap-2">
                    <DoorClosed className="w-5 h-5 text-primary-700" />
                    <span className="text-slate-900">{property.guestToilet ? 'Oui' : 'Non'}</span>
                  </div>
                </div>
              )}
              {property.floor && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Étage</p>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary-700" />
                    <span className="text-slate-900">{property.floor}</span>
                  </div>
                </div>
              )}
              {property.groundLevel && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Niveau du sol</p>
                  <div className="flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-primary-700" />
                    <span className="text-slate-900">{property.groundLevel}</span>
                  </div>
                </div>
              )}
              {property.parking && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Parking</p>
                  <div className="flex items-center gap-2">
                    <ParkingSquare className="w-5 h-5 text-primary-700" />
                    <span className="text-slate-900">{property.parking} places</span>
                  </div>
                </div>
              )}
              {property.garageSpaces && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Garage</p>
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary-700" />
                    <span className="text-slate-900">{property.garageSpaces} places</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-slate-900 mb-4">Description</h4>
              <p className="text-slate-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-6">
                <h4 className="text-slate-900 mb-4">Commodités</h4>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary-700" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          {property.coordinates && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-slate-900 mb-4">Localisation</h4>
              <PropertyMap
                coordinates={property.coordinates}
                propertyName={property.title}
                location={property.location}
              />
            </div>
          )}

          {/* Financing Options */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="text-slate-900 mb-4">Options de financement</h4>
            
            {/* Plans de paiement pour terrains */}
            {property.type === 'terrain' && property.paymentPlans && property.paymentPlans.length > 0 ? (
              <div className="space-y-6">
                {/* Paiement comptant */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-900 mb-2">Paiement Comptant</p>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Prix total</span>
                          <span className="text-primary-700">{formatPrice(property.price)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">Paiement intégral au moment de l'achat</p>
                    </div>
                  </div>
                </div>

                {/* Plans d'échelonnement */}
                {property.paymentPlans.map((plan) => (
                  <div key={plan.duration} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-slate-900 mb-2">Plan d'échelonnement {plan.duration} mois</p>
                        <div className="space-y-2">
                          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Prix total</span>
                              <span className="text-slate-900">{formatPrice(plan.totalPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Apport initial</span>
                              <span className="text-primary-700">{formatPrice(plan.downPayment)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Mensualité</span>
                              <span className="text-primary-700">{formatPrice(plan.monthlyPayment)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          {plan.duration} mensualités de {formatPrice(plan.monthlyPayment)} après un apport de {formatPrice(plan.downPayment)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Tontine si disponible */}
                {property.financingOptions.includes('tontine') && (
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-slate-900 mb-2">Système Tontine</p>
                        <p className="text-sm text-slate-600">
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
                  <div key={option} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-900">{getFinancingLabel(option)}</p>
                      <p className="text-sm text-slate-600 mt-1">
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
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h4 className="text-slate-900 mb-4">Intéressé par ce bien ?</h4>
            <p className="text-slate-600 mb-6 text-sm">
              Faites une demande pour obtenir plus d'informations ou organiser une visite.
            </p>
            <Button 
              className="w-full" 
              onClick={() => setShowRequestModal(true)}
            >
              <Send className="w-5 h-5" />
              Faire une demande
            </Button>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <PropertyRequestModal
          propertyId={property.id}
          propertyTitle={property.title}
          propertyImage={property.images[0]}
          propertyPrice={property.price}
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleRequestSubmit}
          userEmail={userEmail}
          userPhone={userPhone}
          userName={userName}
        />
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-slate-900/95 flex items-center justify-center z-50 p-4">
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