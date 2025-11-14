
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Header from '@/components/header';
import UserManagement from '@/components/user-management';

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

async function getUsers() {
  return await prisma.usuariosPortal.findMany({
    select: {
      id: true,
      email: true,
      cliente: true,
      tipo: true,
      ativo: true,
      criadoEm: true,
    },
    orderBy: { criadoEm: 'desc' },
  });
}

export default async function UsuariosPage() {
  const headersList = headers();
  const userId = headersList.get('x-user-id');
  const userType = headersList.get('x-user-type');

  if (!userId || userType !== 'admin') {
    redirect('/dashboard');
  }

  const user = await getUser(userId);
  const users = await getUsers();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-black">
      <Header user={user} />
      <UserManagement users={users} />
    </div>
  );
}
