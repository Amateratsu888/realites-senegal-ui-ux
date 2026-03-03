import React, { useState } from 'react';
import { Search, Filter, UserPlus, Phone, Mail, Calendar, CheckCircle2, Eye, MoreVertical, Crown, Building2, UserCheck, X } from 'lucide-react';
import { Button } from '../Button';
import { leads, properties } from '../../data/mockData';
import { LeadStatus, LeadRequestType } from '../../types';

export function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<LeadRequestType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCreateAccessModal, setShowCreateAccessModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesType = typeFilter === 'all' || lead.requestType === typeFilter;
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusInfo = (status: LeadStatus) => {
    const statusConfig = {
      'nouveau': { label: 'Nouveau', color: 'bg-blue-100 text-blue-700' },
      'en-cours': { label: 'En cours', color: 'bg-sand-100 text-sand-700' },
      'gagné': { label: 'Gagné', color: 'bg-green-100 text-green-700' },
      'perdu': { label: 'Perdu', color: 'bg-slate-100 text-slate-700' },
    };
    return statusConfig[status];
  };

  const getTypeInfo = (type?: LeadRequestType) => {
    if (type === 'demande-vip') {
      return { label: 'Demande VIP', icon: Crown, color: 'text-gold-600' };
    }
    return { label: 'Demande de bien', icon: Building2, color: 'text-slate-600' };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const statusCounts = {
    all: leads.length,
    nouveau: leads.filter(l => l.status === 'nouveau').length,
    'en-cours': leads.filter(l => l.status === 'en-cours').length,
    gagné: leads.filter(l => l.status === 'gagné').length,
    perdu: leads.filter(l => l.status === 'perdu').length,
  };

  const typeCounts = {
    all: leads.length,
    'demande-bien': leads.filter(l => l.requestType === 'demande-bien').length,
    'demande-vip': leads.filter(l => l.requestType === 'demande-vip').length,
  };

  const handleChangeStatus = (leadId: string, newStatus: LeadStatus) => {
    // Ici, dans une vraie app, on mettrait à jour la base de données
    console.log(`Changement du statut de ${leadId} vers ${newStatus}`);
    setShowStatusModal(false);
    setSelectedLead(null);
  };

  const handleCreateAccess = (leadId: string, role: 'client' | 'vip') => {
    // Ici, dans une vraie app, on créerait le compte utilisateur
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      console.log(`Création d'un compte ${role} pour ${lead.name} (${lead.email})`);
      // Afficher un message de succès
      alert(`Compte ${role} créé avec succès pour ${lead.name}\nEmail: ${lead.email}\nMot de passe temporaire envoyé par email.`);
    }
    setShowCreateAccessModal(false);
    setSelectedLead(null);
  };

  const currentLead = selectedLead ? leads.find(l => l.id === selectedLead) : null;

  return (
    <div className="space-y-6">
      {/* Stats par statut */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as LeadStatus | 'all')}
            className={`bg-white rounded shadow-sm p-4 hover:shadow-md transition-shadow text-left ${
              statusFilter === status ? 'ring-2 ring-red-600' : ''
            }`}
          >
            <p className="text-sm text-slate-600 mb-1 capitalize">
              {status === 'all' ? 'Toutes' : status === 'en-cours' ? 'En cours' : status}
            </p>
            <h3 className="text-slate-900">{count}</h3>
          </button>
        ))}
      </div>

      {/* Stats par type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(typeCounts).map(([type, count]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type as LeadRequestType | 'all')}
            className={`bg-white rounded shadow-sm p-4 hover:shadow-md transition-shadow text-left ${
              typeFilter === type ? 'ring-2 ring-red-600' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {type === 'demande-vip' ? (
                <Crown className="w-5 h-5 text-gold-600" />
              ) : type === 'demande-bien' ? (
                <Building2 className="w-5 h-5 text-slate-600" />
              ) : (
                <Filter className="w-5 h-5 text-slate-600" />
              )}
              <p className="text-sm text-slate-600">
                {type === 'all' ? 'Toutes les demandes' : type === 'demande-vip' ? 'Demandes VIP' : 'Demandes de biens'}
              </p>
            </div>
            <h3 className="text-slate-900">{count}</h3>
          </button>
        ))}
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
              placeholder="Rechercher un prospect..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3>Demandes ({filteredLeads.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Prospect
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Bien concerné
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Assigné à
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredLeads.map((lead) => {
                const property = lead.propertyId ? properties.find(p => p.id === lead.propertyId) : null;
                const statusInfo = getStatusInfo(lead.status);
                const typeInfo = getTypeInfo(lead.requestType);
                const TypeIcon = typeInfo.icon;

                return (
                  <tr 
                    key={lead.id} 
                    onClick={() => {
                      setSelectedLead(lead.id);
                      setShowDetailsModal(true);
                    }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 ${typeInfo.color}`}>
                        <TypeIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{typeInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white">{lead.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1.5 text-slate-900 mb-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {property ? (
                        <div className="text-sm">
                          <p className="text-slate-900 font-medium">{property.title}</p>
                          <p className="text-slate-600">{property.location}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{formatDate(lead.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.assignedTo ? (
                        <div className="flex items-center gap-2 text-sm">
                          <UserPlus className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900">{lead.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead.id);
                          setShowDetailsModal(true);
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

        {filteredLeads.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Aucune demande trouvée</p>
          </div>
        )}
      </div>

      {/* Modal Détails de la demande */}
      {showDetailsModal && currentLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl">{currentLead.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">{currentLead.name}</h3>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const typeInfo = getTypeInfo(currentLead.requestType);
                        const TypeIcon = typeInfo.icon;
                        return (
                          <div className={`flex items-center gap-1 ${typeInfo.color}`}>
                            <TypeIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{typeInfo.label}</span>
                          </div>
                        );
                      })()}
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusInfo(currentLead.status).color}`}>
                        {getStatusInfo(currentLead.status).label}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedLead(null);
                  }}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Informations de contact */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Informations de contact</h4>
                <div className="bg-slate-50 rounded p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Email</p>
                      <p className="text-sm text-slate-900">{currentLead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Téléphone</p>
                      <p className="text-sm text-slate-900">{currentLead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Date de la demande</p>
                      <p className="text-sm text-slate-900">{formatDate(currentLead.createdAt)}</p>
                    </div>
                  </div>
                  {currentLead.assignedTo && (
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Assigné à</p>
                        <p className="text-sm text-slate-900">{currentLead.assignedTo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bien concerné */}
              {currentLead.propertyId && (() => {
                const property = properties.find(p => p.id === currentLead.propertyId);
                return property ? (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Bien concerné</h4>
                    <div className="bg-slate-50 rounded p-4">
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">{property.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{property.location}</p>
                          <p className="text-sm text-red-600 font-medium mt-2">
                            {property.price.toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Message */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Message</h4>
                <div className="bg-slate-50 rounded p-4">
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{currentLead.message}</p>
                </div>
              </div>

              {/* Actions principales */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Actions rapides</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      window.location.href = `tel:${currentLead.phone}`;
                    }}
                  >
                  
                    
                    Assigner ce bien
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      window.location.href = `mailto:${currentLead.email}`;
                    }}
                  >
                    <Mail className="w-5 h-5" />
                    Envoyer un email
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowStatusModal(true);
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Changer le statut
                  </Button>
                  {currentLead.status !== 'gagné' && (
                    <Button
                      className="justify-start"
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowCreateAccessModal(true);
                      }}
                    >
                      {currentLead.requestType === 'demande-vip' ? (
                        <>
                          <Crown className="w-5 h-5" />
                          Promouvoir en VIP
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-5 h-5" />
                          Créer un compte
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Changement de statut */}
      {showStatusModal && currentLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900">Changer le statut</h3>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedLead(null);
                }}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-2">Demande de : <span className="font-medium text-slate-900">{currentLead.name}</span></p>
              <p className="text-sm text-slate-600">Statut actuel : <span className={`font-medium ${getStatusInfo(currentLead.status).color}`}>{getStatusInfo(currentLead.status).label}</span></p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 mb-2">Nouveau statut :</p>
              {(['nouveau', 'en-cours', 'gagné', 'perdu'] as LeadStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleChangeStatus(currentLead.id, status)}
                  className={`w-full text-left px-4 py-3 rounded border-2 transition-colors ${
                    currentLead.status === status
                      ? 'border-red-600 bg-red-50'
                      : 'border-slate-200 hover:border-red-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(status).color}`}>
                    {getStatusInfo(status).label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Créer accès */}
      {showCreateAccessModal && currentLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900">
                {currentLead.requestType === 'demande-vip' 
                  ? 'Promouvoir en VIP'
                  : 'Créer un accès utilisateur'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateAccessModal(false);
                  setSelectedLead(null);
                }}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-slate-50 rounded">
              <p className="text-sm font-medium text-slate-900 mb-2">{currentLead.name}</p>
              <p className="text-sm text-slate-600 mb-1">{currentLead.email}</p>
              <p className="text-sm text-slate-600">{currentLead.phone}</p>
            </div>

            {currentLead.requestType === 'demande-vip' ? (
              // Pour les demandes VIP - afficher un message d'information et le bouton principal
              <>
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 mb-1">Demande de statut VIP</p>
                      <p className="text-xs text-amber-800">
                        Ce prospect souhaite bénéficier du statut VIP pour accéder aux biens exclusifs et aux avantages premium.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start bg-amber-600 hover:bg-amber-700"
                    onClick={() => handleCreateAccess(currentLead.id, 'vip')}
                  >
                    <Crown className="w-5 h-5" />
                    Créer un compte VIP
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleCreateAccess(currentLead.id, 'client')}
                  >
                    <UserPlus className="w-5 h-5" />
                    Créer un compte Client standard
                  </Button>
                </div>
              </>
            ) : (
              // Pour les demandes de biens normales
              <>
                <div className="mb-6">
                  <p className="text-sm text-slate-700 mb-4">
                    Choisissez le type de compte à créer pour ce prospect :
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    onClick={() => handleCreateAccess(currentLead.id, 'client')}
                  >
                    <UserPlus className="w-5 h-5" />
                    Créer un compte Client
                  </Button>
                  <Button
                    className="w-full justify-start bg-amber-600 hover:bg-amber-700"
                    onClick={() => handleCreateAccess(currentLead.id, 'vip')}
                  >
                    <Crown className="w-5 h-5" />
                    Créer un compte VIP
                  </Button>
                </div>
              </>
            )}

            <p className="text-xs text-slate-500 mt-4 text-center">
              Un email avec les identifiants sera envoyé automatiquement au prospect.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}