import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../src/server/prisma';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idFromPath = new URL(req.url).pathname.split('/').pop();
  const resolvedId = id ?? idFromPath;
  if (!resolvedId) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  try {
    await prisma.queueItem.delete({ where: { id: resolvedId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}
