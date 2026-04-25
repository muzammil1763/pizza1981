import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Updating user passwords...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const testPassword = await bcrypt.hash('password', 10)

  // Update admin user
  const admin = await prisma.user.update({
    where: { email: 'admin@pizza1981.com' },
    data: { password: adminPassword },
  })
  console.log('✅ Updated admin password')

  // Update test user
  const testUser = await prisma.user.update({
    where: { email: 'test@example.com' },
    data: { password: testPassword },
  })
  console.log('✅ Updated test user password')

  console.log('\n📝 Login Credentials:')
  console.log('   👤 User: test@example.com / password')
  console.log('   🔐 Admin: admin@pizza1981.com / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Update failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
