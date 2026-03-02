import { NextResponse } from 'next/server';
import prisma from '../../../server/prisma';
import type {
  ApiError,
  QueueCreateRequest,
  QueueCreateResponse,
  QueueListResponse,
} from '../../../types/jukebox';

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object';

export async function GET() {
  if (!prisma) return NextResponse.json([]);
  const items = await prisma.queueItem.findMany({ orderBy: { order: 'asc' } });
  const out: QueueListResponse = items.map((i) => ({
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
  if (!prisma) {
    const error: ApiError = { error: 'database unavailable' };
    return NextResponse.json(error, { status: 503 });
  }
  let body: QueueCreateRequest | null = null;
  try {
    const parsed = await req.json();
    if (isObject(parsed)) {
      body = parsed as QueueCreateRequest;
    }
  } catch {
    body = null;
  }

  if (!body || typeof body.title !== 'string' || body.title.trim().length === 0) {
    const error: ApiError = { error: 'title is required' };
    return NextResponse.json(error, { status: 400 });
  }

  const title = body.title.trim();
  const url = body.url ?? null;
  const addedBy = body.addedBy ?? null;

  const max = await prisma.queueItem.aggregate({ _max: { order: true } });
  const nextOrder = (max._max.order ?? 0) + 1;

  const created = await prisma.queueItem.create({
    data: { title, url: url ?? null, addedBy: addedBy ?? null, order: nextOrder },
  });

  const out: QueueCreateResponse = {
    id: created.id,
    title: created.title,
    url: created.url ?? null,
    addedBy: created.addedBy ?? null,
    createdAt: created.createdAt.toISOString(),
    order: created.order ?? null,
  };

  return NextResponse.json(out, { status: 201 });
}
