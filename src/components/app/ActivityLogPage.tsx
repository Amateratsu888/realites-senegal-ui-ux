import React, { useState } from 'react';
import { Search, Filter, Calendar, User, FileText, Home, CreditCard, Trash2, Edit, UserPlus, UserMinus, LogIn, LogOut, Upload, Eye, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { Button } from '../Button';

export type ActivityType = 
  | 'user_created' 
  | 'user_deleted' 
  | 'user_role_changed'
  | 'property_added' 
  | 'property_updated' 
  | 'property_deleted'
  | 'payment_received'
  | 'payment_verified'
  | 'document_uploaded'
  | 'lead_created'
  | 'contract_signed'
  | 'login'
  | 'logout';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  user: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  target?: {
    type: 'user' | 'property' | 'payment' | 'document' | 'lead' | 'contract';
    id: string;
    name: string;
  };
  description: string;
  details?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

// Données mock pour les logs d'activité
const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-001',
    type: 'user_created',
    user: { id: 'admin-1', name: 'Admin Principal', role: 'admin' },
    target: { type: 'user', id: 'c005', name: 'Marie Diop' },
    description: 'Nouveau client VIP créé',
    details: { email: 'marie.diop@example.com', role: 'vip' },
    timestamp: '2024-12-15T14:30:00Z',
    ipAddress: '197.149.91.45',
  },
  {
    id: 'log-002',
    type: 'payment_received',
    user: { id: 'c001', name: 'Amadou Diallo', role: 'client' },
    target: { type: 'payment', id: 'p123', name: 'Paiement mensuel - Villa Tropicale' },
    description: 'Paiement de 25,000,000 FCFA reçu',
    details: { amount: 25000000, method: 'Virement Bancaire', propertyId: '4' },
    timestamp: '2024-12-15T13:15:00Z',
    ipAddress: '41.202.213.88',
  },
  {
    id: 'log-003',
    type: 'property_added',
    user: { id: 'admin-1', name: 'Admin Principal', role: 'admin' },
    target: { type: 'property', id: '46', name: 'Villa Moderne Almadies' },
    description: 'Nouveau bien ajouté au catalogue',
    details: { price: 450000000, type: 'villa', location: 'Almadies, Dakar', vipOnly: true },
    timestamp: '2024-12-15T11:45:00Z',
    ipAddress: '197.149.91.45',
  },
  {
    id: 'log-004',
    type: 'document_uploaded',
    user: { id: 'tech-1', name: 'Technicien 1', role: 'technicien' },
    target: { type: 'document', id: 'doc-045', name: 'Contrat signé - Appartement Mermoz' },
    description: 'Document contractuel uploadé',
    details: { fileSize: '2.4 MB', fileType: 'PDF', contractId: 'c2' },
    timestamp: '2024-12-15T10:20:00Z',
    ipAddress: '197.149.91.50',
  },
  {
    id: 'log-005',
    type: 'user_role_changed',
    user: { id: 'admin-1', name: 'Admin Principal', role: 'admin' },
    target: { type: 'user', id: 'c003', name: 'Khadija Ndiaye' },
    description: 'Rôle modifié de Client à VIP',
    details: { oldRole: 'client', newRole: 'vip', reason: 'Upgrade premium' },
    timestamp: '2024-12-15T09:00:00Z',
    ipAddress: '197.149.91.45',
  },
  {
    id: 'log-006',
    type: 'property_updated',
    user: { id: 'admin-1', name: 'Admin Principal', role: 'admin' },
    target: { type: 'property', id: '5', name: 'Résidence Moderne 3 Chambres' },
    description: 'Statut du bien modifié',
    details: { oldStatus: 'disponible', newStatus: 'réservé', field: 'status' },
    timestamp: '2024-12-14T16:30:00Z',
    ipAddress: '197.149.91.45',
  },
  {
    id: 'log-007',
    type: 'lead_created',
    user: { id: 'visitor-1', name: 'Visiteur Anonyme', role: 'visitor' },
    target: { type: 'lead', id: 'lead-045', name: 'Demande info - Villa Contemporaine' },
    description: 'Nouveau lead généré depuis le site web',
    details: { source: 'website', propertyId: '1', interest: 'financement' },
    timestamp: '2024-12-14T14:15:00Z',
    ipAddress: '41.202.213.100',
  },
  {
    id: 'log-008',
    type: 'payment_verified',
    user: { id: 'tech-1', name: 'Technicien 1', role: 'technicien' },
    target: { type: 'payment', id: 'p120', name: 'Paiement initial - Terrain Saly' },
    description: 'Paiement vérifié et validé',
    details: { amount: 20000000, proofUrl: '/documents/proof-120.pdf' },
    timestamp: '2024-12-14T12:00:00Z',
    ipAddress: '197.149.91.50',
  },
  {
    id: 'log-009',
    type: 'contract_signed',
    user: { id: 'c002', name: 'Fatou Sow', role: 'vip' },
    target: { type: 'contract', id: 'c5', name: 'Contrat VEFA - Appartement Sicap' },
    description: 'Contrat signé électroniquement',
    details: { propertyId: '41', totalAmount: 88000000, duration: 24 },
    timestamp: '2024-12-14T10:30:00Z',
    ipAddress: '41.202.213.92',
  },
  {
    id: 'log-010',
    type: 'login',
    user: { id: 'c001', name: 'Amadou Diallo', role: 'client' },
    description: 'Connexion réussie',
    details: { device: 'Chrome/Windows', location: 'Dakar, Sénégal' },
    timestamp: '2024-12-14T08:00:00Z',
    ipAddress: '41.202.213.88',
  },
  {
    id: 'log-011',
    type: 'user_deleted',
    user: { id: 'admin-1', name: 'Admin Principal', role: 'admin' },
    target: { type: 'user', id: 'c999', name: 'Compte Test' },
    description: 'Compte utilisateur supprimé',
    details: { reason: 'Compte de test', deletedBy: 'admin-1' },
    timestamp: '2024-12-13T17:00:00Z',
    ipAddress: '197.149.91.45',
  },
  {
    id: 'log-012',
    type: 'property_deleted',
    user: { id: 'admin-1', name: 'Admin Principal', role: 'admin' },
    target: { type: 'property', id: '999', name: 'Bien Test Supprimé' },
    description: 'Bien retiré du catalogue',
    details: { reason: 'Vendu ailleurs', deletedBy: 'admin-1' },
    timestamp: '2024-12-13T15:30:00Z',
    ipAddress: '197.149.91.45',
  },
];

