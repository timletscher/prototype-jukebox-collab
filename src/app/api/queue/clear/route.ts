import { NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';

export async function POST() {
  await prisma.queueItem.deleteMany({});
  return NextResponse.json({ ok: true });
}
