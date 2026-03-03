import React, { useState } from 'react';
import { User, Camera, Save } from 'lucide-react';
import { Button } from '../Button';

interface ProfileSettingsProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    bio?: string;
  };
  onSave: (updatedUser: any) => void;
}

export function ProfileSettings({ user, onSave }: ProfileSettingsProps) {
  const [formData, setFormData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // En production, vous uploaderiez le fichier sur un serveur
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validation basique
      if (!formData.name.trim()) {
        throw new Error('Le nom est requis');
      }
      if (!formData.email.trim()) {
        throw new Error('L\'email est requis');
      }
      if (!formData.phone.trim()) {
        throw new Error('Le numéro de téléphone est requis');
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }

      // Validation téléphone (format simplifié)
      const phoneRegex = /^[\d\s\-\+]+$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('Veuillez entrer un numéro de téléphone valide');
      }

      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      onSave(formData);
      setSuccessMessage('Profil mis à jour avec succès!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Profil utilisateur</h2>
        <p className="text-neutral-600">Mettez à jour vos informations personnelles</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {formData.avatar ? (
              <img 
                src={formData.avatar} 
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-12 h-12 text-primary-700" />
              </div>
            )}
            <label htmlFor="avatar-input" className="absolute bottom-0 right-0 bg-primary-700 text-white p-2 rounded-full cursor-pointer hover:bg-primary-800 transition">
              <Camera className="w-5 h-5" />
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1">
            <p className="text-neutral-900 font-semibold">{formData.name}</p>
            <p className="text-neutral-600 text-sm">{formData.email}</p>
            <p className="text-neutral-500 text-sm mt-2">JPG, PNG ou GIF. Max 5MB</p>
          </div>
        </div>

        <div className="border-t pt-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-neutral-700 font-semibold mb-2">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Votre nom complet"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-neutral-700 font-semibold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="votre.email@example.com"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-neutral-700 font-semibold mb-2">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+221 78 123 45 67"
              />
            </div>

            {/* Ville */}
            <div>
              <label htmlFor="city" className="block text-neutral-700 font-semibold mb-2">
                Ville
              </label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Dakar"
              />
            </div>

            {/* Pays */}
            <div>
              <label htmlFor="country" className="block text-neutral-700 font-semibold mb-2">
                Pays
              </label>
              <input
                id="country"
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Sénégal"
              />
            </div>

            {/* Code postal */}
            <div>
              <label htmlFor="postalCode" className="block text-neutral-700 font-semibold mb-2">
                Code postal
              </label>
              <input
                id="postalCode"
                type="text"
                name="postalCode"
                value={formData.postalCode || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="14000"
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="mt-6">
            <label htmlFor="address" className="block text-neutral-700 font-semibold mb-2">
              Adresse
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Votre adresse complète"
            />
          </div>

          {/* Biographie */}
          <div className="mt-6">
            <label htmlFor="bio" className="block text-neutral-700 font-semibold mb-2">
              Biographie
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Parlez un peu de vous..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </div>
  );
}
