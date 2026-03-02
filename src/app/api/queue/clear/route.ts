import { NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';
import type { ApiOk } from '../../../../types/jukebox';

export async function POST() {
  const db = prisma;
  if (!db) {
    return NextResponse.json({ ok: false, error: 'database unavailable' }, { status: 503 });
  }
  await db.queueItem.deleteMany({});
  const ok: ApiOk = { ok: true };
  return NextResponse.json(ok);
}
