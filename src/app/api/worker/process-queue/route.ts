import { NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';
import type { QueueItem, QueueStatus, WorkerRequest, WorkerResponse } from '../../../../types/jukebox';
import type { QueueItem as PrismaQueueItem } from '@prisma/client';

const WORKER_HEADER = 'x-worker-token';

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object';

const toQueueStatus = (status: string | null): QueueStatus | null => {
  if (!status) return null;
  if (status === 'PENDING' || status === 'PROCESSING' || status === 'DONE' || status === 'FAILED') {
    return status;
  }
  return null;
};

const toQueueItem = (item: PrismaQueueItem): QueueItem => ({
  id: item.id,
  title: item.title,
  url: item.url ?? null,
  addedBy: item.addedBy ?? null,
  createdAt: item.createdAt.toISOString(),
  order: item.order ?? null,
  status: toQueueStatus(item.status ?? null),
  attempts: item.attempts ?? null,
  lastAttemptAt: item.lastAttemptAt ? item.lastAttemptAt.toISOString() : null,
});

export async function POST(request: Request) {
  const db = prisma;
  if (!db) {
    return NextResponse.json({ error: 'database unavailable' }, { status: 503 });
  }
  const token = request.headers.get(WORKER_HEADER) ?? '';

  if (!process.env.WORKER_TOKEN || token !== process.env.WORKER_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: WorkerRequest = {};
  try {
    const parsed = await request.json();
    if (isObject(parsed)) body = parsed as WorkerRequest;
  } catch {
    // ignore — treat as empty
  }

  const limit = Math.max(1, Math.min(50, body.limit ?? 10));
  const MAX_RETRIES = 3;

  try {
    // Actions:
    // - peek: readonly list
    // - claim: atomically mark PENDING items -> PROCESSING and increment attempts, return them to worker
    // - complete: mark items DONE or FAILED based on success flag

    if (body.action === 'claim') {
      // fetch pending items in order
      const toClaim = await db.queueItem.findMany({
        where: { status: 'PENDING' },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'asc' },
        ],
        take: limit,
      });

      const ids = toClaim.map((i) => i.id);
      const claimedItems = toClaim.map(toQueueItem);
      if (ids.length > 0) {
        // mark as processing and increment attempts
        await db.queueItem.updateMany({
          where: { id: { in: ids } },
          data: { status: 'PROCESSING', attempts: { increment: 1 }, lastAttemptAt: new Date() },
        });
      }
      const response: WorkerResponse = { action: 'claimed', count: ids.length, items: claimedItems };
      return NextResponse.json(response);
    }

    if (body.action === 'complete') {
      const ids = body.ids ?? [];
      if (ids.length === 0) {
        return NextResponse.json({ error: 'no ids provided' }, { status: 400 });
      }

      if (body.success) {
        await db.queueItem.updateMany({ where: { id: { in: ids } }, data: { status: 'DONE' } });
        const response: WorkerResponse = { action: 'completed', count: ids.length };
        return NextResponse.json(response);
      }

      // failed: requeue if attempts < MAX_RETRIES, otherwise mark FAILED
      // fetch attempts for the ids
      const items = await db.queueItem.findMany({ where: { id: { in: ids } } });
      const retryIds: string[] = [];
      const failIds: string[] = [];
      for (const it of items) {
        if ((it.attempts ?? 0) < MAX_RETRIES) retryIds.push(it.id);
        else failIds.push(it.id);
      }

      if (retryIds.length > 0) {
        await db.queueItem.updateMany({ where: { id: { in: retryIds } }, data: { status: 'PENDING' } });
      }
      if (failIds.length > 0) {
        await db.queueItem.updateMany({ where: { id: { in: failIds } }, data: { status: 'FAILED' } });
      }

      const response: WorkerResponse = {
        action: 'complete',
        retried: retryIds.length,
        failed: failIds.length,
      };
      return NextResponse.json(response);
    }

    // default: peek
    const items = await db.queueItem.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
      take: limit,
    });

    const response: WorkerResponse = {
      action: 'peek',
      count: items.length,
      items: items.map(toQueueItem),
    };
    return NextResponse.json(response);
  } catch (err) {
    // Log and return 500
    // eslint-disable-next-line no-console
    console.error('worker/process-queue error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

export async function GET() {
  // Simple readonly peek for convenience (no auth)
  const db = prisma;
  if (!db) {
    return NextResponse.json({ error: 'database unavailable' }, { status: 503 });
  }
  try {
    const items = await db.queueItem.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
      take: 20,
    });
    const response: WorkerResponse = {
      action: 'peek',
      count: items.length,
      items: items.map(toQueueItem),
    };
    return NextResponse.json(response);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('worker/process-queue GET error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
