import { NextResponse } from "next/server";
import prisma from "../../../../src/server/prisma";
import type { QueueItem } from "../../../../src/types/jukebox";

export async function POST() {
  const db = prisma;
  if (!db) {
    return NextResponse.json({ error: 'database unavailable' }, { status: 503 });
  }
  const max = await db.queueItem.aggregate({ _max: { order: true } });
  const nextOrder = (max._max.order ?? 0) + 1;
  const created = await db.queueItem.create({
    data: {
      title: `Test Track ${Date.now()}`,
      url: null,
      addedBy: "test",
      order: nextOrder,
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

  return NextResponse.json(out);
}
