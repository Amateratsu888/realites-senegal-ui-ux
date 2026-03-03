import React from 'react';
import { Building2, Users, Target, Award, Heart, Shield, TrendingUp, MapPin } from 'lucide-react';
import { Button } from '../Button';
import teamImage from 'figma:asset/5ee2ba3eef86046f93c9e05d5c89a0f68bb89c2e.png';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const stats = [
    { value: '1200+', label: 'Collaborateurs' },
    { value: '364.2M€', label: 'Chiffre d\'affaires' },
    { value: '28.9M€', label: 'Résultat opérationnel' },
    { value: '15+', label: 'Résidences à Dakar' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Des délais de livraison respectés',
      description: 'Grâce à une ingénierie technique et financière maîtrisées, les programmes immobiliers sont livrés aux dates annoncées.',
    },
    {
      icon: Heart,
      title: 'Une totale transparence',
      description: "Nous vous disons tout avant de vous engager : gamme des matériaux, niveau d'équipements et échéancier clair des appels de fonds.",
    },
    {
      icon: Target,
      title: 'Un conseiller expert dédié',
      description: "Dès votre prise de contact, un interlocuteur unique au sein de l'équipe commerciale se chargera de vous accompagner jusqu'à la livraison de votre bien.",
    },
    {
      icon: TrendingUp,
      title: 'Groupe RÉALITÉS International',
      description: 'Nous créons dans l\'intérêt général et dans le respect de nos engagements des projets intelligents associant la mixité des usages à la qualité des ouvrages.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-sm font-medium text-red-600 mb-4 tracking-wide uppercase">
              À propos de nous
            </div>
            <h1 className="mb-6">RÉALITÉS SÉNÉGAL, promoteur immobilier à Dakar</h1>
            <p className="text-xl text-slate-600">
              Nous transformons vos rêves immobiliers en réalité avec professionnalisme, 
              transparence et un accompagnement personnalisé à chaque étape de votre projet.
            </p>
          </div>
          
          {/* Video Container */}
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden shadow-2xl">
              {/* Placeholder for video - Replace with actual video embed */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4 cursor-pointer hover:bg-red-700 transition-colors">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-slate-600">Vidéo de présentation</p>
                </div>
              </div>
              {/* Uncomment and replace with your actual video URL */}
              {/* <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="Présentation RÉALITÉS SÉNÉGAL"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe> */}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Notre Mission</span>
              </div>
              <h2 className="mb-6">Design moderne, destination multi-usage, typologies variées</h2>
              <p className="text-slate-600 mb-4">
                RÉALITÉS SÉNÉGAL est un promoteur immobilier qui propose une large gamme d'appartements, 
                de commerces et de bureaux dans des quartiers très prisés à Dakar. Design moderne, 
                destination multi-usage, typologies variées, emplacement stratégique tels sont les 
                maîtres-mots qui guident notre conception.
              </p>
              <p className="text-slate-600 mb-6">
                Une équipe mixte composée de conseillers commerciaux et de techniciens du bâtiment 
                se tiennent à votre disposition pour une entière prise en compte de vos besoins. 
                Filiale du groupe RÉALITÉS, nous bénéficions d'une expertise internationale reconnue.
              </p>
              <Button onClick={() => onNavigate('contact')}>
                Contactez-nous
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={teamImage}
                  alt="L'équipe RÉALITÉS SÉNÉGAL" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-red-600 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Notre Histoire</span>
            </div>
            <h2 className="mb-6">Une entreprise née d'une passion</h2>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-8 md:p-12 relative">
            <div className="absolute top-8 left-8 text-red-600 opacity-20">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            
            <div className="relative">
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                RÉALITÉS SÉNÉGAL, filiale du groupe RÉALITÉS, développe des programmes immobiliers 
                d'exception dans les quartiers les plus prisés de Dakar. Notre expertise combine 
                l'innovation architecturale, la qualité des finitions et l'excellence du service client. 
                Nous nous engageons dans la fabrique de la ville de demain à travers des projets 
                qui créent de la valeur pour nos clients et la communauté.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  YCJ
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Yoann Choin-Joubert</p>
                  <p className="text-sm text-red-600">PDG du Groupe RÉALITÉS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Nos Valeurs</span>
            </div>
            <h2 className="mb-6">Ce qui nous guide au quotidien</h2>
            <p className="text-slate-600">
              Nos valeurs fondamentales sont le socle de notre engagement envers nos clients et partenaires.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="mb-3">{value.title}</h3>
                <p className="text-sm text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}