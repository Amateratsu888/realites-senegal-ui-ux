import React, { useState } from 'react';
import { FileText, Download, MessageSquare, Send, Paperclip } from 'lucide-react';
import { Button } from '../Button';
import { documents, conversations, currentUser } from '../../data/mockData';

export function DocumentsMessagesPage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'messages'>('documents');
  const [selectedConversation, setSelectedConversation] = useState(conversations[0].id);
  const [messageText, setMessageText] = useState('');

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'contrat': 'Contrat',
      'facture': 'Facture',
      'reçu': 'Reçu',
      'avenant': 'Avenant',
      'pv-reception': 'PV de réception',
    };
    return labels[type] || type;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const mockMessages = [
    {
      id: '1',
      sender: 'Support Client',
      content: 'Bonjour ! Comment pouvons-nous vous aider aujourd\'hui ?',
      timestamp: '10:00',
      isOwn: false,
    },
    {
      id: '2',
      sender: currentUser.name,
      content: 'Je souhaite obtenir une copie de mon dernier contrat.',
      timestamp: '10:15',
      isOwn: true,
    },
    {
      id: '3',
      sender: 'Support Client',
      content: 'Bien sûr ! Je vous envoie le document par email dans quelques minutes. Vous pouvez également le télécharger depuis la section "Documents".',
      timestamp: '10:20',
      isOwn: false,
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      alert('Message envoyé !');
      setMessageText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-colors ${
              activeTab === 'documents'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-700'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-colors relative ${
              activeTab === 'messages'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-700'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Messagerie</span>
            <span className="absolute top-3 right-3 w-2 h-2 bg-sand-500 rounded-full"></span>
          </button>
        </div>

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="mb-2">Mes documents</h3>
              <p className="text-neutral-600">
                Accédez à tous vos documents contractuels et administratifs
              </p>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <h5 className="text-neutral-900 mb-1">{doc.name}</h5>
                      <div className="flex items-center gap-3 text-sm text-neutral-600">
                        <span className="px-2 py-0.5 bg-neutral-100 rounded">
                          {getDocumentTypeLabel(doc.type)}
                        </span>
                        <span>{formatDate(doc.date)}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-80 border-r border-neutral-200 overflow-y-auto">
              <div className="p-4 border-b border-neutral-200">
                <h4>Conversations</h4>
              </div>
              <div className="divide-y divide-neutral-200">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 text-left hover:bg-neutral-50 transition-colors ${
                      selectedConversation === conv.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">{conv.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-neutral-900 truncate">{conv.name}</h5>
                          {conv.unread > 0 && (
                            <span className="w-5 h-5 bg-sand-500 text-white text-xs rounded-full flex items-center justify-center">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-neutral-500 mt-1">{conv.timestamp}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-neutral-200">
                <h4>{conversations.find(c => c.id === selectedConversation)?.name}</h4>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-3 rounded-lg ${
                          message.isOwn
                            ? 'bg-primary-700 text-white'
                            : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        {!message.isOwn && (
                          <p className="text-xs mb-1 opacity-70">{message.sender}</p>
                        )}
                        <p>{message.content}</p>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 px-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button type="submit">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}