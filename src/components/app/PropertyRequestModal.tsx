import React, { useState } from 'react';
import { X, Send, Calendar, Clock, Phone, Mail, MessageSquare, Home, Info, CreditCard } from 'lucide-react';
import { Button } from '../Button';
import { RequestType } from './MyRequestsPage';

interface PropertyRequestModalProps {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyPrice: number;
  onClose: () => void;
  onSubmit: (data: RequestFormData) => void;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}

export interface RequestFormData {
  type: RequestType;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  phone: string;
  email: string;
}

export function PropertyRequestModal({
  propertyId,
  propertyTitle,
  propertyImage,
  propertyPrice,
  onClose,
  onSubmit,
  userEmail,
  userPhone,
  userName,
}: PropertyRequestModalProps) {
  const [formData, setFormData] = useState<RequestFormData>({
    type: 'visite',
    message: '',
    preferredDate: '',
    preferredTime: '',
    phone: userPhone || '+221 ',
    email: userEmail || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RequestFormData, string>>>({});

  const requestTypes: { value: RequestType; label: string; icon: any; description: string }[] = [
    {
      value: 'visite',
      label: 'Demande de visite',
      icon: Calendar,
      description: 'Planifier une visite du bien',
    },
    {
      value: 'reservation',
      label: 'Réserver ce bien',
      icon: Home,
      description: 'Faire une demande de réservation',
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RequestFormData, string>> = {};

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }

    if (!formData.phone || formData.phone.length < 8) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Email invalide';
    }

    if (formData.type === 'visite' && !formData.preferredDate) {
      newErrors.preferredDate = 'Veuillez sélectionner une date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-slate-900">Faire une demande</h3>
              <p className="text-sm text-slate-600 mt-1">
                Remplissez le formulaire ci-dessous pour envoyer votre demande
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Property Info */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600 mb-2">Bien concerné</p>
            <div className="flex items-center gap-4">
              <img
                src={propertyImage}
                alt={propertyTitle}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-sm">{propertyTitle}</p>
                <p className="text-sm text-primary-700 mt-1">{formatPrice(propertyPrice)}</p>
              </div>
            </div>
          </div>

          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Type de demande *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requestTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.type === type.value
                        ? 'border-red-600 bg-red-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${
                        formData.type === type.value
                          ? 'bg-red-100'
                          : 'bg-slate-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          formData.type === type.value
                            ? 'text-red-600'
                            : 'text-slate-600'
                        }`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          formData.type === type.value
                            ? 'text-red-900'
                            : 'text-slate-900'
                        }`}>
                          {type.label}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Date & Time (only for visits) */}
          {formData.type === 'visite' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date souhaitée *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    min={getMinDate()}
                    className={`w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.preferredDate ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.preferredDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.preferredDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Heure souhaitée
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={
                  formData.type === 'visite'
                    ? 'Décrivez vos disponibilités ou questions...'
                    : formData.type === 'reservation'
                    ? 'Expliquez votre projet d\'acquisition...'
                    : formData.type === 'financement'
                    ? 'Précisez vos besoins de financement...'
                    : 'Posez vos questions...'
                }
                rows={5}
                className={`w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${
                  errors.message ? 'border-red-500' : 'border-slate-300'
                }`}
              />
            </div>
            {errors.message && (
              <p className="text-xs text-red-600 mt-1">{errors.message}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Téléphone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+221 77 123 45 67"
                  className={`w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.phone ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
              {userPhone && (
                <p className="text-xs text-green-600 mt-1">✓ Pré-rempli avec vos informations</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                  className={`w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
              {userEmail && (
                <p className="text-xs text-green-600 mt-1">✓ Pré-rempli avec vos informations</p>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Notre équipe vous contactera dans les plus brefs délais pour traiter votre demande.
              Vous pouvez suivre l'état de votre demande dans l'onglet "Mes demandes".
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer la demande
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}