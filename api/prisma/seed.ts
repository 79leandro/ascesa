import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ascesa.com.br' },
    update: {},
    create: {
      email: 'admin@ascesa.com.br',
      password: hashedPassword,
      name: 'Administrador',
      cpf: '123.456.789-00',
      phone: '(31) 99999-0000',
      status: 'ACTIVE',
      role: 'ADMIN',
    },
  });

  console.log('Admin created:', admin.email);

  // Create associated user for testing
  const associated = await prisma.user.upsert({
    where: { email: 'associado@teste.com.br' },
    update: {},
    create: {
      email: 'associado@teste.com.br',
      password: hashedPassword,
      name: 'João Silva Santos',
      cpf: '123.456.789-01',
      phone: '(31) 99999-9999',
      status: 'ACTIVE',
      role: 'ASSOCIATED',
    },
  });

  console.log('Associated created:', associated.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
