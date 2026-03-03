import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '../Button';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message envoyé ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4">Contactez-nous</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h5 className="mb-1">Téléphone</h5>
                  <p className="text-neutral-600">+221 33 123 45 67</p>
                  <p className="text-neutral-600">+221 77 123 45 67</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h5 className="mb-1">Email</h5>
                  <p className="text-neutral-600">contact@realites-senegal.sn</p>
                  <p className="text-neutral-600">commercial@prestige-immo.sn</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h5 className="mb-1">Adresse</h5>
                  <p className="text-neutral-600">
                    Avenue Cheikh Anta Diop<br />
                    Dakar, Sénégal
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h5 className="mb-1">Horaires</h5>
                  <p className="text-neutral-600">
                    Lun - Ven : 8h00 - 18h00<br />
                    Sam : 9h00 - 13h00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-neutral-200">
              <h3 className="mb-6">Envoyez-nous un message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm mb-2 text-neutral-700">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 text-neutral-700">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+221 XX XXX XX XX"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2 text-neutral-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2 text-neutral-700">Sujet *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Objet de votre demande"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2 text-neutral-700">Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Décrivez votre demande..."
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full md:w-auto">
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 overflow-hidden">
              <div className="h-64 bg-neutral-200 flex items-center justify-center rounded-lg">
                <div className="text-center text-neutral-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Carte interactive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}