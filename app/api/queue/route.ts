import { NextResponse } from 'next/server';
import prisma from '../../../src/server/prisma';
import type { QueueItem } from '../../../src/types/jukebox';

export async function GET() {
  const items = await prisma.queueItem.findMany({ orderBy: { order: 'asc' } });
  const out: QueueItem[] = items.map((i) => ({
    id: i.id,
    title: i.title,
    url: i.url ?? null,
    addedBy: i.addedBy ?? null,
    createdAt: i.createdAt.toISOString(),
    order: i.order ?? null,
  }));

  return NextResponse.json(out);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, url, addedBy } = body;
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const max = await prisma.queueItem.aggregate({ _max: { order: true } });
  const nextOrder = (max._max.order ?? 0) + 1;

  const created = await prisma.queueItem.create({
    data: { title, url: url ?? null, addedBy: addedBy ?? null, order: nextOrder },
  });

  const out: QueueItem = {
    id: created.id,
    title: created.title,
    url: created.url ?? null,
    addedBy: created.addedBy ?? null,
    createdAt: created.createdAt.toISOString(),
    order: created.order ?? null,
  };

  return NextResponse.json(out, { status: 201 });
}
