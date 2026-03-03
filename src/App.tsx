import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { PropertiesPage } from './components/pages/PropertiesPage';
import { PropertyDetailPage } from './components/pages/PropertyDetailPage';
import { ContactPage } from './components/pages/ContactPage';
import { AboutPage } from './components/pages/AboutPage';
import { StyleGuidePage } from './components/pages/StyleGuidePage';
import { AppLayout } from './components/app/AppLayout';
import { ClientDashboard } from './components/app/ClientDashboard';
import { PaymentsPage } from './components/app/PaymentsPage';
import { DocumentsMessagesPage } from './components/app/DocumentsMessagesPage';
import { VIPSpace } from './components/app/VIPSpace';
import { MyPropertiesPage } from './components/app/MyPropertiesPage';
import { LeadsPage } from './components/app/LeadsPage';
import { PortfolioPage } from './components/app/PortfolioPage';
import { PropertiesListPage } from './components/app/PropertiesListPage';
import { AdminDashboard } from './components/app/AdminDashboard';
import { PropertiesAdmin } from './components/app/PropertiesAdmin';
import { BookCallPage } from './components/app/BookCallPage';
import { PropertyFolderPage } from './components/app/PropertyFolderPage';
import { OnboardingTour } from './components/app/OnboardingTour';
import { UsersManagement } from './components/app/UsersManagement';
import { ActivityLogPage } from './components/app/ActivityLogPage';
import { ClientCatalogPage } from './components/app/ClientCatalogPage';
import { MyRequestsPage } from './components/app/MyRequestsPage';
import { TechnicianClientsPage } from './components/app/TechnicianClientsPage';
import { PropertyDetailClient } from './components/app/PropertyDetailClient';
import { VEFATrackingPage } from './components/app/VEFATrackingPage';
import { VIPServicesAdmin } from './components/app/VIPServicesAdmin';
import { BankAccountsAdmin } from './components/app/BankAccountsAdmin';
import { UserSettingsPage } from './components/app/UserSettingsPage';
import { VEFAManagementAdmin } from './components/app/VEFAManagementAdmin';
import { AppointmentsAdmin } from './components/app/AppointmentsAdmin';
import { AdminSettingsPage } from './components/app/AdminSettingsPage';
import { Button } from './components/Button';
import { UserRole } from './types';
import { currentUser } from './data/mockData';
import { PropertyType } from './types/index';
type PageType = 
  | 'home' 
  | 'properties' 
  | 'property-detail' 
  | 'how-it-works' 
  | 'contact'
  | 'login'
  | 'about'
  | 'style-guide'
  // Client pages
  | 'client-dashboard'
  | 'my-properties'
  | 'catalog'
  | 'property-detail-client'
  | 'my-requests'
  | 'vefa-tracking'
  | 'property-folder'
  | 'payments'
  | 'documents'
  | 'vip-space'
  | 'book-call'
  | 'user-settings'
  // Technicien pages
  | 'leads'
  | 'portfolio'
  | 'properties-list'
  | 'technicien-clients'
  // Admin pages
  | 'dashboard'
  | 'properties-admin'
  | 'vefa-management'
  | 'appointments-admin'
  | 'vip-services-admin'
  | 'users-management'
  | 'activity-log'
  | 'notifications-config'
  | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('vip');
  const [propertyFilter, setPropertyFilter] = useState<PropertyType | undefined>();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<Record<string, boolean>>({});
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isOnboardingMode, setIsOnboardingMode] = useState(false);

  // Get user name based on role
  const getUserName = (role: UserRole) => {
    switch (role) {
      case 'vip':
        return 'Fatou Cissé';
      case 'client':
        return 'Amadou Diallo';
      case 'technicien':
        return 'Bienta Fall';
      case 'admin':
        return 'M. Amadou dieng';
      default:
        return 'Utilisateur';
    }
  };

  // Get user info based on role
  const getUserInfo = (role: UserRole) => {
    switch (role) {
      case 'vip':
        return {
          name: 'Fatou Cissé',
          email: 'fatou.cisse@example.com',
          phone: '+221 77 123 45 67',
        };
      case 'client':
        return {
          name: 'Amadou Diallo',
          email: 'amadou.diallo@example.com',
          phone: '+221 78 234 56 78',
        };
      case 'technicien':
        return {
          name: 'Bienta Fall',
          email: 'commercial.fall@realites-senegal.sn',
          phone: '+221 76 345 67 89',
        };
      case 'admin':
        return {
          name: 'M. Amadou dieng',
          email: 'admin@realites-senegal.sn',
          phone: '+221 77 999 00 00',
        };
      default:
        return {
          name: 'Utilisateur',
          email: '',
          phone: '',
        };
    }
  };

  const handleNavigate = (page: string, propertyId?: string, filter?: PropertyType) => {
    setCurrentPage(page as PageType);
    if (propertyId) {
      setSelectedPropertyId(propertyId);
    }
    if (filter) {
      setPropertyFilter(filter);
    } else if (page !== 'properties') {
      setPropertyFilter(undefined);
    }
    window.scrollTo(0, 0);
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    
    // Vérifier si c'est la première connexion pour ce client
    const userName = getUserName(role);
    if ((role === 'client' || role === 'vip') && !hasSeenOnboarding[userName]) {
      setShowOnboarding(false);
      setIsOnboardingMode(false);
    }
    
    if (role === 'admin') {
      setCurrentPage('dashboard');
    } else if (role === 'technicien') {
      setCurrentPage('leads');
    } else {
      // Tous les clients (VIP et normal) vont directement sur "Mes biens"
      setCurrentPage('my-properties');
    }
  };

  const handleOnboardingComplete = () => {
    const userName = getUserName(userRole);
    setHasSeenOnboarding(prev => ({ ...prev, [userName]: true }));
    setShowOnboarding(false);
    setIsOnboardingMode(false);
  };

  const handleOnboardingStepChange = (step: number) => {
    setOnboardingStep(step);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // Login Page
  if (currentPage === 'login' && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <img 
              src="/src/assets/logo.png" 
              alt="RÉALITÉS SÉNÉGAL" 
              className="h-12 w-auto"
            />
          </div>
          <h2 className="mb-6 text-center">Connexion</h2>
          <p className="text-center text-neutral-600 mb-8">
            Choisissez votre rôle pour accéder à l'espace correspondant
          </p>
          
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => handleLogin('vip')}
            >
              Fatou Cissé (Client VIP)
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleLogin('client')}
            >
              Amadou Diallo (Client)
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleLogin('technicien')}
            >
              Bienta Fall (Technicien)
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleLogin('admin')}
            >
              M. Amadou dieng (Administrateur)
            </Button>
          </div>

          <button
            onClick={() => setCurrentPage('home')}
            className="w-full mt-6 text-center text-sm text-neutral-600 hover:text-primary-700 transition-colors"
          >
            Retour au site
          </button>
        </div>
      </div>
    );
  }

  // App Interface (logged in)
  if (isLoggedIn) {
    let content;

    // Client Pages
    if (currentPage === 'client-dashboard') {
      content = <ClientDashboard onNavigate={handleNavigate} userName={getUserName(userRole)} />;
    } else if (currentPage === 'my-properties') {
      content = <MyPropertiesPage onNavigate={handleNavigate} isOnboardingMode={isOnboardingMode} />;
    } else if (currentPage === 'catalog') {
      const userInfo = getUserInfo(userRole);
      content = <ClientCatalogPage 
        onNavigate={handleNavigate} 
        isVIP={userRole === 'vip'} 
        userEmail={userInfo.email}
        userPhone={userInfo.phone}
        userName={userInfo.name}
      />;
    } else if (currentPage === 'property-detail-client') {
      const userInfo = getUserInfo(userRole);
      content = <PropertyDetailClient 
        propertyId={selectedPropertyId} 
        onNavigate={handleNavigate}
        isVIP={userRole === 'vip'}
        userEmail={userInfo.email}
        userPhone={userInfo.phone}
        userName={userInfo.name}
      />;
    } else if (currentPage === 'my-requests') {
      content = <MyRequestsPage onNavigate={handleNavigate} userRole={userRole} />;
    } else if (currentPage === 'vefa-tracking') {
      content = <VEFATrackingPage onNavigate={handleNavigate} />;
    } else if (currentPage === 'property-folder') {
      content = <PropertyFolderPage propertyId={selectedPropertyId} onNavigate={handleNavigate} isOnboardingMode={isOnboardingMode} />;
    } else if (currentPage === 'payments') {
      content = <PaymentsPage onNavigate={handleNavigate} />;
    } else if (currentPage === 'documents') {
      content = <DocumentsMessagesPage />;
    } else if (currentPage === 'vip-space' && userRole === 'vip') {
      content = <VIPSpace onNavigate={handleNavigate} userRole={userRole} userId="client-vip-1" />;
    } else if (currentPage === 'book-call') {
      content = <BookCallPage />;
    } else if (currentPage === 'user-settings') {
      const userInfo = getUserInfo(userRole);
      content = <UserSettingsPage 
        user={{
          id: 'current-user',
          ...userInfo,
          role: userRole,
          isVip: userRole === 'vip',
        }}
        onNavigate={handleNavigate}
      />;
    }
    // Technicien Pages
    else if (currentPage === 'leads') {
      content = <LeadsPage />;
    } else if (currentPage === 'portfolio') {
      content = <PortfolioPage />;
    } else if (currentPage === 'properties-list') {
      content = <PropertiesListPage />;
    } else if (currentPage === 'technicien-clients') {
      content = <TechnicianClientsPage />;
    }
    // Admin Pages
    else if (currentPage === 'dashboard') {
      content = <AdminDashboard />;
    } else if (currentPage === 'properties-admin') {
      content = <PropertiesAdmin />;
    } else if (currentPage === 'vefa-management') {
      content = <VEFAManagementAdmin onNavigate={handleNavigate} />;
    } else if (currentPage === 'appointments-admin') {
      content = <AppointmentsAdmin onNavigate={handleNavigate} />;
    } else if (currentPage === 'vip-services-admin') {
      content = <VIPServicesAdmin onNavigate={handleNavigate} />;
    } else if (currentPage === 'users-management') {
      content = <UsersManagement />;
    } else if (currentPage === 'activity-log') {
      content = <ActivityLogPage />;
    } else if (currentPage === 'notifications-config') {
      content = (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h3 className="mb-2">Configuration des notifications</h3>
          <p className="text-neutral-600">Page de configuration des notifications à implémenter</p>
        </div>
      );
    } else if (currentPage === 'settings') {
      content = <AdminSettingsPage onNavigate={handleNavigate} />;
    } else {
      content = <ClientDashboard onNavigate={handleNavigate} userName={getUserName(userRole)} />;
    }

    return (
      <AppLayout
        role={userRole}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={getUserName(userRole)}
        userAvatar={currentUser.avatar}
      >
        {content}
        {showOnboarding && (
          <OnboardingTour 
            role={userRole} 
            onComplete={handleOnboardingComplete} 
            onStepChange={handleOnboardingStepChange}
            currentStep={onboardingStep}
            isOnboardingMode={isOnboardingMode}
          />
        )}
      </AppLayout>
    );
  }

  // Public Website
  let content;
  if (currentPage === 'home') {
    content = <HomePage onNavigate={handleNavigate} />;
  } else if (currentPage === 'properties') {
    content = <PropertiesPage onNavigate={handleNavigate} initialFilter={propertyFilter} />;
  } else if (currentPage === 'property-detail') {
    content = <PropertyDetailPage propertyId={selectedPropertyId} onNavigate={handleNavigate} />;
  } else if (currentPage === 'how-it-works') {
    content = <HomePage onNavigate={handleNavigate} />;
  } else if (currentPage === 'contact') {
    content = <ContactPage onNavigate={handleNavigate} />;
  } else if (currentPage === 'about') {
    content = <AboutPage onNavigate={handleNavigate} />;
  } else if (currentPage === 'style-guide') {
    content = <StyleGuidePage onNavigate={handleNavigate} />;
  } else {
    content = <HomePage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} transparentOnTop={currentPage === 'home'} />
      <main className="flex-1">
        {content}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}