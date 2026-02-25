/** @jest-environment node */
import { NextRequest } from 'next/server';
import prisma from '../../src/server/prisma';
import { GET as getQueue, POST as postQueue } from '../../app/api/queue/route';
import { DELETE as deleteQueueItem } from '../../app/api/queue/[id]/route';
import { POST as clearQueue } from '../../app/api/queue/clear/route';

describe('Queue API (integration)', () => {
  beforeEach(async () => {
    await prisma.queueItem.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('POST -> GET -> DELETE -> CLEAR', async () => {
    const postRes = await postQueue(
      new Request('http://localhost/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'test song', addedBy: 'jest' }),
      })
    );

    expect(postRes.status).toBe(201);
    const created = (await postRes.json()) as { id: string; title: string };
    expect(created.title).toBe('test song');
    expect(created.id).toBeTruthy();

    const getRes = await getQueue();
    expect(getRes.status).toBe(200);
    const items = (await getRes.json()) as Array<{ id: string; title: string }>;
    expect(items.length).toBe(1);
    expect(items[0].id).toBe(created.id);

    const deleteReq = new NextRequest(`http://localhost/api/queue/${created.id}`);
    const deleteRes = await deleteQueueItem(deleteReq, { params: Promise.resolve({ id: created.id }) });
    expect(deleteRes.status).toBe(200);
    const deleteBody = (await deleteRes.json()) as { ok?: boolean };
    expect(deleteBody.ok).toBe(true);

    const clearRes = await clearQueue();
    expect(clearRes.status).toBe(200);

    const finalRes = await getQueue();
    const finalItems = (await finalRes.json()) as Array<unknown>;
    expect(finalItems.length).toBe(0);
  });
});
