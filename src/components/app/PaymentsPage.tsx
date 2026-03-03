import React, { useState } from 'react';
import { CreditCard, Calendar, CheckCircle2, Clock, AlertCircle, Download, X } from 'lucide-react';
import { Button } from '../Button';
import { contracts, currentUser } from '../../data/mockData';
import { PaymentStatus } from '../../types';

interface PaymentsPageProps {
  onNavigate: (page: string) => void;
}

export function PaymentsPage({ onNavigate }: PaymentsPageProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'card'>('wave');

  const userContracts = contracts.filter(c => c.userId === currentUser.id);
  const allPayments = userContracts.flatMap(c => c.installments);

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

  const getStatusInfo = (status: PaymentStatus) => {
    const statusConfig = {
      'payé': {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
        label: 'Payé',
      },
      'en-attente': {
        icon: Clock,
        color: 'text-sand-600',
        bg: 'bg-sand-50',
        label: 'En attente',
      },
      'en-retard': {
        icon: AlertCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        label: 'En retard',
      },
    };
    return statusConfig[status];
  };

  const handlePayNow = (paymentId: string) => {
    setSelectedPayment(paymentId);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = () => {
    alert('Paiement effectué avec succès !');
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  const nextPayment = allPayments.find(p => p.status === 'en-attente');

  return (
    <div className="space-y-6">
      {/* Next Payment Alert */}
      {nextPayment && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-primary-900 mb-1">Prochaine échéance</h4>
                <p className="text-primary-800 mb-2">
                  {formatPrice(nextPayment.amount)} - {formatDate(nextPayment.date)}
                </p>
                <p className="text-sm text-primary-700">
                  N'oubliez pas d'effectuer votre paiement avant la date limite.
                </p>
              </div>
            </div>
            <Button onClick={() => handlePayNow(nextPayment.id)}>
              Payer maintenant
            </Button>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-neutral-600 mb-2">Total payé</p>
          <h3 className="text-primary-700 mb-1">
            {formatPrice(allPayments.filter(p => p.status === 'payé').reduce((sum, p) => sum + p.amount, 0))}
          </h3>
          <p className="text-sm text-neutral-500">
            {allPayments.filter(p => p.status === 'payé').length} paiement(s)
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-neutral-600 mb-2">En attente</p>
          <h3 className="text-sand-600 mb-1">
            {formatPrice(allPayments.filter(p => p.status === 'en-attente').reduce((sum, p) => sum + p.amount, 0))}
          </h3>
          <p className="text-sm text-neutral-500">
            {allPayments.filter(p => p.status === 'en-attente').length} échéance(s)
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-neutral-600 mb-2">En retard</p>
          <h3 className="text-red-600 mb-1">
            {formatPrice(allPayments.filter(p => p.status === 'en-retard').reduce((sum, p) => sum + p.amount, 0))}
          </h3>
          <p className="text-sm text-neutral-500">
            {allPayments.filter(p => p.status === 'en-retard').length} paiement(s)
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h3>Historique des paiements</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-neutral-700">Date d'échéance</th>
                <th className="px-6 py-3 text-left text-sm text-neutral-700">Montant</th>
                <th className="px-6 py-3 text-left text-sm text-neutral-700">Statut</th>
                <th className="px-6 py-3 text-right text-sm text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {allPayments.map((payment) => {
                const statusInfo = getStatusInfo(payment.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={payment.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-900">{formatDate(payment.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-900">{formatPrice(payment.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        <span className={`text-sm ${statusInfo.color}`}>{statusInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.status === 'payé' ? (
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                          Télécharger
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handlePayNow(payment.id)}>
                          Payer
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h3>Effectuer un paiement</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-neutral-500 hover:text-neutral-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-neutral-600 mb-2">Montant à payer</p>
                <h3 className="text-primary-700">
                  {formatPrice(allPayments.find(p => p.id === selectedPayment)?.amount || 0)}
                </h3>
              </div>

              <div>
                <label className="block text-sm mb-3 text-neutral-700">Méthode de paiement</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod('wave')}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'wave'
                        ? 'border-primary-700 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white">W</span>
                    </div>
                    <span className="text-neutral-900">Wave</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('orange')}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'orange'
                        ? 'border-primary-700 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white">OM</span>
                    </div>
                    <span className="text-neutral-900">Orange Money</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-primary-700 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-neutral-900">Carte bancaire</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handlePaymentSubmit} className="flex-1">
                  Confirmer le paiement
                </Button>
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
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