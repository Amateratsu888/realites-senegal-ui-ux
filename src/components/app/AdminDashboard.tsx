import React from 'react';
import { TrendingUp, DollarSign, Users, Crown, Building2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function AdminDashboard() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(price);
  };

  const salesData = [
    { month: 'Jan', ventes: 450000000 },
    { month: 'Fév', ventes: 380000000 },
    { month: 'Mar', ventes: 520000000 },
    { month: 'Avr', ventes: 490000000 },
    { month: 'Mai', ventes: 610000000 },
    { month: 'Juin', ventes: 580000000 },
  ];

  const recentTransactions = [
    { id: '1', client: 'Amadou Diallo', property: 'Penthouse Mermoz', amount: 37000000, date: '2024-12-01' },
    { id: '2', client: 'Fatou Ndiaye', property: 'Villa Almadies', amount: 90000000, date: '2024-12-02' },
    { id: '3', client: 'Ousmane Ba', property: 'Terrain Saly', amount: 15000000, date: '2024-12-03' },
  ];

  const newAccounts = [
    { id: '1', name: 'Awa Diop', role: 'Client VIP', date: '2024-12-03' },
    { id: '2', name: 'Mamadou Sow', role: 'Client', date: '2024-12-02' },
    { id: '3', name: 'Ibrahima Sarr', role: 'Technicien', date: '2024-12-01' },
    { id: '4', name: 'Mariama Diallo', role: 'Client VIP', date: '2024-11-30' },
    { id: '5', name: 'Cheikh Ndiaye', role: 'Administrateur', date: '2024-11-29' },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-700" />
            </div>
            <span className="text-green-600 text-sm">+12%</span>
          </div>
          <p className="text-sm text-neutral-600 mb-1">Ventes totales</p>
          <h3 className="text-neutral-900">{formatPrice(3030000000)}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-sand-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-sand-600" />
            </div>
            <span className="text-green-600 text-sm">+8%</span>
          </div>
          <p className="text-sm text-neutral-600 mb-1">Montants encaissés</p>
          <h3 className="text-neutral-900">{formatPrice(1650000000)}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-1">Paiements en retard</p>
          <h3 className="text-neutral-900">{formatPrice(48000000)}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-gold-600" />
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-1">Clients VIP</p>
          <h3 className="text-neutral-900">24</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="mb-6">Évolution des ventes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value: number) => formatPrice(value)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="ventes" stroke="#147452" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="mb-6">Ventes par mois</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value: number) => formatPrice(value)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="ventes" fill="#147452" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h3>Dernières transactions</h3>
          </div>
          <div className="divide-y divide-neutral-200">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-neutral-900">{transaction.client}</h5>
                  <span className="text-primary-700">{formatPrice(transaction.amount)}</span>
                </div>
                <p className="text-sm text-neutral-600">{transaction.property}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(transaction.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h3>Nouveaux comptes</h3>
          </div>
          <div className="divide-y divide-neutral-200">
            {newAccounts.map((account) => (
              <div key={account.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white">{account.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-neutral-900">{account.name}</h5>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-neutral-600">{account.role}</span>
                      {account.role.includes('VIP') && (
                        <Crown className="w-3 h-3 text-gold-600" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {new Date(account.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}