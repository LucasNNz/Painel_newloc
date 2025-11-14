
import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value;

    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('session-token');
    
    return response;
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