export function ActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const getActivityIcon = (type: ActivityType) => {
    const icons: Record<ActivityType, any> = {
      user_created: UserPlus,
      user_deleted: UserMinus,
      user_role_changed: Edit,
      property_added: Home,
      property_updated: Edit,
      property_deleted: Trash2,
      payment_received: CreditCard,
      payment_verified: CheckCircle,
      document_uploaded: Upload,
      lead_created: FileText,
      contract_signed: FileText,
      login: LogIn,
      logout: LogOut,
    };
    return icons[type] || FileText;
  };

  const getActivityColor = (type: ActivityType) => {
    const colors: Record<ActivityType, string> = {
      user_created: 'text-green-600 bg-green-100',
      user_deleted: 'text-red-600 bg-red-100',
      user_role_changed: 'text-blue-600 bg-blue-100',
      property_added: 'text-green-600 bg-green-100',
      property_updated: 'text-blue-600 bg-blue-100',
      property_deleted: 'text-red-600 bg-red-100',
      payment_received: 'text-green-600 bg-green-100',
      payment_verified: 'text-green-600 bg-green-100',
      document_uploaded: 'text-purple-600 bg-purple-100',
      lead_created: 'text-yellow-600 bg-yellow-100',
      contract_signed: 'text-indigo-600 bg-indigo-100',
      login: 'text-slate-600 bg-slate-100',
      logout: 'text-slate-600 bg-slate-100',
    };
    return colors[type] || 'text-slate-600 bg-slate-100';
  };

  const getActivityLabel = (type: ActivityType) => {
    const labels: Record<ActivityType, string> = {
      user_created: 'Utilisateur créé',
      user_deleted: 'Utilisateur supprimé',
      user_role_changed: 'Rôle modifié',
      property_added: 'Bien ajouté',
      property_updated: 'Bien modifié',
      property_deleted: 'Bien supprimé',
      payment_received: 'Paiement reçu',
      payment_verified: 'Paiement vérifié',
      document_uploaded: 'Document uploadé',
      lead_created: 'Lead créé',
      contract_signed: 'Contrat signé',
      login: 'Connexion',
      logout: 'Déconnexion',
    };
    return labels[type] || type;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterLogs = () => {
    let filtered = mockActivityLogs;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.description.toLowerCase().includes(query) ||
        log.user.name.toLowerCase().includes(query) ||
        log.target?.name.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === typeFilter);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        const diffDays = Math.floor((now.getTime() - logDate.getTime()) / 86400000);
        
        if (dateFilter === 'today') return diffDays === 0;
        if (dateFilter === 'week') return diffDays <= 7;
        if (dateFilter === 'month') return diffDays <= 30;
        return true;
      });
    }

    return filtered;
  };

  const filteredLogs = filterLogs();

  const activityTypes: { value: ActivityType | 'all'; label: string }[] = [
    { value: 'all', label: 'Toutes les activités' },
    { value: 'user_created', label: 'Utilisateurs créés' },
    { value: 'user_deleted', label: 'Utilisateurs supprimés' },
    { value: 'user_role_changed', label: 'Rôles modifiés' },
    { value: 'property_added', label: 'Biens ajoutés' },
    { value: 'property_updated', label: 'Biens modifiés' },
    { value: 'property_deleted', label: 'Biens supprimés' },
    { value: 'payment_received', label: 'Paiements reçus' },
    { value: 'payment_verified', label: 'Paiements vérifiés' },
    { value: 'document_uploaded', label: 'Documents uploadés' },
    { value: 'lead_created', label: 'Leads créés' },
    { value: 'contract_signed', label: 'Contrats signés' },
    { value: 'login', label: 'Connexions' },
  ];

  const exportLogs = () => {
    const csv = [
      ['Date', 'Type', 'Utilisateur', 'Action', 'Cible', 'Adresse IP'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString('fr-FR'),
        getActivityLabel(log.type),
        log.user.name,
        log.description,
        log.target?.name || '-',
        log.ipAddress || '-',
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-activite-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Journal d'activité</h2>
          <p className="text-sm text-slate-600 mt-1">
            Historique de toutes les actions effectuées sur la plateforme
          </p>
        </div>
        <Button variant="outline" onClick={exportLogs}>
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Nouveaux utilisateurs</p>
              <p className="font-medium text-slate-900">
                {mockActivityLogs.filter(l => l.type === 'user_created').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Biens ajoutés</p>
              <p className="font-medium text-slate-900">
                {mockActivityLogs.filter(l => l.type === 'property_added').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Paiements reçus</p>
              <p className="font-medium text-slate-900">
                {mockActivityLogs.filter(l => l.type === 'payment_received').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Documents uploadés</p>
              <p className="font-medium text-slate-900">
                {mockActivityLogs.filter(l => l.type === 'document_uploaded').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ActivityType | 'all')}
            className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-slate-900">
            Activités récentes ({filteredLogs.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredLogs.map((log) => {
            const Icon = getActivityIcon(log.type);
            
            return (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getActivityColor(log.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 mb-1">
                          {log.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {log.user.name} ({log.user.role})
                          </span>
                          {log.target && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {log.target.name}
                            </span>
                          )}
                          {log.ipAddress && (
                            <span className="text-slate-500">
                              IP: {log.ipAddress}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(log.type)}`}>
                          {getActivityLabel(log.type)}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                    </div>

                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
                        <span className="text-slate-600">Détails: </span>
                        {Object.entries(log.details).slice(0, 2).map(([key, value]) => (
                          <span key={key} className="text-slate-700 mr-2">
                            {key}: <strong>{String(value)}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Aucune activité trouvée</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getActivityIcon(selectedLog.type);
                    return (
                      <div className={`p-3 rounded-lg ${getActivityColor(selectedLog.type)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-slate-900">{getActivityLabel(selectedLog.type)}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {formatTimestamp(selectedLog.timestamp)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-slate-100 rounded transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Description</h4>
                <p className="text-slate-900">{selectedLog.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Utilisateur</h4>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded">
                  <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{selectedLog.user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{selectedLog.user.name}</p>
                    <p className="text-xs text-slate-600">
                      Rôle: {selectedLog.user.role} • ID: {selectedLog.user.id}
                    </p>
                  </div>
                </div>
              </div>

              {selectedLog.target && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Cible</h4>
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-sm font-medium text-slate-900">{selectedLog.target.name}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Type: {selectedLog.target.type} • ID: {selectedLog.target.id}
                    </p>
                  </div>
                </div>
              )}

              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Détails techniques</h4>
                  <div className="bg-slate-50 rounded p-4 space-y-2">
                    {Object.entries(selectedLog.details).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2">
                        <span className="text-xs text-slate-600 min-w-[120px]">{key}:</span>
                        <span className="text-xs text-slate-900 font-medium">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Informations système</h4>
                <div className="bg-slate-50 rounded p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-600 min-w-[120px]">ID Log:</span>
                    <span className="text-xs text-slate-900 font-mono">{selectedLog.id}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-600 min-w-[120px]">Date complète:</span>
                    <span className="text-xs text-slate-900">
                      {new Date(selectedLog.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  {selectedLog.ipAddress && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-slate-600 min-w-[120px]">Adresse IP:</span>
                      <span className="text-xs text-slate-900 font-mono">{selectedLog.ipAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
