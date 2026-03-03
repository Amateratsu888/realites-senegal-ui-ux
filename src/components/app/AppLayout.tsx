import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Crown,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Bell,
  Phone,
  Star,
  Sparkles,
  Activity,
  Send,
  TrendingUp,
  Check,
  X,
  Zap,
  Users2,
  Calendar,
  User
} from 'lucide-react';
import { UserRole } from '../../types';
import logo from '@/assets/logo.png';

const logoSvg = '/wp-content/themes/senegal/dist/icons/sprite.svg#logo';
import { SupportButton } from './SupportButton';
import { Button } from '../Button';

interface AppLayoutProps {
  role: UserRole;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
  userName: string;
  userAvatar?: string;
}

export function AppLayout({ 
  role, 
  currentPage, 
  onNavigate, 
  onLogout, 
  children,
  userName,
  userAvatar,
}: AppLayoutProps) {
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'bank' | 'mobile'>('card');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getMenuItems = () => {
    let items = [];
    
    if (role === 'technicien') {
      items = [
        { id: 'leads', label: 'Leads', icon: ClipboardList },
        { id: 'portfolio', label: 'Portefeuille clients', icon: Building2 },
        { id: 'properties-list', label: 'Liste des Biens', icon: FileText },
        { id: 'technicien-clients', label: 'Mes Clients', icon: Users },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
      ];
    } else if (role === 'admin') {
      items = [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { id: 'leads', label: 'Demandes / Leads', icon: ClipboardList },
        { id: 'portfolio', label: 'Portefeuille clients', icon: Users },
        { id: 'properties-list', label: 'Catalogue biens', icon: Building2 },
        { id: 'vefa-management', label: 'Gestion VEFA', icon: ClipboardList },
        { id: 'appointments-admin', label: 'Rendez-vous', icon: Calendar },
        { id: 'vip-services-admin', label: 'Services VIP', icon: Crown },
        { id: 'users-management', label: 'Utilisateurs & rôles', icon: Users },
        { id: 'activity-log', label: 'Journal d\'activité', icon: Activity },
        { id: 'settings', label: 'Configuration', icon: Settings },
      ];
    }
    
    // Client or VIP
    if (role === 'client' || role === 'vip') {
      // Mes biens pour tous les clients
      items.push({ id: 'my-properties', label: 'Mes biens', icon: Building2, disabled: false });
      
      // Catalogue accessible pour tous les clients (avec filtrage VIP intégré)
      items.push({ 
        id: 'catalog', 
        label: 'Catalogue', 
        icon: Crown, 
        disabled: false,
        vipOnly: false
      });
      
      // Mes demandes - accessible à tous
      items.push({ 
        id: 'my-requests', 
        label: 'Mes demandes', 
        icon: Send, 
        disabled: false,
        vipOnly: false
      });
      
      // Suivi VEFA - Pour tous les clients
      items.push({ 
        id: 'vefa-tracking', 
        label: 'Suivi VEFA', 
        icon: TrendingUp, 
        disabled: false,
        vipOnly: false
      });
      
      // Espace VIP exclusif (ancienne page VIP avec biens exclusifs et avantages)
      if (role === 'vip') {
        items.push({ 
          id: 'vip-space', 
          label: 'Espace VIP', 
          icon: Sparkles, 
          disabled: false,
          vipOnly: true
        });
      }
      
      items.push({ 
        id: 'book-call', 
        label: 'Réserver un appel', 
        icon: Phone, 
        disabled: role !== 'vip',
        vipOnly: true
      });
    }
    
    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen w-64 bg-white border-r border-neutral-200 flex-col z-30">
        <div className="p-6 border-b border-neutral-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <svg alt="RÉALITÉS SÉNÉGAL" width="112" height="22" className="svg-icon h-10 w-auto" viewBox="0 0 112.036 22.095">
              <use xlinkHref="/wp-content/themes/senegal/dist/icons/sprite.svg#logo"></use>
            </svg>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            {role === 'admin' ? 'Administration' : role === 'technicien' ? 'Technicien' : 'Espace Client'}
          </p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  id={`nav-${item.id}`}
                  onClick={() => !item.disabled && onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors relative ${
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed text-neutral-400'
                      : currentPage === item.id
                      ? 'bg-primary-700 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                  disabled={item.disabled}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  {item.vipOnly && role !== 'vip' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs flex-shrink-0 ml-2">
                      <Crown className="w-3 h-3" />
                      VIP
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {/* Bouton Devenir VIP pour les clients normaux */}
          {role === 'client' && (
            <div className="mt-4">
              <Button 
                id="btn-become-vip"
                variant="outline"
                className="w-full border-amber-600 text-amber-700 hover:bg-amber-50"
                onClick={() => setShowVIPModal(true)}
              >
                <Crown className="w-4 h-4 mr-2" />
                Devenir VIP
              </Button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-neutral-200 flex-shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-16 md:pb-0 md:ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <svg alt="RÉALITÉS SÉNÉGAL" width="112" height="22" className="svg-icon h-8 w-auto md:hidden" viewBox="0 0 112.036 22.095">
              <use xlinkHref="/wp-content/themes/senegal/dist/icons/sprite.svg#logo"></use>
            </svg>
            <h2 className="text-neutral-800 hidden md:block">
              {menuItems.find(item => item.id === currentPage)?.label || 'Accueil'}
            </h2>
            <h2 className="text-neutral-800 md:hidden text-sm">
              {menuItems.find(item => item.id === currentPage)?.label || 'Accueil'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-sand-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 md:gap-3 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{userName.charAt(0)}</span>
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm text-neutral-900">
                    {userName} ({role === 'admin' ? 'Administrateur' : role === 'technicien' ? 'Technicien' : role === 'vip' ? 'Client VIP' : 'Client'})
                  </p>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 w-56">
                  <div className="p-4 border-b border-neutral-200">
                    <p className="font-semibold text-neutral-900">{userName}</p>
                    <p className="text-sm text-neutral-600">{role === 'admin' ? 'Administrateur' : role === 'technicien' ? 'Technicien' : role === 'vip' ? 'Client VIP' : 'Client'}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onNavigate('user-settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Paramètres du compte</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors border-t border-neutral-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => !item.disabled && onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
                item.disabled
                  ? 'opacity-50 cursor-not-allowed text-neutral-400'
                  : currentPage === item.id
                  ? 'bg-primary-700 text-white'
                  : 'text-neutral-600'
              }`}
              disabled={item.disabled}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.vipOnly && role !== 'vip' && (
                  <Crown className="w-3 h-3 absolute -top-1 -right-1 text-amber-600" />
                )}
              </div>
              <span className="text-xs truncate max-w-full">{item.label.split(' ')[0]}</span>
            </button>
          ))}
          {/* Menu/More button for additional items or logout on mobile */}
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-neutral-600 min-w-0 flex-1"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs">Quitter</span>
          </button>
        </div>
      </nav>

      {/* Support Button - Available for all users */}
      {/* {(role === 'client' || role === 'vip') && <SupportButton />} */}

      {/* VIP Modal */}
      {showVIPModal && role === 'client' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 flex items-start justify-between sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Devenir VIP</h2>
                  <p className="text-amber-100 text-sm">Débloquez l'accès premium</p>
                </div>
              </div>
              <button
                onClick={() => setShowVIPModal(false)}
                className="text-white hover:bg-amber-700 rounded-lg p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Benefits Section */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Les avantages VIP</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-green-700" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Accès aux nouveaux biens 24h avant les autres</p>
                      <p className="text-sm text-neutral-600">Soyez les premiers à découvrir nos exclusivités immobilières</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Accès aux services VIP</p>
                      <p className="text-sm text-neutral-600">Bénéficiez de services premium et d'accompagnement personnalisé</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-purple-700" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Entretiens avec M. Amadou dieng en physique et en présentiel</p>
                      <p className="text-sm text-neutral-600">Rencontrez directement notre directrice pour des conseils experts</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-neutral-900">100,000</span>
                  <span className="text-lg text-neutral-600">FCFA</span>
                </div>
                <p className="text-sm text-neutral-600">Frais d'accès unique pour accéder au statut VIP</p>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Moyens de paiement</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'card' 
                        ? 'border-amber-600 bg-amber-50 text-amber-700' 
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm text-center">Carte bancaire</span>
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('bank')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'bank' 
                        ? 'border-amber-600 bg-amber-50 text-amber-700' 
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <Building2 className="w-6 h-6" />
                    <span className="text-sm text-center">Virement</span>
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('mobile')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'mobile' 
                        ? 'border-amber-600 bg-amber-50 text-amber-700' 
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <Phone className="w-6 h-6" />
                    <span className="text-sm text-center">Mobile Money</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                <p className="text-sm text-neutral-700">
                  ✨ <strong>Bon à savoir :</strong> Une fois VIP, vous accédez immédiatement à tous les avantages premium et bénéficiez d'une assistance prioritaire.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-6 flex gap-3">
              <button
                onClick={() => setShowVIPModal(false)}
                className="flex-1 px-4 py-3 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <Button
                onClick={() => {
                  console.log('Upgrade VIP avec méthode:', selectedPaymentMethod);
                  alert('Paiement VIP initié avec ' + 
                    (selectedPaymentMethod === 'card' ? 'Carte bancaire' : 
                     selectedPaymentMethod === 'bank' ? 'Virement' : 'Mobile Money'));
                  setShowVIPModal(false);
                }}
                className="flex-1"
              >
                <Crown className="w-5 h-5 mr-2" />
                Devenir VIP maintenant
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}