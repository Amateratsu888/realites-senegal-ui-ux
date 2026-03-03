import { AppointmentSlot, AppointmentSettings, Appointment, ClientAppointmentHistory, AlternativeSlotProposal } from '../types';

// Paramètres par défaut des rendez-vous
export const appointmentSettings: AppointmentSettings = {
  id: 'settings-1',
  defaultDuration: 120, // 2 heures par défaut
  onlinePrice: 50000, // 50 000 FCFA pour RDV en ligne
  inPersonPrice: 75000, // 75 000 FCFA pour RDV en présentiel
  firstAppointmentFree: true,
  cancellationDeadlineHours: 24,
  onlineLocation: 'Lien Google Meet envoyé par email après confirmation',
  inPersonLocation: 'Bureaux RÉALITÉS SÉNÉGAL - Almadies, Dakar',
  createdAt: '2024-01-01T09:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

// Fonction utilitaire pour générer des créneaux
const generateSlots = (): AppointmentSlot[] => {
  const slots: AppointmentSlot[] = [];
  const today = new Date();
  
  // Générer des créneaux pour les 30 prochains jours
  for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    
    // Skip weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Créneaux du matin
    slots.push({
      id: `slot-${dateStr}-0900`,
      date: dateStr,
      startTime: '09:00',
      endTime: '11:00',
      isAvailable: Math.random() > 0.3, // 70% disponibles
      createdAt: '2024-01-01T09:00:00Z',
      updatedAt: '2024-01-01T09:00:00Z',
    });
    
    // Créneaux de l'après-midi
    slots.push({
      id: `slot-${dateStr}-1400`,
      date: dateStr,
      startTime: '14:00',
      endTime: '16:00',
      isAvailable: Math.random() > 0.4, // 60% disponibles
      createdAt: '2024-01-01T09:00:00Z',
      updatedAt: '2024-01-01T09:00:00Z',
    });
    
    slots.push({
      id: `slot-${dateStr}-1600`,
      date: dateStr,
      startTime: '16:00',
      endTime: '18:00',
      isAvailable: Math.random() > 0.5, // 50% disponibles
      createdAt: '2024-01-01T09:00:00Z',
      updatedAt: '2024-01-01T09:00:00Z',
    });
  }
  
  return slots;
};

export const appointmentSlots: AppointmentSlot[] = generateSlots();

