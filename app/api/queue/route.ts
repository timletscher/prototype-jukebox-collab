import { NextResponse } from 'next/server';
import prisma from '../../../src/server/prisma';
import type {
  ApiError,
  QueueCreateRequest,
  QueueCreateResponse,
  QueueListResponse,
} from '../../../src/types/jukebox';

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object';

export async function GET() {
  const db = prisma;
  if (!db) return NextResponse.json([]);
  const items = await db.queueItem.findMany({ orderBy: { order: 'asc' } });
  const out: QueueListResponse = items.map((i) => ({
    id: i.id,
    title: i.title,
    artist: i.artist ?? null,
    url: i.url ?? null,
    addedBy: i.addedBy ?? null,
    createdAt: i.createdAt.toISOString(),
    order: i.order ?? null,
  }));

  return NextResponse.json(out);
}

export async function POST(req: Request) {
  const db = prisma;
  if (!db) {
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
  const artist = body.artist ?? null;
  const url = body.url ?? null;
  const addedBy = body.addedBy ?? null;

  const max = await db.queueItem.aggregate({ _max: { order: true } });
  const nextOrder = (max._max.order ?? 0) + 1;

  const created = await db.queueItem.create({
    data: { title, artist, url: url ?? null, addedBy: addedBy ?? null, order: nextOrder },
  });

  const out: QueueCreateResponse = {
    id: created.id,
    title: created.title,
    artist: created.artist ?? null,
    url: created.url ?? null,
    addedBy: created.addedBy ?? null,
    createdAt: created.createdAt.toISOString(),
    order: created.order ?? null,
  };

  return NextResponse.json(out, { status: 201 });
}
