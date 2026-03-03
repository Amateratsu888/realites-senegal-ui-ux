import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '../Button';
import { UserRole } from '../../types';

interface OnboardingTourProps {
  onComplete: () => void;
  role: UserRole;
  onStepChange?: (step: number) => void;
  currentPage?: string;
  currentStep?: number;
  isOnboardingMode?: boolean;
}

interface TourStep {
  target: string; // ID de l'élément à cibler
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  highlightPulse?: boolean;
  requireClick?: boolean; // Si true, l'utilisateur doit cliquer sur l'élément pour avancer
  waitForPage?: string; // Page attendue avant de continuer
}

export function OnboardingTour({ onComplete, role, onStepChange, currentPage, currentStep, isOnboardingMode }: OnboardingTourProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStepState, setCurrentStepState] = useState(0);
  const [tourStarted, setTourStarted] = useState(false);

  const steps: TourStep[] = [
    {
      target: 'nav-my-properties',
      title: 'Vos biens immobiliers',
      description: 'Retrouvez ici tous vos biens. Cliquez pour voir les détails, documents et échéanciers.',
      position: 'right',
      highlightPulse: true,
    },
    ...(role === 'vip' ? [{
      target: 'nav-vip-space',
      title: 'Catalogue exclusif VIP',
      description: 'Accédez à des biens exclusifs réservés aux clients VIP.',
      position: 'right' as const,
      highlightPulse: true,
    }] : [{
      target: 'nav-vip-space',
      title: 'Catalogue VIP',
      description: 'Cette section est réservée aux clients VIP. Passez VIP pour y accéder !',
      position: 'right' as const,
    }]),
    ...(role === 'vip' ? [{
      target: 'nav-book-call',
      title: 'Réservez un appel',
      description: 'Prenez rendez-vous avec nos conseillers pour un accompagnement personnalisé.',
      position: 'right' as const,
      highlightPulse: true,
    }] : [{
      target: 'nav-book-call',
      title: 'Réserver un appel',
      description: 'Cette fonctionnalité est réservée aux clients VIP.',
      position: 'right' as const,
    }]),
    ...(role === 'client' ? [{
      target: 'btn-become-vip',
      title: 'Devenir VIP',
      description: 'Cliquez ici pour passer VIP et débloquer toutes les fonctionnalités exclusives !',
      position: 'right' as const,
      highlightPulse: true,
    }] : []),
    // Étapes interactives
    {
      target: 'property-card-0',
      title: 'Cliquez sur votre bien',
      description: 'Maintenant, cliquez sur ce bien pour voir tous ses détails et gérer vos paiements.',
      position: 'bottom',
      highlightPulse: true,
      requireClick: true,
      waitForPage: 'my-properties',
    },
    {
      target: 'tab-payments',
      title: 'Accédez aux paiements',
      description: 'Cliquez sur l\'onglet "Paiements" pour voir votre échéancier et effectuer un paiement.',
      position: 'bottom',
      highlightPulse: true,
      requireClick: true,
      waitForPage: 'property-folder',
    },
    {
      target: 'pay-installment-0',
      title: 'Payez votre première échéance',
      description: 'Cliquez sur "Payer l\'échéance" pour effectuer votre premier paiement. Vous verrez ensuite l\'état du paiement se mettre à jour.',
      position: 'left',
      highlightPulse: true,
      requireClick: true,
      waitForPage: 'property-folder',
    },
  ];

  const handleStartTour = () => {
    setShowWelcome(false);
    setTourStarted(true);
  };

  const handleSkip = () => {
    setShowWelcome(false);
    setTourStarted(false);
    onComplete();
  };

  const handleNext = () => {
    if (currentStepState < steps.length - 1) {
      setCurrentStepState(currentStepState + 1);
    } else {
      setTourStarted(false);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepState > 0) {
      setCurrentStepState(currentStepState - 1);
    }
  };

  // Calculer la position du tooltip
  const getTooltipPosition = () => {
    const step = steps[currentStepState];
    const target = document.getElementById(step.target);
    
    if (!target) return null;

    const rect = target.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 180;
    const offset = 20;

    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + offset;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - offset;
        break;
      case 'top':
        top = rect.top - tooltipHeight - offset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
    };
  };

  const getHighlightPosition = () => {
    const step = steps[currentStepState];
    const target = document.getElementById(step.target);
    
    if (!target) return null;

    const rect = target.getBoundingClientRect();
    
    return {
      top: `${rect.top - 4}px`,
      left: `${rect.left - 4}px`,
      width: `${rect.width + 8}px`,
      height: `${rect.height + 8}px`,
    };
  };

  useEffect(() => {
    if (tourStarted) {
      // Scroll vers l'élément ciblé
      const target = document.getElementById(steps[currentStepState].target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStepState, tourStarted, steps]);

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-gradient-to-br from-primary-700 to-primary-900 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="mb-2" style={{ color: 'white' }}>
              Bienvenue {role === 'vip' ? 'dans votre espace VIP' : 'sur RÉALITÉS SÉNÉGAL'} !
            </h2>
            <p style={{ color: 'white' }}>
              {role === 'vip' 
                ? 'Découvrez toutes les fonctionnalités exclusives de votre espace client VIP'
                : 'Découvrez comment gérer vos biens et paiements facilement'
              }
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-700 text-sm">1</span>
                </div>
                <div>
                  <p className="text-neutral-900">Accédez à vos biens</p>
                  <p className="text-sm text-neutral-600">Consultez tous vos projets immobiliers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-700 text-sm">2</span>
                </div>
                <div>
                  <p className="text-neutral-900">Payez vos échéances</p>
                  <p className="text-sm text-neutral-600">Gérez vos paiements en toute sécurité</p>
                </div>
              </div>
              {role === 'vip' && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-700 text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-neutral-900">Profitez des avantages VIP</p>
                    <p className="text-sm text-neutral-600">Catalogue exclusif et accompagnement personnalisé</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSkip}
              >
                Passer
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleStartTour}
              >
                Commencer le tour
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tourStarted) return null;

  const tooltipPosition = getTooltipPosition();
  const highlightPosition = getHighlightPosition();
  const step = steps[currentStepState];

  if (!tooltipPosition || !highlightPosition) return null;

  return (
    <>
      {/* Overlay sombre */}
      <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" />

      {/* Highlight sur l'élément */}
      <div
        className="fixed z-50 rounded-lg transition-all duration-300"
        style={highlightPosition}
      >
        <div className={`absolute inset-0 bg-white rounded-lg shadow-2xl ${step.highlightPulse ? 'animate-pulse' : ''}`} />
        <div className="absolute inset-0 border-4 border-primary-500 rounded-lg shadow-lg" 
             style={{ 
               boxShadow: '0 0 0 4px rgba(220, 38, 38, 0.2), 0 0 20px rgba(220, 38, 38, 0.4)',
               animation: step.highlightPulse ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
             }} 
        />
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-neutral-200 animate-in fade-in slide-in-from-left-5 duration-300"
        style={tooltipPosition}
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-primary-700 bg-primary-100 px-2 py-1 rounded-full">
                  Étape {currentStepState + 1}/{steps.length}
                </span>
              </div>
              <h3 className="text-neutral-900 text-lg">{step.title}</h3>
            </div>
            <button
              onClick={handleSkip}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-neutral-600 text-sm mb-5 leading-relaxed">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStepState
                      ? 'w-6 bg-primary-700'
                      : index < currentStepState
                      ? 'w-1.5 bg-primary-700'
                      : 'w-1.5 bg-neutral-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStepState > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                >
                  Précédent
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
              >
                {currentStepState === steps.length - 1 ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Terminer
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}