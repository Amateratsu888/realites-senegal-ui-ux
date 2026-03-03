import React, { useState } from 'react';
import { 
  Crown, 
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pause,
  FileText,
  MapPin,
  Handshake,
  SearchCheck,
  Eye,
  Trash2,
  Edit3,
  User,
  Building2,
  Filter,
  MoreVertical,
  Shield,
  Settings,
  Users,
  TrendingUp,
  ArrowUpRight,
  Search,
  Download,
  X,
  Calendar,
  Wallet,
  Target,
  GripVertical,
} from 'lucide-react';
import { Button } from '../Button';
import { vipServices, serviceRequests, interventionZones, getServiceById } from '../../data/vipServicesData';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { VIPService, ServiceRequest, ServiceRequestStatus, ServiceZonePrice } from '../../types';

interface VIPServicesAdminProps {
  onNavigate: (page: string) => void;
}

// ============ HELPER FUNCTIONS ============

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

// Status Badge Component
const StatusBadge = ({ status }: { status: ServiceRequestStatus }) => {
  const statusConfig: Record<ServiceRequestStatus, { label: string; className: string; icon: React.ElementType }> = {
    'en-attente-validation': { label: 'En attente', className: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    'acceptee': { label: 'Acceptée', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
    'refusee': { label: 'Refusée', className: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    'en-cours': { label: 'En cours', className: 'bg-primary-100 text-primary-800 border-primary-200', icon: Clock },
    'terminee': { label: 'Terminée', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
    'suspendue': { label: 'Suspendue', className: 'bg-neutral-100 text-neutral-800 border-neutral-200', icon: Pause },
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

const ServiceIcon = ({ type, className = "w-6 h-6" }: { type: string; className?: string }) => {
  const icons: Record<string, React.ElementType> = {
    'search-check': SearchCheck,
    'map-pin': MapPin,
    'file-text': FileText,
    'handshake': Handshake,
  };
  const Icon = icons[type] || FileText;
  return <Icon className={className} />;
};

// ============ SERVICE MANAGEMENT MODAL ============

const ServiceFormModal = ({
  service,
  isOpen,
  onClose,
  onSubmit,
}: {
  service?: VIPService | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<VIPService>) => void;
}) => {
  const [formData, setFormData] = useState<Partial<VIPService>>(
    service || {
      name: '',
      description: '',
      type: 'verification-hors-realites',
      icon: 'search-check',
      zonePrices: interventionZones.map(z => ({
        zoneId: z.id,
        zoneName: z.name,
        price: 0,
      })),
      isActive: true,
    }
  );

  React.useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'verification-hors-realites',
        icon: 'search-check',
        zonePrices: interventionZones.map(z => ({
          zoneId: z.id,
          zoneName: z.name,
          price: 0,
        })),
        isActive: true,
      });
    }
  }, [service, isOpen]);

  const handleZonePriceChange = (zoneId: string, price: number) => {
    const updatedPrices = (formData.zonePrices || []).map(zp =>
      zp.zoneId === zoneId ? { ...zp, price } : zp
    );
    setFormData({ ...formData, zonePrices: updatedPrices });
  };

  const handleZoneNameChange = (zoneId: string, zoneName: string) => {
    const updatedPrices = (formData.zonePrices || []).map(zp =>
      zp.zoneId === zoneId ? { ...zp, zoneName } : zp
    );
    setFormData({ ...formData, zonePrices: updatedPrices });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const iconOptions = [
    { value: 'search-check', label: 'Vérification', Icon: SearchCheck },
    { value: 'map-pin', label: 'Localisation', Icon: MapPin },
    { value: 'file-text', label: 'Document', Icon: FileText },
    { value: 'handshake', label: 'Partenariat', Icon: Handshake },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            {service ? 'Modifier le service' : 'Créer un nouveau service'}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            {service 
              ? 'Modifiez les informations du service VIP'
              : 'Configurez un nouveau service VIP avec ses tarifs par zone'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nom du service *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ex: Vérification Premium RÉALITÉS"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              placeholder="Décrivez le service proposé..."
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Icône du service
            </label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: value })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                    formData.icon === value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${formData.icon === value ? 'text-primary-600' : 'text-neutral-500'}`} />
                  <span className={`text-xs ${formData.icon === value ? 'text-primary-600' : 'text-neutral-600'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Zone Prices */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tarifs par zone d'intervention *
            </label>
            <div className="space-y-3">
              {(formData.zonePrices || []).map((zonePrice) => {
                return (
                  <div key={zonePrice.zoneId} className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-neutral-500 mb-1">Nom de la zone</label>
                        <input
                          type="text"
                          value={zonePrice.zoneName}
                          onChange={(e) => handleZoneNameChange(zonePrice.zoneId, e.target.value)}
                          required
                          placeholder="Ex: Dakar Centre"
                          className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="w-40">
                        <label className="block text-xs text-neutral-500 mb-1">Tarif</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={zonePrice.price || ''}
                            onChange={(e) => handleZonePriceChange(zonePrice.zoneId, parseInt(e.target.value) || 0)}
                            required
                            min="0"
                            placeholder="0"
                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-14"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">
                            FCFA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm text-neutral-700">
              Service actif (visible pour les clients VIP)
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {service ? 'Enregistrer les modifications' : 'Créer le service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ REQUEST VALIDATION MODAL ============

const RequestValidationModal = ({
  request,
  isOpen,
  onClose,
  onValidate,
  onReject,
}: {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onValidate: (requestId: string, technicianId: string) => void;
  onReject: (requestId: string, reason: string) => void;
}) => {
  const [action, setAction] = useState<'validate' | 'reject'>('validate');
  const [technicianId, setTechnicianId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'validate') {
      onValidate(request.id, technicianId);
    } else {
      onReject(request.id, rejectionReason);
    }
    onClose();
  };

  // Mock technicians
  const technicians = [
    { id: 'tech-1', name: 'Moussa Ndiaye' },
    { id: 'tech-2', name: 'Ibrahima Diop' },
    { id: 'tech-3', name: 'Ousmane Sarr' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-lg m-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Traiter la demande</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Demande de {request.clientName} pour le service "{request.serviceName}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Action Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAction('validate')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                action === 'validate'
                  ? 'border-green-500 bg-green-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <CheckCircle2 className={`w-6 h-6 mx-auto mb-2 ${action === 'validate' ? 'text-green-600' : 'text-neutral-400'}`} />
              <span className={`text-sm font-medium ${action === 'validate' ? 'text-green-700' : 'text-neutral-600'}`}>
                Accepter
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAction('reject')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                action === 'reject'
                  ? 'border-red-500 bg-red-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <XCircle className={`w-6 h-6 mx-auto mb-2 ${action === 'reject' ? 'text-red-600' : 'text-neutral-400'}`} />
              <span className={`text-sm font-medium ${action === 'reject' ? 'text-red-700' : 'text-neutral-600'}`}>
                Refuser
              </span>
            </button>
          </div>

          {action === 'validate' ? (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Assigner un technicien *
              </label>
              <select
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionnez un technicien</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Motif du refus *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                rows={4}
                placeholder="Expliquez au client pourquoi sa demande ne peut pas être acceptée..."
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              className={action === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
              disabled={action === 'validate' ? !technicianId : !rejectionReason}
            >
              {action === 'validate' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Valider la demande
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Refuser la demande
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

// Mock VEFA Projects Data
const mockVEFAProjects = [
  {
    id: 'vefa-1',
    name: 'Résidence Les Orchidées',
    clientId: 'client-1',
    clientName: 'Amadou Diallo',
    location: 'Almadies, Dakar',
    type: 'Appartement T4',
    totalPrice: 85000000,
    startDate: '2024-03-15',
    expectedEndDate: '2025-09-15',
    progress: 65,
    milestones: [
      { id: 'm1', title: 'Fondations et gros œuvre', description: 'Terrassement, fondations, dalle béton', status: 'terminee' as const, order: 1, completedAt: '2024-05-20' },
      { id: 'm2', title: 'Élévation des murs et toiture', description: 'Construction des murs porteurs', status: 'terminee' as const, order: 2, completedAt: '2024-08-25' },
      { id: 'm3', title: 'Finitions intérieures', description: 'Plomberie, électricité, revêtements', status: 'en-cours' as const, order: 3, completedAt: null },
    ],
    annuities: [
      { id: 'a1', label: 'Apport initial', amount: 17000000, dueDate: '2024-03-15', status: 'payé' as const },
      { id: 'a2', label: 'Fondations (20%)', amount: 17000000, dueDate: '2024-05-20', status: 'payé' as const },
      { id: 'a3', label: 'Élévation (25%)', amount: 21250000, dueDate: '2024-08-25', status: 'en-attente' as const },
      { id: 'a4', label: 'Finitions (20%)', amount: 17000000, dueDate: '2025-01-15', status: 'en-attente' as const },
    ],
  },
  {
    id: 'vefa-2',
    name: 'Villa Prestige Ngor',
    clientId: 'client-2',
    clientName: 'Fatou Sow',
    location: 'Ngor, Dakar',
    type: 'Villa 5 pièces',
    totalPrice: 180000000,
    startDate: '2024-01-01',
    expectedEndDate: '2025-07-01',
    progress: 45,
    milestones: [
      { id: 'm1', title: 'Fondations et gros œuvre', description: 'Terrassement, fondations', status: 'terminee' as const, order: 1, completedAt: '2024-03-15' },
      { id: 'm2', title: 'Élévation des murs', description: 'Construction des murs porteurs', status: 'en-cours' as const, order: 2, completedAt: null },
    ],
    annuities: [
      { id: 'a1', label: 'Apport initial (15%)', amount: 27000000, dueDate: '2024-01-01', status: 'payé' as const },
      { id: 'a2', label: 'Fondations (20%)', amount: 36000000, dueDate: '2024-03-15', status: 'payé' as const },
    ],
  },
];

type VEFAMilestoneStatus = 'en-cours' | 'terminee' | 'en-attente';
type AnnuityStatus = 'payé' | 'en-attente' | 'en-retard';

interface VEFAMilestone {
  id: string;
  title: string;
  description: string;
  status: VEFAMilestoneStatus;
  order: number;
  completedAt: string | null;
}

interface VEFAAnnuity {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: AnnuityStatus;
}

interface VEFAProject {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  location: string;
  type: string;
  totalPrice: number;
  startDate: string;
  expectedEndDate: string;
  progress: number;
  milestones: VEFAMilestone[];
  annuities: VEFAAnnuity[];
}

export function VIPServicesAdmin({ onNavigate }: VIPServicesAdminProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'requests' | 'vefa'>('overview');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<VIPService | null>(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestFilter, setRequestFilter] = useState<'all' | ServiceRequestStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // VEFA Management State
  const [vefaProjects, setVefaProjects] = useState<VEFAProject[]>(mockVEFAProjects);
  const [selectedVEFAProject, setSelectedVEFAProject] = useState<VEFAProject | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isAnnuityModalOpen, setIsAnnuityModalOpen] = useState(false);
  const [isVEFAProjectModalOpen, setIsVEFAProjectModalOpen] = useState(false);
  const [editingVEFAProject, setEditingVEFAProject] = useState<VEFAProject | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<VEFAMilestone | null>(null);
  const [editingAnnuity, setEditingAnnuity] = useState<VEFAAnnuity | null>(null);

  // Statistics
  const stats = {
    totalRequests: serviceRequests.length,
    pendingRequests: serviceRequests.filter(r => r.status === 'en-attente-validation').length,
    activeRequests: serviceRequests.filter(r => r.status === 'en-cours').length,
    completedRequests: serviceRequests.filter(r => r.status === 'terminee').length,
    totalRevenue: serviceRequests
      .filter(r => r.status === 'terminee' && r.price)
      .reduce((sum, r) => sum + (r.price || 0), 0),
  };

  const filteredRequests = serviceRequests
    .filter(r => requestFilter === 'all' || r.status === requestFilter)
    .filter(r => 
      searchQuery === '' ||
      r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleCreateService = () => {
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: VIPService) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = (data: Partial<VIPService>) => {
    if (editingService) {
      console.log('Update service:', { ...editingService, ...data });
      alert('Service mis à jour avec succès !');
    } else {
      console.log('Create service:', data);
      alert('Service créé avec succès !');
    }
  };

  const handleOpenValidation = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsValidationModalOpen(true);
  };

  const handleValidateRequest = (requestId: string, technicianId: string) => {
    console.log('Validate request:', requestId, 'with technician:', technicianId);
    alert('Demande validée et assignée au technicien !');
  };

  const handleRejectRequest = (requestId: string, reason: string) => {
    console.log('Reject request:', requestId, 'reason:', reason);
    alert('Demande refusée');
  };

  // VEFA Handlers
  const handleAddMilestone = (project: VEFAProject) => {
    setSelectedVEFAProject(project);
    setEditingMilestone(null);
    setIsMilestoneModalOpen(true);
  };

  const handleEditMilestone = (project: VEFAProject, milestone: VEFAMilestone) => {
    setSelectedVEFAProject(project);
    setEditingMilestone(milestone);
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (milestoneData: Partial<VEFAMilestone>) => {
    if (!selectedVEFAProject) return;
    
    setVefaProjects(prev => prev.map(p => {
      if (p.id !== selectedVEFAProject.id) return p;
      
      if (editingMilestone) {
        // Update existing milestone
        return {
          ...p,
          milestones: p.milestones.map(m => 
            m.id === editingMilestone.id ? { ...m, ...milestoneData } : m
          ),
        };
      } else {
        // Add new milestone
        const newMilestone: VEFAMilestone = {
          id: `m-${Date.now()}`,
          title: milestoneData.title || '',
          description: milestoneData.description || '',
          status: milestoneData.status || 'en-attente',
          order: p.milestones.length + 1,
          completedAt: null,
        };
        return {
          ...p,
          milestones: [...p.milestones, newMilestone],
        };
      }
    }));
    
    setIsMilestoneModalOpen(false);
    setEditingMilestone(null);
    alert(editingMilestone ? 'Jalon mis à jour !' : 'Nouveau jalon ajouté !');
  };

  const handleDeleteMilestone = (projectId: string, milestoneId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce jalon ?')) return;
    
    setVefaProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        milestones: p.milestones.filter(m => m.id !== milestoneId),
      };
    }));
  };

  const handleAddAnnuity = (project: VEFAProject) => {
    setSelectedVEFAProject(project);
    setEditingAnnuity(null);
    setIsAnnuityModalOpen(true);
  };

  const handleEditAnnuity = (project: VEFAProject, annuity: VEFAAnnuity) => {
    setSelectedVEFAProject(project);
    setEditingAnnuity(annuity);
    setIsAnnuityModalOpen(true);
  };

  const handleSaveAnnuity = (annuityData: Partial<VEFAAnnuity>) => {
    if (!selectedVEFAProject) return;
    
    setVefaProjects(prev => prev.map(p => {
      if (p.id !== selectedVEFAProject.id) return p;
      
      if (editingAnnuity) {
        // Update existing annuity
        return {
          ...p,
          annuities: p.annuities.map(a => 
            a.id === editingAnnuity.id ? { ...a, ...annuityData } : a
          ),
        };
      } else {
        // Add new annuity
        const newAnnuity: VEFAAnnuity = {
          id: `a-${Date.now()}`,
          label: annuityData.label || '',
          amount: annuityData.amount || 0,
          dueDate: annuityData.dueDate || new Date().toISOString().split('T')[0],
          status: annuityData.status || 'en-attente',
        };
        return {
          ...p,
          annuities: [...p.annuities, newAnnuity],
        };
      }
    }));
    
    setIsAnnuityModalOpen(false);
    setEditingAnnuity(null);
    alert(editingAnnuity ? 'Annuité mise à jour !' : 'Nouvelle annuité ajoutée !');
  };

  const handleDeleteAnnuity = (projectId: string, annuityId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annuité ?')) return;
    
    setVefaProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        annuities: p.annuities.filter(a => a.id !== annuityId),
      };
    }));
  };

  // VEFA Project Handlers
  const handleCreateVEFAProject = () => {
    setEditingVEFAProject(null);
    setIsVEFAProjectModalOpen(true);
  };

  const handleEditVEFAProject = (project: VEFAProject) => {
    setEditingVEFAProject(project);
    setIsVEFAProjectModalOpen(true);
  };

  const handleSaveVEFAProject = (projectData: Partial<VEFAProject>) => {
    if (editingVEFAProject) {
      // Update existing project
      setVefaProjects(prev => prev.map(p => 
        p.id === editingVEFAProject.id ? { ...p, ...projectData } : p
      ));
      alert('Projet VEFA mis à jour !');
    } else {
      // Create new project
      const newProject: VEFAProject = {
        id: `vefa-${Date.now()}`,
        name: projectData.name || '',
        clientId: projectData.clientId || '',
        clientName: projectData.clientName || '',
        location: projectData.location || '',
        type: projectData.type || '',
        totalPrice: projectData.totalPrice || 0,
        startDate: projectData.startDate || new Date().toISOString().split('T')[0],
        expectedEndDate: projectData.expectedEndDate || '',
        progress: 0,
        milestones: [],
        annuities: [],
      };
      setVefaProjects(prev => [...prev, newProject]);
      alert('Nouveau projet VEFA créé !');
    }
    setIsVEFAProjectModalOpen(false);
    setEditingVEFAProject(null);
  };

  const handleDeleteVEFAProject = (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet VEFA ? Cette action est irréversible.')) return;
    setVefaProjects(prev => prev.filter(p => p.id !== projectId));
    alert('Projet VEFA supprimé !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <Crown className="w-7 h-7 text-amber-500" />
            Gestion Services VIP
          </h1>
          <p className="text-neutral-600 mt-1">
            Gérez les services VIP, validez les demandes et suivez les prestations
          </p>
        </div>
        <Button onClick={handleCreateService}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.pendingRequests}</p>
              <p className="text-xs text-neutral-500">En attente</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.activeRequests}</p>
              <p className="text-xs text-neutral-500">En cours</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.completedRequests}</p>
              <p className="text-xs text-neutral-500">Terminées</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalRequests}</p>
              <p className="text-xs text-neutral-500">Total</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">{formatPrice(stats.totalRevenue)}</p>
              <p className="text-xs text-neutral-500">Revenus</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Demandes
          </TabsTrigger>
          <TabsTrigger value="vefa" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Suivi VEFA
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Pending Requests Alert */}
          {stats.pendingRequests > 0 && (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800">
                      {stats.pendingRequests} demande(s) en attente de validation
                    </p>
                    <p className="text-sm text-amber-700">
                      Ces demandes nécessitent votre attention
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setActiveTab('requests')}>
                  Voir les demandes
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Dernières demandes</CardTitle>
              <CardDescription>Les 5 demandes les plus récentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serviceRequests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedRequest(request);
                      setActiveTab('requests');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ServiceIcon type={getServiceById(request.serviceId)?.icon || 'file-text'} className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{request.serviceName}</p>
                        <p className="text-sm text-neutral-500">{request.clientName} • {formatDate(request.createdAt)}</p>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance par service</CardTitle>
              <CardDescription>Nombre de demandes par type de service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vipServices.map((service) => {
                  const serviceRequestCount = serviceRequests.filter(r => r.serviceId === service.id).length;
                  const completedCount = serviceRequests.filter(r => r.serviceId === service.id && r.status === 'terminee').length;
                  
                  return (
                    <div key={service.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ServiceIcon type={service.icon} className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-neutral-900 truncate">{service.name}</p>
                          <span className="text-sm text-neutral-600">{serviceRequestCount} demandes</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${serviceRequestCount > 0 ? (completedCount / serviceRequestCount) * 100 : 0}%` }}
                          />
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">{completedCount} terminées</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vipServices.map((service) => (
              <Card key={service.id} className={!service.isActive ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <ServiceIcon type={service.icon} className="w-6 h-6 text-primary-700" />
                    </div>
                    <div className="flex items-center gap-2">
                      {!service.isActive && (
                        <Badge variant="secondary">Inactif</Badge>
                      )}
                      <button
                        onClick={() => handleEditService(service)}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-3">{service.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-neutral-500 uppercase">Tarifs par zone</p>
                    {service.zonePrices.slice(0, 3).map((zp) => (
                      <div key={zp.zoneId} className="flex justify-between text-sm">
                        <span className="text-neutral-600">{zp.zoneName}</span>
                        <span className="font-medium text-neutral-900">{formatPrice(zp.price)}</span>
                      </div>
                    ))}
                    {service.zonePrices.length > 3 && (
                      <p className="text-xs text-neutral-500">
                        +{service.zonePrices.length - 3} autres zones
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full" onClick={() => handleEditService(service)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurer
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Add New Service Card */}
            <Card className="border-dashed border-2 border-neutral-300 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer" onClick={handleCreateService}>
              <CardContent className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-neutral-500" />
                </div>
                <p className="font-medium text-neutral-700">Ajouter un service</p>
                <p className="text-sm text-neutral-500 text-center mt-1">
                  Créez un nouveau service VIP
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="mt-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher par client, service ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <select
                value={requestFilter}
                onChange={(e) => setRequestFilter(e.target.value as any)}
                className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="en-attente-validation">En attente</option>
                <option value="en-cours">En cours</option>
                <option value="terminee">Terminées</option>
                <option value="refusee">Refusées</option>
              </select>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>

          {/* Requests Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Demande</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Zone</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Prix</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Statut</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <ServiceIcon type={getServiceById(request.serviceId)?.icon || 'file-text'} className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 text-sm">{request.serviceName}</p>
                            <p className="text-xs text-neutral-500">#{request.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-amber-600" />
                          </div>
                          <span className="text-sm text-neutral-900">{request.clientName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600">{request.zoneName || '-'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-neutral-900">
                          {request.price ? formatPrice(request.price) : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600">{formatDate(request.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                            onClick={() => alert(`Voir détails demande ${request.id}`)}
                          >
                            <Eye className="w-4 h-4 text-neutral-500" />
                          </button>
                          {request.status === 'en-attente-validation' && (
                            <Button size="sm" onClick={() => handleOpenValidation(request)}>
                              Traiter
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">Aucune demande trouvée</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* VEFA Tab */}
        <TabsContent value="vefa" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Gestion des Projets VEFA</h2>
              <p className="text-sm text-neutral-500">Créez, modifiez et gérez les projets de vente en l'état futur d'achèvement</p>
            </div>
            <Button onClick={handleCreateVEFAProject}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau projet VEFA
            </Button>
          </div>

          {/* VEFA Projects List */}
          <div className="space-y-6">
            {vefaProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                {/* Project Header */}
                <div className="bg-gradient-to-r from-primary-50 to-amber-50 p-5 border-b border-neutral-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{project.name}</h3>
                        <p className="text-sm text-neutral-600">{project.location} • {project.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="text-sm text-neutral-500">Client: {project.clientName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-700">{formatPrice(project.totalPrice)}</p>
                        <p className="text-sm text-neutral-500">Prix total</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditVEFAProject(project)}
                          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                          title="Modifier le projet"
                        >
                          <Edit3 className="w-4 h-4 text-neutral-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteVEFAProject(project.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer le projet"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dates */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-neutral-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Début: {formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Fin prévue: {formatDate(project.expectedEndDate)}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-neutral-600">Avancement</span>
                      <span className="text-sm font-medium text-neutral-900">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 grid md:grid-cols-2 gap-6">
                  {/* Milestones Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-neutral-900 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary-600" />
                        Jalons du projet
                      </h4>
                      <Button size="sm" variant="outline" onClick={() => handleAddMilestone(project)}>
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {project.milestones.length === 0 ? (
                        <div className="text-center py-8 bg-neutral-50 rounded-lg">
                          <Target className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                          <p className="text-sm text-neutral-500">Aucun jalon défini</p>
                        </div>
                      ) : (
                        project.milestones.map((milestone, index) => (
                          <div 
                            key={milestone.id} 
                            className={`relative p-3 rounded-lg border-2 ${
                              milestone.status === 'terminee' ? 'border-green-200 bg-green-50/50' :
                              milestone.status === 'en-cours' ? 'border-blue-200 bg-blue-50/50' :
                              'border-neutral-200 bg-neutral-50/50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                milestone.status === 'terminee' ? 'bg-green-500 text-white' :
                                milestone.status === 'en-cours' ? 'bg-blue-500 text-white' :
                                'bg-neutral-300 text-neutral-600'
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm text-neutral-900">{milestone.title}</p>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleEditMilestone(project, milestone)}
                                      className="p-1 hover:bg-white rounded"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMilestone(project.id, milestone.id)}
                                      className="p-1 hover:bg-white rounded"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-neutral-500 mt-0.5">{milestone.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                                    milestone.status === 'terminee' ? 'bg-green-100 text-green-700' :
                                    milestone.status === 'en-cours' ? 'bg-blue-100 text-blue-700' :
                                    'bg-neutral-100 text-neutral-600'
                                  }`}>
                                    {milestone.status === 'terminee' && <CheckCircle2 className="w-3 h-3" />}
                                    {milestone.status === 'en-cours' && <Clock className="w-3 h-3" />}
                                    {milestone.status === 'en-attente' && <AlertCircle className="w-3 h-3" />}
                                    {milestone.status === 'terminee' ? 'Terminé' : 
                                     milestone.status === 'en-cours' ? 'En cours' : 'En attente'}
                                  </span>
                                  {milestone.completedAt && (
                                    <span className="text-xs text-neutral-400">
                                      {formatDate(milestone.completedAt)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Annuities Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-neutral-900 flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-green-600" />
                        Échéancier de paiement
                      </h4>
                      <Button size="sm" variant="outline" onClick={() => handleAddAnnuity(project)}>
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {project.annuities.length === 0 ? (
                        <div className="text-center py-8 bg-neutral-50 rounded-lg">
                          <Wallet className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                          <p className="text-sm text-neutral-500">Aucune annuité définie</p>
                        </div>
                      ) : (
                        project.annuities.map((annuity) => (
                          <div 
                            key={annuity.id} 
                            className={`p-3 rounded-lg border-2 ${
                              annuity.status === 'payé' ? 'border-green-200 bg-green-50/50' :
                              annuity.status === 'en-retard' ? 'border-red-200 bg-red-50/50' :
                              'border-neutral-200 bg-neutral-50/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-neutral-900">{annuity.label}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm font-semibold text-primary-700">
                                    {formatPrice(annuity.amount)}
                                  </span>
                                  <span className="text-xs text-neutral-400">•</span>
                                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(annuity.dueDate)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                                  annuity.status === 'payé' ? 'bg-green-100 text-green-700' :
                                  annuity.status === 'en-retard' ? 'bg-red-100 text-red-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {annuity.status === 'payé' && <CheckCircle2 className="w-3 h-3" />}
                                  {annuity.status === 'en-retard' && <XCircle className="w-3 h-3" />}
                                  {annuity.status === 'en-attente' && <Clock className="w-3 h-3" />}
                                  {annuity.status === 'payé' ? 'Payé' : 
                                   annuity.status === 'en-retard' ? 'En retard' : 'En attente'}
                                </span>
                                <button
                                  onClick={() => handleEditAnnuity(project, annuity)}
                                  className="p-1 hover:bg-white rounded"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAnnuity(project.id, annuity.id)}
                                  className="p-1 hover:bg-white rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Payment Summary */}
                    {project.annuities.length > 0 && (
                      <div className="mt-4 p-3 bg-neutral-100 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Total payé</span>
                          <span className="font-semibold text-green-600">
                            {formatPrice(project.annuities.filter(a => a.status === 'payé').reduce((sum, a) => sum + a.amount, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-neutral-600">Reste à payer</span>
                          <span className="font-semibold text-amber-600">
                            {formatPrice(project.annuities.filter(a => a.status !== 'payé').reduce((sum, a) => sum + a.amount, 0))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {vefaProjects.length === 0 && (
              <div className="text-center py-12 bg-neutral-50 rounded-xl">
                <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">Aucun projet VEFA en cours</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ServiceFormModal
        service={editingService}
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleServiceSubmit}
      />

      <RequestValidationModal
        request={selectedRequest}
        isOpen={isValidationModalOpen}
        onClose={() => {
          setIsValidationModalOpen(false);
          setSelectedRequest(null);
        }}
        onValidate={handleValidateRequest}
        onReject={handleRejectRequest}
      />

      {/* Milestone Modal */}
      {isMilestoneModalOpen && (
        <MilestoneFormModal
          milestone={editingMilestone}
          projectName={selectedVEFAProject?.name || ''}
          onClose={() => {
            setIsMilestoneModalOpen(false);
            setEditingMilestone(null);
            setSelectedVEFAProject(null);
          }}
          onSubmit={handleSaveMilestone}
        />
      )}

      {/* Annuity Modal */}
      {isAnnuityModalOpen && (
        <AnnuityFormModal
          annuity={editingAnnuity}
          projectName={selectedVEFAProject?.name || ''}
          onClose={() => {
            setIsAnnuityModalOpen(false);
            setEditingAnnuity(null);
            setSelectedVEFAProject(null);
          }}
          onSubmit={handleSaveAnnuity}
        />
      )}

      {/* VEFA Project Modal */}
      {isVEFAProjectModalOpen && (
        <VEFAProjectFormModal
          project={editingVEFAProject}
          onClose={() => {
            setIsVEFAProjectModalOpen(false);
            setEditingVEFAProject(null);
          }}
          onSubmit={handleSaveVEFAProject}
        />
      )}
    </div>
  );
}

// ============ MILESTONE FORM MODAL ============

const MilestoneFormModal = ({
  milestone,
  projectName,
  onClose,
  onSubmit,
}: {
  milestone: VEFAMilestone | null;
  projectName: string;
  onClose: () => void;
  onSubmit: (data: Partial<VEFAMilestone>) => void;
}) => {
  const [formData, setFormData] = useState<Partial<VEFAMilestone>>(
    milestone || {
      title: '',
      description: '',
      status: 'en-attente',
    }
  );

  React.useEffect(() => {
    if (milestone) {
      setFormData(milestone);
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'en-attente',
      });
    }
  }, [milestone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            {milestone ? 'Modifier le jalon' : 'Ajouter un jalon'}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Projet: {projectName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Titre du jalon *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ex: Fondations et gros œuvre"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Description détaillée du jalon..."
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Statut *
            </label>
            <select
              value={formData.status || 'en-attente'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as VEFAMilestoneStatus })}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="en-attente">En attente</option>
              <option value="en-cours">En cours</option>
              <option value="terminee">Terminé</option>
            </select>
          </div>

          {formData.status === 'terminee' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date de complétion
              </label>
              <input
                type="date"
                value={formData.completedAt || ''}
                onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {milestone ? 'Enregistrer' : 'Ajouter le jalon'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ ANNUITY FORM MODAL ============

const AnnuityFormModal = ({
  annuity,
  projectName,
  onClose,
  onSubmit,
}: {
  annuity: VEFAAnnuity | null;
  projectName: string;
  onClose: () => void;
  onSubmit: (data: Partial<VEFAAnnuity>) => void;
}) => {
  const [formData, setFormData] = useState<Partial<VEFAAnnuity>>(
    annuity || {
      label: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'en-attente',
    }
  );

  React.useEffect(() => {
    if (annuity) {
      setFormData(annuity);
    } else {
      setFormData({
        label: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'en-attente',
      });
    }
  }, [annuity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            {annuity ? 'Modifier l\'annuité' : 'Ajouter une annuité'}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Projet: {projectName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Libellé *
            </label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
              placeholder="Ex: Apport initial (15%)"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Montant *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                FCFA
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Date d'échéance *
            </label>
            <input
              type="date"
              value={formData.dueDate || ''}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Statut *
            </label>
            <select
              value={formData.status || 'en-attente'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AnnuityStatus })}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="en-attente">En attente</option>
              <option value="payé">Payé</option>
              <option value="en-retard">En retard</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {annuity ? 'Enregistrer' : 'Ajouter l\'annuité'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ VEFA PROJECT FORM MODAL ============

const VEFAProjectFormModal = ({
  project,
  onClose,
  onSubmit,
}: {
  project: VEFAProject | null;
  onClose: () => void;
  onSubmit: (data: Partial<VEFAProject>) => void;
}) => {
  const [formData, setFormData] = useState<Partial<VEFAProject>>(
    project || {
      name: '',
      clientId: '',
      clientName: '',
      location: '',
      type: '',
      totalPrice: 0,
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: '',
      progress: 0,
    }
  );

  React.useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        name: '',
        clientId: '',
        clientName: '',
        location: '',
        type: '',
        totalPrice: 0,
        startDate: new Date().toISOString().split('T')[0],
        expectedEndDate: '',
        progress: 0,
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Mock clients list
  const mockClients = [
    { id: 'client-1', name: 'Amadou Diallo' },
    { id: 'client-2', name: 'Fatou Sow' },
    { id: 'client-3', name: 'Moussa Ndiaye' },
    { id: 'client-4', name: 'Aissatou Ba' },
  ];

  const propertyTypes = [
    'Appartement T2',
    'Appartement T3',
    'Appartement T4',
    'Appartement T5',
    'Villa 3 pièces',
    'Villa 4 pièces',
    'Villa 5 pièces',
    'Villa de luxe',
    'Duplex',
    'Penthouse',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {project ? 'Modifier le projet VEFA' : 'Créer un projet VEFA'}
              </h2>
              <p className="text-sm text-neutral-500">
                Vente en l'État Futur d'Achèvement
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nom du projet *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ex: Résidence Les Orchidées"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Client VIP *
            </label>
            <select
              value={formData.clientId || ''}
              onChange={(e) => {
                const client = mockClients.find(c => c.id === e.target.value);
                setFormData({ 
                  ...formData, 
                  clientId: e.target.value,
                  clientName: client?.name || '',
                });
              }}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Sélectionnez un client</option>
              {mockClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Localisation *
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="Ex: Almadies, Dakar"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Type de bien *
              </label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionnez un type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Total Price */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Prix total *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.totalPrice || ''}
                onChange={(e) => setFormData({ ...formData, totalPrice: parseInt(e.target.value) || 0 })}
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                FCFA
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date de début *
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Expected End Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date de livraison prévue *
              </label>
              <input
                type="date"
                value={formData.expectedEndDate || ''}
                onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Progress (only for editing) */}
          {project && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Avancement (%)
              </label>
              <input
                type="number"
                value={formData.progress || 0}
                onChange={(e) => setFormData({ ...formData, progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                min="0"
                max="100"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {project ? 'Enregistrer les modifications' : 'Créer le projet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
