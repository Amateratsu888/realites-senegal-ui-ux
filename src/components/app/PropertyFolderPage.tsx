import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ArrowLeft, 
  CreditCard, 
  FileText, 
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Info,
  Calendar,
  Home,
  Wallet,
  TrendingUp,
  DollarSign,
  X,
  Receipt,
  FileCheck,
  Eye,
  PenTool,
  Upload
} from 'lucide-react';
import { Button } from '../Button';
import { properties, contracts, payments, documents, bankAccounts } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PropertyFolderPageProps {
  propertyId: string;
  onNavigate: (page: string) => void;
  isOnboardingMode?: boolean;
}

export function PropertyFolderPage({ propertyId, onNavigate, isOnboardingMode }: PropertyFolderPageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'payments' | 'documents'>('info');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile'>('card');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signedDocuments, setSignedDocuments] = useState<string[]>([]);
  const [viewedDocuments, setViewedDocuments] = useState<string[]>([]);

  const property = properties.find(p => p.id === propertyId);
  const contract = contracts.find(c => c.propertyId === propertyId);
  const propertyPayments = payments.filter(p => p.contractId === contract?.id);
  const propertyDocuments = documents.filter(d => d.contractId === contract?.id);
  
  // Obtenir le compte bancaire pour les virements (premier compte actif avec virement)
  const bankAccountForTransfer = bankAccounts.find(
    acc => acc.isActive && acc.paymentMethods.includes('virement-bancaire')
  );

  if (!property || !contract) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <AlertCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h3 className="mb-2">Dossier introuvable</h3>
        <p className="text-neutral-600 mb-6">Le dossier demandé n'existe pas ou vous n'y avez pas accès.</p>
        <Button onClick={() => onNavigate('my-properties')}>
          Retour à mes biens
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const progress = (contract.paidAmount / contract.totalAmount) * 100;
  const remainingAmount = contract.totalAmount - contract.paidAmount;

  const tabs = [
    { id: 'info' as const, label: 'Informations du bien', icon: Home },
    { id: 'payments' as const, label: 'Paiements', icon: CreditCard },
    { id: 'documents' as const, label: 'Documents & Contrats', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('my-properties')}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <h2 className="!text-neutral-900 mb-1">Dossier : {property.title}</h2>
          <div className="flex items-center gap-2 text-neutral-600">
            <MapPin className="w-4 h-4" />
            <span>{property.location}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-600">N° Dossier</p>
          <p className="text-neutral-900">{contract.id}</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-neutral-100 rounded-xl p-6">
        <div className="flex items-center gap-8 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Montant total</p>
              <p className="text-xl text-neutral-900">{formatPrice(contract.totalAmount)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Montant payé</p>
              <p className="text-xl text-neutral-900">{formatPrice(contract.paidAmount)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Montant restant</p>
              <p className="text-xl text-neutral-900">{formatPrice(remainingAmount)}</p>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-neutral-600">Progression du paiement</span>
            <span className="text-neutral-900 font-semibold">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div 
              className="bg-primary-700 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-neutral-50 border-b-2 border-neutral-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={tab.id === 'payments' ? 'tab-payments' : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 transition-all border-b-4 font-medium ${
                  activeTab === tab.id
                    ? 'border-primary-700 bg-white text-primary-700 shadow-sm'
                    : 'border-transparent text-neutral-600 hover:bg-white hover:text-neutral-900'
                }`}
              >
                <tab.icon className="w-6 h-6" />
                <span className="text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Informations Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Property Images */}
              <div>
                <h4 className="text-neutral-900 mb-4">Photos du bien</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.images.map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={image}
                        alt={`${property.title} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h4 className="text-neutral-900 mb-4">Caractéristiques</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-1">Type de bien</p>
                    <p className="text-neutral-900 capitalize">{property.type}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-1">Superficie</p>
                    <p className="text-neutral-900">{property.surface} m²</p>
                  </div>
                  {property.bedrooms && (
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-600 mb-1">Chambres</p>
                      <p className="text-neutral-900">{property.bedrooms}</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-600 mb-1">Salles de bain</p>
                      <p className="text-neutral-900">{property.bathrooms}</p>
                    </div>
                  )}
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-1">Localisation</p>
                    <p className="text-neutral-900">{property.location}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-1">Prix</p>
                    <p className="text-neutral-900">{formatPrice(property.price)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-neutral-900 mb-4">Description</h4>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-neutral-700">{property.description}</p>
                </div>
              </div>

              {/* Contract Info */}
              <div>
                <h4 className="text-neutral-900 mb-4">Informations du contrat</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-1">Date de signature</p>
                    <p className="text-neutral-900">{formatDate(contract.startDate)}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-1">Prochain paiement</p>
                    <p className="text-neutral-900">{formatDate(contract.nextPaymentDate)}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-1">Statut</p>
                    <div className="flex items-center gap-2">
                      {contract.status === 'active' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Actif</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-yellow-600">En attente</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 mb-1">
                      <strong>Prochain paiement prévu</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      Le {formatDate(contract.nextPaymentDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Payment Action */}
              <div className="flex justify-end">
                <Button onClick={() => setShowPaymentModal(true)}>
                  <CreditCard className="w-5 h-5" />
                  Effectuer un paiement
                </Button>
              </div>

              {/* Payment Schedule - Future Installments Only */}
              <div>
                <h4 className="text-neutral-900 mb-4">Prochaines échéances</h4>
                {contract.installments && contract.installments.filter(i => i.status !== 'payé').length > 0 ? (
                  <div className="space-y-3">
                    {contract.installments
                      .filter(i => i.status !== 'payé')
                      .map((installment, index) => {
                        const isOverdue = installment.status === 'en-retard';
                        const installmentDate = new Date(installment.date);
                        const today = new Date();
                        const isUpcoming = installmentDate > today;
                        const daysUntil = Math.ceil((installmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        const allInstallments = contract.installments || [];
                        const installmentNumber = allInstallments.findIndex(i => i.id === installment.id) + 1;
                        
                        return (
                          <div 
                            key={installment.id} 
                            className={`border-2 rounded-lg p-5 transition-all ${
                              isOverdue
                                ? 'border-red-300 bg-red-50'
                                : isUpcoming
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-yellow-300 bg-yellow-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                                  isOverdue
                                    ? 'bg-red-100'
                                    : isUpcoming
                                    ? 'bg-blue-100'
                                    : 'bg-yellow-100'
                                }`}>
                                  {isOverdue ? (
                                    <AlertCircle className="w-7 h-7 text-red-700" />
                                  ) : (
                                    <Calendar className="w-7 h-7 text-blue-700" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <p className="text-neutral-900 font-medium">
                                      Échéance {installmentNumber} sur {allInstallments.length}
                                    </p>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                      isOverdue
                                        ? 'bg-red-100 text-red-700'
                                        : isUpcoming
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {isOverdue && <AlertCircle className="w-3 h-3" />}
                                      {!isOverdue && <Clock className="w-3 h-3" />}
                                      {isOverdue ? 'En retard' : isUpcoming ? 'À venir' : 'En attente'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      <span className="font-medium">{formatDate(installment.date)}</span>
                                    </div>
                                    {isUpcoming && daysUntil > 0 && (
                                      <>
                                        <span>•</span>
                                        <span>
                                          Dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}
                                        </span>
                                      </>
                                    )}
                                    {isOverdue && (
                                      <>
                                        <span>•</span>
                                        <span className="text-red-600 font-medium">
                                          Paiement en retard
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl text-neutral-900 font-semibold mb-2">
                                  {formatPrice(installment.amount)}
                                </p>
                                <Button 
                                  id={index === 0 ? 'pay-installment-0' : undefined}
                                  size="sm"
                                  onClick={() => {
                                    setPaymentAmount(installment.amount.toString());
                                    setShowPaymentModal(true);
                                  }}
                                >
                                  Payer maintenant
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-neutral-50 rounded-lg">
                    <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <p className="text-neutral-900 font-medium mb-2">Tous les paiements sont à jour !</p>
                    <p className="text-neutral-600 text-sm">Aucune échéance en attente</p>
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div>
                <h4 className="text-neutral-900 mb-4">Historique des paiements</h4>
                {propertyPayments.length > 0 ? (
                  <div className="space-y-3">
                    {propertyPayments.map((payment) => (
                      <div key={payment.id} className="border border-neutral-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              payment.status === 'completed' 
                                ? 'bg-green-100' 
                                : payment.status === 'pending'
                                ? 'bg-yellow-100'
                                : 'bg-red-100'
                            }`}>
                              {payment.status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : payment.status === 'pending' ? (
                                <Clock className="w-5 h-5 text-yellow-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-neutral-900">Paiement #{payment.id}</p>
                              <p className="text-sm text-neutral-600">{formatDate(payment.date)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-neutral-900 font-medium">{formatPrice(payment.amount)}</p>
                            <p className={`text-sm ${
                              payment.status === 'completed' 
                                ? 'text-green-600' 
                                : payment.status === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}>
                              {payment.status === 'completed' 
                                ? 'Confirmé' 
                                : payment.status === 'pending'
                                ? 'En attente'
                                : 'Échoué'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Mode de paiement : {payment.method}</span>
                          {payment.status === 'completed' && (
                            <button className="text-primary-700 hover:text-primary-800 flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              Télécharger le reçu
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-neutral-50 rounded-lg">
                    <CreditCard className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-600">Aucun paiement enregistré</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Contracts Section */}
              <div>
                <h4 className="text-neutral-900 mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary-700" />
                  Contrats
                </h4>
                
                {/* Info message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 mb-1">
                        <strong>Information importante</strong>
                      </p>
                      <p className="text-sm text-blue-700">
                        Vous devez d'abord consulter le contrat en cliquant sur "Lire" avant de pouvoir le signer. Le document s'ouvrira dans un nouvel onglet.
                      </p>
                    </div>
                  </div>
                </div>

                {propertyDocuments.filter(d => d.type === 'contrat').length > 0 ? (
                  <div className="space-y-3">
                    {propertyDocuments.filter(d => d.type === 'contrat').map((doc) => {
                      const isSigned = signedDocuments.includes(doc.id);
                      return (
                        <div 
                          key={doc.id} 
                          className={`border-2 rounded-lg p-5 transition-all ${
                            isSigned 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-primary-300 bg-primary-50 hover:border-primary-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                                isSigned ? 'bg-green-100' : 'bg-primary-100'
                              }`}>
                                <FileCheck className={`w-7 h-7 ${isSigned ? 'text-green-700' : 'text-primary-700'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className={`text-neutral-900 ${isSigned ? '' : 'font-medium'}`}>{doc.name}</p>
                                  {isSigned && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Signé
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-neutral-600">
                                  <span>Contrat de vente</span>
                                  <span>•</span>
                                  <span>{formatDate(doc.date)}</span>
                                  {doc.size && (
                                    <>
                                      <span>•</span>
                                      <span>{doc.size}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Marquer le document comme consulté
                                  if (!viewedDocuments.includes(doc.id)) {
                                    setViewedDocuments([...viewedDocuments, doc.id]);
                                  }
                                  // Ouvrir dans un nouvel onglet (simulé)
                                  window.open('#document-' + doc.id, '_blank');
                                }}
                              >
                                <Eye className="w-4 h-4" />
                                Lire
                              </Button>
                              {!isSigned && (
                                <Button 
                                  size="sm"
                                  disabled={!viewedDocuments.includes(doc.id)}
                                  onClick={() => {
                                    setSelectedDocument(doc);
                                    setShowSignatureModal(true);
                                  }}
                                  title={!viewedDocuments.includes(doc.id) ? 'Veuillez d\'abord consulter le document' : ''}
                                >
                                  <PenTool className="w-4 h-4" />
                                  Signer
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-neutral-50 rounded-lg">
                    <FileCheck className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                    <p className="text-neutral-600 text-sm">Aucun contrat disponible</p>
                  </div>
                )}
              </div>

              {/* Invoices Section */}
              <div>
                <h4 className="text-neutral-900 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-700" />
                  Factures
                </h4>
                {propertyDocuments.filter(d => d.type === 'facture').length > 0 ? (
                  <div className="space-y-3">
                    {propertyDocuments.filter(d => d.type === 'facture').map((doc) => (
                      <div 
                        key={doc.id} 
                        className="border border-blue-200 bg-blue-50 rounded-lg p-4 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Receipt className="w-6 h-6 text-blue-700" />
                            </div>
                            <div>
                              <p className="text-neutral-900 mb-1">{doc.name}</p>
                              <div className="flex items-center gap-4 text-sm text-neutral-600">
                                <span>Facture</span>
                                <span>•</span>
                                <span>{formatDate(doc.date)}</span>
                                {doc.size && (
                                  <>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowDocumentViewer(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              Voir
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-neutral-50 rounded-lg">
                    <Receipt className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                    <p className="text-neutral-600 text-sm">Aucune facture disponible</p>
                  </div>
                )}
              </div>

              {/* Receipts Section */}
              <div>
                <h4 className="text-neutral-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-700" />
                  Reçus de paiement
                </h4>
                {propertyDocuments.filter(d => d.type === 'reçu').length > 0 ? (
                  <div className="space-y-3">
                    {propertyDocuments.filter(d => d.type === 'reçu').map((doc) => (
                      <div 
                        key={doc.id} 
                        className="border border-green-200 bg-green-50 rounded-lg p-4 hover:border-green-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-6 h-6 text-green-700" />
                            </div>
                            <div>
                              <p className="text-neutral-900 mb-1">{doc.name}</p>
                              <div className="flex items-center gap-4 text-sm text-neutral-600">
                                <span>Reçu</span>
                                <span>•</span>
                                <span>{formatDate(doc.date)}</span>
                                {doc.size && (
                                  <>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowDocumentViewer(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              Voir
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-neutral-50 rounded-lg">
                    <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                    <p className="text-neutral-600 text-sm">Aucun reçu disponible</p>
                  </div>
                )}
              </div>

              {/* Upload Section */}
              <div className="bg-neutral-50 rounded-lg p-6">
                <h4 className="text-neutral-900 mb-3">Envoyer un document</h4>
                <p className="text-neutral-600 text-sm mb-4">
                  Vous pouvez téléverser des documents supplémentaires (pièces d'identité, justificatifs, etc.)
                </p>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
                  <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-700 mb-2">Cliquez pour sélectionner un fichier</p>
                  <p className="text-sm text-neutral-500">PDF, JPG, PNG (max. 10MB)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h3 className="text-neutral-900">Effectuer un paiement</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Payment Summary */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-600">Montant restant</span>
                  <span className="text-xl text-neutral-900">{formatPrice(remainingAmount)}</span>
                </div>
              </div>

              {/* Payment Amount */}
              <div>
                <label className="block text-sm text-neutral-700 mb-2">Montant à payer (XOF)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Entrez le montant"
                  className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm text-neutral-700 mb-3">Mode de paiement</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-primary-700 bg-primary-50 text-primary-700' 
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm">Carte bancaire</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'bank' 
                        ? 'border-primary-700 bg-primary-50 text-primary-700' 
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <Building2 className="w-6 h-6" />
                    <span className="text-sm">Virement</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'mobile' 
                        ? 'border-primary-700 bg-primary-50 text-primary-700' 
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <Wallet className="w-6 h-6" />
                    <span className="text-sm">Mobile Money</span>
                  </button>
                </div>
              </div>

              {/* Bank Transfer Details */}
              {paymentMethod === 'bank' && bankAccountForTransfer && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-3">Coordonnées bancaires</h4>
                      
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-neutral-600 mb-1">Banque</p>
                          <p className="text-sm font-medium text-neutral-900">{bankAccountForTransfer.bankName}</p>
                        </div>
                        
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-neutral-600 mb-1">Titulaire du compte</p>
                          <p className="text-sm font-medium text-neutral-900">{bankAccountForTransfer.accountHolderName}</p>
                        </div>
                        
                        {bankAccountForTransfer.iban && (
                          <div className="bg-white rounded p-3">
                            <p className="text-xs text-neutral-600 mb-1">IBAN</p>
                            <p className="text-sm font-mono text-neutral-900">{bankAccountForTransfer.iban}</p>
                          </div>
                        )}
                        
                        {bankAccountForTransfer.swift && (
                          <div className="bg-white rounded p-3">
                            <p className="text-xs text-neutral-600 mb-1">Code SWIFT</p>
                            <p className="text-sm font-mono text-neutral-900">{bankAccountForTransfer.swift}</p>
                          </div>
                        )}
                        
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-neutral-600 mb-1">Numéro de compte</p>
                          <p className="text-sm font-mono text-neutral-900">{bankAccountForTransfer.accountNumber}</p>
                        </div>
                      </div>

                      {/* Upload Proof Section */}
                      <div className="pt-3 border-t border-blue-200">
                        <label className="block text-sm font-medium text-neutral-900 mb-3">Joindre une preuve de paiement</label>
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white">
                          <input
                            type="file"
                            id="proof-upload"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setProofFileName(file.name);
                              }
                            }}
                          />
                          <label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Upload className="w-5 h-5 text-blue-600" />
                            </div>
                            {proofFileName ? (
                              <>
                                <p className="text-sm text-neutral-900 font-medium">{proofFileName}</p>
                                <p className="text-xs text-blue-600">Cliquez pour changer le fichier</p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-medium text-neutral-700">Cliquez pour sélectionner un PDF</p>
                                <p className="text-xs text-neutral-500">Fichier PDF uniquement (max. 10MB)</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
              <Button
                onClick={() => {
                  setShowPaymentModal(false);
                  setProofFileName('');
                }}
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  // Handle payment logic here
                  console.log('Paiement effectué:', {
                    montant: paymentAmount,
                    méthode: paymentMethod,
                    preuveUploadée: proofFileName
                  });
                  setShowPaymentModal(false);
                  setPaymentAmount('');
                  setProofFileName('');
                }}
              >
                <CreditCard className="w-5 h-5" />
                Confirmer le paiement
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                {selectedDocument.type === 'contrat' ? (
                  <FileCheck className="w-6 h-6 text-primary-700" />
                ) : selectedDocument.type === 'facture' ? (
                  <Receipt className="w-6 h-6 text-blue-700" />
                ) : (
                  <FileText className="w-6 h-6 text-green-700" />
                )}
                <h3 className="text-neutral-900">{selectedDocument.name}</h3>
              </div>
              <button
                onClick={() => setShowDocumentViewer(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Document Metadata */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">Type</p>
                  <p className="text-neutral-900 capitalize">{selectedDocument.type}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">Date</p>
                  <p className="text-neutral-900">{formatDate(selectedDocument.date)}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">Taille</p>
                  <p className="text-neutral-900">{selectedDocument.size}</p>
                </div>
              </div>

              {/* Document Preview Area */}
              <div className="bg-neutral-100 rounded-lg p-12 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    {selectedDocument.type === 'contrat' ? (
                      <FileCheck className="w-12 h-12 text-primary-700" />
                    ) : selectedDocument.type === 'facture' ? (
                      <Receipt className="w-12 h-12 text-blue-700" />
                    ) : (
                      <FileText className="w-12 h-12 text-green-700" />
                    )}
                  </div>
                  <p className="text-neutral-700 mb-2">Aperçu du document</p>
                  <p className="text-sm text-neutral-500">
                    Le document s'affichera ici en mode lecture
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-6 border-t border-neutral-200">
              <Button
                onClick={() => setShowDocumentViewer(false)}
                variant="outline"
              >
                Fermer
              </Button>
              <div className="flex items-center gap-3">
                {selectedDocument.type === 'contrat' && !signedDocuments.includes(selectedDocument.id) && (
                  <Button
                    onClick={() => {
                      setShowDocumentViewer(false);
                      setShowSignatureModal(true);
                    }}
                  >
                    <PenTool className="w-5 h-5" />
                    Signer ce document
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="w-5 h-5" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignatureModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <PenTool className="w-6 h-6 text-primary-700" />
                <h3 className="text-neutral-900">Signature électronique</h3>
              </div>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Document Info */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck className="w-5 h-5 text-primary-700" />
                  <p className="text-neutral-900 font-medium">{selectedDocument.name}</p>
                </div>
                <p className="text-sm text-neutral-600">
                  Vous êtes sur le point de signer ce document électroniquement. Cette signature a la même valeur juridique qu'une signature manuscrite.
                </p>
              </div>

              {/* Signature Area */}
              <div>
                <label className="block text-sm text-neutral-700 mb-2">Dessinez votre signature</label>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 bg-white hover:border-primary-300 transition-colors">
                  <div className="bg-neutral-50 rounded h-48 flex items-center justify-center cursor-crosshair">
                    <div className="text-center">
                      <PenTool className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <p className="text-neutral-600 text-sm">Cliquez et maintenez pour dessiner votre signature</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="accept-terms"
                    className="mt-1 w-4 h-4 text-primary-700 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="accept-terms" className="text-sm text-neutral-700 cursor-pointer">
                    Je certifie avoir lu et compris le contenu de ce document. J'accepte les termes et conditions énoncés et je confirme que cette signature électronique engage ma responsabilité.
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-6 border-t border-neutral-200">
              <Button
                onClick={() => setShowSignatureModal(false)}
                variant="outline"
              >
                Annuler
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  Effacer la signature
                </Button>
                <Button
                  onClick={() => {
                    if (selectedDocument) {
                      setSignedDocuments([...signedDocuments, selectedDocument.id]);
                      setShowSignatureModal(false);
                      setSelectedDocument(null);
                    }
                  }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Signer le document
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}