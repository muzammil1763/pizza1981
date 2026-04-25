import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ menuItems })
  } catch (error) {
    console.error('Menu API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, category, image } = await request.json()

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        category,
        image: image || '/placeholder.jpg',
        available: true
      }
    })

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error('Menu creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}