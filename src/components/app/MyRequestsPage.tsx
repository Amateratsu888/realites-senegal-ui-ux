import React, { useState } from 'react';
import { Send, Clock, CheckCircle, XCircle, Eye, Calendar, Home, Phone, Mail, MessageSquare, Filter, Search, Video, MapPin, Crown, CreditCard, RefreshCw, Check, X, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '../Button';
import { appointments as clientAppointments } from '../../data/appointmentsData';
import { Appointment, AppointmentStatus, AlternativeSlotProposal, UserRole } from '../../types';

export type RequestType = 'visite' | 'information' | 'reservation' | 'financement';
export type RequestStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface PropertyRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyPrice: number;
  type: RequestType;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  phone: string;
  email: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}

// Données mock pour les demandes
const mockRequests: PropertyRequest[] = [
  {
    id: 'req-001',
    propertyId: '1',
    propertyTitle: 'Villa Contemporaine Almadies',
    propertyImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGV4dGVyaW9yfGVufDF8fHx8MTczNDYyMjU2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    propertyPrice: 450000000,
    type: 'visite',
    message: 'Je souhaiterais visiter cette magnifique villa ce week-end si possible.',
    preferredDate: '2024-12-20',
    preferredTime: '14:00',
    phone: '+221 77 123 45 67',
    email: 'amadou.diallo@example.com',
    status: 'confirmed',
    createdAt: '2024-12-14T10:30:00Z',
    updatedAt: '2024-12-14T14:00:00Z',
    adminResponse: 'Visite confirmée pour le 20/12/2024 à 14h. Notre agent vous contactera la veille.',
  },
  {
    id: 'req-002',
    propertyId: '5',
    propertyTitle: 'Résidence Moderne 3 Chambres',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTczNDYyMjU2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    propertyPrice: 175000000,
    type: 'reservation',
    message: 'Je suis très intéressé par ce bien. Je souhaite le réserver et obtenir plus d\'informations sur les modalités de paiement échelonné.',
    phone: '+221 77 123 45 67',
    email: 'amadou.diallo@example.com',
    status: 'pending',
    createdAt: '2024-12-15T09:15:00Z',
    updatedAt: '2024-12-15T09:15:00Z',
  },
  {
    id: 'req-003',
    propertyId: '8',
    propertyTitle: 'Appartement Standing Mermoz',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3MzQ2MjI1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    propertyPrice: 125000000,
    type: 'financement',
    message: 'Bonjour, je souhaiterais connaître les options de financement disponibles pour cet appartement.',
    phone: '+221 77 123 45 67',
    email: 'amadou.diallo@example.com',
    status: 'completed',
    createdAt: '2024-12-10T11:00:00Z',
    updatedAt: '2024-12-11T16:30:00Z',
    adminResponse: 'Nous proposons un financement échelonné sur 24 mois. Nos conseillers vous ont envoyé les détails par email.',
  },
  {
    id: 'req-004',
    propertyId: '12',
    propertyTitle: 'Villa Luxe Ngor',
    propertyImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYXxlbnwxfHx8fDE3MzQ2MjI1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    propertyPrice: 380000000,
    type: 'information',
    message: 'Pouvez-vous me fournir plus d\'informations sur cette propriété ? Y a-t-il une piscine ?',
    phone: '+221 77 123 45 67',
    email: 'amadou.diallo@example.com',
    status: 'rejected',
    createdAt: '2024-12-08T15:45:00Z',
    updatedAt: '2024-12-09T10:00:00Z',
    adminResponse: 'Ce bien a été vendu. Nous pouvons vous proposer des biens similaires.',
  },
];

interface MyRequestsPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
  userRole?: UserRole;
}

