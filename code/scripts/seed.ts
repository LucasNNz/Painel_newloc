
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Imagem base64 simples (1x1 pixel transparente)
const sampleImageBase64 = `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`;

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional)
  await prisma.sessionsPortal.deleteMany();
  await prisma.documentosOperacoes.deleteMany();
  await prisma.usuariosPortal.deleteMany();

  console.log('🗑️ Dados existentes removidos');

  // 1. Criar usuário admin
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.usuariosPortal.create({
    data: {
      email: 'admin@newloc.com',
      senhaHash: adminPassword,
      tipo: 'admin',
      ativo: true,
      cliente: null,
    },
  });

  console.log('👤 Usuário admin criado:', admin.email);

  // 2. Criar alguns usuários clientes de exemplo
  const clientePassword = await bcrypt.hash('cliente123', 12);
  
  const cliente1 = await prisma.usuariosPortal.create({
    data: {
      email: 'cliente@construtorasilva.com',
      senhaHash: clientePassword,
      tipo: 'cliente',
      ativo: true,
      cliente: 'Construtora Silva Ltda',
    },
  });

  const cliente2 = await prisma.usuariosPortal.create({
    data: {
      email: 'admin@empresaabc.com',
      senhaHash: clientePassword,
      tipo: 'cliente',
      ativo: true,
      cliente: 'Empresa ABC S.A.',
    },
  });

  const cliente3 = await prisma.usuariosPortal.create({
    data: {
      email: 'gerente@obrasbrasil.com',
      senhaHash: clientePassword,
      tipo: 'cliente',
      ativo: true,
      cliente: 'Obras Brasil Empreendimentos',
    },
  });

  console.log('👥 Usuários clientes criados');

  // 3. Criar documentos de exemplo
  const documentos = [
    {
      date: new Date('2024-11-10'),
      cliente: 'Construtora Silva Ltda',
      dataDocumento: new Date('2024-11-10'),
      remessa: 'REM-2024-001',
      contrato: 'CTR-001/2024',
      operacao: 'entrega',
      patrimonios: [
        'Andaime metálico - AM001',
        'Betoneira 400L - BT002',
        'Furadeira elétrica - FE003',
        'Escada de alumínio 5m - EA004'
      ],
      documentacaoImagem: sampleImageBase64,
      status: 'concluido',
    },
    {
      date: new Date('2024-11-12'),
      cliente: 'Empresa ABC S.A.',
      dataDocumento: new Date('2024-11-12'),
      remessa: 'REM-2024-002',
      contrato: 'CTR-002/2024',
      operacao: 'retirada',
      patrimonios: [
        'Compressor de ar - CA005',
        'Martelete pneumático - MP006',
        'Serra circular - SC007'
      ],
      documentacaoImagem: sampleImageBase64,
      status: 'pendente',
    },
    {
      date: new Date('2024-11-13'),
      cliente: 'Obras Brasil Empreendimentos',
      dataDocumento: new Date('2024-11-13'),
      remessa: 'REM-2024-003',
      contrato: 'CTR-003/2024',
      operacao: 'devolucao',
      patrimonios: [
        'Guincho elétrico 500kg - GE008',
        'Soldador MIG 200A - SM009',
        'Gerador 3KVA - GR010',
        'Parafusadeira elétrica - PE011',
        'Morsa bancada 6" - MB012'
      ],
      documentacaoImagem: sampleImageBase64,
      status: 'em andamento',
    },
    {
      date: new Date('2024-11-14'),
      cliente: 'Construtora Silva Ltda',
      dataDocumento: new Date('2024-11-14'),
      remessa: 'REM-2024-004',
      contrato: 'CTR-004/2024',
      operacao: 'entrega',
      patrimonios: [
        'Vibrador de concreto - VC013',
        'Cortadora de piso - CP014',
        'Bomba d\'água 2" - BA015'
      ],
      documentacaoImagem: sampleImageBase64,
      status: 'concluido',
    },
    {
      date: new Date('2024-11-15'),
      cliente: 'Empresa ABC S.A.',
      dataDocumento: new Date('2024-11-15'),
      remessa: 'REM-2024-005',
      contrato: 'CTR-005/2024',
      operacao: 'manutencao',
      patrimonios: [
        'Equipamento especial - EE016',
        'Acessório de segurança - AS017'
      ],
      documentacaoImagem: sampleImageBase64,
      status: 'cancelado',
    },
  ];

  for (const doc of documentos) {
    await prisma.documentosOperacoes.create({
      data: doc,
    });
  }

  console.log('📄 Documentos de exemplo criados');

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📋 Resumo:');
  console.log(`- 1 Admin: admin@newloc.com (senha: Admin@123)`);
  console.log(`- 3 Clientes com senha: cliente123`);
  console.log(`  • cliente@construtorasilva.com`);
  console.log(`  • admin@empresaabc.com`);
  console.log(`  • gerente@obrasbrasil.com`);
  console.log(`- ${documentos.length} Documentos de exemplo`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
