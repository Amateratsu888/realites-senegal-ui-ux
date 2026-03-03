import React, { useState } from 'react';
import { MessageSquare, X, Send, Clock, CheckCircle2, AlertCircle, Plus, ChevronRight, Home, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import supportTeam from 'figma:asset/6dd8ea03ef5328b60a779eeff065d7d70e3401df.png';

interface Ticket {
  id: string;
  subject: string;
  status: 'ouvert' | 'en-cours' | 'résolu' | 'fermé';
  priority: 'basse' | 'normale' | 'haute' | 'urgente';
  createdAt: string;
  lastUpdate: string;
  messages: {
    id: string;
    sender: 'client' | 'support';
    senderName: string;
    content: string;
    timestamp: string;
  }[];
}

const mockTickets: Ticket[] = [
  {
    id: 'T001',
    subject: 'Question sur le prochain paiement',
    status: 'résolu',
    priority: 'normale',
    createdAt: '2024-12-08',
    lastUpdate: '2024-12-09',
    messages: [
      {
        id: 'm1',
        sender: 'client',
        senderName: 'Amadou Diallo',
        content: 'Bonjour, j\'aimerais savoir si je peux reporter mon prochain paiement de quelques jours ?',
        timestamp: '2024-12-08 10:30',
      },
      {
        id: 'm2',
        sender: 'support',
        senderName: 'Sarah Ndiaye - Support',
        content: 'Bonjour M. Diallo, nous avons bien reçu votre demande. Un délai de 5 jours ouvrables peut être accordé. Je vous envoie les documents par email.',
        timestamp: '2024-12-08 14:15',
      },
      {
        id: 'm3',
        sender: 'client',
        senderName: 'Amadou Diallo',
        content: 'Parfait, merci beaucoup !',
        timestamp: '2024-12-09 09:20',
      },
    ],
  },
  {
    id: 'T002',
    subject: 'Problème d\'accès aux documents',
    status: 'en-cours',
    priority: 'haute',
    createdAt: '2024-12-10',
    lastUpdate: '2024-12-10',
    messages: [
      {
        id: 'm4',
        sender: 'client',
        senderName: 'Amadou Diallo',
        content: 'Je n\'arrive pas à télécharger le contrat de vente depuis hier soir.',
        timestamp: '2024-12-10 08:45',
      },
      {
        id: 'm5',
        sender: 'support',
        senderName: 'Mamadou Sow - Support Technique',
        content: 'Bonjour, nous vérifions le problème technique. Pouvez-vous réessayer maintenant ?',
        timestamp: '2024-12-10 10:30',
      },
    ],
  },
];

type ViewType = 'home' | 'tickets' | 'new-ticket' | 'ticket-detail' | 'chat';

export function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'basse' | 'normale' | 'haute' | 'urgente'>('normale');

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'ouvert':
        return 'bg-blue-100 text-blue-700';
      case 'en-cours':
        return 'bg-yellow-100 text-yellow-700';
      case 'résolu':
        return 'bg-green-100 text-green-700';
      case 'fermé':
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'ouvert':
      case 'en-cours':
        return <Clock className="w-3 h-3" />;
      case 'résolu':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'fermé':
        return <X className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'basse':
        return 'bg-neutral-100 text-neutral-700';
      case 'normale':
        return 'bg-blue-100 text-blue-700';
      case 'haute':
        return 'bg-orange-100 text-orange-700';
      case 'urgente':
        return 'bg-red-100 text-red-700';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    console.log('Envoi du message:', newMessage);
    setNewMessage('');
  };

  const handleCreateTicket = () => {
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;
    console.log('Création du ticket:', { newTicketSubject, newTicketMessage, newTicketPriority });
    setNewTicketSubject('');
    setNewTicketMessage('');
    setNewTicketPriority('normale');
    setCurrentView('home');
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('ticket-detail');
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset to home view when closing
    setTimeout(() => {
      setCurrentView('home');
      setSelectedTicket(null);
    }, 300);
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 md:bottom-6 md:right-6 bottom-20 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 group"
        aria-label="Support"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Support Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 md:bottom-24 md:right-6 bottom-36 w-full md:w-[26rem] max-w-[calc(100vw-3rem)] h-[38rem] max-h-[calc(100vh-10rem)] bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200">
          {/* Home View */}
          {currentView === 'home' && (
            <>
              {/* Hero Header with Background Image */}
              <div className="relative h-56 bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden">
                <div className="absolute inset-0">
                  <img 
                    src={supportTeam} 
                    alt="Support Team" 
                    className="w-full h-full object-cover opacity-30"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="relative z-10 p-6 text-white">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded flex items-center justify-center mb-4">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl mb-2 text-white">
                    Bonjour ! 👋
                  </h2>
                  <p className="text-sm text-white">
                    Notre équipe est là pour vous aider - comment pouvons-nous vous assister ?
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex-1 overflow-y-auto p-5 bg-slate-50">
                <div className="space-y-2">
                  <button
                    onClick={() => setCurrentView('tickets')}
                    className="w-full bg-white border border-slate-200 rounded p-4 hover:border-red-300 hover:bg-red-50/50 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Mes tickets de support</p>
                          <p className="text-xs text-slate-500">Voir tous mes tickets</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentView('new-ticket')}
                    className="w-full bg-white border border-slate-200 rounded p-4 hover:border-red-300 hover:bg-red-50/50 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                          <Plus className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Créer un nouveau ticket</p>
                          <p className="text-xs text-slate-500">Contactez notre équipe</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentView('chat')}
                    className="w-full bg-red-600 rounded p-4 hover:bg-red-700 transition-all text-left group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Chatter avec RÉALITÉS SÉNÉGAL</p>
                          <p className="text-xs text-red-100">Notre équipe est en ligne</p>
                        </div>
                      </div>
                      <Send className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 bg-white">
                <div className="flex items-center justify-center gap-8 py-3">
                  <button className="flex flex-col items-center gap-1 text-red-600">
                    <Home className="w-5 h-5" />
                    <span className="text-xs font-medium">Accueil</span>
                  </button>
                  <button 
                    onClick={() => setCurrentView('chat')}
                    className="flex flex-col items-center gap-1 text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs">Chat</span>
                  </button>
                </div>
                <div className="text-center pb-3 px-4">
                  <p className="text-xs text-slate-400">
                    PROPULSÉ PAR <span className="font-semibold text-slate-500">RÉALITÉS SÉNÉGAL</span>
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Tickets List View */}
          {currentView === 'tickets' && (
            <>
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentView('home')}
                      className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <h3 className="font-medium">Mes tickets</h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {mockTickets.length} ticket{mockTickets.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                <div className="space-y-2">
                  {mockTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleViewTicket(ticket)}
                      className="bg-white border border-slate-200 rounded p-3 hover:border-red-300 hover:bg-red-50/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-slate-900">#{ticket.id}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status === 'en-cours' ? 'En cours' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-900 font-medium mb-1">{ticket.subject}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          {formatDate(ticket.lastUpdate)}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {mockTickets.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-900 font-medium mb-1">Aucun ticket</p>
                    <p className="text-xs text-slate-600 mb-4">
                      Créez un ticket pour nous contacter
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* New Ticket View */}
          {currentView === 'new-ticket' && (
            <>
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentView('home')}
                      className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <h3 className="font-medium">Nouveau ticket</h3>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Sujet
                    </label>
                    <input
                      type="text"
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      placeholder="Ex: Question sur mon paiement"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Priorité
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['normale', 'haute'] as const).map((priority) => (
                        <button
                          key={priority}
                          onClick={() => setNewTicketPriority(priority)}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                            newTicketPriority === priority
                              ? 'bg-red-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      value={newTicketMessage}
                      onChange={(e) => setNewTicketMessage(e.target.value)}
                      placeholder="Décrivez votre demande..."
                      rows={8}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-white"
                    />
                  </div>

                  <Button
                    onClick={handleCreateTicket}
                    disabled={!newTicketSubject.trim() || !newTicketMessage.trim()}
                    className="w-full"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                    Créer le ticket
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Ticket Detail View */}
          {currentView === 'ticket-detail' && selectedTicket && (
            <>
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setCurrentView('tickets');
                        setSelectedTicket(null);
                      }}
                      className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <h3 className="font-medium">Ticket #{selectedTicket.id}</h3>
                      <p className="text-xs text-slate-300 mt-0.5">{selectedTicket.subject}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status === 'en-cours' ? 'En cours' : selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    <AlertCircle className="w-3 h-3" />
                    {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                  </span>
                  <span className="text-xs text-slate-500 ml-auto">
                    {formatDate(selectedTicket.createdAt)}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[85%]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="text-xs text-slate-600">{message.senderName}</p>
                        <span className="text-xs text-slate-400">•</span>
                        <p className="text-xs text-slate-400">{formatDateTime(message.timestamp)}</p>
                      </div>
                      <div
                        className={`px-3 py-2 rounded text-sm ${
                          message.sender === 'client'
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-900'
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              {selectedTicket.status !== 'fermé' && selectedTicket.status !== 'résolu' && (
                <div className="p-3 border-t border-slate-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Écrivez votre message..."
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Chat View */}
          {currentView === 'chat' && (
            <>
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentView('home')}
                      className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <h3 className="font-medium">Chat en direct</h3>
                      <p className="text-xs text-slate-300 mt-0.5">En ligne</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-900 font-medium mb-2">
                    Démarrez une conversation
                  </p>
                  <p className="text-xs text-slate-600">
                    Notre équipe vous répondra dans les plus brefs délais
                  </p>
                </div>
              </div>

              <div className="p-3 border-t border-slate-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <Button size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}