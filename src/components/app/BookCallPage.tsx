import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  Video, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  User,
  MapPin,
  Crown,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Gift
} from 'lucide-react';
import { Button } from '../Button';
import { 
  appointmentSlots, 
  appointmentSettings, 
  appointments as existingAppointments,
  clientAppointmentHistories,
  appointmentSubjects 
} from '../../data/appointmentsData';
import { AppointmentSlot, AppointmentType } from '../../types';

interface BookCallPageProps {
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export function BookCallPage({ 
  clientId = 'client-vip-1',
  clientName = 'Fatou Cissé',
  clientEmail = 'fatou.cisse@example.com',
  clientPhone = '+221 77 123 45 67'
}: BookCallPageProps) {
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Start from tomorrow
    return today;
  });

  // Vérifier si c'est le premier RDV du client
  const clientHistory = clientAppointmentHistories.find(h => h.clientId === clientId);
  const isFirstAppointment = !clientHistory?.hasUsedFreeAppointment;
  const isFreeAppointment = isFirstAppointment && appointmentSettings.firstAppointmentFree;

  // Calculer le prix
  const getPrice = () => {
    if (isFreeAppointment) return 0;
    return selectedType === 'online' 
      ? appointmentSettings.onlinePrice 
      : appointmentSettings.inPersonPrice;
  };

  // Obtenir les créneaux disponibles
  const availableSlots = useMemo(() => {
    return appointmentSlots.filter(slot => {
      // Vérifier si le créneau est disponible
      if (!slot.isAvailable) return false;
      
      // Vérifier si le créneau n'est pas déjà réservé
      const isBooked = existingAppointments.some(
        apt => apt.slotId === slot.id && apt.status !== 'cancelled'
      );
      if (isBooked) return false;
      
      // Vérifier si la date est dans le futur
      const slotDate = new Date(slot.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return slotDate > today;
    }).sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.startTime);
      const dateB = new Date(b.date + 'T' + b.startTime);
      return dateA.getTime() - dateB.getTime();
    });
  }, []);

  // Grouper les créneaux par date
  const slotsByDate = useMemo(() => {
    const grouped: Record<string, AppointmentSlot[]> = {};
    availableSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  }, [availableSlots]);

  // Obtenir les dates avec des créneaux disponibles pour la semaine courante
  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedType || !subject) return;
    
    // Simuler l'envoi de la demande
    console.log('Demande de rendez-vous:', {
      slot: selectedSlot,
      type: selectedType,
      subject,
      message,
      price: getPrice(),
      isFreeFirstAppointment: isFreeAppointment,
      clientId,
      clientName,
      clientEmail,
      clientPhone,
    });

    setIsSubmitted(true);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  // Page de confirmation
  if (isSubmitted && selectedSlot) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-3">Demande enregistrée !</h3>
          <p className="text-neutral-600 mb-6">
            Votre demande de rendez-vous a été envoyée avec succès. 
            M. Amadou dieng examinera votre demande et vous recevrez une confirmation sous 24h.
          </p>
          <div className="bg-neutral-50 rounded-lg p-4 text-left space-y-2">
            <p className="text-sm text-neutral-700">
              <strong>Type :</strong> {selectedType === 'online' ? 'Rendez-vous en ligne' : 'Rendez-vous en présentiel'}
            </p>
            <p className="text-sm text-neutral-700">
              <strong>Date :</strong> {formatDate(selectedSlot.date)}
            </p>
            <p className="text-sm text-neutral-700">
              <strong>Horaire :</strong> {selectedSlot.startTime} - {selectedSlot.endTime}
            </p>
            <p className="text-sm text-neutral-700">
              <strong>Sujet :</strong> {subject}
            </p>
            <p className="text-sm text-neutral-700">
              <strong>Tarif :</strong> {isFreeAppointment ? (
                <span className="text-green-600 font-medium">Gratuit (1er rendez-vous offert)</span>
              ) : (
                formatPrice(getPrice())
              )}
            </p>
          </div>
          <Button 
            className="mt-6"
            onClick={() => {
              setIsSubmitted(false);
              setSelectedType(null);
              setSelectedSlot(null);
              setSubject('');
              setMessage('');
            }}
          >
            Prendre un autre rendez-vous
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-800 rounded-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Prendre rendez-vous avec M. Amadou dieng</h2>
            <p className="text-white/80">
              Service exclusif réservé aux clients VIP
            </p>
          </div>
        </div>
        {isFreeAppointment && (
          <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3 mt-4">
            <Gift className="w-5 h-5 text-amber-300" />
            <span className="text-white">
              <strong>Offre spéciale :</strong> Votre premier rendez-vous est gratuit !
            </span>
          </div>
        )}
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-neutral-900 font-medium mb-3">
              Type de rendez-vous <span className="text-primary-700">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedType('online')}
                className={`border-2 rounded-lg p-6 transition-all text-left ${
                  selectedType === 'online'
                    ? 'border-primary-700 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedType === 'online' ? 'bg-primary-700' : 'bg-neutral-100'
                  }`}>
                    <Video className={`w-6 h-6 ${
                      selectedType === 'online' ? 'text-white' : 'text-neutral-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-neutral-900 mb-1">Rendez-vous en ligne</h5>
                    <p className="text-sm text-neutral-600 mb-2">
                      Visioconférence avec M. Amadou dieng depuis chez vous
                    </p>
                    <p className="text-sm font-medium text-primary-700">
                      {isFreeAppointment ? 'Gratuit' : formatPrice(appointmentSettings.onlinePrice)}
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('in-person')}
                className={`border-2 rounded-lg p-6 transition-all text-left ${
                  selectedType === 'in-person'
                    ? 'border-primary-700 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedType === 'in-person' ? 'bg-primary-700' : 'bg-neutral-100'
                  }`}>
                    <MapPin className={`w-6 h-6 ${
                      selectedType === 'in-person' ? 'text-white' : 'text-neutral-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-neutral-900 mb-1">Rendez-vous en présentiel</h5>
                    <p className="text-sm text-neutral-600 mb-2">
                      Rencontre dans nos bureaux aux Almadies, Dakar
                    </p>
                    <p className="text-sm font-medium text-primary-700">
                      {isFreeAppointment ? 'Gratuit' : formatPrice(appointmentSettings.inPersonPrice)}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {selectedType && (
            <>
              {/* Slot Selection */}
              <div>
                <label className="block text-neutral-900 font-medium mb-3">
                  Choisissez un créneau <span className="text-primary-700">*</span>
                </label>
                
                {availableSlots.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 font-medium">Aucun créneau disponible</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Il n'y a actuellement aucun créneau disponible. Veuillez réessayer plus tard 
                        ou contacter directement notre équipe.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setCurrentWeekStart(prev => {
                          const newDate = new Date(prev);
                          newDate.setDate(prev.getDate() - 7);
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          return newDate < tomorrow ? tomorrow : newDate;
                        })}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-medium text-neutral-700">
                        {weekDates[0].toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentWeekStart(prev => {
                          const newDate = new Date(prev);
                          newDate.setDate(prev.getDate() + 7);
                          return newDate;
                        })}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Week Grid */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {weekDates.map(date => {
                        const dateStr = date.toISOString().split('T')[0];
                        const daySlots = slotsByDate[dateStr] || [];
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        const hasSlots = daySlots.length > 0;
                        
                        return (
                          <div
                            key={dateStr}
                            className={`text-center p-2 rounded-lg ${
                              isWeekend ? 'bg-neutral-50' : hasSlots ? 'bg-green-50' : 'bg-neutral-100'
                            }`}
                          >
                            <div className="text-xs text-neutral-500">
                              {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                            </div>
                            <div className={`font-semibold ${hasSlots ? 'text-green-700' : 'text-neutral-400'}`}>
                              {date.getDate()}
                            </div>
                            {hasSlots && (
                              <div className="text-xs text-green-600">{daySlots.length} créneaux</div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Available Slots */}
                    <div className="space-y-4">
                      {weekDates.map(date => {
                        const dateStr = date.toISOString().split('T')[0];
                        const daySlots = slotsByDate[dateStr] || [];
                        
                        if (daySlots.length === 0) return null;
                        
                        return (
                          <div key={dateStr}>
                            <h4 className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(date)}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {daySlots.map(slot => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`border-2 rounded-lg p-3 transition-all text-center ${
                                    selectedSlot?.id === slot.id
                                      ? 'border-primary-700 bg-primary-50'
                                      : 'border-neutral-200 hover:border-primary-300'
                                  }`}
                                >
                                  <Clock className={`w-4 h-4 mx-auto mb-1 ${
                                    selectedSlot?.id === slot.id ? 'text-primary-700' : 'text-neutral-500'
                                  }`} />
                                  <span className={`text-sm font-medium ${
                                    selectedSlot?.id === slot.id ? 'text-primary-700' : 'text-neutral-900'
                                  }`}>
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Subject Selection */}
              {selectedSlot && (
                <>
                  <div>
                    <label className="block text-neutral-900 font-medium mb-3">
                      Sujet du rendez-vous <span className="text-primary-700">*</span>
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      {appointmentSubjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-neutral-900 font-medium mb-3">
                      Message complémentaire (optionnel)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Décrivez brièvement l'objet de votre demande..."
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <h4 className="font-medium text-neutral-900 mb-3">Récapitulatif</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Type</span>
                        <span className="font-medium text-neutral-900">
                          {selectedType === 'online' ? 'En ligne' : 'Présentiel'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Date</span>
                        <span className="font-medium text-neutral-900">
                          {formatDate(selectedSlot.date)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Horaire</span>
                        <span className="font-medium text-neutral-900">
                          {selectedSlot.startTime} - {selectedSlot.endTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Durée</span>
                        <span className="font-medium text-neutral-900">
                          {appointmentSettings.defaultDuration} minutes
                        </span>
                      </div>
                      <div className="border-t border-neutral-200 pt-2 mt-2 flex justify-between">
                        <span className="text-neutral-700 font-medium">Tarif</span>
                        {isFreeAppointment ? (
                          <span className="font-bold text-green-600 flex items-center gap-1">
                            <Gift className="w-4 h-4" />
                            Gratuit
                          </span>
                        ) : (
                          <span className="font-bold text-neutral-900">
                            {formatPrice(getPrice())}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900 mb-1">
                          <strong>Information importante</strong>
                        </p>
                        <p className="text-sm text-blue-700">
                          Votre demande sera examinée par M. Amadou dieng. Vous recevrez une confirmation 
                          par email sous 24h. {!isFreeAppointment && 'Le paiement sera demandé après confirmation du rendez-vous.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit"
                      disabled={!selectedType || !selectedSlot || !subject}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Demander ce rendez-vous
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </div>

      {/* Help Section */}
      <div className="bg-neutral-50 rounded-xl p-6">
        <h4 className="font-semibold text-neutral-900 mb-3">Besoin d'aide ?</h4>
        <p className="text-neutral-600 mb-4">
          Si aucun créneau ne vous convient ou pour toute question urgente, 
          contactez-nous directement :
        </p>
        <div className="flex flex-wrap gap-4">
          <a 
            href="tel:+221338234567" 
            className="flex items-center gap-2 text-primary-700 hover:text-primary-800 transition-colors"
          >
            <Phone className="w-4 h-4" />
            +221 33 823 45 67
          </a>
          <span className="text-neutral-300">|</span>
          <p className="text-neutral-600">
            Du lundi au vendredi, 9h-18h
          </p>
        </div>
      </div>
    </div>
  );
}
