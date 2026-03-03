import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '../Button';

interface ChangePasswordProps {
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function ChangePassword({ onPasswordChange }: ChangePasswordProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculer la force du mot de passe
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'Faible';
      case 'medium':
        return 'Moyen';
      case 'strong':
        return 'Fort';
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validation
      if (!formData.currentPassword.trim()) {
        throw new Error('Le mot de passe actuel est requis');
      }
      if (!formData.newPassword.trim()) {
        throw new Error('Le nouveau mot de passe est requis');
      }
      if (!formData.confirmPassword.trim()) {
        throw new Error('La confirmation du mot de passe est requise');
      }

      if (formData.currentPassword === formData.newPassword) {
        throw new Error('Le nouveau mot de passe doit être différent du mot de passe actuel');
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (formData.newPassword.length < 8) {
        throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      }

      // Appel API
      await onPasswordChange(formData.currentPassword, formData.newPassword);

      // Réinitialiser le formulaire
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccessMessage('Mot de passe mis à jour avec succès!');
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
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-6 h-6 text-primary-700" />
          <h2 className="text-2xl font-bold text-neutral-900">Sécurité</h2>
        </div>
        <p className="text-neutral-600">Modifiez votre mot de passe régulièrement pour sécuriser votre compte</p>
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
        {/* Mot de passe actuel */}
        <div>
          <label htmlFor="currentPassword" className="block text-neutral-700 font-semibold mb-2">
            Mot de passe actuel
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
              placeholder="Entrez votre mot de passe actuel"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
            >
              {showPasswords.current ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          {/* Nouveau mot de passe */}
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-neutral-700 font-semibold mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                placeholder="Entrez un nouveau mot de passe"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Indicateur de force */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-neutral-600">Force du mot de passe:</p>
                  <p className="text-sm font-semibold text-neutral-700">{getPasswordStrengthLabel()}</p>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                    style={{
                      width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Critères */}
            <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
              <p className="text-xs font-semibold text-neutral-700 mb-2">Critères du mot de passe:</p>
              <ul className="text-xs text-neutral-600 space-y-1">
                <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                  {formData.newPassword.length >= 8 ? '✓' : '○'} Au moins 8 caractères
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  {/[a-z]/.test(formData.newPassword) ? '✓' : '○'} Lettres minuscules
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  {/[A-Z]/.test(formData.newPassword) ? '✓' : '○'} Lettres majuscules
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  {/[0-9]/.test(formData.newPassword) ? '✓' : '○'} Chiffres
                </li>
                <li className={/[!@#$%^&*]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  {/[!@#$%^&*]/.test(formData.newPassword) ? '✓' : '○'} Caractères spéciaux (!@#$%^&*)
                </li>
              </ul>
            </div>
          </div>

          {/* Confirmer le mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-neutral-700 font-semibold mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                placeholder="Confirmez le nouveau mot de passe"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="text-red-600 text-sm mt-2">Les mots de passe ne correspondent pas</p>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <p className="text-green-600 text-sm mt-2">✓ Les mots de passe correspondent</p>
            )}
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
            {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </Button>
        </div>
      </form>

      {/* Conseil de sécurité */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Conseil de sécurité:</strong> Ne partagez jamais votre mot de passe. Nous ne vous demanderons jamais votre mot de passe par email ou téléphone.
        </p>
      </div>
    </div>
  );
}
