
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Users, Home } from 'lucide-react';

interface User {
  id: string;
  email: string;
  cliente: string | null;
  tipo: 'admin' | 'cliente';
}

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.replace('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.tipo === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div 
              className="text-2xl font-bold cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              <span className="text-white">New</span>
              <span className="text-[#f4c400]">Loc</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-300 hover:text-[#f4c400] transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => router.push('/usuarios')}
                  className="flex items-center gap-2 text-gray-300 hover:text-[#f4c400] transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Usuários
                </button>
              )}
            </nav>
          </div>

          {/* User info and logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white font-medium">
                {user?.email}
              </p>
              <p className="text-xs text-gray-400">
                {isAdmin ? 'Administrador' : user?.cliente}
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
