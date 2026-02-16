import type { QueueItem } from '../types/jukebox';

const base = '/api/queue';

export async function fetchQueue(): Promise<QueueItem[]> {
  try {
    const res = await fetch(base);
    if (!res.ok) {
      // don't throw — return empty queue to keep UI resilient
      // eslint-disable-next-line no-console
      console.warn('fetchQueue: non-OK response', res.status);
      return [];
    }
    return res.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('fetchQueue failed', err);
    return [];
  }
}

export async function addQueueItem(payload: { title: string; url?: string | null; addedBy?: string | null }) {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('failed to add item');
  return res.json();
}

export async function deleteQueueItem(id: string) {
  const res = await fetch(`${base}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('failed to delete');
  return res.json();
}

export async function clearQueue() {
  const res = await fetch(`${base}/clear`, { method: 'POST' });
  if (!res.ok) throw new Error('failed to clear');
  return res.json();
}
