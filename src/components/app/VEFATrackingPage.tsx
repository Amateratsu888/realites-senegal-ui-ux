import React, { useState } from 'react';
import { Building2, CheckCircle, Clock, Image as ImageIcon, FileText, Eye, Calendar, AlertCircle, TrendingUp, DollarSign, Download, X, ArrowLeft, MapPin, User, Phone, Mail, ChevronRight, Play, Pause, Upload, MessageSquare, FileCheck, Info, Smartphone } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Progress } from '../ui/progress';

interface VEFATrackingPageProps {
  onNavigate: (page: string) => void;
}

// Types for VEFA data
interface VEFAProof {
  type: 'image' | 'document';
  name: string;
  date: string;
  url?: string;
}

interface VEFAMilestone {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  completedDate: string | null;
  paidStatus: 'paid' | 'unpaid';
  paymentAmount: number;
  paymentDate?: string;
  receiptUrl?: string;
  proofs: VEFAProof[];
  startDate?: string;
  endDate?: string;
  completionPercentage?: number;
}

interface VEFAProject {
  id: string;
  name: string;
  location: string;
  type: string;
  totalPrice: string;
  totalBudget?: number;
  startDate: string;
  expectedEndDate: string;
  progress: number;
  currentMilestone: string;
  description?: string;
  ownerName?: string;
  developerName?: string;
  contactPhone?: string;
  contactEmail?: string;
  totalUnits?: number;
  milestones: VEFAMilestone[];
}

