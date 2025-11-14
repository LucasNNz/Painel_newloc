
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionUser } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas
  if (pathname === '/login' || pathname.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }

  // Rotas que precisam de autenticação
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/documento') || pathname.startsWith('/usuarios') || pathname.startsWith('/api/')) {
    const token = request.cookies.get('session-token')?.value;

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = await getSessionUser(token);
      if (!user || !user.ativo) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Verificar permissões para rotas de usuários (apenas admin)
      if (pathname.startsWith('/usuarios') || pathname.startsWith('/api/usuarios')) {
        if (user.tipo !== 'admin') {
          if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
          }
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // Adicionar dados do usuário nos headers para as APIs
      const response = NextResponse.next();
      response.headers.set('x-user-id', user.id);
      response.headers.set('x-user-type', user.tipo);
      response.headers.set('x-user-client', user.cliente || '');
      
      return response;
    } catch (error) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Erro na autenticação' }, { status: 500 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/documento/:path*',
    '/usuarios/:path*',
    '/api/:path*'
  ],
};
