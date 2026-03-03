export type PropertyType = 'villa' | 'appartement' | 'terrain' | 'espace-commercial';
export type PropertyStatus = 'disponible' | 'réservé' | 'vendu' | 'nouveau';
export type FinancingOption = 'comptant' | 'échelonné' | 'tontine' | 'location-vente' | 'vefa';
export type PropertyCategory = 'vente' | 'location-vente' | 'location';
export type UserRole = 'client' | 'technicien' | 'admin' | 'vip';
export type LeadStatus = 'nouveau' | 'en-cours' | 'gagné' | 'perdu';
export type LeadRequestType = 'demande-bien' | 'demande-vip';
export type PaymentStatus = 'payé' | 'en-attente' | 'en-retard' | 'completed' | 'pending' | 'failed';
export type PaymentMethodType = 'virement-bancaire' | 'carte-bancaire' | 'cheque' | 'especes' | 'mobile-money';
export type VEFAProjectStatus = 'planification' | 'en-construction' | 'presque-termine' | 'termine' | 'suspendu';
export type VEFAMilestoneStatus = 'planifie' | 'en-cours' | 'termine' | 'retarde';
export type VEFAMilestonePaidStatus = 'paid' | 'unpaid';

export interface VEFAMilestone {
  id: string;
  vefaProjectId: string;
  title: string;
  description: string;
  status: VEFAMilestoneStatus;
  paidStatus: VEFAMilestonePaidStatus;
  paymentAmount?: number;
  paymentDate?: string;
  receiptUrl?: string;
  order: number;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface VEFAProject {
  id: string;
  name: string;
  description: string;
  location: string;
  status: VEFAProjectStatus;
  startDate: string;
  expectedEndDate: string;
  totalBudget: number;
  spentBudget: number;
  ownerName: string;
  developerName: string;
  contactEmail: string;
  contactPhone: string;
  totalUnits: number;
  tags?: string[];
  milestones: VEFAMilestone[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PaymentPlan {
  id: string;
  duration: number; // Nombre de mois (personnalisable)
  totalPrice: number;
  downPayment: number;
  monthlyPayment: number;
  interestRate?: number; // Taux d'intérêt optionnel en pourcentage
  name?: string; // Nom du plan (ex: "Plan 12 mois", "Plan personnalisé")
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  iban?: string;
  swift?: string;
  isActive: boolean;
  paymentMethods: PaymentMethodType[];
  createdAt: string;
  updatedAt: string;
  currency?: string; // Par défaut XOF pour Sénégal
}

export type DayOfWeek = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';

export interface AvailabilityConfig {
  id: string;
  availableDays: DayOfWeek[];
  startTime: string; // Format HH:mm (ex: "09:00")
  endTime: string;   // Format HH:mm (ex: "18:00")
  lunchStartTime?: string; // Format HH:mm (ex: "12:00")
  lunchEndTime?: string;   // Format HH:mm (ex: "13:00")
  maxAppointmentsPerDay?: number;
  appointmentDuration?: number; // En minutes (ex: 30, 60)
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  type: PropertyType;
  title: string;
  location: string;
  price: number;
  surface: number;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  images: string[];
  status: PropertyStatus;
  featured: boolean;
  financingOptions: FinancingOption[];
  vipOnly?: boolean;
  vipExclusivityEndDate?: string; // Date de fin de l'exclusivité VIP automatique
  coordinates?: {
    lat: number;
    lng: number;
  };
  // Nouvelles informations détaillées
  category?: PropertyCategory;
  guestToilet?: boolean;
  floor?: string;
  groundLevel?: string;
  garageSpaces?: number;
  parking?: number;
  amenities?: string[];
  paymentPlans?: PaymentPlan[];
  ownerId?: string; // ID du propriétaire/client qui possède ce bien
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isVip?: boolean;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  propertyId: string;
  contractId?: string;
  method?: string;
  proofUrl?: string;
}

export type DocumentType = 'contrat' | 'facture' | 'reçu';

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  date: string;
  propertyId: string;
  url: string;
  contractId?: string;
  size?: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  message: string;
  status: LeadStatus;
  requestType?: LeadRequestType;
  assignedTo?: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  propertyId: string;
  userId: string;
  startDate: string;
  totalAmount: number;
  paidAmount: number;
  nextPaymentDate: string;
  installments: Payment[];
  status?: 'active' | 'pending' | 'completed';
}

// ============ VIP SERVICES & MILESTONES ============

export type VIPServiceType = 
  | 'verification-hors-realites'
  | 'identification-bien'
  | 'plan-cadastral-nicad'
  | 'achat-hors-realites';

export type ServiceRequestStatus = 
  | 'en-attente-validation'
  | 'acceptee'
  | 'refusee'
  | 'en-cours'
  | 'terminee'
  | 'suspendue';

export type MilestoneStatus = 
  | 'en-cours'
  | 'terminee'
  | 'suspendue'
  | 'en-attente-validation';

export interface ServiceZonePrice {
  zoneId: string;
  zoneName: string;
  price: number;
}

export interface VIPService {
  id: string;
  type: VIPServiceType;
  name: string;
  description: string;
  icon: string;
  zonePrices: ServiceZonePrice[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneComment {
  id: string;
  milestoneId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface MilestoneDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'other';
  url: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Milestone {
  id: string;
  serviceRequestId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  documents: MilestoneDocument[];
  comments: MilestoneComment[];
  commentsEnabled: boolean;
  isProtected: boolean;
  protectedAt?: string;
  protectedBy?: string;
  estimatedDuration?: string;
  completedAt?: string;
}

export interface ServiceRequestDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'other';
  url: string;
  size: string;
  uploadedAt: string;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceType: VIPServiceType;
  clientId: string;
  clientName: string;
  status: ServiceRequestStatus;
  description: string;
  location?: string;
  zoneId?: string;
  zoneName?: string;
  price?: number;
  documents: ServiceRequestDocument[];
  milestones: Milestone[];
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
  validatedBy?: string;
  rejectionReason?: string;
  completedAt?: string;
}

// ============ APPOINTMENTS MANAGEMENT ============

export type AppointmentType = 'online' | 'in-person';

export type AppointmentStatus = 
  | 'pending-payment'   // En attente de paiement
  | 'pending'           // Payé, en attente de confirmation admin
  | 'confirmed'         // Confirmé par l'admin
  | 'alternative-proposed' // Admin a proposé un autre créneau
  | 'cancelled'         // Annulé
  | 'completed'         // Terminé
  | 'no-show';          // Client absent

export type AppointmentPaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'free';

export interface AppointmentSlot {
  id: string;
  date: string;           // Format YYYY-MM-DD
  startTime: string;      // Format HH:mm
  endTime: string;        // Format HH:mm
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentSettings {
  id: string;
  defaultDuration: number;           // Durée en minutes (défaut: 120)
  onlinePrice: number;               // Prix RDV en ligne (après le 1er gratuit)
  inPersonPrice: number;             // Prix RDV en présentiel (après le 1er gratuit)
  firstAppointmentFree: boolean;     // Premier RDV gratuit
  cancellationDeadlineHours: number; // Délai d'annulation en heures
  onlineLocation?: string;           // Lien ou info pour RDV en ligne
  inPersonLocation?: string;         // Adresse pour RDV en présentiel
  createdAt: string;
  updatedAt: string;
}

export interface AlternativeSlotProposal {
  id: string;
  appointmentId: string;
  proposedSlotId: string;
  proposedDate: string;
  proposedStartTime: string;
  proposedEndTime: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  proposedAt: string;
  respondedAt?: string;
}

export interface Appointment {
  id: string;
  slotId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: AppointmentType;
  status: AppointmentStatus;
  paymentStatus: AppointmentPaymentStatus;
  subject: string;
  message?: string;
  price: number;                     // 0 si premier RDV gratuit
  isFreeFirstAppointment: boolean;
  date: string;                      // Format YYYY-MM-DD
  startTime: string;                 // Format HH:mm
  endTime: string;                   // Format HH:mm
  meetingLink?: string;              // Lien de la visio pour RDV en ligne
  location?: string;                 // Adresse pour RDV en présentiel
  adminNotes?: string;               // Notes internes de l'admin
  adminResponse?: string;            // Réponse visible par le client
  alternativeProposal?: AlternativeSlotProposal; // Proposition de créneau alternatif
  paidAt?: string;                   // Date de paiement
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientAppointmentHistory {
  clientId: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  hasUsedFreeAppointment: boolean;
  lastAppointmentDate?: string;
}