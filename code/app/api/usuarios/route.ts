
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userType = request.headers.get('x-user-type');

    if (userType !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const users = await prisma.usuariosPortal.findMany({
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

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userType = request.headers.get('x-user-type');

    if (userType !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { email, senha, cliente, tipo } = await request.json();

    // Validações
    if (!email || !senha || !cliente) {
      return NextResponse.json(
        { error: 'Email, senha e nome da empresa são obrigatórios' },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    if (tipo && tipo !== 'cliente') {
      return NextResponse.json(
        { error: 'Apenas usuários do tipo cliente podem ser criados' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existingUser = await prisma.usuariosPortal.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 409 }
      );
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha);

    // Criar usuário
    const user = await prisma.usuariosPortal.create({
      data: {
        email: email.toLowerCase(),
        senhaHash,
        cliente,
        tipo: 'cliente',
        ativo: true,
      },
      select: {
        id: true,
        email: true,
        cliente: true,
        tipo: true,
        ativo: true,
        criadoEm: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
