import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, phone, available } = await request.json()
    const rider = await prisma.rider.update({
      where: { id },
      data: { ...(name && { name }), ...(phone && { phone }), ...(available !== undefined && { available }) },
    })
    return NextResponse.json({ rider })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rider' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.rider.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete rider' }, { status: 500 })
  }
}
