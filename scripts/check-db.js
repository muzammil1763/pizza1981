const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
Promise.all([p.menuItem.count(), p.deal.count(), p.user.count()])
  .then(([m, d, u]) => {
    console.log('Menu items:', m);
    console.log('Deals:', d);
    console.log('Users:', u);
    p.$disconnect();
  });