// Rendez-vous existants (exemples)
export const appointments: Appointment[] = [
  {
    id: 'apt-1',
    slotId: 'slot-2024-01-22-0900',
    clientId: 'client-vip-1',
    clientName: 'Fatou Cissé',
    clientEmail: 'fatou.cisse@example.com',
    clientPhone: '+221 77 123 45 67',
    type: 'in-person',
    status: 'confirmed',
    paymentStatus: 'free',
    subject: 'Consultation patrimoniale',
    message: 'Je souhaite discuter de mon portefeuille immobilier et des opportunités d\'investissement.',
    price: 0, // Premier RDV gratuit
    isFreeFirstAppointment: true,
    date: '2024-01-22',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Bureaux RÉALITÉS SÉNÉGAL - Almadies, Dakar',
    adminNotes: 'Cliente VIP depuis 2023, très intéressée par les villas de luxe.',
    adminResponse: 'Rendez-vous confirmé. Nous avons hâte de vous recevoir dans nos bureaux.',
    confirmedAt: '2024-01-18T14:00:00Z',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
  },
  {
    id: 'apt-2',
    slotId: 'slot-2024-01-25-1400',
    clientId: 'client-vip-2',
    clientName: 'Ousmane Ba',
    clientEmail: 'ousmane.ba@example.com',
    clientPhone: '+221 78 234 56 78',
    type: 'online',
    status: 'pending',
    paymentStatus: 'paid',
    subject: 'Informations sur un bien VEFA',
    message: 'Je voudrais en savoir plus sur les projets VEFA en cours.',
    price: 50000,
    isFreeFirstAppointment: false,
    date: '2024-01-25',
    startTime: '14:00',
    endTime: '16:00',
    paidAt: '2024-01-19T16:35:00Z',
    createdAt: '2024-01-19T16:30:00Z',
    updatedAt: '2024-01-19T16:35:00Z',
  },
  {
    id: 'apt-3',
    slotId: 'slot-2024-01-20-0900',
    clientId: 'client-vip-3',
    clientName: 'Aminata Diallo',
    clientEmail: 'aminata.diallo@example.com',
    clientPhone: '+221 76 345 67 89',
    type: 'in-person',
    status: 'completed',
    paymentStatus: 'paid',
    subject: 'Visite de propriété',
    message: 'Suite à notre échange, je souhaite visiter la villa aux Almadies.',
    price: 75000,
    isFreeFirstAppointment: false,
    date: '2024-01-20',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Bureaux RÉALITÉS SÉNÉGAL - Almadies, Dakar',
    adminResponse: 'Merci pour votre visite. N\'hésitez pas à nous recontacter pour toute question.',
    completedAt: '2024-01-20T11:00:00Z',
    confirmedAt: '2024-01-18T10:00:00Z',
    paidAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
  },
  {
    id: 'apt-4',
    slotId: 'slot-2024-01-23-1600',
    clientId: 'client-vip-4',
    clientName: 'Moussa Ndiaye',
    clientEmail: 'moussa.ndiaye@example.com',
    clientPhone: '+221 77 456 78 90',
    type: 'online',
    status: 'cancelled',
    paymentStatus: 'refunded',
    subject: 'Options de financement',
    message: 'Je voudrais discuter des options de financement pour un terrain.',
    price: 50000,
    isFreeFirstAppointment: false,
    date: '2024-01-23',
    startTime: '16:00',
    endTime: '18:00',
    cancelledAt: '2024-01-22T08:00:00Z',
    cancellationReason: 'Empêchement professionnel - remboursement effectué',
    paidAt: '2024-01-18T12:00:00Z',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-22T08:00:00Z',
  },
  {
    id: 'apt-5',
    slotId: 'slot-2024-01-26-0900',
    clientId: 'client-vip-1',
    clientName: 'Fatou Cissé',
    clientEmail: 'fatou.cisse@example.com',
    clientPhone: '+221 77 123 45 67',
    type: 'in-person',
    status: 'pending-payment',
    paymentStatus: 'unpaid',
    subject: 'Suivi de mon dossier',
    message: 'Je souhaite faire le point sur mes investissements en cours.',
    price: 75000,
    isFreeFirstAppointment: false,
    date: '2024-01-26',
    startTime: '09:00',
    endTime: '11:00',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
  },
  {
    id: 'apt-6',
    slotId: 'slot-2024-01-27-1400',
    clientId: 'client-vip-2',
    clientName: 'Ousmane Ba',
    clientEmail: 'ousmane.ba@example.com',
    clientPhone: '+221 78 234 56 78',
    type: 'online',
    status: 'alternative-proposed',
    paymentStatus: 'paid',
    subject: 'Projet VEFA',
    message: 'Je voudrais discuter d\'un nouveau projet VEFA.',
    price: 50000,
    isFreeFirstAppointment: false,
    date: '2024-01-27',
    startTime: '14:00',
    endTime: '16:00',
    paidAt: '2024-01-21T10:00:00Z',
    adminResponse: 'Le créneau initial n\'est plus disponible. Nous vous proposons un nouveau créneau.',
    alternativeProposal: {
      id: 'alt-1',
      appointmentId: 'apt-6',
      proposedSlotId: 'slot-2024-01-28-0900',
      proposedDate: '2024-01-28',
      proposedStartTime: '09:00',
      proposedEndTime: '11:00',
      reason: 'M. Amadou dieng a un déplacement professionnel le 27/01. Nous vous proposons le lendemain matin.',
      status: 'pending',
      proposedAt: '2024-01-21T14:00:00Z',
    },
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-01-21T14:00:00Z',
  },
];

// Historique des rendez-vous par client
export const clientAppointmentHistories: ClientAppointmentHistory[] = [
  {
    clientId: 'client-vip-1',
    totalAppointments: 1,
    completedAppointments: 0,
    cancelledAppointments: 0,
    noShowAppointments: 0,
    hasUsedFreeAppointment: true,
    lastAppointmentDate: '2024-01-22',
  },
  {
    clientId: 'client-vip-2',
    totalAppointments: 3,
    completedAppointments: 2,
    cancelledAppointments: 0,
    noShowAppointments: 0,
    hasUsedFreeAppointment: true,
    lastAppointmentDate: '2024-01-25',
  },
  {
    clientId: 'client-vip-3',
    totalAppointments: 5,
    completedAppointments: 4,
    cancelledAppointments: 1,
    noShowAppointments: 0,
    hasUsedFreeAppointment: true,
    lastAppointmentDate: '2024-01-20',
  },
];

// Sujets disponibles pour les rendez-vous
export const appointmentSubjects = [
  'Consultation patrimoniale',
  'Informations sur un bien',
  'Suivi de mon dossier',
  'Options de financement',
  'Visite de propriété',
  'Projet VEFA',
  'Services VIP',
  'Autre',
];