export function MyRequestsPage({ onNavigate, userRole = 'vip' }: MyRequestsPageProps) {
  const [activeTab, setActiveTab] = useState<'requests' | 'appointments'>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<RequestType | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<PropertyRequest | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(clientAppointments);
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  
  // Est-ce un client VIP ?
  const isVIP = userRole === 'vip';

  // Stats des rendez-vous
  const appointmentStats = {
    pending: appointments.filter(a => a.status === 'pending' || a.status === 'pending-payment').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    alternativeProposed: appointments.filter(a => a.status === 'alternative-proposed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    total: appointments.length,
  };

  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = appointmentStatusFilter === 'all' || apt.status === appointmentStatusFilter;
    const matchesSearch = searchQuery === '' || 
      apt.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Actions pour les propositions de créneaux alternatifs
  const handleAcceptAlternative = (appointment: Appointment) => {
    if (!appointment.alternativeProposal) return;
    
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id
        ? {
            ...apt,
            date: appointment.alternativeProposal!.proposedDate,
            startTime: appointment.alternativeProposal!.proposedStartTime,
            endTime: appointment.alternativeProposal!.proposedEndTime,
            slotId: appointment.alternativeProposal!.proposedSlotId,
            status: 'confirmed' as AppointmentStatus,
            alternativeProposal: {
              ...appointment.alternativeProposal!,
              status: 'accepted' as const,
              respondedAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          }
        : apt
    ));
    setSelectedAppointment(null);
  };

  const handleRejectAlternative = (appointment: Appointment) => {
    if (!appointment.alternativeProposal) return;
    
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id
        ? {
            ...apt,
            status: 'cancelled' as AppointmentStatus,
            alternativeProposal: {
              ...appointment.alternativeProposal!,
              status: 'rejected' as const,
              respondedAt: new Date().toISOString(),
            },
            cancelledAt: new Date().toISOString(),
            cancellationReason: 'Client a refusé le créneau alternatif proposé',
            updatedAt: new Date().toISOString(),
          }
        : apt
    ));
    setSelectedAppointment(null);
  };

  // Formattage
  const formatAppointmentDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getAppointmentStatusBadge = (status: AppointmentStatus) => {
    const statusConfig: Record<AppointmentStatus, { label: string; className: string; icon: React.ElementType }> = {
      'pending-payment': { label: 'En attente de paiement', className: 'bg-orange-100 text-orange-800', icon: DollarSign },
      'pending': { label: 'En attente de confirmation', className: 'bg-amber-100 text-amber-800', icon: Clock },
      'confirmed': { label: 'Confirmé', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      'alternative-proposed': { label: 'Nouveau créneau proposé', className: 'bg-purple-100 text-purple-800', icon: RefreshCw },
      'cancelled': { label: 'Annulé', className: 'bg-red-100 text-red-800', icon: XCircle },
      'completed': { label: 'Terminé', className: 'bg-blue-100 text-blue-800', icon: Check },
      'no-show': { label: 'Absent', className: 'bg-neutral-100 text-neutral-800', icon: X },
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getAppointmentTypeBadge = (type: 'online' | 'in-person') => {
    if (type === 'online') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Video className="w-3 h-3" />
          En ligne
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
        <MapPin className="w-3 h-3" />
        Présentiel
      </span>
    );
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusLabel = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'rejected':
        return 'Refusée';
      case 'completed':
        return 'Traitée';
    }
  };

  const getTypeLabel = (type: RequestType) => {
    switch (type) {
      case 'visite':
        return 'Demande de visite';
      case 'information':
        return 'Demande d\'information';
      case 'reservation':
        return 'Demande de réservation';
      case 'financement':
        return 'Demande de financement';
    }
  };

  const getTypeIcon = (type: RequestType) => {
    switch (type) {
      case 'visite':
        return <Calendar className="w-4 h-4" />;
      case 'information':
        return <MessageSquare className="w-4 h-4" />;
      case 'reservation':
        return <Home className="w-4 h-4" />;
      case 'financement':
        return <Phone className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRequests = mockRequests.filter(request => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        request.propertyTitle.toLowerCase().includes(query) ||
        request.message.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (statusFilter !== 'all' && request.status !== statusFilter) {
      return false;
    }

    if (typeFilter !== 'all' && request.type !== typeFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Mes demandes</h2>
          <p className="text-sm text-slate-600 mt-1">
            Gérez toutes vos demandes de visite, réservation{isVIP && ', rendez-vous'} et information
          </p>
        </div>
        <div className="flex gap-2">
          {isVIP && (
            <Button variant="outline" onClick={() => onNavigate('book-call')}>
              <Calendar className="w-4 h-4 mr-2" />
              Prendre RDV
            </Button>
          )}
          <Button onClick={() => onNavigate('catalog')}>
            <Send className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Tabs for VIP */}
      {isVIP && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-slate-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'requests'
                    ? 'border-primary-700 text-primary-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Demandes
                </div>
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'appointments'
                    ? 'border-primary-700 text-primary-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Rendez-vous VIP
                  {appointmentStats.alternativeProposed > 0 && (
                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {appointmentStats.alternativeProposed}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Appointments Tab Content (VIP only) */}
      {isVIP && activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Appointment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600">En attente</p>
                  <p className="text-xl font-medium text-amber-700">{appointmentStats.pending}</p>
                </div>
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div className="bg-white rounded shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600">Confirmés</p>
                  <p className="text-xl font-medium text-green-700">{appointmentStats.confirmed}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div 
              className="bg-white rounded shadow-sm p-4 cursor-pointer hover:bg-purple-50 transition-colors border-2 border-transparent hover:border-purple-300"
              onClick={() => setAppointmentStatusFilter('alternative-proposed')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium">Nouveau créneau</p>
                  <p className="text-xl font-medium text-purple-700">{appointmentStats.alternativeProposed}</p>
                </div>
                <RefreshCw className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600">Terminés</p>
                  <p className="text-xl font-medium text-blue-700">{appointmentStats.completed}</p>
                </div>
                <Check className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600">Total</p>
                  <p className="text-xl font-medium text-slate-900">{appointmentStats.total}</p>
                </div>
                <Calendar className="w-6 h-6 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Alert for alternative proposals */}
          {appointmentStats.alternativeProposed > 0 && (
            <div className="bg-purple-50 border border-purple-300 rounded-lg p-4 flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">
                  {appointmentStats.alternativeProposed} nouveau(x) créneau(x) proposé(s)
                </p>
                <p className="text-sm text-purple-700 mt-1">
                  L'administrateur vous a proposé de nouveaux créneaux pour certains rendez-vous. Veuillez accepter ou refuser ces propositions.
                </p>
              </div>
            </div>
          )}

          {/* Appointment Filters */}
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un rendez-vous..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={appointmentStatusFilter}
                onChange={(e) => setAppointmentStatusFilter(e.target.value as AppointmentStatus | 'all')}
                className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending-payment">💳 Attente paiement</option>
                <option value="pending">⏳ En attente confirmation</option>
                <option value="alternative-proposed">🔄 Nouveau créneau proposé</option>
                <option value="confirmed">✓ Confirmés</option>
                <option value="completed">✔ Terminés</option>
                <option value="cancelled">✗ Annulés</option>
              </select>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">Aucun rendez-vous trouvé</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Prenez un rendez-vous avec notre équipe pour discuter de vos projets immobiliers
                </p>
                <Button onClick={() => onNavigate('book-call')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Prendre rendez-vous
                </Button>
              </div>
            ) : (
              filteredAppointments.map(appointment => (
                <div
                  key={appointment.id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all ${
                    appointment.status === 'alternative-proposed'
                      ? 'ring-2 ring-purple-300'
                      : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Crown className="w-5 h-5 text-primary-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{appointment.subject}</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {formatAppointmentDate(appointment.date)} • {appointment.startTime} - {appointment.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {getAppointmentTypeBadge(appointment.type)}
                        {getAppointmentStatusBadge(appointment.status)}
                      </div>
                    </div>

                    {appointment.message && (
                      <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded">
                        {appointment.message}
                      </p>
                    )}

                    {/* Admin Response */}
                    {appointment.adminResponse && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded mb-4">
                        <p className="text-xs font-medium text-green-900 mb-1">Réponse de l'agence:</p>
                        <p className="text-sm text-green-800">{appointment.adminResponse}</p>
                      </div>
                    )}

                    {/* Alternative Proposal Alert */}
                    {appointment.status === 'alternative-proposed' && appointment.alternativeProposal && (
                      <div className="p-4 bg-purple-50 border border-purple-300 rounded-lg mb-4">
                        <div className="flex items-start gap-3">
                          <RefreshCw className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-purple-900 mb-1">Nouveau créneau proposé</p>
                            <p className="text-sm text-purple-800 mb-2">
                              <strong>{formatAppointmentDate(appointment.alternativeProposal.proposedDate)}</strong> de <strong>{appointment.alternativeProposal.proposedStartTime}</strong> à <strong>{appointment.alternativeProposal.proposedEndTime}</strong>
                            </p>
                            <p className="text-sm text-purple-700 mb-3">
                              Raison : {appointment.alternativeProposal.reason}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAcceptAlternative(appointment)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accepter
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleRejectAlternative(appointment)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Refuser
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price & Payment Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {appointment.isFreeFirstAppointment || appointment.price === 0 
                            ? 'Gratuit (1er RDV)' 
                            : formatPrice(appointment.price)
                          }
                        </span>
                        {appointment.paymentStatus === 'paid' && (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CreditCard className="w-4 h-4" />
                            Payé
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Requests Tab Content */}
      {(!isVIP || activeTab === 'requests') && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">En attente</p>
              <p className="text-2xl font-medium text-yellow-700 mt-1">
                {mockRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Confirmées</p>
              <p className="text-2xl font-medium text-green-700 mt-1">
                {mockRequests.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Traitées</p>
              <p className="text-2xl font-medium text-blue-700 mt-1">
                {mockRequests.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-2xl font-medium text-slate-900 mt-1">
                {mockRequests.length}
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <Send className="w-6 h-6 text-slate-600" />
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
            className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="completed">Traitées</option>
            <option value="rejected">Refusées</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as RequestType | 'all')}
            className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tous les types</option>
            <option value="visite">Visites</option>
            <option value="reservation">Réservations</option>
            <option value="information">Informations</option>
            <option value="financement">Financement</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Property Image */}
                <img
                  src={request.propertyImage}
                  alt={request.propertyTitle}
                  className="w-24 h-24 rounded object-cover flex-shrink-0"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">
                        {request.propertyTitle}
                      </h3>
                      <p className="text-sm text-primary-700 font-medium">
                        {formatPrice(request.propertyPrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded text-xs text-slate-700">
                      {getTypeIcon(request.type)}
                      {getTypeLabel(request.type)}
                    </span>
                    <span className="text-xs text-slate-500">
                      Envoyée le {formatDate(request.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 mb-3 line-clamp-2">
                    {request.message}
                  </p>

                  {request.preferredDate && (
                    <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Date souhaitée: {new Date(request.preferredDate).toLocaleDateString('fr-FR')}
                      </span>
                      {request.preferredTime && (
                        <span>Heure: {request.preferredTime}</span>
                      )}
                    </div>
                  )}

                  {request.adminResponse && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-xs font-medium text-green-900 mb-1">Réponse de l'agence:</p>
                      <p className="text-xs text-green-800">{request.adminResponse}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('property-folder', request.propertyId)}
                    >
                      <Home className="w-4 h-4 mr-1" />
                      Voir le bien
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Send className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">Aucune demande trouvée</h3>
          <p className="text-slate-600 text-sm mb-4">
            Parcourez notre catalogue et envoyez votre première demande
          </p>
          <Button onClick={() => onNavigate('catalog')}>
            Voir le catalogue
          </Button>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-slate-900">Détails de la demande</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    ID: {selectedRequest.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-slate-100 rounded transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Property Info */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Bien concerné</h4>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <img
                    src={selectedRequest.propertyImage}
                    alt={selectedRequest.propertyTitle}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{selectedRequest.propertyTitle}</p>
                    <p className="text-sm text-primary-700 mt-1">{formatPrice(selectedRequest.propertyPrice)}</p>
                  </div>
                </div>
              </div>

              {/* Request Type & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Type de demande</h4>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded">
                    {getTypeIcon(selectedRequest.type)}
                    <span className="text-sm text-slate-900">{getTypeLabel(selectedRequest.type)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Statut</h4>
                  <div className={`flex items-center gap-2 p-3 rounded ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="text-sm font-medium">{getStatusLabel(selectedRequest.status)}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Message</h4>
                <div className="p-4 bg-slate-50 rounded">
                  <p className="text-sm text-slate-900">{selectedRequest.message}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Informations de contact</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{selectedRequest.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>{selectedRequest.email}</span>
                  </div>
                </div>
              </div>

              {/* Preferred Date/Time */}
              {(selectedRequest.preferredDate || selectedRequest.preferredTime) && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Date et heure souhaitées</h4>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded">
                    {selectedRequest.preferredDate && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>{new Date(selectedRequest.preferredDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {selectedRequest.preferredTime && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>{selectedRequest.preferredTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Response */}
              {selectedRequest.adminResponse && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Réponse de l'agence</h4>
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-900">{selectedRequest.adminResponse}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <span className="font-medium">Créée le:</span>
                    <p className="mt-1">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Mise à jour:</span>
                    <p className="mt-1">{formatDate(selectedRequest.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <h3 className="text-slate-900">Détails du rendez-vous</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {selectedAppointment.subject}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-slate-100 rounded transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Type */}
              <div className="flex flex-wrap items-center gap-3">
                {getAppointmentStatusBadge(selectedAppointment.status)}
                {getAppointmentTypeBadge(selectedAppointment.type)}
                {selectedAppointment.isFreeFirstAppointment && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="w-3 h-3" />
                    Gratuit (1er RDV)
                  </span>
                )}
              </div>

              {/* Alternative Proposal Action */}
              {selectedAppointment.status === 'alternative-proposed' && selectedAppointment.alternativeProposal && (
                <div className="p-4 bg-purple-50 border border-purple-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-purple-900 mb-1">Nouveau créneau proposé par l'agence</p>
                      <p className="text-sm text-purple-800 mb-2">
                        <strong>{formatAppointmentDate(selectedAppointment.alternativeProposal.proposedDate)}</strong><br />
                        De <strong>{selectedAppointment.alternativeProposal.proposedStartTime}</strong> à <strong>{selectedAppointment.alternativeProposal.proposedEndTime}</strong>
                      </p>
                      <p className="text-sm text-purple-700 mb-3">
                        <strong>Raison :</strong> {selectedAppointment.alternativeProposal.reason}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptAlternative(selectedAppointment)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accepter ce créneau
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleRejectAlternative(selectedAppointment)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Date</h4>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-900">{formatAppointmentDate(selectedAppointment.date)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Horaire</h4>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-900">{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedAppointment.message && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Votre message</h4>
                  <div className="p-4 bg-slate-50 rounded">
                    <p className="text-sm text-slate-900">{selectedAppointment.message}</p>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Informations de paiement</h4>
                <div className="p-4 bg-slate-50 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Tarif</span>
                    <span className="text-sm font-medium text-slate-900">
                      {selectedAppointment.isFreeFirstAppointment || selectedAppointment.price === 0 
                        ? 'Gratuit (1er rendez-vous offert)' 
                        : formatPrice(selectedAppointment.price)
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Statut du paiement</span>
                    <span className={`text-sm font-medium ${
                      selectedAppointment.paymentStatus === 'paid' || selectedAppointment.paymentStatus === 'free'
                        ? 'text-green-600'
                        : selectedAppointment.paymentStatus === 'refunded'
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}>
                      {selectedAppointment.paymentStatus === 'paid' ? 'Payé' : 
                       selectedAppointment.paymentStatus === 'free' ? 'Gratuit' :
                       selectedAppointment.paymentStatus === 'refunded' ? 'Remboursé' : 'Non payé'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Response */}
              {selectedAppointment.adminResponse && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Réponse de l'agence</h4>
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-900">{selectedAppointment.adminResponse}</p>
                  </div>
                </div>
              )}

              {/* Location Info */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Lieu du rendez-vous</h4>
                <div className="p-4 bg-slate-50 rounded">
                  {selectedAppointment.type === 'online' ? (
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-slate-900">
                        Rendez-vous en ligne - Le lien vous sera envoyé par email avant le rendez-vous
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-600" />
                      <span className="text-sm text-slate-900">
                        Bureaux RÉALITÉS SÉNÉGAL - Almadies, Dakar
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <span className="font-medium">Demandé le:</span>
                    <p className="mt-1">{formatDate(selectedAppointment.createdAt)}</p>
                  </div>
                  {selectedAppointment.confirmedAt && (
                    <div>
                      <span className="font-medium">Confirmé le:</span>
                      <p className="mt-1">{formatDate(selectedAppointment.confirmedAt)}</p>
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
