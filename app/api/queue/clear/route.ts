import { NextResponse } from 'next/server';
import prisma from '../../../../src/server/prisma';
import type { ApiOk } from '../../../../src/types/jukebox';

export async function POST() {
  await prisma.queueItem.deleteMany({});
  const ok: ApiOk = { ok: true };
  return NextResponse.json(ok);
}
