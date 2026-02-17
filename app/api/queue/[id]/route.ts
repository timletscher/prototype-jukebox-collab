import { NextResponse } from 'next/server';
import prisma from '../../../../src/server/prisma';

export async function DELETE(req: Request, { params }: { params: { id?: string } }) {
  const idFromPath = new URL(req.url).pathname.split('/').pop();
  const id = params?.id ?? idFromPath;
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  try {
    await prisma.queueItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}
