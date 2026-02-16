import { NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';

type RequestBody = {
  action?: 'peek' | 'claim' | 'complete';
  limit?: number;
  // for complete: ids to mark done/failed and success flag
  ids?: string[];
  success?: boolean;
};

const WORKER_HEADER = 'x-worker-token';

export async function POST(request: Request) {
  const token = request.headers.get(WORKER_HEADER) ?? '';

  if (!process.env.WORKER_TOKEN || token !== process.env.WORKER_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: RequestBody = {};
  try {
    body = (await request.json()) as RequestBody;
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
      const toClaim = await prisma.queueItem.findMany({
        where: { status: 'PENDING' },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'asc' },
        ],
        take: limit,
      });

      const ids = toClaim.map((i) => i.id);
      if (ids.length > 0) {
        // mark as processing and increment attempts
        await prisma.queueItem.updateMany({
          where: { id: { in: ids } },
          data: { status: 'PROCESSING', attempts: { increment: 1 }, lastAttemptAt: new Date() },
        });
      }
      return NextResponse.json({ action: 'claimed', count: ids.length, items: toClaim });
    }

    if (body.action === 'complete') {
      const ids = body.ids ?? [];
      if (ids.length === 0) {
        return NextResponse.json({ error: 'no ids provided' }, { status: 400 });
      }

      if (body.success) {
        await prisma.queueItem.updateMany({ where: { id: { in: ids } }, data: { status: 'DONE' } });
        return NextResponse.json({ action: 'completed', count: ids.length });
      }

      // failed: requeue if attempts < MAX_RETRIES, otherwise mark FAILED
      // fetch attempts for the ids
      const items = await prisma.queueItem.findMany({ where: { id: { in: ids } } });
      const retryIds: string[] = [];
      const failIds: string[] = [];
      for (const it of items) {
        if ((it.attempts ?? 0) < MAX_RETRIES) retryIds.push(it.id);
        else failIds.push(it.id);
      }

      if (retryIds.length > 0) {
        await prisma.queueItem.updateMany({ where: { id: { in: retryIds } }, data: { status: 'PENDING' } });
      }
      if (failIds.length > 0) {
        await prisma.queueItem.updateMany({ where: { id: { in: failIds } }, data: { status: 'FAILED' } });
      }

      return NextResponse.json({ action: 'complete', retried: retryIds.length, failed: failIds.length });
    }

    // default: peek
    const items = await prisma.queueItem.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
      take: limit,
    });

    return NextResponse.json({ action: 'peek', count: items.length, items });
  } catch (err) {
    // Log and return 500
    // eslint-disable-next-line no-console
    console.error('worker/process-queue error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

export async function GET() {
  // Simple readonly peek for convenience (no auth)
  try {
    const items = await prisma.queueItem.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
      take: 20,
    });
    return NextResponse.json({ action: 'peek', count: items.length, items });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('worker/process-queue GET error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
