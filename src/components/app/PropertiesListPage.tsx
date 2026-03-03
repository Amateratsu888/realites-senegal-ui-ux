import React, { useState } from 'react';
import { Search, MapPin, Home, Maximize, Crown, Plus, Filter, MoreVertical, Edit, Trash2, X, Upload, Image as ImageIcon, CreditCard, Save, TrendingUp } from 'lucide-react';
import { properties, contracts, technicianClients, bankAccounts } from '../../data/mockData';
import { vefaProjects } from '../../data/vefaData';
import { Property, PaymentPlan } from '../../types';
import { Button } from '../Button';

export function PropertiesListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<Property['type'] | 'all' | 'vefa'>('all');
  const [statusFilter, setStatusFilter] = useState<Property['status'] | 'all'>('all');
  const [vipFilter, setVipFilter] = useState<'all' | 'vip' | 'standard'>('all');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditPaymentForm, setShowEditPaymentForm] = useState(false);
  const [showCreatePaymentForm, setShowCreatePaymentForm] = useState(false);
  const [newPlan, setNewPlan] = useState({ duration: 12, downPayment: 0, monthlyPayment: 0 });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState<Property | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('');
  const [createOwnerId, setCreateOwnerId] = useState<string>('');
  const [ownerSearchQuery, setOwnerSearchQuery] = useState<string>('');
  const [showOwnerDropdown, setShowOwnerDropdown] = useState<boolean>(false);
  const [createOwnerSearchQuery, setCreateOwnerSearchQuery] = useState<string>('');
  const [showCreateOwnerDropdown, setShowCreateOwnerDropdown] = useState<boolean>(false);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>('');
  const [createForm, setCreateForm] = useState<Property>({
    id: '',
    type: 'villa',
    title: '',
    location: '',
    price: 0,
    surface: 0,
    description: '',
    images: [],
    status: 'disponible',
    featured: false,
    financingOptions: [],
    vipOnly: false,
  });

  // Fonction pour trouver le client propriétaire d'un bien
  const getPropertyOwner = (propertyId: string) => {
    const contract = contracts.find(c => c.propertyId === propertyId);
    if (!contract) return null;
    return technicianClients.find(client => client.id === contract.userId);
  };

  // Fonction pour filtrer les clients selon la recherche
  const filterClients = (searchQuery: string) => {
    if (!searchQuery.trim()) return technicianClients;
    
    const query = searchQuery.toLowerCase();
    return technicianClients.filter(client => 
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query)
    );
  };

  // Fonction pour obtenir les comptes bancaires actifs
  const getActiveBankAccounts = () => {
    return bankAccounts.filter(account => account.isActive && account.paymentMethods.includes('virement-bancaire'));
  };

  // Fonction pour obtenir les 5 premiers chiffres de l'IBAN
  const getIbanPreview = (iban?: string) => {
    if (!iban) return 'N/A';
    return iban.substring(0, 5);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: Property['type'] | 'vefa') => {
    const labels: Record<string, string> = {
      villa: 'Villa',
      appartement: 'Appartement',
      terrain: 'Terrain',
      'espace-commercial': 'Espace commercial',
      vefa: 'VEFA',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: Property['status']) => {
    const labels = {
      disponible: 'Disponible',
      réservé: 'Réservé',
      vendu: 'Vendu',
    };
    return labels[status];
  };

  const getStatusColor = (status: Property['status']) => {
    const colors = {
      disponible: 'bg-green-100 text-green-700',
      réservé: 'bg-yellow-100 text-yellow-700',
      vendu: 'bg-slate-100 text-slate-700',
    };
    return colors[status];
  };

  const filteredProperties = properties.filter(property => {
    // Exclure les propriétés classiques si on filtre par VEFA
    if (typeFilter === 'vefa') return false;
    
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getPropertyTypeLabel(property.type).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesVip = vipFilter === 'all' || (vipFilter === 'vip' && property.vipOnly) || (vipFilter === 'standard' && !property.vipOnly);
    
    return matchesSearch && matchesType && matchesStatus && matchesVip;
  });

  // Filtrer les projets VEFA en planification (pas encore débutés)
  const filteredVEFAProjects = vefaProjects.filter(vefa => {
    // Seulement les VEFA en planification (pas encore débutés)
    if (vefa.status !== 'planification') return false;
    
    // Seulement si on filtre par VEFA ou par tous
    if (typeFilter !== 'vefa' && typeFilter !== 'all') return false;
    
    const matchesSearch = 
      vefa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vefa.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vefa.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Nombre total d'éléments filtrés
  const totalFilteredItems = filteredProperties.length + filteredVEFAProjects.length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Catalogue des biens</h2>
          <p className="text-slate-600">Tous les biens immobiliers disponibles</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5" />
          Créer un bien
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded shadow-sm p-6">
        <div className="flex items-center gap-6">
          {/* Filters on the left */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-500">Filtres</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as Property['type'] | 'all')}
                className="w-32 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Tous</option>
                <option value="villa">Villa</option>
                <option value="appartement">Appartement</option>
                <option value="terrain">Terrain</option>
                <option value="espace-commercial">Espace commercial</option>
                <option value="vefa">VEFA</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Statut:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Property['status'] | 'all')}
                className="w-32 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Tous</option>
                <option value="disponible">Disponible</option>
                <option value="réservé">Réservé</option>
                <option value="vendu">Vendu</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">VIP:</span>
              <select
                value={vipFilter}
                onChange={(e) => setVipFilter(e.target.value as 'all' | 'vip' | 'standard')}
                className="w-32 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Tous</option>
                <option value="vip">VIP</option>
                <option value="standard">Standard</option>
              </select>
            </div>
          </div>

          {/* Search on the right */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, localisation ou type..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3>Tous les biens ({totalFilteredItems})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Bien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Surface
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredProperties.map((property) => (
                <tr 
                  key={property.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={(e) => {
                    // Éviter d'ouvrir le modal si on clique sur le bouton actions
                    if ((e.target as HTMLElement).closest('button')) return;
                    setSelectedProperty(property);
                    setEditForm(property);
                    // Trouver le client propriétaire actuel
                    const contract = contracts.find(c => c.propertyId === property.id);
                    setSelectedOwnerId(contract?.userId || '');
                    setShowEditModal(true);
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{property.title}</p>
                        {property.vipOnly && (
                          <div className="flex items-center gap-1 mt-1">
                            <Crown className="w-3 h-3 text-yellow-600" />
                            <span className="text-xs text-yellow-700">Exclusivité VIP</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      {getPropertyTypeLabel(property.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{property.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-4 h-4" />
                        <span>{property.surface} m²</span>
                      </div>
                      {property.bedrooms && (
                        <div className="flex items-center gap-1.5">
                          <Home className="w-4 h-4" />
                          <span>{property.bedrooms} ch.</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{formatPrice(property.price)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const owner = getPropertyOwner(property.id);
                      if (owner) {
                        return (
                          <div className="flex items-center gap-2">
                            <img 
                              src={owner.avatar} 
                              alt={owner.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-900">{owner.name}</span>
                              {owner.isVip && (
                                <span className="flex items-center gap-1 text-xs text-yellow-700">
                                  <Crown className="w-3 h-3" />
                                  VIP
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return <span className="text-sm text-slate-400 italic">Non assigné</span>;
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenActionMenu(openActionMenu === property.id ? null : property.id)}
                        className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {openActionMenu === property.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenActionMenu(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border border-slate-200 z-20">
                            <div className="py-1">
                              <button
                                className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                onClick={() => {
                                  // Handle edit action
                                  console.log('Modifier bien:', property.id);
                                  setOpenActionMenu(null);
                                  setSelectedProperty(property);
                                  setEditForm(property);
                                  // Trouver le client propriétaire actuel
                                  const contract = contracts.find(c => c.propertyId === property.id);
                                  setSelectedOwnerId(contract?.userId || '');
                                  setShowEditModal(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </button>
                              <button
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                onClick={() => {
                                  // Handle delete action
                                  console.log('Supprimer bien:', property.id);
                                  setOpenActionMenu(null);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* VEFA Projects */}
              {filteredVEFAProjects.map((vefa) => (
                <tr 
                  key={vefa.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer bg-amber-50/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-8 h-8 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{vefa.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Projet VEFA</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                      VEFA
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{vefa.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Home className="w-4 h-4" />
                        <span>{vefa.totalUnits} unités</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{formatPrice(vefa.totalBudget)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      Planification
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{vefa.ownerName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenActionMenu(openActionMenu === vefa.id ? null : vefa.id)}
                        className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {openActionMenu === vefa.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenActionMenu(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border border-slate-200 z-20">
                            <div className="py-1">
                              <button
                                className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                onClick={() => {
                                  console.log('Modifier VEFA:', vefa.id);
                                  setOpenActionMenu(null);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </button>
                              <button
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                onClick={() => {
                                  console.log('Supprimer VEFA:', vefa.id);
                                  setOpenActionMenu(null);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProperties.length === 0 && filteredVEFAProjects.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-slate-500">Aucun bien trouvé</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedProperty && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="mb-1">Modifier le bien</h3>
                <p className="text-sm text-slate-600">ID: {selectedProperty.id}</p>
              </div>
              <button
                className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                onClick={() => {
                  setShowEditModal(false);
                  setOwnerSearchQuery('');
                  setShowOwnerDropdown(false);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-6">
                {/* Informations générales */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Informations générales</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Localisation</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                      <select
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Property['type'] })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="villa">Villa</option>
                        <option value="appartement">Appartement</option>
                        <option value="terrain">Terrain</option>
                        <option value="espace-commercial">Espace commercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                      <select
                        value={editForm.category || 'vente'}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value as Property['category'] })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="vente">Vente</option>
                        <option value="location-vente">Location-vente</option>
                        <option value="location">Location</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Property['status'] })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="disponible">Disponible</option>
                        <option value="réservé">Réservé</option>
                        <option value="vendu">Vendu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Accès</label>
                      <select
                        value={editForm.vipOnly ? 'vip' : 'standard'}
                        onChange={(e) => setEditForm({ ...editForm, vipOnly: e.target.value === 'vip' })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="standard">Standard</option>
                        <option value="vip">VIP uniquement</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Client propriétaire</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={ownerSearchQuery}
                          onChange={(e) => {
                            setOwnerSearchQuery(e.target.value);
                            setShowOwnerDropdown(true);
                          }}
                          onFocus={() => setShowOwnerDropdown(true)}
                          placeholder="Rechercher par nom, email ou téléphone..."
                          className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {showOwnerDropdown && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowOwnerDropdown(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded shadow-lg max-h-60 overflow-y-auto z-20">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOwnerId('');
                                  setOwnerSearchQuery('');
                                  setShowOwnerDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors border-b border-slate-200"
                              >
                                <span className="text-sm text-slate-500 italic">Non assigné</span>
                              </button>
                              {filterClients(ownerSearchQuery).map((client) => (
                                <button
                                  key={client.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedOwnerId(client.id);
                                    setOwnerSearchQuery('');
                                    setShowOwnerDropdown(false);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-b-0"
                                >
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={client.avatar} 
                                      alt={client.name}
                                      className="w-8 h-8 rounded-full flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-900">{client.name}</p>
                                        {client.isVip && (
                                          <span className="flex items-center gap-1 text-xs text-yellow-700">
                                            <Crown className="w-3 h-3" />
                                            VIP
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-600">{client.email}</p>
                                      <p className="text-xs text-slate-500">{client.phone}</p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                              {filterClients(ownerSearchQuery).length === 0 && (
                                <div className="px-3 py-4 text-center text-sm text-slate-500">
                                  Aucun client trouvé
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {selectedOwnerId && (() => {
                        const owner = technicianClients.find(c => c.id === selectedOwnerId);
                        return owner ? (
                          <div className="mt-2 flex items-center justify-between gap-2 p-2 bg-slate-50 rounded">
                            <div className="flex items-center gap-2">
                              <img 
                                src={owner.avatar} 
                                alt={owner.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-900">{owner.name}</p>
                                  {owner.isVip && (
                                    <span className="flex items-center gap-1 text-xs text-yellow-700">
                                      <Crown className="w-3 h-3" />
                                      VIP
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600">{owner.email}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOwnerId('');
                                setOwnerSearchQuery('');
                              }}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                              title="Retirer le client"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    <div className="col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editForm.featured}
                          onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                          className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Bien en vedette</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Description</h4>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Description détaillée du bien..."
                  />
                </div>

                {/* Caractéristiques */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Caractéristiques</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Surface (m²)</label>
                      <input
                        type="number"
                        value={editForm.surface}
                        onChange={(e) => setEditForm({ ...editForm, surface: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Prix (FCFA)</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Chambres</label>
                      <input
                        type="number"
                        value={editForm.bedrooms || ''}
                        onChange={(e) => setEditForm({ ...editForm, bedrooms: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nombre de chambres"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Salles de bain</label>
                      <input
                        type="number"
                        value={editForm.bathrooms || ''}
                        onChange={(e) => setEditForm({ ...editForm, bathrooms: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nombre de salles de bain"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Niveau</label>
                      <input
                        type="text"
                        value={editForm.groundLevel || ''}
                        onChange={(e) => setEditForm({ ...editForm, groundLevel: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Ex: R+1, R+2..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Étage</label>
                      <input
                        type="text"
                        value={editForm.floor || ''}
                        onChange={(e) => setEditForm({ ...editForm, floor: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Ex: 3ème étage"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Places de garage</label>
                      <input
                        type="number"
                        value={editForm.garageSpaces || ''}
                        onChange={(e) => setEditForm({ ...editForm, garageSpaces: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nombre de places"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Places de parking</label>
                      <input
                        type="number"
                        value={editForm.parking || ''}
                        onChange={(e) => setEditForm({ ...editForm, parking: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nombre de places"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editForm.guestToilet || false}
                          onChange={(e) => setEditForm({ ...editForm, guestToilet: e.target.checked })}
                          className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Toilettes invités</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Coordonnées GPS */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Localisation GPS (optionnel)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={editForm.coordinates?.lat || ''}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          coordinates: { 
                            ...editForm.coordinates, 
                            lat: e.target.value ? parseFloat(e.target.value) : 0,
                            lng: editForm.coordinates?.lng || 0
                          } 
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Ex: 14.7167"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={editForm.coordinates?.lng || ''}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          coordinates: { 
                            lat: editForm.coordinates?.lat || 0,
                            lng: e.target.value ? parseFloat(e.target.value) : 0
                          } 
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Ex: -17.4933"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Images</h4>
                  
                  {/* Aperçu des images existantes */}
                  {editForm.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {editForm.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = editForm.images.filter((_, i) => i !== index);
                              setEditForm({ ...editForm, images: newImages });
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Supprimer cette image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bouton pour uploader de nouvelles images */}
                  <div className="border-2 border-dashed border-slate-300 rounded p-6 text-center hover:border-red-500 transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        // Convertir les fichiers en URLs temporaires pour l'aperçu
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const imageUrl = event.target?.result as string;
                            setEditForm({ 
                              ...editForm, 
                              images: [...editForm.images, imageUrl] 
                            });
                          };
                          reader.readAsDataURL(file);
                        });
                        // Réinitialiser l'input pour permettre de re-sélectionner le même fichier
                        e.target.value = '';
                      }}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Cliquez pour ajouter des images
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          PNG, JPG jusqu'à 10MB (plusieurs fichiers acceptés)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Équipements */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Équipements (séparés par des virgules)</h4>
                  <input
                    type="text"
                    value={editForm.amenities?.join(', ') || ''}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      amenities: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ex: Piscine, Jardin, Terrasse, Climatisation..."
                  />
                </div>

                {/* Plans de financement */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-slate-900">Plans de financement</h4>
                    <Button
                      type="button"
                      onClick={() => {
                        if (showEditPaymentForm) {
                          setShowEditPaymentForm(false);
                          setNewPlan({ duration: 12, downPayment: 0, monthlyPayment: 0 });
                        } else {
                          setShowEditPaymentForm(true);
                        }
                      }}
                      variant="outline"
                      size="sm"
                    >
                      {showEditPaymentForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {showEditPaymentForm ? 'Annuler' : 'Ajouter un plan'}
                    </Button>
                  </div>
                  
                  {/* Formulaire d'ajout */}
                  {showEditPaymentForm && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="text-sm font-medium text-slate-900 mb-3">Nouveau plan de financement</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Nombre de mois <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={newPlan.duration}
                            onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            placeholder="12"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Paiement initial (FCFA) <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="100000"
                            value={newPlan.downPayment}
                            onChange={(e) => setNewPlan({ ...newPlan, downPayment: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            placeholder="20000000"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Mensualité (FCFA) <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="10000"
                            value={newPlan.monthlyPayment}
                            onChange={(e) => setNewPlan({ ...newPlan, monthlyPayment: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            placeholder="5000000"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (newPlan.duration > 0 && newPlan.downPayment >= 0 && newPlan.monthlyPayment > 0) {
                              const plan: PaymentPlan = {
                                id: `plan-${Date.now()}`,
                                duration: newPlan.duration,
                                totalPrice: newPlan.downPayment + (newPlan.monthlyPayment * newPlan.duration),
                                downPayment: newPlan.downPayment,
                                monthlyPayment: newPlan.monthlyPayment,
                                name: `Plan ${newPlan.duration} mois`,
                              };
                              setEditForm({
                                ...editForm,
                                paymentPlans: [...(editForm.paymentPlans || []), plan],
                              });
                              setNewPlan({ duration: 12, downPayment: 0, monthlyPayment: 0 });
                              setShowEditPaymentForm(false);
                            }
                          }}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Liste des plans existants */}
                  {editForm.paymentPlans && editForm.paymentPlans.length > 0 ? (
                    <div className="space-y-2">
                      {editForm.paymentPlans.map((plan, index) => (
                        <div
                          key={plan.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              Plan {plan.duration} mois
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              Apport: {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'XOF',
                                minimumFractionDigits: 0,
                              }).format(plan.downPayment)} • 
                              Mensualité: {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'XOF',
                                minimumFractionDigits: 0,
                              }).format(plan.monthlyPayment)} • 
                              Total: {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'XOF',
                                minimumFractionDigits: 0,
                              }).format(plan.totalPrice)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newPlans = editForm.paymentPlans?.filter((_, i) => i !== index) || [];
                              setEditForm({ ...editForm, paymentPlans: newPlans });
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !showEditPaymentForm && (
                      <div className="p-4 bg-slate-50 rounded border border-dashed border-slate-300 text-center">
                        <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">
                          Aucun plan de financement configuré
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Cliquez sur "Ajouter un plan" pour créer une option de paiement échelonné
                        </p>
                      </div>
                    )
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setOwnerSearchQuery('');
                  setShowOwnerDropdown(false);
                  setShowEditPaymentForm(false);
                  setNewPlan({ duration: 12, downPayment: 0, monthlyPayment: 0 });
                }}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                Annuler
              </button>
              <Button
                type="button"
                onClick={() => {
                  // Handle save action
                  console.log('Bien modifié:', editForm);
                  console.log('Nouveau client propriétaire:', selectedOwnerId);
                  setShowEditModal(false);
                  setOwnerSearchQuery('');
                  setShowOwnerDropdown(false);
                  setShowEditPaymentForm(false);
                  setNewPlan({ duration: 12, downPayment: 0, monthlyPayment: 0 });
                }}
              >
                Enregistrer les modifications
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="mb-1">Créer un bien</h3>
              </div>
              <button
                className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateOwnerId('');
                  setCreateOwnerSearchQuery('');
                  setShowCreateOwnerDropdown(false);
                  setShowCreatePaymentForm(false);
                  setSelectedBankAccountId('');
                  setNewPlan({ duration: 12, downPayment: 0, monthlyPayment: 0 });
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-6">
                {/* Informations générales */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Informations générales</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                      <input
                        type="text"
                        value={createForm.title}
                        onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Localisation</label>
                      <input
                        type="text"
                        value={createForm.location}
                        onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                      <select
                        value={createForm.type}
                        onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as Property['type'] })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="villa">Villa</option>
                        <option value="appartement">Appartement</option>
                        <option value="terrain">Terrain</option>
                        <option value="espace-commercial">Espace commercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                      <select
                        value={createForm.category || 'vente'}
                        onChange={(e) => setCreateForm({ ...createForm, category: e.target.value as Property['category'] })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="vente">Vente</option>
                        <option value="location-vente">Location-vente</option>
                        <option value="location">Location</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                      <select
                        value={createForm.status}
                        onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as Property['status'] })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="disponible">Disponible</option>
                        <option value="réservé">Réservé</option>
                        <option value="vendu">Vendu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Accès</label>
                      <select
                        value={createForm.vipOnly ? 'vip' : 'standard'}
                        onChange={(e) => setCreateForm({ ...createForm, vipOnly: e.target.value === 'vip' })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="standard">Standard</option>
                        <option value="vip">VIP uniquement</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Client propriétaire</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={createOwnerSearchQuery}
                          onChange={(e) => {
                            setCreateOwnerSearchQuery(e.target.value);
                            setShowCreateOwnerDropdown(true);
                          }}
                          onFocus={() => setShowCreateOwnerDropdown(true)}
                          placeholder="Rechercher par nom, email ou téléphone..."
                          className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {showCreateOwnerDropdown && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowCreateOwnerDropdown(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded shadow-lg max-h-60 overflow-y-auto z-20">
                              <button
                                type="button"
                                onClick={() => {
                                  setCreateOwnerId('');
                                  setCreateOwnerSearchQuery('');
                                  setShowCreateOwnerDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors border-b border-slate-200"
                              >
                                <span className="text-sm text-slate-500 italic">Non assigné</span>
                              </button>
                              {filterClients(createOwnerSearchQuery).map((client) => (
                                <button
                                  key={client.id}
                                  type="button"
                                  onClick={() => {
                                    setCreateOwnerId(client.id);
                                    setCreateOwnerSearchQuery('');
                                    setShowCreateOwnerDropdown(false);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-b-0"
                                >
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={client.avatar} 
                                      alt={client.name}
                                      className="w-8 h-8 rounded-full flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-900">{client.name}</p>
                                        {client.isVip && (
                                          <span className="flex items-center gap-1 text-xs text-yellow-700">
                                            <Crown className="w-3 h-3" />
                                            VIP
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-600">{client.email}</p>
                                      <p className="text-xs text-slate-500">{client.phone}</p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                              {filterClients(createOwnerSearchQuery).length === 0 && (
                                <div className="px-3 py-4 text-center text-sm text-slate-500">
                                  Aucun client trouvé
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {createOwnerId && (() => {
                        const owner = technicianClients.find(c => c.id === createOwnerId);
                        return owner ? (
                          <div className="mt-2 flex items-center justify-between gap-2 p-2 bg-slate-50 rounded">
                            <div className="flex items-center gap-2">
                              <img 
                                src={owner.avatar} 
                                alt={owner.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-900">{owner.name}</p>
                                  {owner.isVip && (
                                    <span className="flex items-center gap-1 text-xs text-yellow-700">
                                      <Crown className="w-3 h-3" />
                                      VIP
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600">{owner.email}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setCreateOwnerId('');
                                setCreateOwnerSearchQuery('');
                              }}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                              title="Retirer le client"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    <div className="col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={createForm.featured}
                          onChange={(e) => setCreateForm({ ...createForm, featured: e.target.checked })}
                          className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Bien en vedette</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Description</h4>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Description détaillée du bien..."
                  />
                </div>

                {/* Caractéristiques */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Caractéristiques</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Surface (m²)</label>
                      <input
                        type="number"
                        value={createForm.surface}
                        onChange={(e) => setCreateForm({ ...createForm, surface: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Prix (FCFA)</label>
                      <input
                        type="number"
                        value={createForm.price}
                        onChange={(e) => setCreateForm({ ...createForm, price: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Chambres</label>
                      <input
                        type="number"
                        value={createForm.bedrooms || ''}
                        onChange={(e) => setCreateForm({ ...createForm, bedrooms: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nombre de chambres"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Salles de bain</label>
                      <input
                        type="number"
                        value={createForm.bathrooms || ''}
                        onChange={(e) => setCreateForm({ ...createForm, bathrooms: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nombre de salles de bain"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Niveau</label>
                      <input
                        type="text"
                        value={createForm.groundLevel || ''}
                        onChange={(e) => setCreateForm({ ...createForm, groundLevel: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Ex: R+1, R+2..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Étage</label>
                      <input
                        type="text"
                        value={createForm.floor || ''}
                        onChange={(e) => setCreateForm({ ...createForm, floor: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Ex: 3ème étage"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Places de garage</label>
                      <input
                        type="number"
                        value={createForm.garageSpaces || ''}
                        onChange={(e) => setCreateForm({ ...createForm, garageSpaces: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nombre de places"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Places de parking</label>
                      <input
                        type="number"
                        value={createForm.parking || ''}
                        onChange={(e) => setCreateForm({ ...createForm, parking: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nombre de places"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={createForm.guestToilet || false}
                          onChange={(e) => setCreateForm({ ...createForm, guestToilet: e.target.checked })}
                          className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Toilettes invités</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Coordonnées GPS */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Localisation GPS (optionnel)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={createForm.coordinates?.lat || ''}
                        onChange={(e) => setCreateForm({ 
                          ...createForm, 
                          coordinates: { 
                            ...createForm.coordinates, 
                            lat: e.target.value ? parseFloat(e.target.value) : 0,
                            lng: createForm.coordinates?.lng || 0
                          } 
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Ex: 14.7167"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={createForm.coordinates?.lng || ''}
                        onChange={(e) => setCreateForm({ 
                          ...createForm, 
                          coordinates: { 
                            lat: createForm.coordinates?.lat || 0,
                            lng: e.target.value ? parseFloat(e.target.value) : 0
                          } 
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Ex: -17.4933"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Images</h4>
                  
                  {/* Aperçu des images existantes */}
                  {createForm.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {createForm.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = createForm.images.filter((_, i) => i !== index);
                              setCreateForm({ ...createForm, images: newImages });
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Supprimer cette image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bouton pour uploader de nouvelles images */}
                  <div className="border-2 border-dashed border-slate-300 rounded p-6 text-center hover:border-red-500 transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        // Convertir les fichiers en URLs temporaires pour l'aperçu
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const imageUrl = event.target?.result as string;
                            setCreateForm({ 
                              ...createForm, 
                              images: [...createForm.images, imageUrl] 
                            });
                          };
                          reader.readAsDataURL(file);
                        });
                        // Réinitialiser l'input pour permettre de re-sélectionner le même fichier
                        e.target.value = '';
                      }}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Cliquez pour ajouter des images
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          PNG, JPG jusqu'à 10MB (plusieurs fichiers acceptés)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Équipements */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Équipements (séparés par des virgules)</h4>
                  <input
                    type="text"
                    value={createForm.amenities?.join(', ') || ''}
                    onChange={(e) => setCreateForm({ 
                      ...createForm, 
                      amenities: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ex: Piscine, Jardin, Terrasse, Climatisation..."
                  />
                </div>

                {/* Compte bancaire pour virement */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Compte bancaire pour virement</h4>
                  <p className="text-xs text-slate-600 mb-3">Sélectionnez le compte bancaire sur lequel les clients pourront effectuer leur virement</p>
                  <select
                    value={selectedBankAccountId}
                    onChange={(e) => setSelectedBankAccountId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">-- Aucun compte sélectionné --</option>
                    {getActiveBankAccounts().map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.bankName} (IBAN: {getIbanPreview(account.iban)})
                      </option>
                    ))}
                  </select>
                  {selectedBankAccountId && (() => {
                    const selectedAccount = bankAccounts.find(acc => acc.id === selectedBankAccountId);
                    return selectedAccount ? (
                      <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm font-medium text-slate-900">{selectedAccount.bankName}</p>
                        <p className="text-xs text-slate-600 mt-1">Titulaire: {selectedAccount.accountHolderName}</p>
                        <p className="text-xs text-slate-600">IBAN: {selectedAccount.iban || 'N/A'}</p>
                        <p className="text-xs text-slate-600">SWIFT: {selectedAccount.swift || 'N/A'}</p>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Plans de financement */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-slate-900">Plans de financement</h4>
                    <Button
                      type="button"
                      onClick={() => {
                        if (showCreatePaymentForm) {
                          setShowCreatePaymentForm(false);
                          setNewPlan({ duration: 12, downPayment: 0, monthlyPayment: 0 });
                        } else {
                          setShowCreatePaymentForm(true);
                        }
                      }}
                      variant="outline"
                      size="sm"
                    >
                      {showCreatePaymentForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {showCreatePaymentForm ? 'Annuler' : 'Ajouter un plan'}
                    </Button>
                  </div>
                  
                  {/* Formulaire d'ajout */}
                  {showCreatePaymentForm && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="text-sm font-medium text-slate-900 mb-3">Nouveau plan de financement</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Nombre de mois <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={newPlan.duration}
                            onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            placeholder="12"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Paiement initial (FCFA) <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="100000"
                            value={newPlan.downPayment}
                            onChange={(e) => setNewPlan({ ...newPlan, downPayment: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            placeholder="20000000"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Mensualité (FCFA) <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="10000"
                            value={newPlan.monthlyPayment}
                            onChange={(e) => setNewPlan({ ...newPlan, monthlyPayment: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            placeholder="5000000"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (newPlan.duration > 0 && newPlan.downPayment >= 0 && newPlan.monthlyPayment > 0) {
                              const plan: PaymentPlan = {
                                id: `plan-${Date.now()}`,
                                duration: newPlan.duration,
                                totalPrice: newPlan.downPayment + (newPlan.monthlyPayment * newPlan.duration),
                                downPayment: newPlan.downPayment,
                                monthlyPayment: newPlan.monthlyPayment,
                                name: `Plan ${newPlan.duration} mois`,
                              };
                              setCreateForm({
                                ...createForm,
                                paymentPlans: [...(createForm.paymentPlans || []), plan],
                              });
                              setNewPlan({ duration: 12, downPayment: 0, monthlyPayment: 0 });
                              setShowCreatePaymentForm(false);
                            }
                          }}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Liste des plans existants */}
                  {createForm.paymentPlans && createForm.paymentPlans.length > 0 ? (
                    <div className="space-y-2">
                      {createForm.paymentPlans.map((plan, index) => (
                        <div
                          key={plan.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              Plan {plan.duration} mois
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              Apport: {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'XOF',
                                minimumFractionDigits: 0,
                              }).format(plan.downPayment)} • 
                              Mensualité: {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'XOF',
                                minimumFractionDigits: 0,
                              }).format(plan.monthlyPayment)} • 
                              Total: {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'XOF',
                                minimumFractionDigits: 0,
                              }).format(plan.totalPrice)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newPlans = createForm.paymentPlans?.filter((_, i) => i !== index) || [];
                              setCreateForm({ ...createForm, paymentPlans: newPlans });
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !showCreatePaymentForm && (
                      <div className="p-4 bg-slate-50 rounded border border-dashed border-slate-300 text-center">
                        <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">
                          Aucun plan de financement configuré
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Cliquez sur "Ajouter un plan" pour créer une option de paiement échelonné
                        </p>
                      </div>
                    )
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateOwnerId('');
                  setCreateOwnerSearchQuery('');
                  setShowCreateOwnerDropdown(false);
                  setShowCreatePaymentForm(false);
                  setSelectedBankAccountId('');
                  setNewPlan({ duration: 12, downPayment: 0, monthlyPayment: 0 });
                }}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                Annuler
              </button>
              <Button
                type="button"
                onClick={() => {
                  // Handle save action
                  console.log('Bien créé:', createForm);
                  console.log('Client propriétaire:', createOwnerId);
                  console.log('Compte bancaire:', selectedBankAccountId);
                  setShowCreateModal(false);
                  setCreateOwnerId('');
                  setCreateOwnerSearchQuery('');
                  setShowCreateOwnerDropdown(false);
                  setShowCreatePaymentForm(false);
                  setSelectedBankAccountId('');
                  setNewPlan({ duration: 12, downPayment: 0, monthlyPayment: 0 });
                }}
              >
                Enregistrer le bien
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}