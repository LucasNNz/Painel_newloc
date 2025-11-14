
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userType = request.headers.get('x-user-type');
    const userClient = request.headers.get('x-user-client');

    if (!userType) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const whereClause = userType === 'admin' 
      ? {} // Admin vê todos
      : { cliente: userClient || '' }; // Cliente vê apenas os seus

    const documents = await prisma.documentosOperacoes.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
