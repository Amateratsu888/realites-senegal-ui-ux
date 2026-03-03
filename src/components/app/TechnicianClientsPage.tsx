import React, { useState } from 'react';
import { Crown, Mail, Phone, Search, UserCircle, Star, CheckCircle, MoreVertical, X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '../Button';
import { User } from '../../types';
import { technicianClients } from '../../data/mockData';

interface ClientDetailsModalProps {
  client: User;
  onClose: () => void;
  onToggleVip: () => void;
}

function ClientDetailsModal({ client, onClose, onToggleVip }: ClientDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-slate-900">Détails du client</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={client.avatar}
                alt={client.name}
                className="w-20 h-20 rounded-full"
              />
              {client.role === 'vip' && (
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-medium text-slate-900">{client.name}</h4>
              {client.role === 'vip' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm mt-2">
                  <Crown className="w-4 h-4" />
                  Client VIP
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm mt-2">
                  Client standard
                </span>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Informations de contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <Mail className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm text-slate-900 truncate">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <Phone className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Téléphone</p>
                  <p className="text-sm text-slate-900">{client.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* VIP Status Section */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="font-medium text-slate-900 mb-4">Gestion du statut</h4>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    {client.role === 'vip' ? 'Ce client bénéficie du statut VIP' : 'Promouvoir ce client en VIP'}
                  </p>
                  <p className="text-xs text-amber-800 mt-1">
                    {client.role === 'vip' 
                      ? 'Accès aux biens exclusifs, support prioritaire et conditions préférentielles.'
                      : 'Le client aura accès aux biens exclusifs et aux avantages premium.'}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant={client.role === 'vip' ? 'outline' : 'primary'}
              onClick={onToggleVip}
              className="w-full"
            >
              {client.role === 'vip' ? (
                <>
                  <ArrowDownCircle className="w-4 h-4 mr-2" />
                  Retirer le statut VIP
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-4 h-4 mr-2" />
                  Promouvoir en VIP
                </>
              )}
            </Button>
          </div>

          {/* Activity Stats (placeholder) */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="font-medium text-slate-900 mb-4">Activité</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-medium text-slate-900">3</p>
                <p className="text-xs text-slate-600 mt-1">Demandes</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-medium text-slate-900">1</p>
                <p className="text-xs text-slate-600 mt-1">Bien acquis</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-medium text-slate-900">5</p>
                <p className="text-xs text-slate-600 mt-1">Visites</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TechnicianClientsPage() {
  const [clients, setClients] = useState<User[]>(technicianClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'client' | 'vip'>('all');
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleToggleVipStatus = (userId: string) => {
    const user = clients.find(u => u.id === userId);
    if (!user) return;

    const isCurrentlyVip = user.role === 'vip';
    const action = isCurrentlyVip ? 'retirer le statut VIP' : 'promouvoir au statut VIP';
    
    if (confirm(`Voulez-vous ${action} pour ${user.name} ?`)) {
      setClients(clients.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            role: isCurrentlyVip ? 'client' : 'vip',
            isVip: !isCurrentlyVip,
          };
        }
        return u;
      }));
      
      const message = isCurrentlyVip 
        ? `${user.name} a été rétrogradé(e) au statut client standard`
        : `${user.name} a été promu(e) au statut VIP ! Il aura désormais accès aux biens exclusifs.`;
      
      alert(message);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || client.role === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clients.length,
    vips: clients.filter(c => c.role === 'vip').length,
    standard: clients.filter(c => c.role === 'client').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900">Mes clients</h2>
        <p className="text-sm text-slate-600 mt-1">
          Gérez vos clients et leur statut VIP
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total clients</p>
              <p className="text-2xl font-medium text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCircle className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Clients VIP</p>
              <p className="text-2xl font-medium text-amber-700 mt-1">{stats.vips}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Crown className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Clients standard</p>
              <p className="text-2xl font-medium text-slate-700 mt-1">{stats.standard}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <UserCircle className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="vip">Clients VIP</option>
            <option value="client">Clients standard</option>
          </select>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Gestion du statut VIP</p>
            <p className="text-xs text-amber-800 mt-1">
              Vous pouvez promouvoir vos clients au statut VIP pour leur donner accès aux biens exclusifs et aux avantages premium.
              Le changement de statut est immédiat.
            </p>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Client</th>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Contact</th>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Statut</th>
                <th className="text-right px-6 py-4 text-sm text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Aucun client trouvé
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={client.avatar} 
                            alt={client.name}
                            className="w-10 h-10 rounded-full"
                          />
                          {client.role === 'vip' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-slate-900 font-medium">{client.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.role === 'vip' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm">
                          <Crown className="w-4 h-4" />
                          Client VIP
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                          Client standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClient(client);
                          }}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <UserCircle className="w-5 h-5" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(activeMenu === client.id ? null : client.id);
                            }}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Plus d'actions"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          {/* Dropdown menu */}
                          {activeMenu === client.id && (
                            <div 
                              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                  setSelectedClient(client);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <UserCircle className="w-4 h-4" />
                                Voir les détails
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                  handleToggleVipStatus(client.id);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                              >
                                {client.role === 'vip' ? (
                                  <>
                                    <ArrowDownCircle className="w-4 h-4 text-slate-600" />
                                    <span className="text-slate-700">Retirer le statut VIP</span>
                                  </>
                                ) : (
                                  <>
                                    <Crown className="w-4 h-4 text-amber-600" />
                                    <span className="text-amber-700">Promouvoir en VIP</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onToggleVip={() => {
            handleToggleVipStatus(selectedClient.id);
            setSelectedClient(null);
          }}
        />
      )}

      {/* VIP Benefits Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-slate-900 mb-4">Avantages du statut VIP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Biens exclusifs</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Accès à tous les biens du catalogue, y compris les propriétés VIP exclusives
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Support prioritaire</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Réservation d'appels et traitement prioritaire des demandes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Espace VIP dédié</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Interface avec avantages et offres personnalisées
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Conditions préférentielles</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Options de financement et négociation avantageuses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}