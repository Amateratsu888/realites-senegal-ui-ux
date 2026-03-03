import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Settings, 
  Check, 
  X, 
  Video, 
  MapPin,
  User,
  Phone,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Crown,
  Save,
  CreditCard,
  RefreshCw,
  Send,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Button } from '../Button';
import { 
  appointments as initialAppointments, 
  appointmentSlots as initialSlots,
  appointmentSettings as initialSettings,
  appointmentSubjects
} from '../../data/appointmentsData';
import { Appointment, AppointmentSlot, AppointmentSettings, AppointmentStatus, AppointmentType, AlternativeSlotProposal, AppointmentPaymentStatus } from '../../types';

interface AppointmentsAdminProps {
  onNavigate: (page: string) => void;
}

export function AppointmentsAdmin({ onNavigate }: AppointmentsAdminProps) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'slots' | 'settings'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [slots, setSlots] = useState<AppointmentSlot[]>(initialSlots);
  const [settings, setSettings] = useState<AppointmentSettings>(initialSettings);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAlternativeModal, setShowAlternativeModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all' | 'paid'>('all');
  const [typeFilter, setTypeFilter] = useState<AppointmentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '09:00',
    endTime: '11:00',
  });
  const [editingSettings, setEditingSettings] = useState<AppointmentSettings>(initialSettings);
  const [alternativeSlot, setAlternativeSlot] = useState({
    slotId: '',
    reason: '',
  });
  const [adminResponse, setAdminResponse] = useState('');

  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter(apt => {
    // Filtre spécial pour "payés en attente"
    if (statusFilter === 'paid') {
      return apt.paymentStatus === 'paid' && apt.status === 'pending';
    }
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesType = typeFilter === 'all' || apt.type === typeFilter;
    const matchesSearch = searchQuery === '' || 
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Stats
  const stats = {
    total: appointments.length,
    pendingPayment: appointments.filter(a => a.status === 'pending-payment').length,
    paidPending: appointments.filter(a => a.paymentStatus === 'paid' && a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    alternativeProposed: appointments.filter(a => a.status === 'alternative-proposed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  // Gestion du calendrier
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return slots.filter(slot => slot.date === dateStr);
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  // Obtenir les créneaux disponibles pour proposer une alternative
  const getAvailableSlots = () => {
    return slots.filter(slot => {
      if (!slot.isAvailable) return false;
      const isBooked = appointments.some(apt => apt.slotId === slot.id && apt.status !== 'cancelled');
      if (isBooked) return false;
      const slotDate = new Date(slot.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return slotDate > today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Actions sur les rendez-vous
  const handleConfirmAppointment = (appointment: Appointment) => {
    if (appointment.paymentStatus !== 'paid' && appointment.paymentStatus !== 'free') {
      alert('Le paiement doit être effectué avant de confirmer le rendez-vous.');
      return;
    }
    
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { 
            ...apt, 
            status: 'confirmed' as AppointmentStatus, 
            confirmedAt: new Date().toISOString(),
            adminResponse: adminResponse || 'Votre rendez-vous est confirmé. À bientôt !',
            updatedAt: new Date().toISOString(),
          }
        : apt
    ));
    setAdminResponse('');
    setShowAppointmentModal(false);
  };

  const handleRejectAppointment = (appointment: Appointment, reason: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { 
            ...apt, 
            status: 'cancelled' as AppointmentStatus, 
            cancelledAt: new Date().toISOString(), 
            cancellationReason: reason,
            paymentStatus: apt.paymentStatus === 'paid' ? 'refunded' : apt.paymentStatus,
            adminResponse: reason,
            updatedAt: new Date().toISOString(),
          }
        : apt
    ));
    setShowAppointmentModal(false);
  };

  const handleProposeAlternative = (appointment: Appointment) => {
    if (!alternativeSlot.slotId || !alternativeSlot.reason) {
      alert('Veuillez sélectionner un créneau et indiquer une raison.');
      return;
    }

    const proposedSlot = slots.find(s => s.id === alternativeSlot.slotId);
    if (!proposedSlot) return;

    const proposal: AlternativeSlotProposal = {
      id: `alt-${Date.now()}`,
      appointmentId: appointment.id,
      proposedSlotId: alternativeSlot.slotId,
      proposedDate: proposedSlot.date,
      proposedStartTime: proposedSlot.startTime,
      proposedEndTime: proposedSlot.endTime,
      reason: alternativeSlot.reason,
      status: 'pending',
      proposedAt: new Date().toISOString(),
    };

    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { 
            ...apt, 
            status: 'alternative-proposed' as AppointmentStatus, 
            alternativeProposal: proposal,
            adminResponse: `Nouveau créneau proposé: ${formatDate(proposedSlot.date)} de ${proposedSlot.startTime} à ${proposedSlot.endTime}. Raison: ${alternativeSlot.reason}`,
            updatedAt: new Date().toISOString(),
          }
        : apt
    ));
    
    setAlternativeSlot({ slotId: '', reason: '' });
    setShowAlternativeModal(false);
    setShowAppointmentModal(false);
  };

  const handleCompleteAppointment = (appointment: Appointment) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { 
            ...apt, 
            status: 'completed' as AppointmentStatus, 
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : apt
    ));
  };

  // Gestion des créneaux
  const handleAddSlot = () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) return;
    
    const newSlotItem: AppointmentSlot = {
      id: `slot-${newSlot.date}-${newSlot.startTime.replace(':', '')}`,
      date: newSlot.date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSlots(prev => [...prev, newSlotItem]);
    setNewSlot({ date: '', startTime: '09:00', endTime: '11:00' });
    setShowSlotModal(false);
  };

  const handleToggleSlotAvailability = (slotId: string) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, isAvailable: !slot.isAvailable, updatedAt: new Date().toISOString() }
        : slot
    ));
  };

  const handleDeleteSlot = (slotId: string) => {
    const hasAppointment = appointments.some(apt => apt.slotId === slotId && apt.status !== 'cancelled');
    if (hasAppointment) {
      alert('Impossible de supprimer ce créneau car il a un rendez-vous associé.');
      return;
    }
    setSlots(prev => prev.filter(slot => slot.id !== slotId));
  };

  const handleSaveSettings = () => {
    setSettings(editingSettings);
    setShowSettingsModal(false);
  };

  // Formattage
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig: Record<AppointmentStatus, { label: string; className: string; icon: React.ElementType }> = {
      'pending-payment': { label: 'Attente paiement', className: 'bg-orange-100 text-orange-800', icon: DollarSign },
      'pending': { label: 'Payé - En attente', className: 'bg-amber-100 text-amber-800', icon: AlertCircle },
      'confirmed': { label: 'Confirmé', className: 'bg-green-100 text-green-800', icon: CheckCircle2 },
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

  const getPaymentBadge = (appointment: Appointment) => {
    if (appointment.isFreeFirstAppointment) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3" />
          Gratuit (1er RDV)
        </span>
      );
    }
    
    const paymentConfig = {
      'unpaid': { label: 'Non payé', className: 'bg-red-100 text-red-800', icon: XCircle },
      'paid': { label: 'Payé', className: 'bg-green-100 text-green-800', icon: CreditCard },
      'refunded': { label: 'Remboursé', className: 'bg-orange-100 text-orange-800', icon: RefreshCw },
      'free': { label: 'Gratuit', className: 'bg-green-100 text-green-800', icon: Check },
    };
    
    const config = paymentConfig[appointment.paymentStatus];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: AppointmentType) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestion des Rendez-vous</h1>
          <p className="text-neutral-600">Gérez vos créneaux et les demandes de rendez-vous VIP</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettingsModal(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
          <Button onClick={() => setShowSlotModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un créneau
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
          <div className="text-2xl font-bold text-neutral-900">{stats.total}</div>
          <div className="text-sm text-neutral-600">Total</div>
        </div>
        <div 
          className="bg-white rounded-lg p-4 shadow-sm border border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
          onClick={() => setStatusFilter('pending-payment')}
        >
          <div className="text-2xl font-bold text-orange-700">{stats.pendingPayment}</div>
          <div className="text-sm text-orange-600">Attente paiement</div>
        </div>
        <div 
          className="bg-white rounded-lg p-4 shadow-sm border border-amber-200 bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors"
          onClick={() => setStatusFilter('paid')}
        >
          <div className="text-2xl font-bold text-amber-700">{stats.paidPending}</div>
          <div className="text-sm text-amber-600">Payés à confirmer</div>
        </div>
        <div 
          className="bg-white rounded-lg p-4 shadow-sm border border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => setStatusFilter('confirmed')}
        >
          <div className="text-2xl font-bold text-green-700">{stats.confirmed}</div>
          <div className="text-sm text-green-600">Confirmés</div>
        </div>
        <div 
          className="bg-white rounded-lg p-4 shadow-sm border border-purple-200 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors"
          onClick={() => setStatusFilter('alternative-proposed')}
        >
          <div className="text-2xl font-bold text-purple-700">{stats.alternativeProposed}</div>
          <div className="text-sm text-purple-600">Nouveau créneau</div>
        </div>
        <div 
          className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => setStatusFilter('completed')}
        >
          <div className="text-2xl font-bold text-blue-700">{stats.completed}</div>
          <div className="text-sm text-blue-600">Terminés</div>
        </div>
      </div>

      {/* Alert for paid pending */}
      {stats.paidPending > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">
              {stats.paidPending} rendez-vous payé(s) en attente de confirmation
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Ces clients ont effectué leur paiement et attendent votre confirmation.
            </p>
            <Button 
              size="sm" 
              className="mt-2"
              onClick={() => setStatusFilter('paid')}
            >
              Voir les demandes payées
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'appointments'
                  ? 'border-primary-700 text-primary-700'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Rendez-vous
                {stats.paidPending > 0 && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {stats.paidPending}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('slots')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'slots'
                  ? 'border-primary-700 text-primary-700'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Créneaux
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher par client ou sujet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all' | 'paid')}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="paid">✅ Payés à confirmer</option>
                  <option value="pending-payment">💳 Attente paiement</option>
                  <option value="pending">⏳ En attente</option>
                  <option value="confirmed">✓ Confirmés</option>
                  <option value="alternative-proposed">🔄 Nouveau créneau</option>
                  <option value="completed">✔ Terminés</option>
                  <option value="cancelled">✗ Annulés</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as AppointmentType | 'all')}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Tous les types</option>
                  <option value="online">En ligne</option>
                  <option value="in-person">Présentiel</option>
                </select>
              </div>

              {/* Appointments List */}
              <div className="space-y-3">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                    <p>Aucun rendez-vous trouvé</p>
                  </div>
                ) : (
                  filteredAppointments.map(appointment => (
                    <div
                      key={appointment.id}
                      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        appointment.paymentStatus === 'paid' && appointment.status === 'pending' 
                          ? 'border-amber-300 bg-amber-50' 
                          : appointment.status === 'pending-payment'
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Crown className="w-6 h-6 text-primary-700" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-semibold text-neutral-900">{appointment.clientName}</h4>
                              {getTypeBadge(appointment.type)}
                              {getStatusBadge(appointment.status)}
                              {getPaymentBadge(appointment)}
                            </div>
                            <p className="text-sm text-neutral-600 mb-1">{appointment.subject}</p>
                            <div className="flex items-center gap-4 text-sm text-neutral-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(appointment.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.startTime} - {appointment.endTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {appointment.price === 0 ? 'Gratuit' : formatPrice(appointment.price)}
                              </span>
                            </div>
                            {appointment.alternativeProposal && (
                              <div className="mt-2 p-2 bg-purple-100 rounded text-sm text-purple-800">
                                <RefreshCw className="w-4 h-4 inline mr-1" />
                                Nouveau créneau proposé : {formatDate(appointment.alternativeProposal.proposedDate)} à {appointment.alternativeProposal.proposedStartTime}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {appointment.status === 'pending' && appointment.paymentStatus === 'paid' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-purple-600 border-purple-300 hover:bg-purple-50"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowAlternativeModal(true);
                                }}
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Proposer autre créneau
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowAppointmentModal(true);
                                }}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Confirmer
                              </Button>
                            </>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCompleteAppointment(appointment)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Marquer terminé
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowAppointmentModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Slots Tab */}
          {activeTab === 'slots' && (
            <div className="space-y-6">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              

              {/* Quick Add Slots */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">Créneaux à venir</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slots
                    .filter(slot => new Date(slot.date) >= new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 12)
                    .map(slot => {
                      const hasAppointment = appointments.some(apt => apt.slotId === slot.id && apt.status !== 'cancelled');
                      return (
                        <div
                          key={slot.id}
                          className={`border rounded-lg p-3 ${
                            hasAppointment
                              ? 'border-blue-300 bg-blue-50'
                              : slot.isAvailable
                              ? 'border-green-300 bg-green-50'
                              : 'border-neutral-200 bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-neutral-900">
                              {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                            {hasAppointment ? (
                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Réservé</span>
                            ) : slot.isAvailable ? (
                              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Disponible</span>
                            ) : (
                              <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">Indisponible</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleToggleSlotAvailability(slot.id)}
                                className="p-1 hover:bg-white rounded transition-colors"
                                title={slot.isAvailable ? 'Désactiver' : 'Activer'}
                              >
                                {slot.isAvailable ? <X className="w-4 h-4 text-neutral-500" /> : <Check className="w-4 h-4 text-green-600" />}
                              </button>
                              {!hasAppointment && (
                                <button
                                  onClick={() => handleDeleteSlot(slot.id)}
                                  className="p-1 hover:bg-white rounded transition-colors text-red-500"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Détails du rendez-vous</h3>
                  <p className="text-sm text-neutral-600">{selectedAppointment.subject}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status & Payment */}
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(selectedAppointment.status)}
                {getTypeBadge(selectedAppointment.type)}
                {getPaymentBadge(selectedAppointment)}
              </div>

              {/* Payment Alert */}
              {selectedAppointment.paymentStatus === 'paid' && selectedAppointment.status === 'pending' && (
                <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Paiement reçu</p>
                    <p className="text-sm text-green-700 mt-1">
                      Le client a effectué le paiement de {formatPrice(selectedAppointment.price)}.
                      {selectedAppointment.paidAt && ` Reçu le ${new Date(selectedAppointment.paidAt).toLocaleDateString('fr-FR')}.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Client Info */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-600" />
                  Client VIP
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>{selectedAppointment.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span>{selectedAppointment.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span>{selectedAppointment.clientPhone}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-500">Date</label>
                  <p className="font-medium text-neutral-900">{formatDate(selectedAppointment.date)}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500">Horaire</label>
                  <p className="font-medium text-neutral-900">{selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500">Type</label>
                  <p className="font-medium text-neutral-900">
                    {selectedAppointment.type === 'online' ? 'Rendez-vous en ligne' : 'Rendez-vous en présentiel'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500">Tarif</label>
                  <p className="font-medium text-neutral-900">
                    {selectedAppointment.price === 0 ? 'Gratuit (1er RDV)' : formatPrice(selectedAppointment.price)}
                  </p>
                </div>
              </div>

              {/* Message */}
              {selectedAppointment.message && (
                <div>
                  <label className="text-sm text-neutral-500 block mb-1">Message du client</label>
                  <p className="text-neutral-700 bg-neutral-50 rounded-lg p-3">{selectedAppointment.message}</p>
                </div>
              )}

              {/* Admin Response */}
              {selectedAppointment.status === 'pending' && selectedAppointment.paymentStatus === 'paid' && (
                <div>
                  <label className="text-sm text-neutral-500 block mb-1">Message de confirmation (visible par le client)</label>
                  <textarea
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Message pour le client..."
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                  />
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="text-sm text-neutral-500 block mb-1">Notes internes (non visibles)</label>
                <textarea
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={2}
                  placeholder="Notes internes..."
                  defaultValue={selectedAppointment.adminNotes}
                />
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 flex flex-wrap justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAppointmentModal(false)}>
                Fermer
              </Button>
              {selectedAppointment.status === 'pending' && selectedAppointment.paymentStatus === 'paid' && (
                <>
                  <Button
                    variant="outline"
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                    onClick={() => {
                      setShowAlternativeModal(true);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Proposer autre créneau
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleRejectAppointment(selectedAppointment, 'Annulé par l\'administrateur - remboursement en cours')}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Refuser
                  </Button>
                  <Button onClick={() => handleConfirmAppointment(selectedAppointment)}>
                    <Check className="w-4 h-4 mr-1" />
                    Confirmer
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alternative Slot Modal */}
      {showAlternativeModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Proposer un autre créneau</h3>
              </div>
              <button
                onClick={() => setShowAlternativeModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-sm text-neutral-600">
                  Créneau initial demandé par <strong>{selectedAppointment.clientName}</strong> :
                </p>
                <p className="font-medium text-neutral-900">
                  {formatDate(selectedAppointment.date)} à {selectedAppointment.startTime}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Nouveau créneau proposé *
                </label>
                <select
                  value={alternativeSlot.slotId}
                  onChange={(e) => setAlternativeSlot(prev => ({ ...prev, slotId: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Sélectionnez un créneau</option>
                  {getAvailableSlots().slice(0, 20).map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} - {slot.startTime} à {slot.endTime}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Raison du changement *
                </label>
                <textarea
                  value={alternativeSlot.reason}
                  onChange={(e) => setAlternativeSlot(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  placeholder="Expliquez pourquoi vous proposez un autre créneau..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAlternativeModal(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => handleProposeAlternative(selectedAppointment)}
                disabled={!alternativeSlot.slotId || !alternativeSlot.reason}
              >
                <Send className="w-4 h-4 mr-1" />
                Envoyer la proposition
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Ajouter un créneau</h3>
              <button
                onClick={() => setShowSlotModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Heure de début</label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Heure de fin</label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSlotModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddSlot} disabled={!newSlot.date}>
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary-700" />
                <h3 className="text-lg font-semibold text-neutral-900">Paramètres des rendez-vous</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Durée par défaut (minutes)
                </label>
                <input
                  type="number"
                  value={editingSettings.defaultDuration}
                  onChange={(e) => setEditingSettings(prev => ({ ...prev, defaultDuration: parseInt(e.target.value) }))}
                  min={30}
                  step={30}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Prix RDV en ligne (FCFA)
                  </label>
                  <input
                    type="number"
                    value={editingSettings.onlinePrice}
                    onChange={(e) => setEditingSettings(prev => ({ ...prev, onlinePrice: parseInt(e.target.value) }))}
                    min={0}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Prix RDV présentiel (FCFA)
                  </label>
                  <input
                    type="number"
                    value={editingSettings.inPersonPrice}
                    onChange={(e) => setEditingSettings(prev => ({ ...prev, inPersonPrice: parseInt(e.target.value) }))}
                    min={0}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">Premier rendez-vous gratuit</p>
                  <p className="text-sm text-neutral-600">Le premier RDV de chaque client VIP est offert</p>
                </div>
                <button
                  onClick={() => setEditingSettings(prev => ({ ...prev, firstAppointmentFree: !prev.firstAppointmentFree }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    editingSettings.firstAppointmentFree ? 'bg-green-600' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      editingSettings.firstAppointmentFree ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Délai d'annulation (heures)
                </label>
                <input
                  type="number"
                  value={editingSettings.cancellationDeadlineHours}
                  onChange={(e) => setEditingSettings(prev => ({ ...prev, cancellationDeadlineHours: parseInt(e.target.value) }))}
                  min={1}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Information RDV en ligne
                </label>
                <input
                  type="text"
                  value={editingSettings.onlineLocation || ''}
                  onChange={(e) => setEditingSettings(prev => ({ ...prev, onlineLocation: e.target.value }))}
                  placeholder="Ex: Lien Google Meet envoyé par email"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Adresse RDV présentiel
                </label>
                <input
                  type="text"
                  value={editingSettings.inPersonLocation || ''}
                  onChange={(e) => setEditingSettings(prev => ({ ...prev, inPersonLocation: e.target.value }))}
                  placeholder="Ex: Bureaux RÉALITÉS SÉNÉGAL - Almadies, Dakar"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-1" />
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
