import React, { useState } from 'react';
import { ArrowLeft, Eye, Edit2, Trash2, Upload, FileText, DollarSign, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../Button';
import { VEFAProject, VEFAMilestone } from '../../types';

interface VEFACatalogAdminProps {
  onNavigate?: (page: string) => void;
}

// Données de test - À récupérer du backend en production
const initialVEFAProjects: VEFAProject[] = [
  {
    id: 'vefa-001',
    name: 'Résidence Almadies Premium',
    description: 'Projet résidentiel haut standing avec 50 villas modernes',
    location: 'Almadies, Dakar',
    status: 'en-construction',
    startDate: '2024-01-15',
    expectedEndDate: '2026-12-31',
    totalBudget: 5000000000,
    spentBudget: 2500000000,
    ownerName: 'RÉALITÉS SÉNÉGAL',
    developerName: 'Développement Sénégal',
    contactEmail: 'vefa001@realites-senegal.sn',
    contactPhone: '+221 77 123 45 67',
    totalUnits: 50,
    milestones: [
      {
        id: 'milestone-001',
        vefaProjectId: 'vefa-001',
        title: 'Préparation du terrain',
        description: 'Nettoyage et préparation du site',
        status: 'termine',
        order: 1,
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        completionPercentage: 100,
        createdAt: '2024-01-10',
        updatedAt: '2024-03-15',
      },
      {
        id: 'milestone-002',
        vefaProjectId: 'vefa-001',
        title: 'Fondations',
        description: 'Réalisation des fondations de toutes les villas',
        status: 'en-cours',
        order: 2,
        startDate: '2024-03-16',
        endDate: '2024-08-15',
        completionPercentage: 65,
        createdAt: '2024-01-10',
        updatedAt: '2024-06-20',
      },
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-06-20',
    createdBy: 'admin-001',
  },
  {
    id: 'vefa-002',
    name: 'Immeubles Mermoz',
    description: 'Résidence de luxe avec 30 appartements',
    location: 'Mermoz, Dakar',
    status: 'planification',
    startDate: '2025-06-01',
    expectedEndDate: '2027-12-31',
    totalBudget: 3000000000,
    spentBudget: 0,
    ownerName: 'Immobilier Plus',
    developerName: 'Constructa',
    contactEmail: 'vefa002@immoplus.com',
    contactPhone: '+221 76 234 56 78',
    totalUnits: 30,
    milestones: [],
    createdAt: '2024-12-20',
    updatedAt: '2024-12-20',
    createdBy: 'admin-001',
  },
];

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'payé' | 'en-attente' | 'retardé';
  description: string;
}

export function VEFACatalogAdmin({ onNavigate }: VEFACatalogAdminProps) {
  const [projects, setProjects] = useState<VEFAProject[]>(initialVEFAProjects);
  const [selectedProject, setSelectedProject] = useState<VEFAProject | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'milestones' | 'documents'>('info');
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'doc-1', name: 'Plan cadastral.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-06-15' },
    { id: 'doc-2', name: 'Permis de construction.pdf', type: 'PDF', size: '1.8 MB', uploadedAt: '2024-05-20' },
  ]);
  const [payments, setPayments] = useState<Payment[]>([
    { id: 'pay-1', date: '2024-06-01', amount: 500000000, status: 'payé', description: 'Premier tranche' },
    { id: 'pay-2', date: '2024-12-01', amount: 500000000, status: 'payé', description: 'Deuxième tranche' },
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'termine':
      case 'planification':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'en-construction':
      case 'en-cours':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'presque-termine':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'suspendu':
      case 'retarde':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet VEFA?')) {
      setProjects(projects.filter(p => p.id !== projectId));
      setSelectedProject(null);
    }
  };

  const handleUploadDocument = () => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: 'Nouveau document.pdf',
      type: 'PDF',
      size: '0.5 MB',
      uploadedAt: new Date().toISOString(),
    };
    setDocuments([...documents, newDoc]);
  };

  // Vue tableau des VEFA
  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Catalogue VEFA</h1>
            <p className="text-neutral-600 mt-2">Consultez tous les projets VEFA</p>
          </div>
        </div>

        {/* Tableau des VEFA */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Projet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Localisation</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Jalons</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-neutral-900">{project.name}</p>
                        <p className="text-sm text-neutral-600">{project.totalUnits} unités</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-700">{project.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-neutral-900 font-semibold">{formatCurrency(project.totalBudget)}</div>
                      <div className="text-sm text-neutral-600">{formatCurrency(project.spentBudget)} dépensé</div>
                      <div className="mt-2 w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-700"
                          style={{ width: `${(project.spentBudget / project.totalBudget) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">{project.milestones.length} jalons</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Vue détails du VEFA
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-primary-700 hover:text-primary-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au catalogue
          </button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{selectedProject.name}</h1>
            <p className="text-neutral-600 mt-1">{selectedProject.description}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedProject.status)}`}>
          {selectedProject.status}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'info'
                ? 'border-primary-700 text-primary-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Informations du VEFA
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'milestones'
                ? 'border-primary-700 text-primary-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Jalons et Paiements
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'documents'
                ? 'border-primary-700 text-primary-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Documents
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Informations du VEFA */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Informations Générales */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Informations générales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">Localisation</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-700" />
                    <p className="text-lg font-semibold text-neutral-900">{selectedProject.location}</p>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">Nombre d'unités</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-700" />
                    <p className="text-lg font-semibold text-neutral-900">{selectedProject.totalUnits} unités</p>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">Date de début</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-700" />
                    <p className="text-lg font-semibold text-neutral-900">{formatDate(selectedProject.startDate)}</p>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">Date prévue de fin</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-700" />
                    <p className="text-lg font-semibold text-neutral-900">{formatDate(selectedProject.expectedEndDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Budget</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-neutral-200 rounded-lg p-4 bg-blue-50">
                  <p className="text-sm text-neutral-600 mb-1">Budget total</p>
                  <p className="text-2xl font-bold text-primary-700">{formatCurrency(selectedProject.totalBudget)}</p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4 bg-orange-50">
                  <p className="text-sm text-neutral-600 mb-1">Dépensé</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(selectedProject.spentBudget)}</p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4 bg-green-50">
                  <p className="text-sm text-neutral-600 mb-1">Restant</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedProject.totalBudget - selectedProject.spentBudget)}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-neutral-700">Progression du budget</span>
                  <span className="text-sm font-semibold text-neutral-700">
                    {Math.round((selectedProject.spentBudget / selectedProject.totalBudget) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-700 transition-all"
                    style={{ width: `${(selectedProject.spentBudget / selectedProject.totalBudget) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Contacts et Acteurs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-2">Propriétaire</p>
                  <p className="text-lg font-semibold text-neutral-900">{selectedProject.ownerName}</p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-2">Promoteur/Développeur</p>
                  <p className="text-lg font-semibold text-neutral-900">{selectedProject.developerName}</p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-2">Email de contact</p>
                  <p className="text-neutral-900 break-all">{selectedProject.contactEmail}</p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-2">Téléphone</p>
                  <p className="text-neutral-900">{selectedProject.contactPhone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jalons et Paiements */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            {/* Jalons */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Jalons du projet ({selectedProject.milestones.length})</h2>
              {selectedProject.milestones.length === 0 ? (
                <div className="text-center py-8 text-neutral-600">
                  Aucun jalon défini pour ce projet
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProject.milestones.map((milestone) => (
                    <div key={milestone.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">{milestone.title}</h3>
                          <p className="text-neutral-600 mt-1">{milestone.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-600">Début</p>
                          <p className="font-semibold text-neutral-900">{formatDate(milestone.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Fin</p>
                          <p className="font-semibold text-neutral-900">{formatDate(milestone.endDate)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Ordre</p>
                          <p className="font-semibold text-neutral-900">#{milestone.order}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Progression</p>
                          <p className="font-semibold text-neutral-900">{milestone.completionPercentage}%</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-700"
                            style={{ width: `${milestone.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paiements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Paiements ({payments.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Montant</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-neutral-50 transition">
                        <td className="px-4 py-3 text-neutral-700">{formatDate(payment.date)}</td>
                        <td className="px-4 py-3 font-semibold text-neutral-900">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-3 text-neutral-700">{payment.description}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                            payment.status === 'payé' ? 'bg-green-100 text-green-800 border-green-300' :
                            payment.status === 'en-attente' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-red-100 text-red-800 border-red-300'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 font-semibold">Total payé</span>
                  <span className="text-xl font-bold text-primary-700">
                    {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Documents ({documents.length})</h2>
              <Button onClick={handleUploadDocument} className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Ajouter un document
              </Button>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-12 text-neutral-600">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun document pour ce projet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-8 h-8 text-primary-700" />
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-900">{doc.name}</p>
                        <p className="text-sm text-neutral-600">{doc.type} • {doc.size} • Uploadé le {formatDate(doc.uploadedAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
