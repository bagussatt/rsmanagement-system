import { PrismaClient, Role } from '@prisma/client';
import { HashService } from './common/hash.service';

const prisma = new PrismaClient();

const main = async () => {
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin';
  const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
  const name = process.env.DEFAULT_ADMIN_NAME || 'admin';

  const hashPassword = await new HashService().hashPassword(password);
  const user = await prisma.user.upsert({
    where: { username: username },
    create: { username, password: hashPassword, name, role: Role.ADMIN },
    update: {},
  });
  console.log({
    user,
    isPasswordMatch: await new HashService().comparePasswords(
      password,
      user.password,
    ),
  });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
