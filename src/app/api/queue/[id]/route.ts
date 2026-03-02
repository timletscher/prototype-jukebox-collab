import { NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';
import type { ApiError, ApiOk, QueueDeleteResponse } from '../../../../types/jukebox';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const db = prisma;
  if (!db) {
    const error: ApiError = { error: 'database unavailable' };
    return NextResponse.json(error, { status: 503 });
  }
  const { id } = params;
  if (!id) {
    const error: ApiError = { error: 'missing id' };
    return NextResponse.json(error, { status: 400 });
  }

  try {
    await db.queueItem.delete({ where: { id } });
    const ok: ApiOk = { ok: true };
    return NextResponse.json(ok);
  } catch {
    const error: QueueDeleteResponse = { error: 'not found' };
    return NextResponse.json(error, { status: 404 });
  }
}
