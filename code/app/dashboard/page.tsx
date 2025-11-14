
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import Header from '@/components/header';
import DocumentCard from '@/components/document-card';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

async function getUser(userId: string) {
  return await prisma.usuariosPortal.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      cliente: true,
      tipo: true,
    },
  });
}

async function getDocuments(userId: string, userType: string, userClient: string) {
  const whereClause = userType === 'admin' 
    ? {} // Admin vê todos
    : { cliente: userClient }; // Cliente vê apenas os seus

  return await prisma.documentosOperacoes.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
}

export default async function DashboardPage() {
  const headersList = headers();
  const userId = headersList.get('x-user-id');
  const userType = headersList.get('x-user-type');
  const userClient = headersList.get('x-user-client');

  if (!userId || !userType) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400">Erro de autenticação</p>
      </div>
    );
  }

  const user = await getUser(userId);
  const documents = await getDocuments(userId, userType, userClient || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400">Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Portal de <span className="text-[#f4c400]">Documentos</span>
          </h1>
          <p className="text-gray-400">
            {user.tipo === 'admin' 
              ? 'Gerencie todos os documentos e operações da NewLoc'
              : `Acompanhe as operações da ${user.cliente}`
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">Total de Documentos</h3>
            <p className="text-3xl font-bold text-[#f4c400]">{documents.length}</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">Este Mês</h3>
            <p className="text-3xl font-bold text-[#f4c400]">
              {documents.filter(doc => {
                const docDate = new Date(doc.createdAt);
                const now = new Date();
                return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">
              {user.tipo === 'admin' ? 'Clientes Ativos' : 'Remessas Ativas'}
            </h3>
            <p className="text-3xl font-bold text-[#f4c400]">
              {user.tipo === 'admin' 
                ? new Set(documents.map(doc => doc.cliente)).size
                : new Set(documents.map(doc => doc.remessa)).size
              }
            </p>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Documentos Recentes
            </h2>
            <div className="text-sm text-gray-400">
              {documents.length} documento{documents.length !== 1 ? 's' : ''} encontrado{documents.length !== 1 ? 's' : ''}
            </div>
          </div>

          {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhum documento encontrado
              </h3>
              <p className="text-gray-400">
                {user.tipo === 'admin' 
                  ? 'Ainda não há documentos cadastrados no sistema.'
                  : 'Ainda não há documentos para sua empresa.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
