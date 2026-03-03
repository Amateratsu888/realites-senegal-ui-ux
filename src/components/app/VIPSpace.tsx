import React, { useState } from 'react';
import { 
  Crown, 
  Star, 
  Search, 
  Calendar, 
  Send,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pause,
  FileText,
  MapPin,
  Handshake,
  SearchCheck,
  Upload,
  Download,
  MessageSquare,
  Lock,
  Unlock,
  Eye,
  Trash2,
  Edit3,
  ArrowLeft,
  Image,
  File,
  User,
  Building2,
  Filter,
  MoreVertical,
  Shield,
  Wallet,
  CreditCard,
  PenTool,
  Target,
  Receipt,
} from 'lucide-react';
import { Button } from '../Button';
import { PropertyCard } from '../PropertyCard';
import { properties } from '../../data/mockData';
import { vipServices, serviceRequests, interventionZones, getServiceById } from '../../data/vipServicesData';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { UserRole, VIPService, ServiceRequest, Milestone, MilestoneStatus, ServiceRequestStatus } from '../../types';

interface VIPSpaceProps {
  onNavigate: (page: string, propertyId?: string) => void;
  userRole?: UserRole;
  userId?: string;
}

// ============ HELPER COMPONENTS ============

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

const MilestoneStatusBadge = ({ status }: { status: MilestoneStatus }) => {
  const statusConfig: Record<MilestoneStatus, { label: string; className: string; icon: React.ElementType }> = {
    'en-cours': { label: 'En cours', className: 'bg-blue-100 text-blue-800', icon: Clock },
    'terminee': { label: 'Terminée', className: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    'suspendue': { label: 'Suspendue', className: 'bg-neutral-100 text-neutral-800', icon: Pause },
    'en-attente-validation': { label: 'En attente', className: 'bg-amber-100 text-amber-800', icon: AlertCircle },
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="w-3 h-3" />
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

// ============ VEFA CLIENT TYPES & DATA ============

type ClientVEFAMilestoneStatus = 'en-cours' | 'terminee' | 'en-attente';
type ClientAnnuityStatus = 'payé' | 'en-attente' | 'en-retard';

interface ClientVEFAMilestone {
  id: string;
  title: string;
  description: string;
  status: ClientVEFAMilestoneStatus;
  order: number;
  completedAt: string | null;
  proofs?: { type: 'image' | 'document'; name: string; date: string }[];
}

interface ClientVEFAAnnuity {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: ClientAnnuityStatus;
  paidAt?: string;
  receiptUrl?: string;
}

interface ClientVEFAProject {
  id: string;
  name: string;
  location: string;
  type: string;
  totalPrice: number;
  startDate: string;
  expectedEndDate: string;
  progress: number;
  contractSigned: boolean;
  contractSignedAt?: string;
  milestones: ClientVEFAMilestone[];
  annuities: ClientVEFAAnnuity[];
}

// Mock VEFA projects for the current client
const mockClientVEFAProjects: ClientVEFAProject[] = [
  {
    id: 'vefa-1',
    name: 'Résidence Les Orchidées',
    location: 'Almadies, Dakar',
    type: 'Appartement T4',
    totalPrice: 85000000,
    startDate: '2024-03-15',
    expectedEndDate: '2025-09-15',
    progress: 65,
    contractSigned: true,
    contractSignedAt: '2024-03-10',
    milestones: [
      { 
        id: 'm1', 
        title: 'Fondations et gros œuvre', 
        description: 'Terrassement, fondations, dalle béton', 
        status: 'terminee', 
        order: 1, 
        completedAt: '2024-05-20',
        proofs: [
          { type: 'image', name: 'fondations-1.jpg', date: '2024-05-15' },
          { type: 'document', name: 'rapport-conformite.pdf', date: '2024-05-20' },
        ],
      },
      { 
        id: 'm2', 
        title: 'Élévation des murs et toiture', 
        description: 'Construction des murs porteurs, charpente et toiture', 
        status: 'terminee', 
        order: 2, 
        completedAt: '2024-08-25',
        proofs: [
          { type: 'image', name: 'elevation-1.jpg', date: '2024-08-10' },
          { type: 'image', name: 'toiture-complete.jpg', date: '2024-08-25' },
        ],
      },
      { 
        id: 'm3', 
        title: 'Finitions intérieures', 
        description: 'Plomberie, électricité, revêtements sols et murs', 
        status: 'en-cours', 
        order: 3, 
        completedAt: null,
        proofs: [
          { type: 'image', name: 'plomberie-installation.jpg', date: '2025-01-02' },
        ],
      },
      { id: 'm4', title: 'Aménagements extérieurs', description: 'Jardins, parkings, clôtures', status: 'en-attente', order: 4, completedAt: null },
      { id: 'm5', title: 'Livraison et réception', description: 'Inspection finale et remise des clés', status: 'en-attente', order: 5, completedAt: null },
    ],
    annuities: [
      { id: 'a1', label: 'Apport initial (20%)', amount: 17000000, dueDate: '2024-03-15', status: 'payé', paidAt: '2024-03-12', receiptUrl: '/receipts/a1.pdf' },
      { id: 'a2', label: 'Fondations (20%)', amount: 17000000, dueDate: '2024-05-20', status: 'payé', paidAt: '2024-05-18', receiptUrl: '/receipts/a2.pdf' },
      { id: 'a3', label: 'Élévation (25%)', amount: 21250000, dueDate: '2024-08-25', status: 'en-attente' },
      { id: 'a4', label: 'Finitions (20%)', amount: 17000000, dueDate: '2025-01-15', status: 'en-attente' },
      { id: 'a5', label: 'Livraison (15%)', amount: 12750000, dueDate: '2025-09-15', status: 'en-attente' },
    ],
  },
];

// ============ SUB COMPONENTS ============

// Service Card Component
const ServiceCard = ({ 
  service, 
  onSelect 
}: { 
  service: VIPService; 
  onSelect: (service: VIPService) => void;
}) => {
  const minPrice = Math.min(...service.zonePrices.map(z => z.price));
  const maxPrice = Math.max(...service.zonePrices.map(z => z.price));
  
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onSelect(service)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
            <ServiceIcon type={service.icon} className="w-6 h-6 text-primary-700" />
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
        </div>
        <CardTitle className="text-lg mt-3">{service.name}</CardTitle>
        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        <div className="w-full">
          <p className="text-sm text-neutral-500 mb-1">À partir de</p>
          <p className="text-lg font-semibold text-primary-700">{formatPrice(minPrice)}</p>
          {minPrice !== maxPrice && (
            <p className="text-xs text-neutral-500">Jusqu'à {formatPrice(maxPrice)}</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Service Request Form Modal
const ServiceRequestModal = ({ 
  service, 
  isOpen, 
  onClose,
  onSubmit,
}: { 
  service: VIPService; 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [formData, setFormData] = useState({
    zoneId: '',
    location: '',
    description: '',
    files: [] as File[],
  });
  
  const selectedZone = service.zonePrices.find(z => z.zoneId === formData.zoneId);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.type,
      price: selectedZone?.price,
      zoneName: selectedZone?.zoneName,
    });
    setFormData({ zoneId: '', location: '', description: '', files: [] });
    onClose();
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <XCircle className="w-6 h-6" />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <ServiceIcon type={service.icon} className="w-6 h-6 text-primary-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">{service.name}</h2>
            <p className="text-sm text-neutral-500">Créer une nouvelle demande de service</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Zone Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Zone d'intervention *
            </label>
            <select
              value={formData.zoneId}
              onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Sélectionnez une zone</option>
              {service.zonePrices.map((zone) => (
                <option key={zone.zoneId} value={zone.zoneId}>
                  {zone.zoneName} - {formatPrice(zone.price)}
                </option>
              ))}
            </select>
            {selectedZone && (
              <p className="mt-2 text-sm text-neutral-600">
                {interventionZones.find(z => z.id === selectedZone.zoneId)?.description}
              </p>
            )}
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Adresse / Localisation précise *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              placeholder="Ex: Quartier Almadies, près du Monument de la Renaissance"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description détaillée de votre demande *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              placeholder="Décrivez en détail votre demande : contexte, objectifs, informations sur le bien concerné..."
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Documents / Photos (optionnel)
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
              <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
              <label className="inline-block">
                <span className="text-sm text-primary-600 font-medium cursor-pointer hover:underline">
                  Parcourir vos fichiers
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.zip"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData({ ...formData, files: Array.from(e.target.files) });
                    }
                  }}
                />
              </label>
              <p className="text-xs text-neutral-500 mt-1">PDF, JPG, PNG ou ZIP</p>
            </div>
            {formData.files.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                    <span className="text-sm text-neutral-700 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, files: formData.files.filter((_, i) => i !== index) })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Price Summary */}
          {selectedZone && (
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Tarif du service</span>
                <span className="text-xl font-semibold text-primary-700">
                  {formatPrice(selectedZone.price)}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Le paiement sera demandé après validation de votre demande
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={!formData.zoneId || !formData.location || !formData.description}>
              <Send className="w-4 h-4 mr-2" />
              Envoyer la demande
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Request Card Component
const RequestCard = ({ 
  request, 
  onView 
}: { 
  request: ServiceRequest; 
  onView: (request: ServiceRequest) => void;
}) => {
  const completedMilestones = request.milestones.filter(m => m.status === 'terminee').length;
  const totalMilestones = request.milestones.length;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(request)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <ServiceIcon 
                type={getServiceById(request.serviceId)?.icon || 'file-text'} 
                className="w-5 h-5 text-primary-700" 
              />
            </div>
            <div>
              <CardTitle className="text-base">{request.serviceName}</CardTitle>
              <p className="text-xs text-neutral-500">{formatDate(request.createdAt)}</p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{request.description}</p>
        
        {request.location && (
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{request.location}</span>
          </div>
        )}
        
        {totalMilestones > 0 && request.status !== 'refusee' && (
          <div>
            <div className="flex justify-between text-xs text-neutral-500 mb-1">
              <span>Progression</span>
              <span>{completedMilestones}/{totalMilestones} étapes</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {request.status === 'refusee' && request.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
            <p className="text-xs text-red-700">{request.rejectionReason}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); onView(request); }}>
          <Eye className="w-4 h-4 mr-2" />
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
};

// Milestone Timeline Component
const MilestoneTimeline = ({ 
  milestones, 
  userRole,
  onAddComment,
  onEditMilestone,
  onDeleteMilestone,
  onProtectMilestone,
}: { 
  milestones: Milestone[];
  userRole: UserRole;
  onAddComment?: (milestoneId: string, comment: string) => void;
  onEditMilestone?: (milestone: Milestone) => void;
  onDeleteMilestone?: (milestoneId: string) => void;
  onProtectMilestone?: (milestoneId: string) => void;
}) => {
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>(
    milestones.filter(m => m.status === 'en-cours').map(m => m.id)
  );
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  
  const canManageMilestones = userRole === 'admin' || userRole === 'technicien';
  const canProtect = userRole === 'admin';
  
  const toggleMilestone = (id: string) => {
    setExpandedMilestones(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };
  
  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);
  
  return (
    <div className="space-y-4">
      {sortedMilestones.map((milestone, index) => {
        const isExpanded = expandedMilestones.includes(milestone.id);
        const isLast = index === sortedMilestones.length - 1;
        
        return (
          <div key={milestone.id} className="relative">
            {/* Timeline Line */}
            {!isLast && (
              <div className="absolute left-5 top-12 w-0.5 h-[calc(100%-24px)] bg-neutral-200" />
            )}
            
            {/* Milestone Card */}
            <div className={`border rounded-xl overflow-hidden transition-all ${
              milestone.isProtected ? 'border-amber-300 bg-amber-50/30' : 'border-neutral-200 bg-white'
            }`}>
              {/* Header */}
              <button
                onClick={() => toggleMilestone(milestone.id)}
                className="w-full flex items-start gap-4 p-4 text-left hover:bg-neutral-50 transition-colors"
              >
                {/* Status Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  milestone.status === 'terminee' 
                    ? 'bg-green-100 text-green-600' 
                    : milestone.status === 'en-cours'
                    ? 'bg-blue-100 text-blue-600'
                    : milestone.status === 'suspendue'
                    ? 'bg-neutral-100 text-neutral-600'
                    : 'bg-amber-100 text-amber-600'
                }`}>
                  {milestone.status === 'terminee' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : milestone.status === 'en-cours' ? (
                    <Clock className="w-5 h-5" />
                  ) : milestone.status === 'suspendue' ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-neutral-900">{milestone.title}</h4>
                    <MilestoneStatusBadge status={milestone.status} />
                    {milestone.isProtected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">
                        <Lock className="w-3 h-3" />
                        Protégée
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    {formatDateTime(milestone.createdAt)}
                    {milestone.completedAt && (
                      <span className="ml-2">• Terminée le {formatDate(milestone.completedAt)}</span>
                    )}
                  </p>
                </div>
                
                {/* Expand Icon */}
                <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`} />
              </button>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pl-18">
                  <div className="ml-14 space-y-4">
                    {/* Description */}
                    <p className="text-sm text-neutral-700">{milestone.description}</p>
                    
                    {/* Estimated Duration */}
                    {milestone.estimatedDuration && (
                      <p className="text-sm text-neutral-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Durée estimée : {milestone.estimatedDuration}
                      </p>
                    )}
                    
                    {/* Documents */}
                    {milestone.documents.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-neutral-700 mb-2">Documents</h5>
                        <div className="space-y-2">
                          {milestone.documents.map((doc) => (
                            <a
                              key={doc.id}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                              {doc.type === 'pdf' ? (
                                <FileText className="w-5 h-5 text-red-500" />
                              ) : doc.type === 'image' ? (
                                <Image className="w-5 h-5 text-blue-500" />
                              ) : (
                                <File className="w-5 h-5 text-neutral-500" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-700 truncate">{doc.name}</p>
                                <p className="text-xs text-neutral-500">{doc.size}</p>
                              </div>
                              <Download className="w-4 h-4 text-neutral-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Comments */}
                    {milestone.commentsEnabled && (
                      <div>
                        <h5 className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Commentaires ({milestone.comments.length})
                        </h5>
                        
                        {milestone.comments.length > 0 && (
                          <div className="space-y-3 mb-3">
                            {milestone.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  comment.authorRole === 'admin' 
                                    ? 'bg-primary-100 text-primary-700'
                                    : comment.authorRole === 'technicien'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  <User className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-neutral-900">
                                      {comment.authorName}
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                      {formatDateTime(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-neutral-700 mt-1">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Add Comment */}
                        {onAddComment && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={commentText[milestone.id] || ''}
                              onChange={(e) => setCommentText({ ...commentText, [milestone.id]: e.target.value })}
                              placeholder="Ajouter un commentaire..."
                              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <Button
                              size="sm"
                              disabled={!commentText[milestone.id]?.trim()}
                              onClick={() => {
                                if (commentText[milestone.id]?.trim()) {
                                  onAddComment(milestone.id, commentText[milestone.id]);
                                  setCommentText({ ...commentText, [milestone.id]: '' });
                                }
                              }}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Actions (Admin/Tech) */}
                    {canManageMilestones && !milestone.isProtected && (
                      <div className="flex gap-2 pt-2 border-t border-neutral-200">
                        {onEditMilestone && (
                          <Button variant="outline" size="sm" onClick={() => onEditMilestone(milestone)}>
                            <Edit3 className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                        )}
                        {canProtect && onProtectMilestone && (
                          <Button variant="outline" size="sm" onClick={() => onProtectMilestone(milestone.id)}>
                            <Lock className="w-4 h-4 mr-1" />
                            Protéger
                          </Button>
                        )}
                        {canProtect && onDeleteMilestone && (
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDeleteMilestone(milestone.id)}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Request Detail View
const RequestDetailView = ({
  request,
  userRole,
  onBack,
  onAddMilestone,
}: {
  request: ServiceRequest;
  userRole: UserRole;
  onBack: () => void;
  onAddMilestone?: () => void;
}) => {
  const canManageMilestones = userRole === 'admin' || userRole === 'technicien';
  const canValidateRequest = userRole === 'admin';
  
  const handleAddComment = (milestoneId: string, comment: string) => {
    alert(`Commentaire ajouté à la milestone ${milestoneId}: ${comment}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour aux demandes</span>
      </button>
      
      {/* Request Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                <ServiceIcon 
                  type={getServiceById(request.serviceId)?.icon || 'file-text'} 
                  className="w-7 h-7 text-primary-700" 
                />
              </div>
              <div>
                <CardTitle className="text-xl">{request.serviceName}</CardTitle>
                <p className="text-sm text-neutral-500">
                  Demande #{request.id} • Créée le {formatDate(request.createdAt)}
                </p>
              </div>
            </div>
            <StatusBadge status={request.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {request.location && (
              <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                <MapPin className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Localisation</p>
                  <p className="text-sm text-neutral-900">{request.location}</p>
                </div>
              </div>
            )}
            {request.zoneName && (
              <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                <Building2 className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Zone</p>
                  <p className="text-sm text-neutral-900">{request.zoneName}</p>
                </div>
              </div>
            )}
            {request.price && (
              <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                <Crown className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Tarif</p>
                  <p className="text-sm font-semibold text-primary-700">{formatPrice(request.price)}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Description de la demande</h4>
            <p className="text-sm text-neutral-600 whitespace-pre-line">{request.description}</p>
          </div>
          
          {/* Client Documents */}
          {request.documents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Documents fournis par le client</h4>
              <div className="flex flex-wrap gap-2">
                {request.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    {doc.type === 'pdf' ? (
                      <FileText className="w-4 h-4 text-red-500" />
                    ) : doc.type === 'image' ? (
                      <Image className="w-4 h-4 text-blue-500" />
                    ) : (
                      <File className="w-4 h-4 text-neutral-500" />
                    )}
                    <span className="text-sm text-neutral-700">{doc.name}</span>
                    <span className="text-xs text-neutral-500">({doc.size})</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Assigned Technician */}
          {request.assignedTechnicianName && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Technicien assigné</p>
                <p className="text-sm font-medium text-neutral-900">{request.assignedTechnicianName}</p>
              </div>
            </div>
          )}
          
          {/* Rejection Reason */}
          {request.status === 'refusee' && request.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-1">Demande refusée</h4>
                  <p className="text-sm text-red-700">{request.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Admin Actions */}
          {canValidateRequest && request.status === 'en-attente-validation' && (
            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              <Button onClick={() => alert('Demande acceptée !')}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Accepter la demande
              </Button>
              <Button variant="outline" className="text-red-600" onClick={() => alert('Demande refusée')}>
                <XCircle className="w-4 h-4 mr-2" />
                Refuser
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Milestones Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                Suivi des étapes
              </CardTitle>
              <CardDescription>
                {request.milestones.length} étape(s) • {request.milestones.filter(m => m.status === 'terminee').length} terminée(s)
              </CardDescription>
            </div>
            {canManageMilestones && request.status !== 'refusee' && request.status !== 'en-attente-validation' && (
              <Button onClick={onAddMilestone}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une étape
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {request.milestones.length > 0 ? (
            <MilestoneTimeline
              milestones={request.milestones}
              userRole={userRole}
              onAddComment={handleAddComment}
              onEditMilestone={(m) => alert(`Éditer milestone: ${m.title}`)}
              onDeleteMilestone={(id) => alert(`Supprimer milestone: ${id}`)}
              onProtectMilestone={(id) => alert(`Protéger milestone: ${id}`)}
            />
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600 mb-1">Aucune étape pour le moment</p>
              {request.status === 'en-attente-validation' ? (
                <p className="text-sm text-neutral-500">
                  Les étapes seront ajoutées après validation de la demande
                </p>
              ) : canManageMilestones ? (
                <Button variant="outline" className="mt-3" onClick={onAddMilestone}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter la première étape
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============ MAIN COMPONENT ============

export function VIPSpace({ onNavigate, userRole = 'vip', userId = 'client-vip-1' }: VIPSpaceProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'requests' | 'vefa'>('services');
  const [selectedService, setSelectedService] = useState<VIPService | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestFilter, setRequestFilter] = useState<'all' | ServiceRequestStatus>('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedVEFAProject, setSelectedVEFAProject] = useState<ClientVEFAProject | null>(null);
  const [selectedAnnuity, setSelectedAnnuity] = useState<ClientVEFAAnnuity | null>(null);
  
  const vipProperties = properties.filter(p => p.vipOnly);
  
  // Filter requests for current user (in real app, filter by userId)
  const userRequests = serviceRequests.filter(r => r.clientId === userId);
  const filteredRequests = requestFilter === 'all' 
    ? userRequests 
    : userRequests.filter(r => r.status === requestFilter);
  
  const handleServiceSelect = (service: VIPService) => {
    setSelectedService(service);
    setIsRequestModalOpen(true);
  };
  
  const handleRequestSubmit = (data: any) => {
    console.log('New request:', data);
    alert('Votre demande a été envoyée avec succès ! Vous serez notifié dès qu\'elle sera validée.');
  };
  
  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
  };
  
  // If viewing a specific request
  if (selectedRequest) {
    return (
      <div className="space-y-6">
        <RequestDetailView
          request={selectedRequest}
          userRole={userRole}
          onBack={() => setSelectedRequest(null)}
          onAddMilestone={() => alert('Ajouter une nouvelle étape')}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* VIP Welcome Banner */}
      <div className="rounded-xl p-8 text-white" style={{ background: "linear-gradient(135deg, #E94C39 , #C43D2F)" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <h2 className="!text-white text-2xl font-bold">Espace VIP</h2>
            </div>
            <p className="!text-white mb-6 max-w-2xl">
              Bienvenue dans votre espace privilégié. Mandatez RÉALITÉS SÉNÉGAL pour vos services immobiliers 
              et suivez l'avancement de vos demandes en temps réel.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Services exclusifs</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Suivi en temps réel</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Star className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Accompagnement dédié</span>
              </div>
            </div>
          </div>
          <Crown className="w-24 h-24 text-gold-300 opacity-30 hidden md:block" />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {userRequests.filter(r => r.status === 'en-cours').length}
              </p>
              <p className="text-xs text-neutral-500">En cours</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {userRequests.filter(r => r.status === 'en-attente-validation').length}
              </p>
              <p className="text-xs text-neutral-500">En attente</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {userRequests.filter(r => r.status === 'terminee').length}
              </p>
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
              <p className="text-2xl font-bold text-neutral-900">{userRequests.length}</p>
              <p className="text-xs text-neutral-500">Total demandes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'services' | 'requests' | 'vefa')}>
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Demandes
            {userRequests.filter(r => r.status === 'en-cours').length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                {userRequests.filter(r => r.status === 'en-cours').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="vefa" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Mes VEFA
            {mockClientVEFAProjects.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                {mockClientVEFAProjects.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Services Tab */}
        <TabsContent value="services" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Nos services VIP</h3>
            <p className="text-neutral-600">
              Sélectionnez un service pour créer une nouvelle demande. Notre équipe prendra en charge votre dossier dans les plus brefs délais.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vipServices.filter(s => s.isActive).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={handleServiceSelect}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Requests Tab */}
        <TabsContent value="requests" className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Mes demandes de service</h3>
              <p className="text-sm text-neutral-600">
                Suivez l'avancement de vos demandes et consultez les étapes de traitement
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <select
                value={requestFilter}
                onChange={(e) => setRequestFilter(e.target.value as any)}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Toutes les demandes</option>
                <option value="en-attente-validation">En attente</option>
                <option value="en-cours">En cours</option>
                <option value="terminee">Terminées</option>
                <option value="refusee">Refusées</option>
              </select>
            </div>
          </div>
          
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onView={handleViewRequest}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-neutral-900 mb-2">
                {requestFilter === 'all' ? 'Aucune demande' : 'Aucune demande correspondante'}
              </h4>
              <p className="text-neutral-600 mb-4">
                {requestFilter === 'all' 
                  ? 'Vous n\'avez pas encore créé de demande de service'
                  : 'Aucune demande ne correspond au filtre sélectionné'}
              </p>
              {requestFilter === 'all' && (
                <Button onClick={() => setActiveTab('services')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une demande
                </Button>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>

     

      {/* Service Request Modal */}
      {selectedService && (
        <ServiceRequestModal
          service={selectedService}
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false);
            setSelectedService(null);
          }}
          onSubmit={handleRequestSubmit}
        />
      )}
    </div>
  );
}
