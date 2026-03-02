import { NextResponse } from 'next/server';
import prisma from '../../../server/prisma';
import type {
  ApiError,
  HistoryCreateRequest,
  HistoryCreateResponse,
  HistoryListResponse,
} from '../../../types/jukebox';

const HISTORY_LIMIT = 40;

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object';

export async function GET() {
  if (!prisma) return NextResponse.json([]);
  const items = await prisma.playHistory.findMany({
    orderBy: { playedAt: 'desc' },
    take: HISTORY_LIMIT,
  });
  const out: HistoryListResponse = items.map((item) => ({
    id: item.id,
    songId: item.songId,
    title: item.title,
    artist: item.artist ?? null,
    addedBy: item.addedBy ?? null,
    playedAt: item.playedAt.toISOString(),
  }));

  return NextResponse.json(out);
}

export async function POST(req: Request) {
  if (!prisma) {
    const error: ApiError = { error: 'database unavailable' };
    return NextResponse.json(error, { status: 503 });
  }
  let body: HistoryCreateRequest | null = null;
  try {
    const parsed = await req.json();
    if (isObject(parsed)) {
      body = parsed as HistoryCreateRequest;
    }
  } catch {
    body = null;
  }

  if (!body || typeof body.songId !== 'string' || typeof body.title !== 'string') {
    const error: ApiError = { error: 'songId and title are required' };
    return NextResponse.json(error, { status: 400 });
  }

  const created = await prisma.playHistory.create({
    data: {
      songId: body.songId.trim(),
      title: body.title.trim(),
      artist: body.artist ?? null,
      addedBy: body.addedBy ?? null,
      playedAt: body.playedAt ? new Date(body.playedAt) : new Date(),
    },
  });

  const out: HistoryCreateResponse = {
    id: created.id,
    songId: created.songId,
    title: created.title,
    artist: created.artist ?? null,
    addedBy: created.addedBy ?? null,
    playedAt: created.playedAt.toISOString(),
  };

  return NextResponse.json(out, { status: 201 });
}
