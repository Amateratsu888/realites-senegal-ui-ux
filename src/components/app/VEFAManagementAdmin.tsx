import React, { useState } from 'react';
import { Plus, Trash2, Calendar, DollarSign, MapPin, User, Mail, Phone, CheckCircle, ArrowLeft, Eye, Upload, FileText, Users, Download, Pencil, X, Crown, UserMinus } from 'lucide-react';
import { Button } from '../Button';
import { VEFAProject, VEFAMilestone } from '../../types';

interface VEFAManagementAdminProps {
  onNavigate?: (page: string) => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

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
    tags: ['premium', 'residential'],
    milestones: [
      {
        id: 'milestone-001',
        vefaProjectId: 'vefa-001',
        title: 'Préparation du terrain',
        description: 'Nettoyage et préparation du site',
        status: 'termine',
        paidStatus: 'paid',
        paymentAmount: 500000000,
        paymentDate: '2024-03-20',
        receiptUrl: 'receipt-001.pdf',
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
        paidStatus: 'unpaid',
        paymentAmount: 750000000,
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
    tags: ['premium', 'luxury'],
    milestones: [],
    createdAt: '2024-12-20',
    updatedAt: '2024-12-20',
    createdBy: 'admin-001',
  },
  {
    id: 'vefa-003',
    name: 'Village Résidentiel Thiès',
    description: 'Complexe résidentiel avec 40 maisons modernes à Thiès',
    location: 'Thiès, Région de Thiès',
    status: 'planification',
    startDate: '2025-03-01',
    expectedEndDate: '2027-06-30',
    totalBudget: 2800000000,
    spentBudget: 0,
    ownerName: 'Immobilier Thiès SARL',
    developerName: 'Constructa Plus',
    contactEmail: 'vefa003@immo-thies.com',
    contactPhone: '+221 77 555 66 77',
    totalUnits: 40,
    tags: ['premium', 'commercial'],
    milestones: [],
    createdAt: '2025-01-10',
    updatedAt: '2025-01-10',
    createdBy: 'admin-001',
  },
  {
    id: 'vefa-004',
    name: 'Résidence Ngor Plage',
    description: 'Projet luxe en bord de mer avec vue océan - 25 villas prestige',
    location: 'Ngor, Dakar',
    status: 'en-construction',
    startDate: '2024-06-15',
    expectedEndDate: '2026-09-30',
    totalBudget: 6500000000,
    spentBudget: 3200000000,
    ownerName: 'RÉALITÉS SÉNÉGAL',
    developerName: 'Premium Build',
    contactEmail: 'vefa004@realites-senegal.sn',
    contactPhone: '+221 77 888 99 00',
    totalUnits: 25,
    tags: ['premium', 'luxury', 'beachfront'],
    milestones: [
      {
        id: 'milestone-004-001',
        vefaProjectId: 'vefa-004',
        title: 'Terrassement et viabilisation',
        description: 'Préparation du terrain et travaux de viabilisation',
        status: 'termine',
        paidStatus: 'paid',
        paymentAmount: 600000000,
        paymentDate: '2024-08-15',
        receiptUrl: 'receipt-004-001.pdf',
        order: 1,
        startDate: '2024-06-15',
        endDate: '2024-08-15',
        completionPercentage: 100,
        createdAt: '2024-06-10',
        updatedAt: '2024-08-15',
      },
      {
        id: 'milestone-004-002',
        vefaProjectId: 'vefa-004',
        title: 'Structures et gros œuvre',
        description: 'Construction des structures principales et gros œuvre',
        status: 'en-cours',
        paidStatus: 'unpaid',
        paymentAmount: 1500000000,
        order: 2,
        startDate: '2024-08-16',
        endDate: '2025-06-30',
        completionPercentage: 45,
        createdAt: '2024-06-10',
        updatedAt: '2025-01-15',
      },
    ],
    createdAt: '2024-06-10',
    updatedAt: '2025-01-15',
    createdBy: 'admin-001',
  },
  {
    id: 'vefa-005',
    name: 'Eco Park Saly',
    description: 'Complexe résidentiel éco-responsable avec 20 villas écologiques',
    location: 'Saly, Mbour',
    status: 'planification',
    startDate: '2025-09-01',
    expectedEndDate: '2027-12-31',
    totalBudget: 4200000000,
    spentBudget: 0,
    ownerName: 'Green Living SARL',
    developerName: 'EcoBuild Sénégal',
    contactEmail: 'vefa005@greenlivingsenegal.com',
    contactPhone: '+221 76 555 44 33',
    totalUnits: 20,
    tags: ['eco-friendly', 'residential', 'modern'],
    milestones: [],
    createdAt: '2025-01-12',
    updatedAt: '2025-01-12',
    createdBy: 'admin-001',
  },
  {
    id: 'vefa-006',
    name: 'Galeries Marchandes Kolda',
    description: 'Centre commercial moderne avec 15 boutiques et 8 appartements',
    location: 'Kolda, Région de Kolda',
    status: 'en-construction',
    startDate: '2024-09-20',
    expectedEndDate: '2025-12-15',
    totalBudget: 1800000000,
    spentBudget: 900000000,
    ownerName: 'Commerce Plus SARL',
    developerName: 'BuildComm',
    contactEmail: 'vefa006@commerceplus.com',
    contactPhone: '+221 77 444 33 22',
    totalUnits: 23,
    tags: ['commercial', 'retail', 'mixed-use'],
    milestones: [
      {
        id: 'milestone-006-001',
        vefaProjectId: 'vefa-006',
        title: 'Fondations du centre commercial',
        description: 'Réalisation des fondations et structure principale',
        status: 'termine',
        paidStatus: 'paid',
        paymentAmount: 400000000,
        paymentDate: '2024-11-20',
        receiptUrl: 'receipt-006-001.pdf',
        order: 1,
        startDate: '2024-09-20',
        endDate: '2024-11-20',
        completionPercentage: 100,
        createdAt: '2024-09-15',
        updatedAt: '2024-11-20',
      },
      {
        id: 'milestone-006-002',
        vefaProjectId: 'vefa-006',
        title: 'Installations mécaniques et électriques',
        description: 'Tous les travaux de MEE',
        status: 'en-cours',
        paidStatus: 'unpaid',
        paymentAmount: 500000000,
        order: 2,
        startDate: '2024-11-21',
        endDate: '2025-07-15',
        completionPercentage: 55,
        createdAt: '2024-09-15',
        updatedAt: '2025-01-10',
      },
    ],
    createdAt: '2024-09-15',
    updatedAt: '2025-01-10',
    createdBy: 'admin-001',
  },
  {
    id: 'vefa-007',
    name: 'Quartier Rénovation Kaolack',
    description: 'Programme de rénovation urbaine avec 35 maisons standardisées',
    location: 'Kaolack, Région de Kaolack',
    status: 'planification',
    startDate: '2025-05-01',
    expectedEndDate: '2027-04-30',
    totalBudget: 2200000000,
    spentBudget: 0,
    ownerName: 'Urban Dev Sénégal',
    developerName: 'Constructa National',
    contactEmail: 'vefa007@urbandev.com',
    contactPhone: '+221 77 333 22 11',
    totalUnits: 35,
    tags: ['renovacion', 'affordable', 'residential'],
    milestones: [],
    createdAt: '2025-01-08',
    updatedAt: '2025-01-08',
    createdBy: 'admin-001',
  },
  {
    id: 'vefa-008',
    name: 'Marina Luxury Club Saint-Louis',
    description: 'Resort prestige en bord de fleuve avec marina privée - 18 suites et 5 villas',
    location: 'Saint-Louis, Région de Saint-Louis',
    status: 'en-construction',
    startDate: '2024-04-10',
    expectedEndDate: '2026-06-30',
    totalBudget: 7800000000,
    spentBudget: 3900000000,
    ownerName: 'Hospitality Sénégal',
    developerName: 'Luxury Hotels Dev',
    contactEmail: 'vefa008@hospitalitysenegal.com',
    contactPhone: '+221 77 222 11 00',
    totalUnits: 23,
    tags: ['luxury', 'hospitality', 'resort'],
    milestones: [
      {
        id: 'milestone-008-001',
        vefaProjectId: 'vefa-008',
        title: 'Infrastructure et viabilisation',
        description: 'Routes, électricité, eau, télécommunications',
        status: 'termine',
        paidStatus: 'paid',
        paymentAmount: 800000000,
        paymentDate: '2024-07-15',
        receiptUrl: 'receipt-008-001.pdf',
        order: 1,
        startDate: '2024-04-10',
        endDate: '2024-07-15',
        completionPercentage: 100,
        createdAt: '2024-04-05',
        updatedAt: '2024-07-15',
      },
      {
        id: 'milestone-008-002',
        vefaProjectId: 'vefa-008',
        title: 'Structures bâtiments',
        description: 'Construction des structures de tous les bâtiments',
        status: 'en-cours',
        paidStatus: 'unpaid',
        paymentAmount: 2100000000,
        order: 2,
        startDate: '2024-07-16',
        endDate: '2025-12-31',
        completionPercentage: 60,
        createdAt: '2024-04-05',
        updatedAt: '2025-01-14',
      },
      {
        id: 'milestone-008-003',
        vefaProjectId: 'vefa-008',
        title: 'Finitions et équipements',
        description: 'Finitions intérieures et équipements hôteliers',
        status: 'planifie',
        paidStatus: 'unpaid',
        paymentAmount: 1900000000,
        order: 3,
        startDate: '2026-01-01',
        endDate: '2026-06-30',
        completionPercentage: 0,
        createdAt: '2024-04-05',
        updatedAt: '2024-04-05',
      },
    ],
    createdAt: '2024-04-05',
    updatedAt: '2025-01-14',
    createdBy: 'admin-001',
  },
  {
    id: 'vefa-009',
    name: 'Technopole Diamniadio',
    description: 'Parc technologique avec 12 espaces de bureaux modernes et 4 salles de conférence',
    location: 'Diamniadio, Région de Thiès',
    status: 'en-construction',
    startDate: '2024-10-01',
    expectedEndDate: '2025-10-31',
    totalBudget: 3600000000,
    spentBudget: 1800000000,
    ownerName: 'Tech Innovation SARL',
    developerName: 'Future Tech Build',
    contactEmail: 'vefa009@techinnovation.com',
    contactPhone: '+221 76 111 00 99',
    totalUnits: 16,
    tags: ['commercial', 'tech', 'office'],
    milestones: [
      {
        id: 'milestone-009-001',
        vefaProjectId: 'vefa-009',
        title: 'Gros œuvre et enveloppe',
        description: 'Structure et façade des bâtiments',
        status: 'en-cours',
        paidStatus: 'paid',
        paymentAmount: 900000000,
        paymentDate: '2024-12-01',
        receiptUrl: 'receipt-009-001.pdf',
        order: 1,
        startDate: '2024-10-01',
        endDate: '2025-03-31',
        completionPercentage: 75,
        createdAt: '2024-10-01',
        updatedAt: '2025-01-12',
      },
      {
        id: 'milestone-009-002',
        vefaProjectId: 'vefa-009',
        title: 'Aménagements intérieurs',
        description: 'Cloisons, revêtements, aménagements',
        status: 'planifie',
        paidStatus: 'unpaid',
        paymentAmount: 900000000,
        order: 2,
        startDate: '2025-04-01',
        endDate: '2025-10-31',
        completionPercentage: 0,
        createdAt: '2024-10-01',
        updatedAt: '2024-10-01',
      },
    ],
    createdAt: '2024-10-01',
    updatedAt: '2025-01-12',
    createdBy: 'admin-001',
  },
];

export function VEFAManagementAdmin({ onNavigate }: VEFAManagementAdminProps) {
  const [projects, setProjects] = useState<VEFAProject[]>(initialVEFAProjects);
  const [selectedProject, setSelectedProject] = useState<VEFAProject | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'milestones' | 'documents'>('info');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateMilestone, setShowCreateMilestone] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showEditMilestone, setShowEditMilestone] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<VEFAMilestone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'doc-1', name: 'Plan cadastral.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-06-15' },
    { id: 'doc-2', name: 'Permis de construction.pdf', type: 'PDF', size: '1.8 MB', uploadedAt: '2024-05-20' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    status: 'planification' as const,
    startDate: '',
    expectedEndDate: '',
    totalBudget: 0,
    ownerName: '',
    developerName: '',
    contactEmail: '',
    contactPhone: '',
    totalUnits: 0,
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  const [milestoneFormData, setMilestoneFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planifie' as const,
    paymentAmount: 0,
  });

  const [editMilestoneFormData, setEditMilestoneFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planifie' as 'planifie' | 'en-cours' | 'termine' | 'retarde',
    paymentAmount: 0,
    completionPercentage: 0,
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  // Récupérer tous les tags uniques
  const getAllTags = () => {
    const allTags = new Set<string>();
    projects.forEach(project => {
      project.tags?.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  // Filtrer les projets selon la recherche et les tags
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.developerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false);

    const matchesTag = !selectedTag || project.tags?.includes(selectedTag) || false;

    return matchesSearch && matchesTag;
  });

  const handleCreateProject = () => {
    if (!formData.name || !formData.location || !formData.startDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newProject: VEFAProject = {
      id: `vefa-${Date.now()}`,
      ...formData,
      milestones: [],
      spentBudget: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin-001',
    };

    setProjects([...projects, newProject]);
    setFormData({
      name: '',
      description: '',
      location: '',
      status: 'planification',
      startDate: '',
      expectedEndDate: '',
      totalBudget: 0,
      ownerName: '',
      developerName: '',
      contactEmail: '',
      contactPhone: '',
      totalUnits: 0,
      tags: [],
    });
    setTagInput('');
    setShowCreateProject(false);
    alert('Projet VEFA créé avec succès!');
  };

  const handleCreateMilestone = () => {
    if (!selectedProject || !milestoneFormData.title || !milestoneFormData.startDate || !milestoneFormData.endDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newMilestone: VEFAMilestone = {
      id: `milestone-${Date.now()}`,
      vefaProjectId: selectedProject.id,
      title: milestoneFormData.title,
      description: milestoneFormData.description,
      status: milestoneFormData.status,
      paidStatus: 'unpaid',
      paymentAmount: milestoneFormData.paymentAmount,
      order: selectedProject.milestones.length + 1,
      completionPercentage: 0,
      startDate: milestoneFormData.startDate,
      endDate: milestoneFormData.endDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProject = { ...selectedProject, milestones: [...selectedProject.milestones, newMilestone] };
    setSelectedProject(updatedProject);
    
    const updatedProjects = projects.map(p => p.id === selectedProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    
    setMilestoneFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'planifie',
      paymentAmount: 0,
    });
    setShowCreateMilestone(false);
    alert('Jalon créé avec succès!');
  };

  // === Fonctions d'édition du projet VEFA ===
  const handleStartEditProject = (project?: VEFAProject) => {
    const projectToEdit = project || selectedProject;
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name,
        description: projectToEdit.description,
        location: projectToEdit.location,
        status: projectToEdit.status,
        startDate: projectToEdit.startDate,
        expectedEndDate: projectToEdit.expectedEndDate,
        totalBudget: projectToEdit.totalBudget,
        ownerName: projectToEdit.ownerName,
        developerName: projectToEdit.developerName,
        contactEmail: projectToEdit.contactEmail,
        contactPhone: projectToEdit.contactPhone,
        totalUnits: projectToEdit.totalUnits,
        tags: projectToEdit.tags || [],
      });
      if (project) {
        setSelectedProject(project);
      }
      setShowEditProject(true);
    }
  };

  const handleUpdateProject = () => {
    if (!selectedProject || !formData.name || !formData.location || !formData.startDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const updatedProject: VEFAProject = {
      ...selectedProject,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    setSelectedProject(updatedProject);
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    setFormData({
      name: '',
      description: '',
      location: '',
      status: 'planification',
      startDate: '',
      expectedEndDate: '',
      totalBudget: 0,
      ownerName: '',
      developerName: '',
      contactEmail: '',
      contactPhone: '',
      totalUnits: 0,
      tags: [],
    });
    setTagInput('');
    setShowEditProject(false);
    alert('Projet VEFA modifié avec succès!');
  };

  const handleCancelEditProject = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      status: 'planification',
      startDate: '',
      expectedEndDate: '',
      totalBudget: 0,
      ownerName: '',
      developerName: '',
      contactEmail: '',
      contactPhone: '',
      totalUnits: 0,
      tags: [],
    });
    setTagInput('');
    setShowEditProject(false);
  };

  // === Fonctions d'édition du jalon ===
  const handleStartEditMilestone = (milestone: VEFAMilestone) => {
    setEditingMilestone(milestone);
    setEditMilestoneFormData({
      title: milestone.title,
      description: milestone.description,
      startDate: milestone.startDate,
      endDate: milestone.endDate,
      status: milestone.status,
      paymentAmount: milestone.paymentAmount || 0,
      completionPercentage: milestone.completionPercentage,
    });
    setShowEditMilestone(true);
  };

  const handleUpdateMilestone = () => {
    if (!selectedProject || !editingMilestone || !editMilestoneFormData.title || !editMilestoneFormData.startDate || !editMilestoneFormData.endDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const updatedMilestone: VEFAMilestone = {
      ...editingMilestone,
      title: editMilestoneFormData.title,
      description: editMilestoneFormData.description,
      startDate: editMilestoneFormData.startDate,
      endDate: editMilestoneFormData.endDate,
      status: editMilestoneFormData.status,
      paymentAmount: editMilestoneFormData.paymentAmount,
      completionPercentage: editMilestoneFormData.completionPercentage,
      updatedAt: new Date().toISOString(),
    };

    const updatedMilestones = selectedProject.milestones.map(m => 
      m.id === editingMilestone.id ? updatedMilestone : m
    );

    const updatedProject = { ...selectedProject, milestones: updatedMilestones, updatedAt: new Date().toISOString() };
    setSelectedProject(updatedProject);
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    setEditMilestoneFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'planifie',
      paymentAmount: 0,
      completionPercentage: 0,
    });
    setEditingMilestone(null);
    setShowEditMilestone(false);
    alert('Jalon modifié avec succès!');
  };

  const handleCancelEditMilestone = () => {
    setEditMilestoneFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'planifie',
      paymentAmount: 0,
      completionPercentage: 0,
    });
    setEditingMilestone(null);
    setShowEditMilestone(false);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet VEFA?')) {
      setProjects(projects.filter(p => p.id !== projectId));
      setSelectedProject(null);
    }
  };

  const handleRevokeProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (window.confirm(`Êtes-vous sûr de vouloir révoquer le VEFA "${project?.name}" du client acquéreur ?\n\nCette action retirera le client de ce projet VEFA.`)) {
      console.log('Révoquer VEFA:', projectId);
      // TODO: Implémenter la révocation (retirer le client du VEFA)
      alert('VEFA révoqué avec succès. Le client a été retiré de ce projet.');
    }
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jalon?')) {
      if (selectedProject) {
        const updatedProject = {
          ...selectedProject,
          milestones: selectedProject.milestones.filter(m => m.id !== milestoneId),
        };
        setSelectedProject(updatedProject);
        setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
      }
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

  const handlePayMilestone = (milestoneId: string) => {
    if (selectedProject) {
      const updatedProject = {
        ...selectedProject,
        milestones: selectedProject.milestones.map(m =>
          m.id === milestoneId
            ? {
                ...m,
                paidStatus: 'paid' as const,
                paymentDate: new Date().toISOString(),
                receiptUrl: `receipt-${milestoneId}.pdf`,
              }
            : m
        ),
      };
      setSelectedProject(updatedProject);
      setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
      alert('Paiement enregistré avec succès!');
    }
  };

  const handleDownloadReceipt = (receiptUrl: string | undefined) => {
    if (!receiptUrl) {
      alert('Aucun reçu disponible');
      return;
    }
    alert(`Téléchargement du reçu: ${receiptUrl}`);
    // Logique de téléchargement à implémenter
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

  // Vue tableau des VEFA
  if (!selectedProject) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Gestion VEFA</h1>
            <p className="text-neutral-600 mt-2">Créez et gérez vos projets VEFA avec leurs jalons</p>
          </div>
          <Button onClick={() => setShowCreateProject(!showCreateProject)} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouveau projet VEFA
          </Button>
        </div>

        {/* Create Project Form */}
        {showCreateProject && (
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-700">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Créer un nouveau projet VEFA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Nom du projet *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nom du projet"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Localisation *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Localisation"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Description du projet"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Date de début *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Date de fin prévue</label>
                <input
                  type="date"
                  value={formData.expectedEndDate}
                  onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Budget total</label>
                <input
                  type="number"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Montant en XOF"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Nombre d'unités</label>
                <input
                  type="number"
                  value={formData.totalUnits}
                  onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nombre d'unités"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Nom du propriétaire</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Propriétaire du projet"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Promoteur</label>
                <input
                  type="text"
                  value={formData.developerName}
                  onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Promoteur du projet"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Email de contact</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Téléphone de contact</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+221 77 123 45 67"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Tags (optionnel)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ajouter un tag (ex: premium, urgent, phase1)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    className="px-4"
                  >
                    Ajouter
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold border border-primary-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-primary-600 hover:text-primary-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleCreateProject} className="flex-1">
                Créer le projet
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateProject(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Rechercher par nom, localisation ou description</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Almadies, Premium, Résidence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="px-4"
                >
                  Effacer
                </Button>
              )}
            </div>
          </div>

          {getAllTags().length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Filtrer par tags</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors border ${
                    !selectedTag
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-primary-500'
                  }`}
                >
                  Tous
                </button>
                {getAllTags().map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors border ${
                      selectedTag === tag
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-primary-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-neutral-600">
            <strong>{filteredProjects.length}</strong> projet(s) trouvé(s)
          </div>
        </div>

        {/* Projects Table */}
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
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-600">
                      {searchQuery || selectedTag ? 'Aucun projet correspondant à votre recherche' : 'Aucun projet VEFA'}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-neutral-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-neutral-900">{project.name}</p>
                          <p className="text-sm text-neutral-600">{project.totalUnits} unités</p>
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold border border-primary-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
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
                            onClick={() => {
                              setSelectedProject(project);
                              setActiveTab('info');
                            }}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Voir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartEditProject(project)}
                            className="text-primary-600 hover:bg-primary-50 border-primary-200"
                          >
                            <Pencil className="w-4 h-4" />
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
                  ))
                )}              </tbody>
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
            Retour à la liste
          </button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{selectedProject.name}</h1>
            <p className="text-neutral-600 mt-1">{selectedProject.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartEditProject}
            className="flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Modifier le projet
          </Button>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedProject.status)}`}>
            {selectedProject.status}
          </span>
        </div>
      </div>

      {/* Modal d'édition du projet */}
      {showEditProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Modifier le projet VEFA</h2>
              <button
                onClick={handleCancelEditProject}
                className="p-2 hover:bg-neutral-100 rounded-full transition"
              >
                <X className="w-6 h-6 text-neutral-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Nom du projet *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: Résidence Almadies Premium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Description du projet..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Localisation *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: Almadies, Dakar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="planification">Planification</option>
                    <option value="en-construction">En construction</option>
                    <option value="termine">Terminé</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Date de début *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Date de fin prévue</label>
                  <input
                    type="date"
                    value={formData.expectedEndDate}
                    onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Budget total (XOF)</label>
                  <input
                    type="number"
                    value={formData.totalBudget}
                    onChange={(e) => setFormData({ ...formData, totalBudget: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: 5000000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Nombre d'unités</label>
                  <input
                    type="number"
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Propriétaire</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nom du propriétaire"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Développeur</label>
                  <input
                    type="text"
                    value={formData.developerName}
                    onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nom du développeur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Email de contact</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Téléphone de contact</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+221 77 123 45 67"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold border border-primary-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ajouter un tag..."
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleUpdateProject} className="flex-1">
                  Enregistrer les modifications
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEditProject}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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

            {/* Tags */}
            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-semibold border border-primary-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

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

            {/* Client Acquéreur */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Client Acquéreur</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-neutral-200 rounded-lg p-4 bg-primary-50">
                  <p className="text-sm text-neutral-600 mb-2">Nom complet</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-700" />
                    </div>
                    <p className="text-lg font-semibold text-neutral-900">Amadou Diallo</p>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-2">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary-700" />
                    <p className="text-neutral-900">amadou.diallo@email.com</p>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-2">Téléphone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary-700" />
                    <p className="text-neutral-900">+221 77 888 99 00</p>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-2">Adresse</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-700" />
                    <p className="text-neutral-900">Almadies, Dakar</p>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4 md:col-span-2">
                  <p className="text-sm text-neutral-600 mb-2">Statut VIP</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-semibold border border-amber-300">
                    <Crown className="w-4 h-4" />
                    Client VIP
                  </span>
                </div>
              </div>

              {/* Bouton Révoquer */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <Button
                  variant="outline"
                  onClick={() => handleRevokeProject(selectedProject.id)}
                  className="text-red-600 hover:bg-red-50 border-red-300 flex items-center gap-2"
                >
                  <UserMinus className="w-5 h-5" />
                  Révoquer ce VEFA du client
                </Button>
                <p className="text-sm text-neutral-500 mt-2">
                  Cette action retirera le client acquéreur de ce projet VEFA.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Jalons et Paiements */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            {/* Jalons */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">Jalons du projet ({selectedProject.milestones.length})</h2>
                <Button
                  size="sm"
                  onClick={() => setShowCreateMilestone(!showCreateMilestone)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter jalon
                </Button>
              </div>

              {showCreateMilestone && (
                <div className="bg-neutral-50 rounded-lg p-4 border border-primary-300 mb-4">
                  <h5 className="font-semibold text-neutral-900 mb-3">Créer un nouveau jalon</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Titre *</label>
                      <input
                        type="text"
                        value={milestoneFormData.title}
                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, title: e.target.value })}
                        className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                        placeholder="Titre du jalon"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Statut</label>
                      <select
                        value={milestoneFormData.status}
                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, status: e.target.value as any })}
                        className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                      >
                        <option value="planifie">Planifié</option>
                        <option value="en-cours">En cours</option>
                        <option value="termine">Terminé</option>
                        <option value="retarde">Retardé</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
                      <textarea
                        value={milestoneFormData.description}
                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, description: e.target.value })}
                        className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                        placeholder="Description du jalon"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Date de début *</label>
                      <input
                        type="date"
                        value={milestoneFormData.startDate}
                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, startDate: e.target.value })}
                        className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Date de fin *</label>
                      <input
                        type="date"
                        value={milestoneFormData.endDate}
                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, endDate: e.target.value })}
                        className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Montant du paiement (XOF)</label>
                      <input
                        type="number"
                        value={milestoneFormData.paymentAmount}
                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, paymentAmount: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                        placeholder="Montant"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={handleCreateMilestone}
                    >
                      Créer jalon
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCreateMilestone(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

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
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(milestone.status)}`}>
                            {milestone.status}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartEditMilestone(milestone)}
                            className="text-primary-600 hover:bg-primary-50 border-primary-200"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="text-red-600 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Milestone Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
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
                      </div>

                      {/* Payment Status Section */}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-neutral-900 mb-1">Paiement</h4>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                                milestone.paidStatus === 'paid'
                                  ? 'bg-green-100 text-green-800 border-green-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}>
                                {milestone.paidStatus === 'paid' ? 'Payé' : 'Non payé'}
                              </span>
                              {milestone.paymentAmount && (
                                <span className="text-lg font-bold text-primary-700">
                                  {formatCurrency(milestone.paymentAmount)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {milestone.paidStatus === 'paid' && (
                              <Button
                                size="sm"
                                onClick={() => handleDownloadReceipt(milestone.receiptUrl)}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                              >
                                <Download className="w-4 h-4" />
                                Télécharger reçu
                              </Button>
                            )}
                          </div>
                        </div>
                        {milestone.paidStatus === 'paid' && milestone.paymentDate && (
                          <p className="text-xs text-neutral-600 mt-2">
                            Payé le {formatDate(milestone.paymentDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Modal d'édition du jalon */}
      {showEditMilestone && editingMilestone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Modifier le jalon</h2>
              <button
                onClick={handleCancelEditMilestone}
                className="p-2 hover:bg-neutral-100 rounded-full transition"
              >
                <X className="w-6 h-6 text-neutral-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Titre du jalon *</label>
                  <input
                    type="text"
                    value={editMilestoneFormData.title}
                    onChange={(e) => setEditMilestoneFormData({ ...editMilestoneFormData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Titre du jalon"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Description</label>
                  <textarea
                    value={editMilestoneFormData.description}
                    onChange={(e) => setEditMilestoneFormData({ ...editMilestoneFormData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Description du jalon..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Statut</label>
                  <select
                    value={editMilestoneFormData.status}
                    onChange={(e) => setEditMilestoneFormData({ ...editMilestoneFormData, status: e.target.value as any })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="planifie">Planifié</option>
                    <option value="en-cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="retarde">Retardé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Progression (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editMilestoneFormData.completionPercentage}
                    onChange={(e) => setEditMilestoneFormData({ ...editMilestoneFormData, completionPercentage: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Date de début *</label>
                  <input
                    type="date"
                    value={editMilestoneFormData.startDate}
                    onChange={(e) => setEditMilestoneFormData({ ...editMilestoneFormData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Date de fin *</label>
                  <input
                    type="date"
                    value={editMilestoneFormData.endDate}
                    onChange={(e) => setEditMilestoneFormData({ ...editMilestoneFormData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Montant du paiement (XOF)</label>
                  <input
                    type="number"
                    value={editMilestoneFormData.paymentAmount}
                    onChange={(e) => setEditMilestoneFormData({ ...editMilestoneFormData, paymentAmount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Montant en XOF"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleUpdateMilestone} className="flex-1">
                  Enregistrer les modifications
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEditMilestone}
                  className="flex-1"
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
