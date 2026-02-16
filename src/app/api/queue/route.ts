import { NextResponse } from 'next/server';
import prisma from '../../../server/prisma';

export async function GET() {
  const items = await prisma.queueItem.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, url, addedBy } = body;
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'invalid title' }, { status: 400 });
  }

  const max = await prisma.queueItem.aggregate({ _max: { order: true } });
  const nextOrder = (max._max.order ?? 0) + 1;

  const created = await prisma.queueItem.create({
    data: { title, url, addedBy, order: nextOrder },
  });

  return NextResponse.json(created);
}
import { NextResponse } from 'next/server';
import prisma from '../../../server/prisma';
import type { QueueItem } from '../../../types/jukebox';

export async function GET() {
  const items = await prisma.queueItem.findMany({ orderBy: { createdAt: 'asc' } });
  // normalize dates to ISO strings
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
  const { title, url, addedBy, order } = body;
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const created = await prisma.queueItem.create({
    data: {
      title,
      url: url ?? null,
      addedBy: addedBy ?? null,
      order: typeof order === 'number' ? order : undefined,
    },
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
