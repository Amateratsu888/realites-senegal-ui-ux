import React, { useState } from 'react';
import { Search, Crown, Phone, Mail, Calendar, Eye, X, Home, FileText, CreditCard, Receipt, Building2, TrendingUp, CheckCircle, Image as ImageIcon, ExternalLink, CheckCircle2, Clock, MoreVertical, ArrowLeft, ChevronRight, LayoutGrid, Table as TableIcon, UserPlus, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '../Button';
import { PropertyCard } from '../PropertyCard';
import { technicianClients, contracts, properties, payments, documents } from '../../data/mockData';
import { User, Payment } from '../../types';

export function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'vip'>('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [propertiesViewMode, setPropertiesViewMode] = useState<'table' | 'cards'>('table');
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [createClientStep, setCreateClientStep] = useState(1);
  const [showPropertySelectionModal, setShowPropertySelectionModal] = useState(false);
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    isVip: false,
  });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [propertyPaymentPlans, setPropertyPaymentPlans] = useState<Record<string, {
    months: 12 | 24 | 36;
    initialPaymentPaid: boolean;
    firstInstallmentPaid: boolean;
    initialPaymentProof: File | null;
    firstInstallmentProof: File | null;
  }>>({});

  const filteredClients = technicianClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || 
                       (roleFilter === 'vip' && client.isVip) ||
                       (roleFilter === 'client' && !client.isVip);
    return matchesSearch && matchesRole;
  });

  const clientsCount = {
    all: technicianClients.length,
    vip: technicianClients.filter(c => c.isVip).length,
    client: technicianClients.filter(c => !c.isVip).length,
  };

  const currentClient = selectedClient ? technicianClients.find(c => c.id === selectedClient) : null;

  // Récupérer les données du client sélectionné
  const getClientData = (clientId: string) => {
    const clientContracts = contracts.filter(c => c.userId === clientId);
    const clientProperties = clientContracts.map(contract => 
      properties.find(p => p.id === contract.propertyId)
    ).filter(Boolean);
    
    const clientPayments = payments.filter(p => 
      clientContracts.some(c => c.id === p.contractId)
    );
    
    const clientDocuments = documents.filter(d => 
      clientContracts.some(c => c.id === d.contractId)
    );

    const totalInvested = clientContracts.reduce((sum, c) => sum + c.paidAmount, 0);
    const totalValue = clientContracts.reduce((sum, c) => sum + c.totalAmount, 0);

    return {
      contracts: clientContracts,
      properties: clientProperties,
      payments: clientPayments,
      documents: clientDocuments,
      totalInvested,
      totalValue,
    };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      'active': { label: 'Actif', color: 'bg-green-100 text-green-700' },
      'pending': { label: 'En attente', color: 'bg-sand-100 text-sand-700' },
      'completed': { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
      'payé': { label: 'Payé', color: 'bg-green-100 text-green-700' },
      'en-attente': { label: 'En attente', color: 'bg-sand-100 text-sand-700' },
      'en-retard': { label: 'En retard', color: 'bg-red-100 text-red-700' },
    };
    const config = statusConfig[status] || { label: status, color: 'bg-slate-100 text-slate-700' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Obtenir le statut des paiements d'un client
  const getClientPaymentStatus = (clientId: string) => {
    const clientData = getClientData(clientId);
    const allPayments = clientData.payments;
    
    const today = new Date();
    const pendingPayments = allPayments.filter(p => p.status === 'en-attente');
    const overduePayments = allPayments.filter(p => {
      if (p.status === 'payé') return false;
      const paymentDate = new Date(p.date);
      return paymentDate < today;
    });
    
    if (overduePayments.length > 0) {
      return {
        status: 'en-retard',
        count: overduePayments.length,
        icon: Clock,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      };
    }
    
    if (pendingPayments.length > 0) {
      return {
        status: 'en-attente',
        count: pendingPayments.length,
        icon: Clock,
        color: 'text-sand-600',
        bgColor: 'bg-sand-100',
      };
    }
    
    return {
      status: 'à-jour',
      count: 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    };
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setRoleFilter('all')}
          className={`bg-white rounded shadow-sm p-6 hover:shadow-md transition-shadow text-left ${
            roleFilter === 'all' ? 'ring-2 ring-red-600' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Total Clients</p>
            <Home className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-slate-900">{clientsCount.all}</h3>
        </button>

        <button
          onClick={() => setRoleFilter('vip')}
          className={`bg-white rounded shadow-sm p-6 hover:shadow-md transition-shadow text-left ${
            roleFilter === 'vip' ? 'ring-2 ring-red-600' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Clients VIP</p>
            <Crown className="w-5 h-5 text-gold-600" />
          </div>
          <h3 className="text-slate-900">{clientsCount.vip}</h3>
        </button>

        <button
          onClick={() => setRoleFilter('client')}
          className={`bg-white rounded shadow-sm p-6 hover:shadow-md transition-shadow text-left ${
            roleFilter === 'client' ? 'ring-2 ring-red-600' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Clients Standards</p>
            <Home className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-slate-900">{clientsCount.client}</h3>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un client..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3>Portefeuille Clients ({filteredClients.length})</h3>
          <Button
            onClick={() => {
              setShowCreateClientModal(true);
            }}
          >
            <UserPlus className="w-5 h-5" />
            Créer un client
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Biens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Paiements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Montant investi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredClients.map((client) => {
                const clientData = getClientData(client.id);
                
                return (
                  <tr 
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client.id);
                      setShowDetailsModal(true);
                      setSelectedPropertyId(null);
                    }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{client.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1.5 text-slate-900 mb-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.isVip ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700">
                          <Crown className="w-3.5 h-3.5" />
                          VIP
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-900">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{clientData.contracts.length} bien{clientData.contracts.length > 1 ? 's' : ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const paymentStatus = getClientPaymentStatus(client.id);
                        const Icon = paymentStatus.icon;
                        
                        return (
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatus.bgColor} ${paymentStatus.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                              {paymentStatus.status === 'en-retard' && `${paymentStatus.count} en retard`}
                              {paymentStatus.status === 'en-attente' && `${paymentStatus.count} en attente`}
                              {paymentStatus.status === 'à-jour' && 'À jour'}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-green-600">
                        {formatAmount(clientData.totalInvested)}
                      </p>
                      <p className="text-xs text-slate-500">
                        sur {formatAmount(clientData.totalValue)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient(client.id);
                          setShowDetailsModal(true);
                          setSelectedPropertyId(null);
                        }}
                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Aucun client trouvé</p>
          </div>
        )}
      </div>

      {/* Modal Détails du client */}
      {showDetailsModal && currentClient && (() => {
        const clientData = getClientData(currentClient.id);
        
        // Si un bien est sélectionné, afficher ses détails
        if (selectedPropertyId) {
          const selectedProperty = properties.find(p => p.id === selectedPropertyId);
          const contract = clientData.contracts.find(c => c.propertyId === selectedPropertyId);
          
          if (!selectedProperty || !contract) return null;
          
          return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedPropertyId(null)}
                        className="p-2 hover:bg-slate-100 rounded transition-colors"
                        title="Retour à la liste des biens"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>
                      <div className="flex-1">
                        <h3 className="text-slate-900 mb-1">{selectedProperty.title}</h3>
                        <p className="text-sm text-slate-600">{selectedProperty.location}</p>
                      </div>
                      {getStatusBadge(contract.status || 'active')}
                    </div>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setSelectedClient(null);
                        setSelectedPropertyId(null);
                      }}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Stats du bien */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 rounded p-4">
                      <p className="text-sm text-slate-600 mb-1">Montant total</p>
                      <p className="font-medium text-slate-900">{formatAmount(contract.totalAmount)}</p>
                    </div>
                    <div className="bg-green-50 rounded p-4">
                      <p className="text-sm text-slate-600 mb-1">Payé</p>
                      <p className="font-medium text-green-600">{formatAmount(contract.paidAmount)}</p>
                    </div>
                    <div className="bg-red-50 rounded p-4">
                      <p className="text-sm text-slate-600 mb-1">Restant</p>
                      <p className="font-medium text-red-600">{formatAmount(contract.totalAmount - contract.paidAmount)}</p>
                    </div>
                    <div className="bg-blue-50 rounded p-4">
                      <p className="text-sm text-slate-600 mb-1">Prochain paiement</p>
                      <p className="font-medium text-slate-900">{formatDate(contract.nextPaymentDate)}</p>
                    </div>
                  </div>

                  {/* Échéancier de paiement */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Échéancier de paiement</h4>
                    <div className="bg-white rounded overflow-hidden border border-slate-200">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700">Statut</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700">Date d'échéance</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700">Montant</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700">Méthode</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700">État</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {contract.installments.map((installment) => {
                            const isPaid = installment.status === 'payé';
                            const isPending = installment.status === 'en-attente';
                            const hasProof = installment.proofUrl;
                            
                            return (
                              <tr 
                                key={installment.id}
                                className={
                                  isPaid ? 'bg-green-50/50' : 
                                  isPending ? 'bg-sand-50/50' : 
                                  'bg-red-50/50'
                                }
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    {isPaid ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : isPending ? (
                                      <Clock className="w-5 h-5 text-sand-600" />
                                    ) : (
                                      <X className="w-5 h-5 text-red-600" />
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-900">
                                  {formatDate(installment.date)}
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-900">
                                  {formatAmount(installment.amount)}
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                  {installment.method || 'Non défini'}
                                </td>
                                <td className="px-4 py-3">
                                  {getStatusBadge(installment.status)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="relative">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenActionMenu(openActionMenu === installment.id ? null : installment.id);
                                      }}
                                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                                    >
                                      <MoreVertical className="w-4 h-4 text-slate-600" />
                                    </button>
                                    
                                    {openActionMenu === installment.id && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-10"
                                          onClick={() => setOpenActionMenu(null)}
                                        />
                                        
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border border-slate-200 py-1 z-20">
                                          {hasProof && (
                                            <button
                                              onClick={() => {
                                                window.open(installment.proofUrl, '_blank');
                                                setOpenActionMenu(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                              <ExternalLink className="w-4 h-4 text-blue-600" />
                                              Voir la preuve
                                            </button>
                                          )}
                                          {!isPaid && (
                                            <button
                                              onClick={() => {
                                                if (confirm(`Confirmer le paiement de ${formatAmount(installment.amount)} du ${formatDate(installment.date)} ?`)) {
                                                  alert('Paiement marqué comme payé ! (Simulation)');
                                                  setOpenActionMenu(null);
                                                }
                                              }}
                                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                                              Marquer comme payé
                                            </button>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Documents du bien */}
                  {(() => {
                    const propertyDocuments = clientData.documents.filter(d => {
                      const docContract = contracts.find(c => c.id === d.contractId);
                      return docContract?.propertyId === selectedPropertyId;
                    });
                    
                    return propertyDocuments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Documents ({propertyDocuments.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {propertyDocuments.map((doc) => (
                            <div key={doc.id} className="bg-slate-50 rounded p-3 flex items-center gap-3 hover:bg-slate-100 transition-colors cursor-pointer">
                              <FileText className="w-8 h-8 text-red-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                                <p className="text-xs text-slate-600">{doc.size} • {formatDate(doc.date)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        }
        
        // Sinon, afficher la liste des biens du client
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={currentClient.avatar}
                      alt={currentClient.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-slate-900 mb-1">{currentClient.name}</h3>
                      <div className="flex items-center gap-2">
                        {currentClient.isVip ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700">
                            <Crown className="w-3.5 h-3.5" />
                            Client VIP
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            Client Standard
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedClient(null);
                      setSelectedPropertyId(null);
                    }}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-slate-400" />
                      <p className="text-sm text-slate-600">Biens acquis</p>
                    </div>
                    <h3 className="text-slate-900">{clientData.contracts.length}</h3>
                  </div>
                  <div className="bg-green-50 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-slate-600">Montant investi</p>
                    </div>
                    <p className="text-green-600 font-medium">{formatAmount(clientData.totalInvested)}</p>
                  </div>
                  <div className="bg-blue-50 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-slate-600">Paiements effectués</p>
                    </div>
                    <h3 className="text-slate-900">{clientData.payments.length}</h3>
                  </div>
                </div>

                {/* Informations de contact */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Informations de contact</h4>
                  <div className="bg-slate-50 rounded p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Email</p>
                        <p className="text-sm text-slate-900">{currentClient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Téléphone</p>
                        <p className="text-sm text-slate-900">{currentClient.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions rapides */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Actions rapides</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.location.href = `tel:${currentClient.phone}`;
                      }}
                    >
                      <Phone className="w-5 h-5" />
                      Appeler
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.location.href = `mailto:${currentClient.email}`;
                      }}
                    >
                      <Mail className="w-5 h-5" />
                      Envoyer un email
                    </Button>
                  </div>
                </div>

                {/* Liste des biens */}
                {clientData.properties.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-700">Biens immobiliers ({clientData.properties.length})</h4>
                      <div className="flex items-center gap-2 bg-slate-100 rounded p-1">
                        <button
                          onClick={() => setPropertiesViewMode('table')}
                          className={`p-1.5 rounded transition-colors ${
                            propertiesViewMode === 'table' 
                              ? 'bg-white text-red-600 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Vue en tableau"
                        >
                          <TableIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPropertiesViewMode('cards')}
                          className={`p-1.5 rounded transition-colors ${
                            propertiesViewMode === 'cards' 
                              ? 'bg-white text-red-600 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Vue en cartes"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {propertiesViewMode === 'table' ? (
                      <div className="bg-white rounded border border-slate-200">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Bien</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Localisation</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Prix total</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-slate-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {clientData.properties.map((property) => {
                              const contract = clientData.contracts.find(c => c.propertyId === property?.id);
                              if (!property || !contract) return null;
                              
                              return (
                                <tr 
                                  key={property.id}
                                  onClick={() => setSelectedPropertyId(property.id)}
                                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                  <td className="px-4 py-3">
                                    <p className="font-medium text-slate-900">{property.title}</p>
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {property.type}
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {property.location}
                                  </td>
                                  <td className="px-4 py-3 font-medium text-slate-900">
                                    {formatAmount(contract.totalAmount)}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="relative inline-block">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenActionMenu(openActionMenu === property.id ? null : property.id);
                                        }}
                                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                                        title="Actions"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </button>
                                      {openActionMenu === property.id && (
                                        <>
                                          <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenActionMenu(null);
                                            }}
                                          />
                                          <div className="fixed z-50 w-48 bg-white rounded-lg shadow-xl border border-slate-200" style={{ transform: 'translateX(-80%) translateY(-100%)', marginTop: '-8px' }}>
                                            <div className="py-1">
                                              <button
                                                className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedPropertyId(property.id);
                                                  setOpenActionMenu(null);
                                                }}
                                              >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Voir détails
                                              </button>
                                              <button
                                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (window.confirm(`Êtes-vous sûr de vouloir révoquer le bien "${property.title}" de ce client ?`)) {
                                                    console.log('Révoquer bien:', property.id, 'du client:', selectedClient);
                                                    // TODO: Implémenter la révocation du bien
                                                  }
                                                  setOpenActionMenu(null);
                                                }}
                                              >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Révoquer le bien
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {clientData.properties.map((property) => {
                          const contract = clientData.contracts.find(c => c.propertyId === property?.id);
                          if (!property || !contract) return null;
                          
                          return (
                            <div
                              key={property.id}
                              onClick={() => setSelectedPropertyId(property.id)}
                              className="cursor-pointer transition-transform hover:scale-[1.02]"
                            >
                              <PropertyCard
                                property={property}
                                onViewDetails={() => {}}
                                hideButton={true}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Paiement */}
      {showPaymentModal && selectedPayment && selectedContractId && (() => {
        const contract = contracts.find(c => c.id === selectedContractId);
        if (!contract) return null;
        
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={currentClient?.avatar}
                      alt={currentClient?.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-slate-900 mb-1">{currentClient?.name}</h3>
                      <div className="flex items-center gap-2">
                        {currentClient?.isVip ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700">
                            <Crown className="w-3.5 h-3.5" />
                            Client VIP
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            Client Standard
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPayment(null);
                      setSelectedContractId(null);
                    }}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Informations du paiement */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Informations du paiement</h4>
                  <div className="bg-slate-50 rounded p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Date</p>
                        <p className="text-sm text-slate-900">{formatDate(selectedPayment.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Méthode</p>
                        <p className="text-sm text-slate-900">{selectedPayment.method}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Receipt className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Montant</p>
                        <p className="text-sm text-slate-900">{formatAmount(selectedPayment.amount)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Statut</p>
                        <p className="text-sm text-slate-900">{getStatusBadge(selectedPayment.status)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations du contrat */}
                {contract && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Informations du contrat</h4>
                    <div className="bg-slate-50 rounded p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-600">Bien</p>
                          <p className="text-sm text-slate-900">{properties.find(p => p.id === contract.propertyId)?.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-600">Montant total</p>
                          <p className="text-sm text-slate-900">{formatAmount(contract.totalAmount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-600">Payé</p>
                          <p className="text-sm text-slate-900">{formatAmount(contract.paidAmount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-600">Restant</p>
                          <p className="text-sm text-slate-900">{formatAmount(contract.totalAmount - contract.paidAmount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-600">Prochain paiement</p>
                          <p className="text-sm text-slate-900">{formatDate(contract.nextPaymentDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Création de client - Multi-step */}
      {showCreateClientModal && (() => {
        const availableProperties = properties.filter(p =>
          p.title.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(propertySearchQuery.toLowerCase())
        );

        const handleNextStep = () => {
          if (createClientStep === 1 && (!newClientForm.name || !newClientForm.email || !newClientForm.phone)) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
          }
          setCreateClientStep(createClientStep + 1);
        };

        const handleFinish = () => {
          alert('Client créé avec succès ! (Simulation)');
          setShowCreateClientModal(false);
          setCreateClientStep(1);
          setNewClientForm({ name: '', email: '', phone: '', address: '', isVip: false });
          setSelectedProperties([]);
          setPropertyPaymentPlans({});
        };

        return (
          <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <UserPlus className="w-5 h-5 text-slate-600" />
                        <div>
                          <h3 className="text-slate-900">Créer un client</h3>
                          <p className="text-sm text-slate-600 mt-1">Étape {createClientStep} sur 3</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((step) => (
                          <div key={step} className={`flex-1 h-1 rounded-full transition-colors ${
                            createClientStep >= step ? 'bg-red-600' : 'bg-slate-200'
                          }`} />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowCreateClientModal(false);
                        setCreateClientStep(1);
                        setNewClientForm({ name: '', email: '', phone: '', address: '', isVip: false });
                        setSelectedProperties([]);
                        setPropertyPaymentPlans({});
                      }}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {createClientStep === 1 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-slate-700">Informations personnelles</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nom complet <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={newClientForm.name}
                            onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Jean Dupont"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={newClientForm.email}
                            onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="jean.dupont@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Téléphone <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={newClientForm.phone}
                            onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="+221 77 123 45 67"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                          <input
                            type="text"
                            value={newClientForm.address}
                            onChange={(e) => setNewClientForm({ ...newClientForm, address: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="123 Rue de la Paix, Dakar"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newClientForm.isVip}
                              onChange={(e) => setNewClientForm({ ...newClientForm, isVip: e.target.checked })}
                              className="w-4 h-4 text-red-600 bg-slate-100 border-slate-300 rounded focus:ring-red-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Client VIP</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {createClientStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-700">
                          Biens sélectionnés ({selectedProperties.length})
                        </h4>
                        <Button onClick={() => setShowPropertySelectionModal(true)}>
                          <Plus className="w-5 h-5" />
                          Ajouter un bien
                        </Button>
                      </div>

                      {selectedProperties.length === 0 ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
                          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-600 mb-4">Aucun bien sélectionné</p>
                          <Button onClick={() => setShowPropertySelectionModal(true)} variant="outline">
                            <Plus className="w-5 h-5" />
                            Ajouter un bien
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-white rounded overflow-hidden border border-slate-200">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Bien</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Localisation</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">Prix</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {selectedProperties.map((propertyId) => {
                                const property = properties.find(p => p.id === propertyId);
                                if (!property) return null;
                                
                                return (
                                  <tr key={property.id}>
                                    <td className="px-4 py-3 font-medium text-slate-900">{property.title}</td>
                                    <td className="px-4 py-3 text-slate-600">{property.type}</td>
                                    <td className="px-4 py-3 text-slate-600">{property.location}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{formatAmount(property.price)}</td>
                                    <td className="px-4 py-3 text-right">
                                      <button
                                        onClick={() => setSelectedProperties(selectedProperties.filter(id => id !== propertyId))}
                                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Retirer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {createClientStep === 3 && (
                    <div className="space-y-6">
                      <h4 className="text-sm font-medium text-slate-700">Contrats et échéanciers de paiement</h4>
                      {selectedProperties.length === 0 ? (
                        <div className="bg-slate-50 rounded-lg p-6 text-center">
                          <p className="text-slate-600">Aucun bien sélectionné</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {selectedProperties.map((propertyId) => {
                            const property = properties.find(p => p.id === propertyId);
                            if (!property) return null;
                            
                            // Initialiser le plan de paiement si nécessaire
                            if (!propertyPaymentPlans[propertyId]) {
                              setPropertyPaymentPlans({
                                ...propertyPaymentPlans,
                                [propertyId]: {
                                  months: 12,
                                  initialPaymentPaid: false,
                                  firstInstallmentPaid: false,
                                  initialPaymentProof: null,
                                  firstInstallmentProof: null,
                                }
                              });
                            }

                            const plan = propertyPaymentPlans[propertyId] || {
                              months: 12,
                              initialPaymentPaid: false,
                              firstInstallmentPaid: false,
                              initialPaymentProof: null,
                              firstInstallmentProof: null,
                            };
                            
                            const monthlyAmount = Math.round(property.price / plan.months);
                            const installments = Array.from({ length: plan.months }, (_, i) => {
                              const date = new Date();
                              date.setMonth(date.getMonth() + i + 1);
                              return {
                                id: `installment-${i + 1}`,
                                date: date.toISOString().split('T')[0],
                                amount: i === plan.months - 1 ? property.price - (monthlyAmount * (plan.months - 1)) : monthlyAmount,
                              };
                            });

                            return (
                              <div key={property.id} className="bg-slate-50 rounded-lg p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h5 className="font-medium text-slate-900">{property.title}</h5>
                                    <p className="text-sm text-slate-600 mt-1">{property.location}</p>
                                  </div>
                                  <p className="font-medium text-slate-900">{formatAmount(property.price)}</p>
                                </div>

                                {/* Sélection de la durée du plan */}
                                <div className="bg-white rounded p-4">
                                  <label className="block text-sm font-medium text-slate-700 mb-3">
                                    Durée du plan de paiement
                                  </label>
                                  <div className="grid grid-cols-3 gap-3">
                                    {[12, 24, 36].map((months) => (
                                      <button
                                        key={months}
                                        type="button"
                                        onClick={() => {
                                          setPropertyPaymentPlans({
                                            ...propertyPaymentPlans,
                                            [propertyId]: {
                                              ...plan,
                                              months: months as 12 | 24 | 36,
                                            }
                                          });
                                        }}
                                        className={`px-4 py-3 rounded border-2 transition-all text-center ${
                                          plan.months === months
                                            ? 'border-red-600 bg-red-50 text-red-700'
                                            : 'border-slate-200 hover:border-red-300 text-slate-700'
                                        }`}
                                      >
                                        <p className="font-medium">{months} mois</p>
                                        <p className="text-xs mt-1">
                                          {formatAmount(Math.round(property.price / months))}/mois
                                        </p>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Paiements initiaux */}
                                <div className="bg-white rounded p-4 space-y-4">
                                  <h6 className="text-sm font-medium text-slate-700">Paiements initiaux</h6>
                                  
                                  {/* Apport initial */}
                                  <div className="border border-slate-200 rounded p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                      <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={plan.initialPaymentPaid}
                                          onChange={(e) => {
                                            setPropertyPaymentPlans({
                                              ...propertyPaymentPlans,
                                              [propertyId]: {
                                                ...plan,
                                                initialPaymentPaid: e.target.checked,
                                              }
                                            });
                                          }}
                                          className="w-4 h-4 text-red-600 bg-slate-100 border-slate-300 rounded focus:ring-red-500"
                                        />
                                        <div>
                                          <span className="text-sm font-medium text-slate-700">
                                            Apport initial payé
                                          </span>
                                          <p className="text-xs text-slate-500 mt-0.5">
                                            Le client a effectué l'apport initial
                                          </p>
                                        </div>
                                      </label>
                                      {plan.initialPaymentPaid && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          Payé
                                        </span>
                                      )}
                                    </div>
                                    
                                    {plan.initialPaymentPaid && (
                                      <div>
                                        <label className="block text-sm text-slate-700 mb-2">
                                          Preuve de paiement
                                        </label>
                                        <div className="relative">
                                          <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0] || null;
                                              setPropertyPaymentPlans({
                                                ...propertyPaymentPlans,
                                                [propertyId]: {
                                                  ...plan,
                                                  initialPaymentProof: file,
                                                }
                                              });
                                            }}
                                            className="hidden"
                                            id={`initial-payment-proof-${propertyId}`}
                                          />
                                          <label
                                            htmlFor={`initial-payment-proof-${propertyId}`}
                                            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                                          >
                                            <Upload className="w-4 h-4 text-slate-600" />
                                            <span className="text-sm text-slate-700">
                                              {plan.initialPaymentProof 
                                                ? plan.initialPaymentProof.name 
                                                : 'Choisir un fichier'}
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Premier échéancier */}
                                  <div className="border border-slate-200 rounded p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                      <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={plan.firstInstallmentPaid}
                                          onChange={(e) => {
                                            setPropertyPaymentPlans({
                                              ...propertyPaymentPlans,
                                              [propertyId]: {
                                                ...plan,
                                                firstInstallmentPaid: e.target.checked,
                                              }
                                            });
                                          }}
                                          className="w-4 h-4 text-red-600 bg-slate-100 border-slate-300 rounded focus:ring-red-500"
                                        />
                                        <div>
                                          <span className="text-sm font-medium text-slate-700">
                                            Premier échéancier payé
                                          </span>
                                          <p className="text-xs text-slate-500 mt-0.5">
                                            Le client a payé la première mensualité
                                          </p>
                                        </div>
                                      </label>
                                      {plan.firstInstallmentPaid && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          Payé
                                        </span>
                                      )}
                                    </div>
                                    
                                    {plan.firstInstallmentPaid && (
                                      <div>
                                        <label className="block text-sm text-slate-700 mb-2">
                                          Preuve de paiement
                                        </label>
                                        <div className="relative">
                                          <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0] || null;
                                              setPropertyPaymentPlans({
                                                ...propertyPaymentPlans,
                                                [propertyId]: {
                                                  ...plan,
                                                  firstInstallmentProof: file,
                                                }
                                              });
                                            }}
                                            className="hidden"
                                            id={`first-installment-proof-${propertyId}`}
                                          />
                                          <label
                                            htmlFor={`first-installment-proof-${propertyId}`}
                                            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                                          >
                                            <Upload className="w-4 h-4 text-slate-600" />
                                            <span className="text-sm text-slate-700">
                                              {plan.firstInstallmentProof 
                                                ? plan.firstInstallmentProof.name 
                                                : 'Choisir un fichier'}
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Échéancier de paiement */}
                                <div className="bg-white rounded p-4">
                                  <p className="text-sm font-medium text-slate-700 mb-3">
                                    Échéancier de paiement ({plan.months} mois)
                                  </p>
                                  <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {installments.map((installment, index) => (
                                      <div key={installment.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded text-sm">
                                        <div>
                                          <span className="font-medium text-slate-900">Échéance {index + 1}</span>
                                          <span className="text-slate-600 ml-2">• {formatDate(installment.date)}</span>
                                        </div>
                                        <span className="font-medium text-slate-900">{formatAmount(installment.amount)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="bg-blue-50 rounded p-4">
                                  <p className="text-sm text-blue-900">
                                    <strong>Note :</strong> Un contrat sera généré automatiquement avec cet échéancier de paiement.
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div>
                      {createClientStep > 1 && (
                        <Button variant="outline" onClick={() => setCreateClientStep(createClientStep - 1)}>
                          Précédent
                        </Button>
                      )}
                    </div>
                    <div>
                      {createClientStep < 3 ? (
                        <Button onClick={handleNextStep}>Suivant</Button>
                      ) : (
                        <Button onClick={handleFinish}>Créer le client</Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showPropertySelectionModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-slate-900 mb-2">Sélectionner un bien</h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={propertySearchQuery}
                            onChange={(e) => setPropertySearchQuery(e.target.value)}
                            placeholder="Rechercher un bien..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowPropertySelectionModal(false);
                          setPropertySearchQuery('');
                        }}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableProperties.map((property) => {
                        const isSelected = selectedProperties.includes(property.id);
                        
                        return (
                          <button
                            key={property.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedProperties(selectedProperties.filter(id => id !== property.id));
                              } else {
                                setSelectedProperties([...selectedProperties, property.id]);
                              }
                            }}
                            className={`p-4 rounded border-2 transition-all text-left ${
                              isSelected 
                                ? 'border-red-600 bg-red-50' 
                                : 'border-slate-200 hover:border-red-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">{property.title}</p>
                                <p className="text-sm text-slate-600 mt-1">{property.location}</p>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                              <span className="text-sm text-slate-600">{property.type}</span>
                              <span className="font-medium text-slate-900">{formatAmount(property.price)}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {availableProperties.length === 0 && (
                      <div className="text-center py-12">
                        <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">Aucun bien trouvé</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      {selectedProperties.length} bien{selectedProperties.length > 1 ? 's' : ''} sélectionné{selectedProperties.length > 1 ? 's' : ''}
                    </p>
                    <Button
                      onClick={() => {
                        setShowPropertySelectionModal(false);
                        setPropertySearchQuery('');
                      }}
                    >
                      Valider
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}