export function VEFATrackingPage({ onNavigate }: VEFATrackingPageProps) {
  const [selectedProject, setSelectedProject] = useState<VEFAProject | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMilestonePayment, setSelectedMilestonePayment] = useState<{ projectId: string; milestoneId: string; amount: number } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

  const paymentMethods = [
    { id: 'bank-transfer', name: 'Virement bancaire', description: 'Transfert direct vers compte bancaire' },
    { id: 'card', name: 'Carte bancaire', description: 'Visa, Mastercard, American Express' },
    { id: 'mobile-money', name: 'Mobile Money', description: 'Orange Money, Tigo Cash' },
  ];

  // Informations bancaires de l'entreprise
  const bankInfo = {
    bankName: 'Banque Atlantique Sénégal',
    accountHolder: 'RÉALITÉS SÉNÉGAL SARL',
    iban: 'SN08 SN08 0101 0101 0000 0000 1234',
    bic: 'ATLASNDA',
    accountNumber: '0101 0101 0000 0000 1234',
  };

  // Mock data for VEFA projects (Vente en l'État Futur d'Achèvement)
  const vefaProjects: VEFAProject[] = [
    {
      id: 'vefa-1',
      name: 'Résidence Les Orchidées',
      location: 'Almadies, Dakar',
      type: 'Appartement T4',
      totalPrice: '85 000 000 FCFA',
      totalBudget: 85000000,
      startDate: '15 Mars 2024',
      expectedEndDate: '15 Septembre 2025',
      progress: 65,
      currentMilestone: 'Finitions intérieures',
      description: 'Appartement de standing dans la résidence Les Orchidées avec vue mer',
      ownerName: 'RÉALITÉS SÉNÉGAL',
      developerName: 'Construction Sénégal',
      contactPhone: '+221 77 123 45 67',
      contactEmail: 'contact@realites-senegal.sn',
      totalUnits: 1,
      milestones: [
        {
          id: 'm1',
          name: 'Fondations et gros œuvre',
          description: 'Terrassement, fondations, dalle béton',
          status: 'completed',
          completedDate: '20 Mai 2024',
          paidStatus: 'paid',
          paymentAmount: 21250000,
          paymentDate: '2024-05-25',
          receiptUrl: 'receipt-001.pdf',
          startDate: '15 Mars 2024',
          endDate: '20 Mai 2024',
          completionPercentage: 100,
          proofs: [
            { type: 'image', name: 'fondations-1.jpg', date: '15 Mai 2024' },
            { type: 'image', name: 'fondations-2.jpg', date: '18 Mai 2024' },
            { type: 'document', name: 'rapport-conformite.pdf', date: '20 Mai 2024' },
          ],
        },
        {
          id: 'm2',
          name: 'Élévation des murs et toiture',
          description: 'Construction des murs porteurs, charpente et toiture',
          status: 'completed',
          completedDate: '25 Août 2024',
          paidStatus: 'paid',
          paymentAmount: 21250000,
          paymentDate: '2024-08-30',
          receiptUrl: 'receipt-002.pdf',
          startDate: '21 Mai 2024',
          endDate: '25 Août 2024',
          completionPercentage: 100,
          proofs: [
            { type: 'image', name: 'elevation-1.jpg', date: '10 Août 2024' },
            { type: 'image', name: 'toiture-complete.jpg', date: '25 Août 2024' },
          ],
        },
        {
          id: 'm3',
          name: 'Finitions intérieures',
          description: 'Plomberie, électricité, revêtements sols et murs',
          status: 'in-progress',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 21250000,
          startDate: '26 Août 2024',
          endDate: '15 Juin 2025',
          completionPercentage: 60,
          proofs: [
            { type: 'image', name: 'plomberie-installation.jpg', date: '02 Jan 2025' },
            { type: 'image', name: 'electricite-avancement.jpg', date: '20 Déc 2024' },
          ],
        },
        {
          id: 'm4',
          name: 'Aménagements extérieurs',
          description: 'Jardins, parkings, clôtures et accès',
          status: 'pending',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 21250000,
          startDate: '16 Juin 2025',
          endDate: '15 Août 2025',
          completionPercentage: 0,
          proofs: [],
        },
        {
          id: 'm5',
          name: 'Livraison et réception',
          description: 'Inspection finale et remise des clés',
          status: 'pending',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 0,
          startDate: '16 Août 2025',
          endDate: '15 Septembre 2025',
          completionPercentage: 0,
          proofs: [],
        },
      ],
    },
    {
      id: 'vefa-2',
      name: 'Villa Prestige Ngor',
      location: 'Ngor, Dakar',
      type: 'Villa 5 pièces',
      totalPrice: '180 000 000 FCFA',
      totalBudget: 180000000,
      startDate: '01 Janvier 2024',
      expectedEndDate: '01 Juillet 2025',
      progress: 45,
      currentMilestone: 'Élévation des murs',
      description: 'Villa de prestige avec piscine et jardin tropical',
      ownerName: 'RÉALITÉS SÉNÉGAL',
      developerName: 'Premium Build',
      contactPhone: '+221 77 888 99 00',
      contactEmail: 'contact@realites-senegal.sn',
      totalUnits: 1,
      milestones: [
        {
          id: 'm1',
          name: 'Fondations et gros œuvre',
          description: 'Terrassement, fondations, dalle béton',
          status: 'completed',
          completedDate: '15 Mars 2024',
          paidStatus: 'paid',
          paymentAmount: 45000000,
          paymentDate: '2024-03-20',
          receiptUrl: 'receipt-villa-001.pdf',
          startDate: '01 Janvier 2024',
          endDate: '15 Mars 2024',
          completionPercentage: 100,
          proofs: [
            { type: 'image', name: 'fondations-villa.jpg', date: '10 Mars 2024' },
            { type: 'document', name: 'certificat-fondations.pdf', date: '15 Mars 2024' },
          ],
        },
        {
          id: 'm2',
          name: 'Élévation des murs et toiture',
          description: 'Construction des murs porteurs, charpente et toiture',
          status: 'in-progress',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 45000000,
          startDate: '16 Mars 2024',
          endDate: '15 Juin 2024',
          completionPercentage: 70,
          proofs: [
            { type: 'image', name: 'murs-etage1.jpg', date: '05 Jan 2025' },
          ],
        },
        {
          id: 'm3',
          name: 'Finitions intérieures',
          description: 'Plomberie, électricité, revêtements sols et murs',
          status: 'pending',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 45000000,
          startDate: '16 Juin 2024',
          endDate: '15 Janvier 2025',
          completionPercentage: 0,
          proofs: [],
        },
        {
          id: 'm4',
          name: 'Aménagements extérieurs',
          description: 'Piscine, jardins, parkings, clôtures',
          status: 'pending',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 45000000,
          startDate: '16 Janvier 2025',
          endDate: '15 Mai 2025',
          completionPercentage: 0,
          proofs: [],
        },
        {
          id: 'm5',
          name: 'Livraison et réception',
          description: 'Inspection finale et remise des clés',
          status: 'pending',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 0,
          startDate: '16 Mai 2025',
          endDate: '01 Juillet 2025',
          completionPercentage: 0,
          proofs: [],
        },
      ],
    },
    {
      id: 'vefa-3',
      name: 'Résidence Mermoz Elite',
      location: 'Mermoz, Dakar',
      type: 'Appartement T3',
      totalPrice: '65 000 000 FCFA',
      totalBudget: 65000000,
      startDate: '01 Juin 2024',
      expectedEndDate: '01 Décembre 2025',
      progress: 25,
      currentMilestone: 'Fondations et gros œuvre',
      description: 'Appartement moderne dans un quartier prisé',
      ownerName: 'Immobilier Plus',
      developerName: 'Constructa',
      contactPhone: '+221 76 234 56 78',
      contactEmail: 'contact@immoplus.com',
      totalUnits: 1,
      milestones: [
        {
          id: 'm1',
          name: 'Fondations et gros œuvre',
          description: 'Terrassement, fondations, dalle béton',
          status: 'in-progress',
          completedDate: null,
          paidStatus: 'paid',
          paymentAmount: 16250000,
          paymentDate: '2024-06-15',
          receiptUrl: 'receipt-mermoz-001.pdf',
          startDate: '01 Juin 2024',
          endDate: '30 Septembre 2024',
          completionPercentage: 80,
          proofs: [
            { type: 'image', name: 'fondations-mermoz.jpg', date: '15 Août 2024' },
          ],
        },
        {
          id: 'm2',
          name: 'Élévation des murs et toiture',
          description: 'Construction des murs porteurs, charpente et toiture',
          status: 'pending',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 16250000,
          startDate: '01 Octobre 2024',
          endDate: '31 Mars 2025',
          completionPercentage: 0,
          proofs: [],
        },
        {
          id: 'm3',
          name: 'Finitions intérieures',
          description: 'Plomberie, électricité, revêtements sols et murs',
          status: 'pending',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 16250000,
          startDate: '01 Avril 2025',
          endDate: '30 Septembre 2025',
          completionPercentage: 0,
          proofs: [],
        },
        {
          id: 'm4',
          name: 'Aménagements extérieurs',
          description: 'Jardins, parkings, clôtures et accès',
          status: 'pending',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 16250000,
          startDate: '01 Octobre 2025',
          endDate: '30 Novembre 2025',
          completionPercentage: 0,
          proofs: [],
        },
        {
          id: 'm5',
          name: 'Livraison et réception',
          description: 'Inspection finale et remise des clés',
          status: 'pending',
          completedDate: null,
          paidStatus: 'unpaid',
          paymentAmount: 0,
          startDate: '01 Décembre 2025',
          endDate: '01 Décembre 2025',
          completionPercentage: 0,
          proofs: [],
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-slate-400 bg-slate-50';
      default:
        return 'text-slate-400 bg-slate-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      case 'pending':
        return 'À venir';
      default:
        return 'À venir';
    }
  };

  const getProjectStatusLabel = (progress: number) => {
    if (progress === 100) return 'Terminé';
    if (progress >= 75) return 'Presque terminé';
    if (progress >= 50) return 'En bonne voie';
    if (progress >= 25) return 'En cours';
    return 'Démarré';
  };

  const getProjectStatusColor = (progress: number) => {
    if (progress === 100) return 'bg-green-100 text-green-700';
    if (progress >= 75) return 'bg-emerald-100 text-emerald-700';
    if (progress >= 50) return 'bg-blue-100 text-blue-700';
    if (progress >= 25) return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-700';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalPaid = (milestones: VEFAMilestone[]) => {
    return milestones.filter(m => m.paidStatus === 'paid').reduce((acc, m) => acc + m.paymentAmount, 0);
  };

  const calculateTotalRemaining = (milestones: VEFAMilestone[]) => {
    return milestones.filter(m => m.paidStatus !== 'paid').reduce((acc, m) => acc + m.paymentAmount, 0);
  };

  const handlePaymentMethodSelect = () => {
    if (selectedPaymentMethod && selectedMilestonePayment) {
      alert(`Paiement de ${formatCurrency(selectedMilestonePayment.amount)} confirmé via ${selectedPaymentMethod}`);
      setShowPaymentModal(false);
      setSelectedPaymentMethod(null);
      setSelectedMilestonePayment(null);
    }
  };

  const handleDownloadReceipt = (receiptUrl: string) => {
    alert(`Téléchargement du reçu: ${receiptUrl}`);
  };

  const handleContactTechnician = (milestone: VEFAMilestone) => {
    alert(`Contacter le technicien pour le jalon: ${milestone.name}`);
  };

  const handleRequestUpdate = (milestone: VEFAMilestone) => {
    alert(`Demande de mise à jour pour le jalon: ${milestone.name}`);
  };

  const handleViewDocument = (doc: VEFAProof) => {
    alert(`Visualisation du document: ${doc.name}`);
  };

  // View: Projects List (Table)
  const renderProjectsTable = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-7 h-7 text-primary-700" />
          <h2 className="text-primary-700">Suivi de mes Projets VEFA</h2>
        </div>
        <p className="text-slate-600">
          Suivez l'avancement de vos projets en construction avec les preuves uploadées par nos techniciens en temps réel
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Projets VEFA</p>
              <p className="text-2xl font-bold text-slate-900">{vefaProjects.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">En construction</p>
              <p className="text-2xl font-bold text-slate-900">{vefaProjects.filter(p => p.progress < 100 && p.progress > 0).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Jalons terminés</p>
              <p className="text-2xl font-bold text-slate-900">
                {vefaProjects.reduce((acc, p) => acc + p.milestones.filter(m => m.status === 'completed').length, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total investi</p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(vefaProjects.reduce((acc, p) => acc + calculateTotalPaid(p.milestones), 0))}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Projects Table */}
      {vefaProjects.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-900">Mes projets VEFA</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Projet</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix total</TableHead>
                <TableHead>Avancement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Livraison prévue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vefaProjects.map((project) => (
                <TableRow 
                  key={project.id} 
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setSelectedProject(project)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Building2 className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{project.name}</p>
                        <p className="text-xs text-slate-500">
                          {project.milestones.filter(m => m.status === 'completed').length}/{project.milestones.length} jalons
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{project.type}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-900">{project.totalPrice}</span>
                  </TableCell>
                  <TableCell>
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getProjectStatusColor(project.progress)}>
                      {getProjectStatusLabel(project.progress)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3 h-3" />
                      <span className="text-sm">{project.expectedEndDate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Détails
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="mb-2">Aucun projet VEFA en cours</h3>
          <p className="text-neutral-600 mb-6">
            Vous n'avez pas encore de projet en construction
          </p>
        </div>
      )}
    </div>
  );

  // View: Project Detail
  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    const project = selectedProject;
    const totalPaid = calculateTotalPaid(project.milestones);
    const totalRemaining = calculateTotalRemaining(project.milestones);

    return (
      <div className="space-y-6">
        {/* Back button and header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedProject(null)}
            className="mb-4 -ml-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Building2 className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-700">{project.name}</h2>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                    <span>•</span>
                    <span>{project.type}</span>
                  </div>
                </div>
              </div>
              {project.description && (
                <p className="text-slate-600 mt-3">{project.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${getProjectStatusColor(project.progress)} text-base px-4 py-1`}>
                {project.progress}% complété
              </Badge>
              <p className="text-sm text-slate-500">
                Étape actuelle: <span className="text-primary-600 font-medium">{project.currentMilestone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Date de début</p>
                <p className="font-semibold text-slate-900">{project.startDate}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Livraison prévue</p>
                <p className="font-semibold text-slate-900">{project.expectedEndDate}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Prix total</p>
                <p className="font-semibold text-slate-900">{project.totalPrice}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Montant payé</p>
                <p className="font-semibold text-green-600">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Info */}
        {(project.developerName || project.contactPhone || project.contactEmail) && (
          <Card className="p-5">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Informations de contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.developerName && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Développeur</p>
                    <p className="font-medium text-slate-900">{project.developerName}</p>
                  </div>
                </div>
              )}
              {project.contactPhone && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Téléphone</p>
                    <p className="font-medium text-slate-900">{project.contactPhone}</p>
                  </div>
                </div>
              )}
              {project.contactEmail && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-900">{project.contactEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Progress Overview */}
        <Card className="p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Avancement global du projet
          </h4>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Progression</span>
              <span className="text-lg font-bold text-primary-600">{project.progress}%</span>
            </div>
            {/* Container avec largeur dynamique selon le pourcentage */}
            <div className="relative">
              {/* Barre de progression avec largeur proportionnelle */}
              <div 
                className="h-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 relative"
                style={{ width: `${project.progress}%`, minWidth: project.progress > 0 ? '40px' : '0px' }}
              >
                {/* Indicateur de fin si pas à 100% */}
                {project.progress < 100 && project.progress > 0 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary-600 rounded-full shadow-sm" />
                )}
              </div>
              {/* Zone restante en pointillés */}
              {project.progress < 100 && (
                <div 
                  className="absolute top-0 h-4 border-2 border-dashed border-slate-300 rounded-full"
                  style={{ 
                    left: `${project.progress}%`, 
                    width: `${100 - project.progress}%`,
                    marginLeft: '2px'
                  }}
                />
              )}
            </div>
            {/* Légende */}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
                <span>Complété ({project.progress}%)</span>
              </div>
              {project.progress < 100 && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-dashed border-slate-300 rounded-full" />
                  <span>Restant ({100 - project.progress}%)</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {project.milestones.filter(m => m.status === 'completed').length}
                </span>
              </div>
              <p className="text-xs text-slate-600">Jalons terminés</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {project.milestones.filter(m => m.status === 'in-progress').length}
                </span>
              </div>
              <p className="text-xs text-slate-600">En cours</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertCircle className="w-5 h-5 text-slate-400" />
                <span className="text-2xl font-bold text-slate-900">
                  {project.milestones.filter(m => m.status === 'pending').length}
                </span>
              </div>
              <p className="text-xs text-slate-600">À venir</p>
            </div>
          </div>
        </Card>

        {/* Payment Summary */}
        <Card className="p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-600" />
            Récapitulatif des paiements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-1">Montant payé</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-green-600 mt-1">
                {project.milestones.filter(m => m.paidStatus === 'paid').length} jalon(s) payé(s)
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700 mb-1">Montant restant</p>
              <p className="text-xl font-bold text-amber-700">{formatCurrency(totalRemaining)}</p>
              <p className="text-xs text-amber-600 mt-1">
                {project.milestones.filter(m => m.paidStatus !== 'paid' && m.paymentAmount > 0).length} jalon(s) à payer
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700 mb-1">Total du projet</p>
              <p className="text-xl font-bold text-slate-900">{project.totalPrice}</p>
              <p className="text-xs text-slate-600 mt-1">
                {Math.round((totalPaid / (project.totalBudget || 1)) * 100)}% payé
              </p>
            </div>
          </div>
        </Card>

        {/* Milestones Timeline */}
        <Card className="p-5">
          <h4 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary-600" />
            Jalons du projet
          </h4>
          
          <div className="space-y-4">
            {project.milestones.map((milestone, index) => {
              const isExpanded = expandedMilestone === milestone.id;
              
              return (
                <div key={milestone.id} className="relative">
                  {/* Timeline connector */}
                  {index !== project.milestones.length - 1 && (
                    <div className="absolute left-5 top-14 bottom-0 w-0.5 bg-slate-200 -mb-4" />
                  )}
                  
                  {/* Milestone Card */}
                  <div
                    className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                      milestone.status === 'completed' ? 'border-green-200 bg-green-50/30' :
                      milestone.status === 'in-progress' ? 'border-blue-200 bg-blue-50/30' :
                      'border-slate-200 bg-slate-50/30'
                    }`}
                  >
                    {/* Milestone Header - Always visible */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-white/50 transition-colors"
                      onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className={`p-2 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-100' :
                          milestone.status === 'in-progress' ? 'bg-blue-100' :
                          'bg-slate-100'
                        }`}>
                          {getStatusIcon(milestone.status)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h5 className="font-semibold text-slate-900">{milestone.name}</h5>
                                <Badge variant="secondary" className={getStatusColor(milestone.status)}>
                                  {getStatusLabel(milestone.status)}
                                </Badge>
                                {milestone.paidStatus === 'paid' && (
                                  <Badge className="bg-green-600 text-white flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Payé
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">{milestone.description}</p>
                              
                              {/* Dates and progress */}
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                                {milestone.startDate && (
                                  <span className="flex items-center gap-1">
                                    <Play className="w-3 h-3" />
                                    Début: {milestone.startDate}
                                  </span>
                                )}
                                {milestone.endDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Fin: {milestone.endDate}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Expand indicator */}
                            <ChevronRight 
                              className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-white p-4 space-y-4">
                        {/* Payment Section */}
                        {milestone.paymentAmount > 0 && (
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div>
                                <p className="text-sm text-slate-600 mb-1">Montant à payer pour ce jalon</p>
                                <p className="text-xl font-bold text-slate-900">{formatCurrency(milestone.paymentAmount)}</p>
                                {milestone.paymentDate && (
                                  <p className="text-xs text-green-600 mt-1">
                                    Payé le {milestone.paymentDate}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {milestone.paidStatus === 'paid' ? (
                                  <>
                                    <Badge className="bg-green-600 text-white px-3 py-1">
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Paiement effectué
                                    </Badge>
                                    {milestone.receiptUrl && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDownloadReceipt(milestone.receiptUrl || '')}
                                        className="flex items-center gap-1"
                                      >
                                        <Download className="w-4 h-4" />
                                        Télécharger reçu
                                      </Button>
                                    )}
                                  </>
                                ) : milestone.status !== 'pending' ? (
                                  <Button
                                    onClick={() => {
                                      setSelectedMilestonePayment({ 
                                        projectId: project.id, 
                                        milestoneId: milestone.id,
                                        amount: milestone.paymentAmount
                                      });
                                      setShowPaymentModal(true);
                                    }}
                                    className="flex items-center gap-1"
                                  >
                                    <DollarSign className="w-4 h-4" />
                                    Effectuer le paiement
                                  </Button>
                                ) : (
                                  <Badge className="bg-slate-200 text-slate-600">
                                    Paiement différé
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions Section */}
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactTechnician(milestone)}
                            className="flex items-center gap-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Contacter le technicien
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRequestUpdate(milestone)}
                            className="flex items-center gap-1"
                          >
                            <Upload className="w-4 h-4" />
                            Demander une mise à jour
                          </Button>
                          {milestone.completedDate && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1 text-green-600 border-green-300"
                            >
                              <FileCheck className="w-4 h-4" />
                              Validé le {milestone.completedDate}
                            </Button>
                          )}
                        </div>

                        {/* Proofs Section */}
                        {milestone.proofs.length > 0 && (
                          <div>
                            <h6 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                              <Eye className="w-4 h-4 text-slate-600" />
                              Preuves et documents ({milestone.proofs.length})
                            </h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {milestone.proofs.map((proof, proofIndex) => (
                                <div
                                  key={proofIndex}
                                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all cursor-pointer"
                                  onClick={() => handleViewDocument(proof)}
                                >
                                  {proof.type === 'image' ? (
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                      <ImageIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                  ) : (
                                    <div className="p-2 bg-red-100 rounded-lg">
                                      <FileText className="w-5 h-5 text-red-600" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{proof.name}</p>
                                    <p className="text-xs text-slate-500">{proof.date}</p>
                                  </div>
                                  <Eye className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* No proofs message */}
                        {milestone.proofs.length === 0 && milestone.status !== 'completed' && (
                          <div className="p-4 bg-slate-50 rounded-lg text-center">
                            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">
                              {milestone.status === 'pending' 
                                ? 'Les preuves seront disponibles une fois ce jalon démarré'
                                : 'Aucune preuve uploadée pour le moment'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPaymentProofFile(file);
    } else {
      alert('Veuillez sélectionner un fichier PDF');
    }
  };

  return (
    <div className="space-y-6">
      {selectedProject ? renderProjectDetail() : renderProjectsTable()}
      {/* Payment Modal */}
      {showPaymentModal && selectedMilestonePayment && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h3>Effectuer un paiement</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPaymentMethod(null);
                  setPaymentProofFile(null);
                }}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-neutral-600 mb-2">Montant à payer</p>
                <h3 className="text-primary-700">
                  {formatCurrency(selectedMilestonePayment.amount)}
                </h3>
              </div>

              <div>
                <label className="block text-sm mb-3 text-neutral-700">Méthode de paiement</label>
                <div className="space-y-2">
                  {/* Mobile Money */}
                  <button
                    onClick={() => {
                      setSelectedPaymentMethod('mobile-money');
                      setPaymentProofFile(null);
                    }}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                      selectedPaymentMethod === 'mobile-money'
                        ? 'border-primary-700 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-neutral-900">Mobile Money</span>
                  </button>

                  {/* Carte bancaire */}
                  <button
                    onClick={() => {
                      setSelectedPaymentMethod('card');
                      setPaymentProofFile(null);
                    }}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                      selectedPaymentMethod === 'card'
                        ? 'border-primary-700 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-neutral-900">Carte bancaire</span>
                  </button>

                  {/* Virement bancaire */}
                  <button
                    onClick={() => {
                      setSelectedPaymentMethod('bank-transfer');
                      setPaymentProofFile(null);
                    }}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                      selectedPaymentMethod === 'bank-transfer'
                        ? 'border-primary-700 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-neutral-900">Virement bancaire</span>
                  </button>
                </div>
              </div>

              {/* Informations bancaires pour le virement */}
              {selectedPaymentMethod === 'bank-transfer' && (
                <div className="space-y-4">
                  {/* Infos bancaires */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Informations bancaires
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Banque :</span>
                        <span className="font-medium text-blue-900">{bankInfo.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Titulaire :</span>
                        <span className="font-medium text-blue-900">{bankInfo.accountHolder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">IBAN :</span>
                        <span className="font-medium text-blue-900 font-mono text-xs">{bankInfo.iban}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">BIC/SWIFT :</span>
                        <span className="font-medium text-blue-900 font-mono">{bankInfo.bic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">N° Compte :</span>
                        <span className="font-medium text-blue-900 font-mono">{bankInfo.accountNumber}</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-3 italic">
                      Veuillez indiquer votre nom et le numéro du jalon dans le libellé du virement.
                    </p>
                  </div>

                  {/* Upload de la preuve de paiement */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Preuve de paiement (PDF)
                    </h4>
                    <div className="space-y-3">
                      <label 
                        htmlFor="payment-proof" 
                        className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          paymentProofFile 
                            ? 'border-green-400 bg-green-50' 
                            : 'border-slate-300 bg-white hover:bg-slate-100'
                        }`}
                      >
                        {paymentProofFile ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <FileCheck className="w-6 h-6" />
                            <div>
                              <p className="font-medium">{paymentProofFile.name}</p>
                              <p className="text-xs text-green-600">Fichier sélectionné</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-slate-500">
                            <FileText className="w-8 h-8 mb-1" />
                            <p className="text-sm">Cliquez pour sélectionner un fichier PDF</p>
                          </div>
                        )}
                        <input 
                          id="payment-proof" 
                          type="file" 
                          accept=".pdf,application/pdf" 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                      </label>
                      {paymentProofFile && (
                        <button
                          onClick={() => setPaymentProofFile(null)}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Supprimer le fichier
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handlePaymentMethodSelect} 
                  className="flex-1"
                  disabled={!selectedPaymentMethod || (selectedPaymentMethod === 'bank-transfer' && !paymentProofFile)}
                >
                  {selectedPaymentMethod === 'bank-transfer' ? 'Soumettre le paiement' : 'Confirmer le paiement'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod(null);
                    setPaymentProofFile(null);
                  }}
                >
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
