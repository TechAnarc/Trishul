const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.deleteMany().then(() => console.log('Deleted all users')).catch(console.error).finally(() => p.$disconnect());
