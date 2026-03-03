import React, { useState } from 'react';
import { User, Lock, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { ProfileSettings } from './ProfileSettings';
import { ChangePassword } from './ChangePassword';
import { Button } from '../Button';
import { User as UserType } from '../../types';

interface UserSettingsPageProps {
  user: UserType;
  onNavigate?: (page: string) => void;
  onUserUpdate?: (user: UserType) => void;
}

type SettingsTab = 'profile' | 'security';

export function UserSettingsPage({ user, onNavigate, onUserUpdate }: UserSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [currentUser, setCurrentUser] = useState(user);

  const handleProfileUpdate = (updatedUser: any) => {
    setCurrentUser(updatedUser);
    onUserUpdate?.(updatedUser);
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    // En production, cet appel serait fait à votre backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simuler une vérification du mot de passe actuel
        if (currentPassword === 'password123') {
          // Simuler la mise à jour du mot de passe
          resolve();
        } else {
          reject(new Error('Le mot de passe actuel est incorrect'));
        }
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            {onNavigate && (
              <button
                onClick={() => onNavigate('client-dashboard')}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Paramètres du compte</h1>
          </div>
          <p className="text-primary-100 mt-2">Gérez vos informations personnelles et vos paramètres de sécurité</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 justify-center">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-primary-700 text-primary-700'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'security'
                  ? 'border-primary-700 text-primary-700'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Sécurité
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {activeTab === 'profile' && (
            <ProfileSettings
              user={currentUser}
              onSave={handleProfileUpdate}
            />
          )}

          {activeTab === 'security' && (
            <ChangePassword
              onPasswordChange={handlePasswordChange}
            />
          )}
        </div>
      </div>

      
    </div>
  );
}
