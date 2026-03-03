import React, { useState } from 'react';
import { BankAccount, PaymentMethodType, AvailabilityConfig, DayOfWeek } from '../../types';
import { bankAccounts as initialBankAccounts, availabilityConfig as initialAvailabilityConfig } from '../../data/mockData';
import { Button } from '../Button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, Clock } from 'lucide-react';

const PAYMENT_METHODS: { value: PaymentMethodType; label: string }[] = [
  { value: 'virement-bancaire', label: 'Virement Bancaire' },
  { value: 'carte-bancaire', label: 'Carte Bancaire' },
  { value: 'cheque', label: 'Chèque' },
  { value: 'especes', label: 'Espèces' },
  { value: 'mobile-money', label: 'Mobile Money' },
];

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'lundi', label: 'Lundi' },
  { value: 'mardi', label: 'Mardi' },
  { value: 'mercredi', label: 'Mercredi' },
  { value: 'jeudi', label: 'Jeudi' },
  { value: 'vendredi', label: 'Vendredi' },
  { value: 'samedi', label: 'Samedi' },
  { value: 'dimanche', label: 'Dimanche' },
];

export const BankAccountsAdmin: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [availabilityConfig, setAvailabilityConfig] = useState<AvailabilityConfig>(initialAvailabilityConfig);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  
  const [formData, setFormData] = useState({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    iban: '',
    swift: '',
    currency: 'XOF',
    paymentMethods: [] as PaymentMethodType[],
  });

  const [availabilityData, setAvailabilityData] = useState({
    availableDays: availabilityConfig.availableDays,
    startTime: availabilityConfig.startTime,
    endTime: availabilityConfig.endTime,
    lunchStartTime: availabilityConfig.lunchStartTime || '12:00',
    lunchEndTime: availabilityConfig.lunchEndTime || '13:00',
    maxAppointmentsPerDay: availabilityConfig.maxAppointmentsPerDay || 8,
    appointmentDuration: availabilityConfig.appointmentDuration || 30,
  });

  const toggleAvailableDay = (day: DayOfWeek) => {
    setAvailabilityData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSaveAvailability = () => {
    if (availabilityData.availableDays.length === 0) {
      alert('Veuillez sélectionner au moins un jour de disponibilité');
      return;
    }

    const updatedConfig: AvailabilityConfig = {
      ...availabilityConfig,
      ...availabilityData,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setAvailabilityConfig(updatedConfig);
    setShowAvailabilityModal(false);
    alert('Configuration de disponibilité mise à jour avec succès');
  };

  const handleCloseAvailabilityModal = () => {
    setShowAvailabilityModal(false);
    setAvailabilityData({
      availableDays: availabilityConfig.availableDays,
      startTime: availabilityConfig.startTime,
      endTime: availabilityConfig.endTime,
      lunchStartTime: availabilityConfig.lunchStartTime || '12:00',
      lunchEndTime: availabilityConfig.lunchEndTime || '13:00',
      maxAppointmentsPerDay: availabilityConfig.maxAppointmentsPerDay || 8,
      appointmentDuration: availabilityConfig.appointmentDuration || 30,
    });
  };

  const resetForm = () => {
    setFormData({
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      iban: '',
      swift: '',
      currency: 'XOF',
      paymentMethods: [],
    });
    setEditingAccount(null);
  };

  const handleOpenForm = (account?: BankAccount) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        bankName: account.bankName,
        accountHolderName: account.accountHolderName,
        accountNumber: account.accountNumber,
        iban: account.iban || '',
        swift: account.swift || '',
        currency: account.currency || 'XOF',
        paymentMethods: account.paymentMethods,
      });
    } else {
      resetForm();
    }
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    resetForm();
  };

  const handleSave = () => {
    if (!formData.bankName || !formData.accountHolderName || !formData.accountNumber) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    if (formData.paymentMethods.length === 0) {
      alert('Veuillez sélectionner au moins un mode de paiement');
      return;
    }

    if (editingAccount) {
      setBankAccounts(
        bankAccounts.map((acc) =>
          acc.id === editingAccount.id
            ? {
                ...acc,
                ...formData,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : acc
        )
      );
    } else {
      const newAccount: BankAccount = {
        id: `ba-${Date.now()}`,
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setBankAccounts([...bankAccounts, newAccount]);
    }

    handleCloseForm();
  };

  const handleToggleActive = (accountId: string) => {
    setBankAccounts(
      bankAccounts.map((acc) =>
        acc.id === accountId ? { ...acc, isActive: !acc.isActive } : acc
      )
    );
  };

  const handleDelete = (account: BankAccount) => {
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le compte "${account.bankName}" ?\n\nCette action ne peut pas être annulée.`
    );
    
    if (confirmDelete) {
      setBankAccounts(bankAccounts.filter((acc) => acc.id !== account.id));
      alert('Compte bancaire supprimé avec succès');
    }
  };

  const togglePaymentMethod = (method: PaymentMethodType) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }));
  };

  const activeAccounts = bankAccounts.filter((acc) => acc.isActive);
  const inactiveAccounts = bankAccounts.filter((acc) => !acc.isActive);

  return (
    <div className="space-y-6">
      {/* Section Gestion des Comptes Bancaires */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Gestion des Comptes Bancaires</h2>
            <p className="text-neutral-600">
              Gérez les identifiants bancaires et liez-les aux modes de paiement
            </p>
          </div>
          <Button onClick={() => handleOpenForm()}>+ Ajouter un compte</Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Comptes Actifs ({activeAccounts.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Comptes Inactifs ({inactiveAccounts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeAccounts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500">Aucun compte bancaire actif</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAccounts.map((account) => (
                  <BankAccountCard
                    key={account.id}
                    account={account}
                    onEdit={() => handleOpenForm(account)}
                    onToggleActive={() => handleToggleActive(account.id)}
                    onDelete={() => handleDelete(account)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            {inactiveAccounts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500">Aucun compte bancaire inactif</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inactiveAccounts.map((account) => (
                  <BankAccountCard
                    key={account.id}
                    account={account}
                    onEdit={() => handleOpenForm(account)}
                    onToggleActive={() => handleToggleActive(account.id)}
                    onDelete={() => handleDelete(account)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Section Configuration des Jours de Disponibilité */}
      {/* <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-600" />
              Disponibilité pour Rendez-vous
            </h2>
            <p className="text-neutral-600">
              Définissez les jours et horaires disponibles pour les rendez-vous clients
            </p>
          </div>
          <Button onClick={() => setShowAvailabilityModal(true)}>Configurer</Button>
        </div>

        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Jours disponibles</p>
              <div className="flex flex-wrap gap-1">
                {availabilityConfig.availableDays.map((day) => (
                  <span
                    key={day}
                    className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full capitalize"
                  >
                    {DAYS_OF_WEEK.find((d) => d.value === day)?.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-neutral-500 mb-1">Horaires</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-500" />
                <p className="text-sm font-medium">
                  {availabilityConfig.startTime} - {availabilityConfig.endTime}
                  {availabilityConfig.lunchStartTime && (
                    <span className="text-neutral-500">
                      {' '}(Pause: {availabilityConfig.lunchStartTime} - {availabilityConfig.lunchEndTime})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-neutral-500 mb-1">Durée rendez-vous</p>
              <p className="text-sm font-medium">{availabilityConfig.appointmentDuration} minutes</p>
            </div>

            <div>
              <p className="text-sm text-neutral-500 mb-1">Max rendez-vous par jour</p>
              <p className="text-sm font-medium">{availabilityConfig.maxAppointmentsPerDay} rendez-vous</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Modal natif HTML - Configuration Disponibilité */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                Configuration des Jours de Disponibilité
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Définissez les jours et horaires disponibles pour les rendez-vous clients
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Sélection des jours */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Jours de la semaine disponibles</h3>
                <div className="grid grid-cols-2 gap-3">
                  {DAYS_OF_WEEK.map((day) => (
                    <label key={day.value} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-neutral-50">
                      <Checkbox
                        checked={availabilityData.availableDays.includes(day.value)}
                        onCheckedChange={() => toggleAvailableDay(day.value)}
                      />
                      <span className="text-sm font-medium">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Horaires */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-sm">Horaires</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Heure d'ouverture *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={availabilityData.startTime}
                      onChange={(e) => setAvailabilityData({ ...availabilityData, startTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime">Heure de fermeture *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={availabilityData.endTime}
                      onChange={(e) => setAvailabilityData({ ...availabilityData, endTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Pause déjeuner */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-sm">Pause déjeuner (optionnel)</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lunchStartTime">Début</Label>
                    <Input
                      id="lunchStartTime"
                      type="time"
                      value={availabilityData.lunchStartTime}
                      onChange={(e) => setAvailabilityData({ ...availabilityData, lunchStartTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lunchEndTime">Fin</Label>
                    <Input
                      id="lunchEndTime"
                      type="time"
                      value={availabilityData.lunchEndTime}
                      onChange={(e) => setAvailabilityData({ ...availabilityData, lunchEndTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Paramètres de rendez-vous */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-sm">Paramètres des Rendez-vous</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appointmentDuration">Durée d'un RDV (minutes)</Label>
                    <Input
                      id="appointmentDuration"
                      type="number"
                      min="15"
                      max="120"
                      step="5"
                      value={availabilityData.appointmentDuration}
                      onChange={(e) => setAvailabilityData({ ...availabilityData, appointmentDuration: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxAppointments">Max RDV par jour</Label>
                    <Input
                      id="maxAppointments"
                      type="number"
                      min="1"
                      max="20"
                      value={availabilityData.maxAppointmentsPerDay}
                      onChange={(e) => setAvailabilityData({ ...availabilityData, maxAppointmentsPerDay: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseAvailabilityModal}>
                  Annuler
                </Button>
                <Button onClick={handleSaveAvailability}>
                  Enregistrer la configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal natif HTML */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <h2 className="text-xl font-bold">
                {editingAccount ? 'Modifier le compte bancaire' : 'Ajouter un nouveau compte'}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Remplissez les informations du compte bancaire et sélectionnez les modes de paiement
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Informations de base</h3>

                <div>
                  <Label htmlFor="bankName">Nom de la banque *</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Ex: Banque Africaine de Développement"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="accountHolderName">Titulaire du compte *</Label>
                  <Input
                    id="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    placeholder="Ex: RÉALITÉS SÉNÉGAL"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountNumber">Numéro de compte *</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="Ex: 0123456789"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Devise</Label>
                    <Input
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      placeholder="Ex: XOF"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Coordonnées bancaires internationales */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Coordonnées internationales</h3>

                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={formData.iban}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                    placeholder="Ex: SN06SN2100010000123456789AB"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="swift">Code SWIFT</Label>
                  <Input
                    id="swift"
                    value={formData.swift}
                    onChange={(e) => setFormData({ ...formData, swift: e.target.value })}
                    placeholder="Ex: BAADSNDS"
                    className="mt-1"
                  />
                </div>
              </div>

            
              

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseForm}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  {editingAccount ? 'Enregistrer les modifications' : 'Ajouter le compte'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour afficher une carte de compte bancaire
interface BankAccountCardProps {
  account: BankAccount;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({
  account,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-neutral-50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-lg">{account.bankName}</h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                account.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {account.isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <p className="text-sm text-neutral-600">{account.accountHolderName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <p className="text-neutral-500 text-xs">Numéro de compte</p>
          <p className="font-mono">{account.accountNumber}</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs">Devise</p>
          <p>{account.currency}</p>
        </div>
      </div>

      {account.iban && (
        <div className="mb-3 text-sm">
          <p className="text-neutral-500 text-xs">IBAN</p>
          <p className="font-mono text-xs">{account.iban}</p>
        </div>
      )}

      <div className="mb-3">
        <p className="text-neutral-500 text-xs mb-2">Modes de paiement</p>
        <div className="flex flex-wrap gap-1">
          {account.paymentMethods.map((method) => {
            const methodLabel = PAYMENT_METHODS.find((m) => m.value === method)?.label;
            return (
              <span key={method} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                {methodLabel}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t">
        <Button size="sm" variant="outline" onClick={onEdit}>
          Modifier
        </Button>
        <Button
          size="sm"
          variant={account.isActive ? 'outline' : 'default'}
          onClick={onToggleActive}
        >
          {account.isActive ? 'Désactiver' : 'Activer'}
        </Button>
        <Button size="sm" variant="outline" onClick={onDelete} className="text-red-600">
          Supprimer
        </Button>
      </div>
    </div>
  );
};
