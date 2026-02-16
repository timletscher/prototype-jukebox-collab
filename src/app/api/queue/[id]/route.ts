import { NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  try {
    const deleted = await prisma.queueItem.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch (err) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}
import { NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.queueItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}
