import type {
  QueueClearResponse,
  QueueCreateRequest,
  QueueCreateResponse,
  QueueDeleteResponse,
  QueueListResponse,
  QueueReorderRequest,
  QueueReorderResponse,
  HistoryCreateRequest,
  HistoryCreateResponse,
  HistoryListResponse,
  SearchResponse,
} from '../types/jukebox';

const base = '/api/queue';

export async function fetchQueue(): Promise<QueueListResponse> {
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

export async function addQueueItem(payload: QueueCreateRequest): Promise<QueueCreateResponse> {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('failed to add item');
  return res.json();
}

export async function deleteQueueItem(id: string): Promise<QueueDeleteResponse> {
  const res = await fetch(`${base}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('failed to delete');
  return res.json();
}

export async function clearQueue(): Promise<QueueClearResponse> {
  const res = await fetch(`${base}/clear`, { method: 'POST' });
  if (!res.ok) throw new Error('failed to clear');
  return res.json();
}

export async function reorderQueue(payload: QueueReorderRequest): Promise<QueueReorderResponse> {
  const res = await fetch(`${base}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('failed to reorder');
  return res.json();
}

export async function searchSongs(query: string): Promise<SearchResponse> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn('searchSongs: non-OK response', res.status);
      return [];
    }
    return res.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('searchSongs failed', err);
    return [];
  }
}

export async function fetchHistory(): Promise<HistoryListResponse> {
  try {
    const res = await fetch('/api/history');
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('fetchHistory failed', err);
    return [];
  }
}

export async function createHistoryEntry(
  payload: HistoryCreateRequest
): Promise<HistoryCreateResponse> {
  const res = await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('failed to create history entry');
  return res.json();
}
