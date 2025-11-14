
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Header from '@/components/header';
import DocumentDetail from '@/components/document-detail';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

interface PageProps {
  params: {
    id: string;
  };
}

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

async function getDocument(documentId: string, userId: string, userType: string, userClient: string) {
  const document = await prisma.documentosOperacoes.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    return null;
  }

  // Verificar permissões
  if (userType !== 'admin' && document.cliente !== userClient) {
    return null; // Cliente tentando acessar documento de outro cliente
  }

  return document;
}

export default async function DocumentPage({ params }: PageProps) {
  const headersList = headers();
  const userId = headersList.get('x-user-id');
  const userType = headersList.get('x-user-type');
  const userClient = headersList.get('x-user-client');

  if (!userId || !userType) {
    return notFound();
  }

  const user = await getUser(userId);
  const document = await getDocument(params.id, userId, userType, userClient || '');

  if (!user || !document) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <Header user={user} />
      <DocumentDetail document={document} />
    </div>
  );
}
