import { NextResponse } from 'next/server';
import prisma from '~/src/server/prisma';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.queueItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}
