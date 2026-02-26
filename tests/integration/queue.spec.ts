/** @jest-environment node */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Queue processing (integration)', () => {
  beforeAll(async () => {
    // skip if no DB configured
    if (!process.env.DATABASE_URL) {
      console.warn('Skipping integration tests: DATABASE_URL not set');
      return;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('create item -> claim (processing) -> complete (done)', async () => {
    if (!process.env.DATABASE_URL) return; // skip when not configured

    // create a queue item
    const created = await prisma.queueItem.create({
      data: {
        title: 'test song',
        url: 'https://example.com/track.mp3',
      },
    });

    expect(created).toBeDefined();

    // simulate claim: set status -> PROCESSING and increment attempts
    const claimed = await prisma.queueItem.update({
      where: { id: created.id },
      data: {
        status: 'PROCESSING',
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
      },
    });

    expect(claimed.status).toBeDefined();

    // simulate successful completion
    const completed = await prisma.queueItem.update({
      where: { id: created.id },
      data: { status: 'DONE' },
    });

    expect(completed.status).toBe('DONE');
  }, 20000);
});
