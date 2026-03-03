import React from 'react';
import { Building2, CreditCard, FileText, TrendingUp, Crown, ArrowRight, Calendar, Star } from 'lucide-react';
import { Button } from '../Button';
import { contracts, properties, currentUser } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ClientDashboardProps {
  onNavigate: (page: string) => void;
  userName?: string;
}

export function ClientDashboard({ onNavigate, userName }: ClientDashboardProps) {
  const userContracts = contracts.filter(c => c.userId === currentUser.id);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const totalPaid = userContracts.reduce((sum, c) => sum + c.paidAmount, 0);
  const totalAmount = userContracts.reduce((sum, c) => sum + c.totalAmount, 0);
  const remaining = totalAmount - totalPaid;
  const progressPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white mb-2">Bienvenue, {userName || currentUser.name}</h2>
            <p className="text-primary-100 mb-4">
              Gérez vos biens et suivez vos paiements en toute simplicité
            </p>
            {currentUser.isVip && (
              <div className="inline-flex items-center gap-2 bg-gold-600 px-4 py-2 rounded-full">
                <Crown className="w-5 h-5" />
                <span>Client VIP</span>
              </div>
            )}
          </div>
          <Building2 className="w-16 h-16 text-primary-300 opacity-50" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-700" />
            </div>
          </div>
          <p className="text-neutral-600 mb-1">Biens acquis</p>
          <h3 className="text-neutral-900">{userContracts.length}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-sand-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-sand-600" />
            </div>
          </div>
          <p className="text-neutral-600 mb-1">Total payé</p>
          <h3 className="text-neutral-900">{formatPrice(totalPaid)}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
          <p className="text-neutral-600 mb-1">Montant restant</p>
          <h3 className="text-neutral-900">{formatPrice(remaining)}</h3>
        </div>
      </div>

      {/* My Properties */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3>Mes biens</h3>
          <Button variant="ghost" onClick={() => onNavigate('my-properties')}>
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {userContracts.map((contract) => {
            const property = properties.find(p => p.id === contract.propertyId);
            if (!property) return null;

            const progress = (contract.paidAmount / contract.totalAmount) * 100;

            return (
              <div key={contract.id} className="flex gap-4 p-4 border border-neutral-200 rounded-lg">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="text-neutral-900 mb-1">{property.title}</h5>
                      <p className="text-sm text-neutral-600">{property.location}</p>
                    </div>
                    <span className="text-primary-700">{formatPrice(contract.totalAmount)}</span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-600">Progression</span>
                      <span className="text-neutral-900">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-700 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-neutral-600">
                      Payé : <span className="text-neutral-900">{formatPrice(contract.paidAmount)}</span>
                    </span>
                    <span className="text-neutral-600">
                      Prochain paiement : <span className="text-neutral-900">{formatDate(contract.nextPaymentDate)}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('payments')}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-700 transition-colors">
            <CreditCard className="w-6 h-6 text-primary-700 group-hover:text-white transition-colors" />
          </div>
          <h5 className="mb-2 text-neutral-900">Effectuer un paiement</h5>
          <p className="text-sm text-neutral-600">Payez vos échéances en ligne</p>
        </button>

        <button
          onClick={() => onNavigate('documents')}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-sand-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-sand-600 transition-colors">
            <FileText className="w-6 h-6 text-sand-600 group-hover:text-white transition-colors" />
          </div>
          <h5 className="mb-2 text-neutral-900">Mes documents</h5>
          <p className="text-sm text-neutral-600">Accédez à vos contrats et factures</p>
        </button>

        {currentUser.isVip ? (
          <button
            onClick={() => onNavigate('vip-space')}
            className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-left group text-white"
          >
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h5 className="mb-2 text-white">Espace VIP</h5>
            <p className="text-sm text-gold-100">Découvrez vos avantages exclusifs</p>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('upgrade-vip')}
            className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl p-6 shadow-md border border-gold-200 hover:shadow-lg transition-shadow text-left group"
          >
            <div className="w-12 h-12 bg-gold-600 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h5 className="mb-2 text-slate-900">Devenez VIP</h5>
            <p className="text-sm text-slate-600 mb-3">Accès exclusif à des biens premium</p>
            <span className="inline-flex items-center text-sm font-medium text-gold-700">
              En savoir plus
              <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}