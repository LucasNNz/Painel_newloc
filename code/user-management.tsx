
"use client";

import { useState } from 'react';
import { Users, Plus, Mail, Building, UserCheck, UserX, Calendar } from 'lucide-react';

interface User {
  id: string;
  email: string;
  cliente: string | null;
  tipo: 'admin' | 'cliente';
  ativo: boolean;
  criadoEm: Date;
}

interface UserManagementProps {
  users: User[];
}

export default function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    cliente: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tipo: 'cliente',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Usuário criado com sucesso!');
        setFormData({ email: '', senha: '', cliente: '' });
        setShowForm(false);
        
        // Atualizar lista de usuários
        setUsers([data.user, ...users]);
      } else {
        setError(data.error || 'Erro ao criar usuário');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Gestão de <span className="text-[#f4c400]">Usuários</span>
        </h1>
        <p className="text-gray-400">
          Gerencie usuários do sistema e crie novos acessos para clientes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-2">Total de Usuários</h3>
          <p className="text-3xl font-bold text-[#f4c400]">{users.length}</p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-2">Clientes</h3>
          <p className="text-3xl font-bold text-[#f4c400]">
            {users.filter(u => u.tipo === 'cliente').length}
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-2">Usuários Ativos</h3>
          <p className="text-3xl font-bold text-[#f4c400]">
            {users.filter(u => u.ativo).length}
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-3 rounded-md mb-6">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-white">
          Lista de Usuários
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError('');
            setSuccess('');
          }}
          className="flex items-center gap-2 bg-[#f4c400] text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      {/* Create User Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Criar Novo Cliente</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-[#f4c400] focus:border-transparent text-white placeholder-gray-400"
                  placeholder="cliente@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-[#f4c400] focus:border-transparent text-white placeholder-gray-400"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <div>
              <label htmlFor="cliente" className="block text-sm font-medium text-gray-300 mb-2">
                Nome da Empresa
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="cliente"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-[#f4c400] focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Nome da empresa cliente"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#f4c400] text-black font-semibold py-3 px-4 rounded-md hover:bg-yellow-500 focus:ring-2 focus:ring-[#f4c400] focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  'Criar Usuário'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 text-white font-semibold py-3 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#f4c400]" />
            Usuários do Sistema
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Criado em
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {user.email}
                      </div>
                      {user.cliente && (
                        <div className="text-sm text-gray-400">
                          {user.cliente}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.tipo === 'admin' 
                        ? 'bg-[#f4c400]/20 text-[#f4c400]' 
                        : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      {user.tipo === 'admin' ? 'Admin' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {user.ativo ? (
                        <>
                          <UserCheck className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">Ativo</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 text-sm">Inativo</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(user.criadoEm)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-400">
              Crie o primeiro usuário para começar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
