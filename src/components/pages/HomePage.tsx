import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, HandshakeIcon, ShieldCheck, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Crown, Calendar, Sparkles, Building2, Home as HomeIcon, MapPin as LandIcon, Store, X } from 'lucide-react';
import { Button } from '../Button';
import { PropertyCard } from '../PropertyCard';
import { properties } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PropertyType } from '../../types/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import heroImage1 from '@/assets/hero 2.png';
import heroImage2 from '@/assets/hero 2.png';

interface HomePageProps {
  onNavigate: (page: string, propertyId?: string, filter?: PropertyType) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  // Exclure les biens VIP exclusifs sur le site web public
  const featuredProperties = properties.filter(p => p.featured && !p.vipOnly);
  const vipProperties = properties.filter(p => p.vipOnly);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAllVIP, setShowAllVIP] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [showVIPForm, setShowVIPForm] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [vipFormData, setVipFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Detect screen size for responsive carousel
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3); // lg breakpoint
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2); // md breakpoint
      } else {
        setSlidesPerView(1); // mobile
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  // Hero slides data
  const heroSlides = [
    {
      title: "Acheter ou investir dans un programme immobilier avec RÉALITÉS SÉNÉGAL",
      description: "L'immobilier de qualité pour un investissement rentable",
      image: heroImage1,
      primaryButton: { text: "Découvrir nos programmes", action: () => onNavigate('properties') },
      secondaryButton: { text: "Nous contacter", action: () => onNavigate('contact') }
    },
    {
      title: "Des programmes immobiliers d'exception à Dakar",
      description: "Découvrez nos résidences de standing: Karibu, Siki, Ali, Maasina et bien d'autres projets haut de gamme.",
      image: heroImage2,
      primaryButton: { text: "Voir nos résidences", action: () => onNavigate('properties') },
      secondaryButton: { text: "Contacter un conseiller", action: () => onNavigate('contact') }
    }
  ];

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Create infinite loop by tripling the array
  const infiniteProperties = [...featuredProperties, ...featuredProperties, ...featuredProperties];
  const startIndex = featuredProperties.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  // Handle infinite loop reset
  React.useEffect(() => {
    if (!isTransitioning) return;

    if (currentSlide >= startIndex + featuredProperties.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(startIndex);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    } else if (currentSlide < startIndex) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(startIndex + featuredProperties.length - 1);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
  }, [currentSlide, startIndex, featuredProperties.length, isTransitioning]);

  // Initialize at middle section
  React.useEffect(() => {
    setCurrentSlide(startIndex);
  }, [startIndex]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  const testimonials = [
    {
      name: 'Aminata Sow',
      role: 'Cliente VIP',
      text: 'Service exceptionnel et accompagnement personnalisé. J\'ai trouvé la villa de mes rêves !',
    },
    {
      name: 'Cheikh Diop',
      role: 'Propriétaire',
      text: 'Le plan d\'échelonnement m\'a permis d\'acquérir mon appartement sans difficulté. Je recommande !',
    },
    {
      name: 'Mariama Fall',
      role: 'Investisseuse',
      text: 'Équipe professionnelle et transparente. Excellent suivi tout au long du projet VEFA.',
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleVIPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Votre demande VIP a été envoyée ! Notre équipe vous contactera dans les plus brefs délais.');
    setShowVIPForm(false);
    setVipFormData({ name: '', email: '', phone: '', message: '' });
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[750px] flex items-center -mt-16 pt-16">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroSlides[currentHeroSlide].image}
            alt="Villa moderne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="!text-white mb-6">{heroSlides[currentHeroSlide].title}</h1>
            <p className="text-xl mb-8 !text-white">
              {heroSlides[currentHeroSlide].description}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={heroSlides[currentHeroSlide].primaryButton.action}>
                <Search className="w-5 h-5" />
                {heroSlides[currentHeroSlide].primaryButton.text}
              </Button>
              <Button variant="outline" size="lg" className="!bg-white/90 !border-white !text-slate-900 hover:!bg-white" onClick={heroSlides[currentHeroSlide].secondaryButton.action}>
                {heroSlides[currentHeroSlide].secondaryButton.text}
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          onClick={prevHeroSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 shadow-lg !bg-white/10 !border-white/30 backdrop-blur-sm hover:!bg-white/20 !text-white z-10"
          style={{ borderRadius: '50vw' }}
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextHeroSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 shadow-lg !bg-white/10 !border-white/30 backdrop-blur-sm hover:!bg-white/20 !text-white z-10"
          style={{ borderRadius: '50vw' }}
          aria-label="Slide suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Hero Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentHeroSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70 w-2'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Property Categories Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Parcourir par catégorie</h2>
            <p className="text-slate-600">
              Trouvez rapidement le type de bien qui vous correspond
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Villa Card */}
            <button
              onClick={() => onNavigate('properties', undefined, 'villa')}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-80"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NDgwMzk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Villa"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HomeIcon className="w-8 h-8" />
                </div>
                <h3 className="!text-white mb-2">Villas</h3>
                <p className="!text-white text-center text-sm opacity-90">
                  Propriétés de standing avec jardin et piscine
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span>Explorer</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Appartement Card */}
            <button
              onClick={() => onNavigate('properties', undefined, 'appartement')}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-80"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjQ3OTE0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Appartement"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="!text-white mb-2">Appartements</h3>
                <p className="!text-white text-center text-sm opacity-90">
                  Logements modernes en résidence sécurisée
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span>Explorer</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Terrain Card */}
            <button
              onClick={() => onNavigate('properties', undefined, 'terrain')}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-80"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764223531702-1614efb82e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kJTIwcHJvcGVydHklMjBhZXJpYWx8ZW58MXx8fHwxNzY0ODAzOTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Terrain"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LandIcon className="w-8 h-8" />
                </div>
                <h3 className="!text-white mb-2">Terrains</h3>
                <p className="!text-white text-center text-sm opacity-90">
                  Parcelles viabilisées pour vos projets
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span>Explorer</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Espace Commercial Card */}
            <button
              onClick={() => onNavigate('properties', undefined, 'espace-commercial')}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-80"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTczMzMzMzMzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Espace Commercial"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Store className="w-8 h-8" />
                </div>
                <h3 className="!text-white mb-2">Espaces commerciaux</h3>
                <p className="!text-white text-center text-sm opacity-90">
                  Locaux et boutiques pour vos activités professionnelles
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span>Explorer</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Nos meilleurs deals</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Une sélection de nos propriétés les plus prestigieuses, disponibles dès maintenant.
            </p>
          </div>
          
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                style={{ 
                  transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` 
                }}
              >
                {infiniteProperties.map((property, index) => (
                  <div key={`${property.id}-${index}`} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                    <PropertyCard
                      property={property}
                      onViewDetails={() => onNavigate('property-detail', property.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons - Hidden on mobile, visible on md+ */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 shadow-lg !bg-slate-900 !border-slate-900 hover:!bg-[#0E1317] !text-white"
              style={{ borderRadius: '50vw' }}
              aria-label="Bien précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 shadow-lg !bg-slate-900 !border-slate-900 hover:!bg-[#0E1317] !text-white"
              style={{ borderRadius: '50vw' }}
              aria-label="Bien suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            
            {/* Mobile Navigation Buttons - Inside the container */}
            <div className="md:hidden flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="shadow-lg !bg-slate-900 !border-slate-900 hover:!bg-[#0E1317] !text-white"
                style={{ borderRadius: '4px' }}
                aria-label="Bien précédent"
              >
                <ChevronLeft className="w-5 h-5" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="shadow-lg !bg-slate-900 !border-slate-900 hover:!bg-[#0E1317] !text-white"
                style={{ borderRadius: '4px' }}
                aria-label="Bien suivant"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Comment ça marche</h2>
            <p className="text-slate-600">Votre parcours d'acquisition en 3 étapes simples</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="mb-3">1. Parcourir</h3>
              <p className="text-slate-600">
                Explorez notre catalogue de biens d'exception et trouvez celui qui vous correspond.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandshakeIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="mb-3">2. Contacter</h3>
              <p className="text-slate-600">
                Prenez contact avec notre équipe commerciale pour organiser une visite et discuter des options.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="mb-3">3. Sécuriser</h3>
              <p className="text-slate-600">
                Choisissez votre option de financement et finalisez votre acquisition en toute sécurité.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Témoignages clients</h2>
            <p className="text-slate-600">Ce que nos clients disent de nous</p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            {/* Carousel */}
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="p-8 text-center bg-slate-50 border-none">
                      <div className="flex gap-1 mb-6 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-slate-900 text-slate-900" />
                        ))}
                      </div>
                      <p className="text-slate-700 mb-6 text-lg italic">"{testimonial.text}"</p>
                      <div>
                        <p className="text-slate-900">{testimonial.name}</p>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 shadow-lg !bg-slate-900 !border-slate-900 hover:!bg-[#0E1317] !text-white"
              style={{ borderRadius: '50vw' }}
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 shadow-lg !bg-slate-900 !border-slate-900 hover:!bg-[#0E1317] !text-white"
              style={{ borderRadius: '50vw' }}
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'bg-slate-900 w-8' 
                      : 'bg-slate-300 hover:bg-slate-400 w-2'
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VIP Services Section */}
      <section className="py-16 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #E94C39 , #C43D2F)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-48 -translate-x-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
              <Crown className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wide">Services VIP</span>
            </div>
            <h2 className="!text-white mb-4">Rejoignez le cercle privilégié</h2>
            <p className="!text-white max-w-2xl mx-auto text-lg">
              Bénéficiez d'avantages exclusifs et d'un accompagnement personnalisé pour vos projets immobiliers d'exception
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="!text-white mb-3">Accès prioritaire</h4>
              <p className="!text-white">
                Découvrez les nouveaux biens avant leur publication publique
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandshakeIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="!text-white mb-3">Conseiller dédié</h4>
              <p className="!text-white">
                Un expert immobilier à votre écoute pour vous accompagner
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h4 className="!text-white mb-3">Événements privés</h4>
              <p className="!text-white">
                Participez à des visites privées et événements networking exclusifs
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => setShowVIPForm(true)}
              className="!bg-white !text-primary-700 hover:!bg-[#0E1317] hover:!text-white"
            >
              Devenir client VIP
              <Crown className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="!text-white mb-4">Prêt à trouver votre bien idéal ?</h2>
          <p className="text-xl mb-8 !text-slate-200">
            Notre équipe d'experts est à votre disposition pour vous accompagner.
          </p>
          <Button variant="secondary" size="lg" onClick={() => onNavigate('contact')}>
            Nous contacter
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* VIP Form Modal */}
      {showVIPForm && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-primary-700" />
                <h3>Demande de statut VIP</h3>
              </div>
              <button onClick={() => setShowVIPForm(false)} className="text-neutral-500 hover:text-neutral-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleVIPSubmit} className="p-6 space-y-4">
              <p className="text-neutral-600 mb-6">
                Remplissez ce formulaire pour rejoindre notre cercle VIP et bénéficier d'avantages exclusifs sur nos biens d'exception.
              </p>

              <div>
                <label className="block text-sm mb-2 text-neutral-700">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={vipFormData.name}
                  onChange={(e) => setVipFormData({ ...vipFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-neutral-700">Email *</label>
                <input
                  type="email"
                  required
                  value={vipFormData.email}
                  onChange={(e) => setVipFormData({ ...vipFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-neutral-700">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={vipFormData.phone}
                  onChange={(e) => setVipFormData({ ...vipFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+221 XX XXX XX XX"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-neutral-700">Message</label>
                <textarea
                  value={vipFormData.message}
                  onChange={(e) => setVipFormData({ ...vipFormData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Parlez-nous de vos projets immobiliers..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Envoyer ma demande
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowVIPForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}