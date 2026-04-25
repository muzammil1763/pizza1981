import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, deliveryFee, active } = await request.json()
    const area = await prisma.deliveryArea.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(deliveryFee !== undefined && { deliveryFee: parseFloat(deliveryFee) }),
        ...(active !== undefined && { active }),
      },
    })
    return NextResponse.json({ area })
  } catch {
    return NextResponse.json({ error: 'Failed to update area' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.deliveryArea.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete area' }, { status: 500 })
  }
}
