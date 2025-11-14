
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId: string): Promise<string> {
  const token = uuidv4();
  const expiracao = new Date();
  expiracao.setHours(expiracao.getHours() + 8); // 8 horas de expiração

  await prisma.sessionsPortal.create({
    data: {
      token,
      userId,
      expiracao,
    },
  });

  return token;
}

export async function getSessionUser(token: string) {
  const session = await prisma.sessionsPortal.findFirst({
    where: {
      token,
      expiracao: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          cliente: true,
          tipo: true,
          ativo: true,
        },
      },
    },
  });

  return session?.user || null;
}

export async function deleteSession(token: string) {
  await prisma.sessionsPortal.deleteMany({
    where: { token },
  });
}

export async function deleteExpiredSessions() {
  await prisma.sessionsPortal.deleteMany({
    where: {
      expiracao: {
        lt: new Date(),
      },
    },
  });
}
