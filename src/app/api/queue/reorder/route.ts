import { NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';
import type {
  ApiError,
  QueueReorderRequest,
  QueueReorderResponse,
} from '../../../../types/jukebox';

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object';

const toQueueResponse = (items: Array<{ id: string; title: string; url: string | null; addedBy: string | null; createdAt: Date; order: number | null }>) =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url ?? null,
    addedBy: item.addedBy ?? null,
    createdAt: item.createdAt.toISOString(),
    order: item.order ?? null,
  }));

export async function PATCH(req: Request) {
  if (!prisma) {
    const error: ApiError = { error: 'database unavailable' };
    return NextResponse.json(error, { status: 503 });
  }
  let body: QueueReorderRequest | null = null;
  try {
    const parsed = await req.json();
    if (isObject(parsed)) {
      body = parsed as QueueReorderRequest;
    }
  } catch {
    body = null;
  }

  if (!body || typeof body.id !== 'string' || (body.direction !== 'up' && body.direction !== 'down')) {
    const error: ApiError = { error: 'invalid reorder payload' };
    return NextResponse.json(error, { status: 400 });
  }

  const items = await prisma.queueItem.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  const index = items.findIndex((item) => item.id === body.id);
  if (index === -1) {
    const error: ApiError = { error: 'item not found' };
    return NextResponse.json(error, { status: 404 });
  }

  const targetIndex = body.direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) {
    const out: QueueReorderResponse = toQueueResponse(items);
    return NextResponse.json(out);
  }

  const reordered = items.slice();
  const [moved] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, moved);

  await prisma.$transaction(
    reordered.map((item, orderIndex) =>
      prisma.queueItem.update({
        where: { id: item.id },
        data: { order: orderIndex + 1 },
      })
    )
  );

  const out: QueueReorderResponse = toQueueResponse(reordered);
  return NextResponse.json(out);
}
