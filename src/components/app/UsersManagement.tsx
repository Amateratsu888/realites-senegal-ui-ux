import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Crown, Mail, Phone, UserCircle, Star, ArrowUpCircle, ArrowDownCircle, MoreVertical, X, CheckCircle } from 'lucide-react';
import { Button } from '../Button';
import { User } from '../../types';
import { technicianClients } from '../../data/mockData';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (user: Partial<User>) => void;
}

function CreateUserModal({ isOpen, onClose, onCreateUser }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'client' as 'client' | 'vip' | 'technicien',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateUser({
      ...formData,
      id: `u${Date.now()}`,
      isVip: formData.role === 'vip',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
    });
    setFormData({ name: '', email: '', phone: '', role: 'client' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 m-4">
        <h3 className="mb-4">Créer un nouvel utilisateur</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-neutral-700">Nom complet</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
              placeholder="Ex: Abdoulaye Diop"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-neutral-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
              placeholder="exemple@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-neutral-700">Téléphone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
              placeholder="+221 77 123 45 67"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-neutral-700">Rôle</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
            >
              <option value="client">Client</option>
              <option value="vip">Client VIP</option>
              <option value="technicien">Technicien</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1"
            >
              Créer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([
    ...technicianClients,
    {
      id: 't1',
      name: 'Bienta Fall',
      email: 'commercial.fall@realites-senegal.sn',
      phone: '+221 77 999 88 77',
      role: 'technicien',
      isVip: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bienta',
    },
    {
      id: 't2',
      name: 'Moussa Ndiaye',
      email: 'technique.ndiaye@realites-senegal.sn',
      phone: '+221 78 111 22 33',
      role: 'technicien',
      isVip: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'vip' | 'technicien'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateUser = (newUser: Partial<User>) => {
    setUsers([...users, newUser as User]);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleVipStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Ne permettre le changement que pour les clients
    if (user.role !== 'client' && user.role !== 'vip') {
      alert('Seuls les clients peuvent avoir un statut VIP');
      return;
    }

    const isCurrentlyVip = user.role === 'vip';
    const action = isCurrentlyVip ? 'retirer le statut VIP' : 'promouvoir au statut VIP';
    
    if (confirm(`Voulez-vous ${action} pour ${user.name} ?`)) {
      setUsers(users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            role: isCurrentlyVip ? 'client' : 'vip',
            isVip: !isCurrentlyVip,
          };
        }
        return u;
      }));
      
      const message = isCurrentlyVip 
        ? `${user.name} a été rétrogradé(e) au statut client standard`
        : `${user.name} a été promu(e) au statut VIP`;
      
      // Simuler une notification
      alert(message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.phone.includes(searchQuery);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    clients: users.filter(u => u.role === 'client').length,
    vips: users.filter(u => u.role === 'vip').length,
    techniciens: users.filter(u => u.role === 'technicien').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total utilisateurs</p>
              <p className="text-2xl text-neutral-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Clients</p>
              <p className="text-2xl text-neutral-900">{stats.clients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Clients VIP</p>
              <p className="text-2xl text-neutral-900">{stats.vips}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Techniciens</p>
              <p className="text-2xl text-neutral-900">{stats.techniciens}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
              />
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
            >
              <option value="all">Tous les rôles</option>
              <option value="client">Clients</option>
              <option value="vip">Clients VIP</option>
              <option value="technicien">Techniciens</option>
            </select>

            <Button 
              variant="primary" 
              onClick={() => setIsCreateModalOpen(true)}
              className="whitespace-nowrap"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvel utilisateur
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-neutral-600">Utilisateur</th>
                <th className="text-left px-6 py-4 text-sm text-neutral-600">Contact</th>
                <th className="text-left px-6 py-4 text-sm text-neutral-600">Rôle</th>
                <th className="text-right px-6 py-4 text-sm text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-neutral-900">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'vip' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm">
                          <Crown className="w-4 h-4" />
                          Client VIP
                        </span>
                      ) : user.role === 'technicien' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                          Technicien
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                          Client
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        {user.role === 'client' || user.role === 'vip' ? (
                          <button
                            onClick={() => handleToggleVipStatus(user.id)}
                            className="p-2 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title={user.role === 'vip' ? 'Retirer le statut VIP' : 'Promouvoir au statut VIP'}
                          >
                            <Crown className="w-5 h-5" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateUser={handleCreateUser}
      />
    </div>
  );
}