import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@ascesa.com' },
    update: {},
    create: {
      email: 'admin@ascesa.com',
      senha: hashedPassword,
      nome: 'Administrador',
      cpf: '00000000000',
      telefone: '00000000000',
      status: 'ATIVO',
      papel: 'ADMIN',
    },
  });

  console.log('Admin created:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
