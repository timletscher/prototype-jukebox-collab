import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../src/server/prisma';
import type { ApiError, ApiOk, QueueDeleteResponse } from '../../../../src/types/jukebox';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idFromPath = new URL(req.url).pathname.split('/').pop();
  const resolvedId = id ?? idFromPath;
  if (!resolvedId) {
    const error: ApiError = { error: 'missing id' };
    return NextResponse.json(error, { status: 400 });
  }

  try {
    await prisma.queueItem.delete({ where: { id: resolvedId } });
    const ok: ApiOk = { ok: true };
    return NextResponse.json(ok);
  } catch {
    const error: QueueDeleteResponse = { error: 'not found' };
    return NextResponse.json(error, { status: 404 });
  }
}
