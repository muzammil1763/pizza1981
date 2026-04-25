import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // If existing user is a GUEST, upgrade them to REGISTERED
      if (existingUser.userType === 'GUEST') {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Upgrade guest to registered user
        const upgradedUser = await prisma.user.update({
          where: { email },
          data: {
            name,
            phone,
            password: hashedPassword,
            userType: 'REGISTERED',
          },
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            address: true,
            role: true,
          },
        })

        return NextResponse.json({
          success: true,
          message: 'Account upgraded successfully! Your previous orders are now linked to your account.',
          user: {
            id: upgradedUser.id,
            name: upgradedUser.name,
            email: upgradedUser.email,
            phone: upgradedUser.phone,
            address: upgradedUser.address,
            isAdmin: upgradedUser.role === 'ADMIN',
          },
        })
      }

      // If already a registered user, return error
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'USER',
        userType: 'REGISTERED',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.role === 'ADMIN',
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
