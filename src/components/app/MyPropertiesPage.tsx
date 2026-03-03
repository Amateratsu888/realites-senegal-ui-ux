import React, { useState } from 'react';
import { Building2, Calendar, TrendingUp, FolderOpen, ChevronRight, LayoutGrid, Table } from 'lucide-react';
import { Button } from '../Button';
import { contracts, properties, currentUser } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface MyPropertiesPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
  isOnboardingMode?: boolean;
}

export function MyPropertiesPage({ onNavigate, isOnboardingMode }: MyPropertiesPageProps) {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const userContracts = contracts.filter(c => c.userId === currentUser.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2">Mes dossiers</h3>
        <p className="text-neutral-600">
          Cliquez sur un dossier pour accéder à toutes les informations du bien
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <FolderOpen className="w-5 h-5" />
          <span>{userContracts.length} {userContracts.length > 1 ? 'dossiers' : 'dossier'}</span>
        </div>
        
        {/* Toggle View Buttons */}
        <div className="inline-flex rounded-md border border-neutral-300 bg-white">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 rounded-l-md transition-colors ${
              viewMode === 'table' 
                ? 'bg-primary-700 text-white' 
                : 'bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Table className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-3 py-2 rounded-r-md border-l border-neutral-300 transition-colors ${
              viewMode === 'card' 
                ? 'bg-primary-700 text-white' 
                : 'bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userContracts.map((contract) => {
            const property = properties.find(p => p.id === contract.propertyId);
            if (!property) return null;

            const progress = (contract.paidAmount / contract.totalAmount) * 100;
            const remaining = contract.totalAmount - contract.paidAmount;

            return (
              <button
                key={contract.id}
                onClick={() => onNavigate('property-folder', property.id)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group text-left"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-primary-700" />
                    <span className="text-sm text-neutral-900">Dossier #{contract.id}</span>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all">
                      <ChevronRight className="w-6 h-6 text-primary-700" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="mb-1 text-neutral-900 group-hover:text-primary-700 transition-colors">
                          {property.title}
                        </h4>
                        <p className="text-neutral-600 text-sm">{property.location}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-neutral-600">
                        <Building2 className="w-4 h-4" />
                        <span>{property.surface} m²</span>
                      </div>
                      {property.bedrooms && (
                        <div className="flex items-center gap-1.5 text-neutral-600">
                          <span>{property.bedrooms} chambres</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-neutral-600">Progression</span>
                      <span className="text-primary-700 font-semibold">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-700 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-700 mb-1">Payé</p>
                      <p className="text-sm text-green-900 font-semibold">{formatPrice(contract.paidAmount)}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-orange-700 mb-1">Restant</p>
                      <p className="text-sm text-orange-900 font-semibold">{formatPrice(remaining)}</p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-100">
                <th className="px-4 py-2 text-left">Dossier</th>
                <th className="px-4 py-2 text-left">Bien</th>
                <th className="px-4 py-2 text-left">Localisation</th>
                <th className="px-4 py-2 text-left">Surface</th>
                <th className="px-4 py-2 text-left">Chambres</th>
                <th className="px-4 py-2 text-left">Progression</th>
                <th className="px-4 py-2 text-left">Payé</th>
                <th className="px-4 py-2 text-left">Restant</th>
              </tr>
            </thead>
            <tbody>
              {userContracts.map((contract, index) => {
                const property = properties.find(p => p.id === contract.propertyId);
                if (!property) return null;

                const progress = isOnboardingMode ? 0 : (contract.paidAmount / contract.totalAmount) * 100;
                const remaining = isOnboardingMode ? contract.totalAmount : (contract.totalAmount - contract.paidAmount);
                const paidAmount = isOnboardingMode ? 0 : contract.paidAmount;

                return (
                  <tr 
                    key={contract.id} 
                    id={index === 0 ? 'property-card-0' : undefined}
                    className="hover:bg-neutral-50 cursor-pointer" 
                    onClick={() => onNavigate('property-folder', property.id)}
                  >
                    <td className="px-4 py-2 text-left">Dossier #{contract.id}</td>
                    <td className="px-4 py-2 text-left">{property.title}</td>
                    <td className="px-4 py-2 text-left">{property.location}</td>
                    <td className="px-4 py-2 text-left">{property.surface} m²</td>
                    <td className="px-4 py-2 text-left">{property.bedrooms ? `${property.bedrooms} chambres` : '-'}</td>
                    <td className="px-4 py-2 text-left">
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary-700 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-primary-700 font-semibold">{progress.toFixed(0)}%</span>
                    </td>
                    <td className="px-4 py-2 text-left text-green-900 font-semibold">{formatPrice(paidAmount)}</td>
                    <td className="px-4 py-2 text-left text-orange-900 font-semibold">{formatPrice(remaining)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {userContracts.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FolderOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="mb-2 text-neutral-600">Aucun dossier pour le moment</h3>
          <p className="text-neutral-500 mb-6">
            Vous n'avez pas encore acquis de bien immobilier
          </p>
        </div>
      )}
    </div>
  );
}