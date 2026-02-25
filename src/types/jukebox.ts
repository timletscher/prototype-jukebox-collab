export type QueueStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

export type QueueItem = {
  id: string;
  title: string;
  artist?: string | null;
  url?: string | null;
  addedBy?: string | null;
  createdAt: string; // ISO date string
  order?: number | null;
  status?: QueueStatus | null;
  attempts?: number | null;
  lastAttemptAt?: string | null; // ISO date string
};

export type ApiOk = { ok: true };
export type ApiError = { error: string };

export type QueueListResponse = QueueItem[];
export type QueueCreateRequest = {
  title: string;
  url?: string | null;
  addedBy?: string | null;
  artist?: string | null;
};
export type QueueCreateResponse = QueueItem;
export type QueueDeleteResponse = ApiOk | ApiError;
export type QueueClearResponse = ApiOk | ApiError;
export type QueueReorderDirection = 'up' | 'down';
export type QueueReorderRequest = {
  id: string;
  direction: QueueReorderDirection;
};
export type QueueReorderResponse = QueueListResponse;

export type SearchResponse = QueueItem[];
export type SearchErrorResponse = ApiError;

export type VoteType = 'thumbsDown' | 'thumbsUp' | 'doubleThumbsUp';
export type VoteCounts = {
  thumbsDown: number;
  thumbsUp: number;
  doubleThumbsUp: number;
};

export type WorkerAction = 'peek' | 'claim' | 'complete';
export type WorkerRequest = {
  action?: WorkerAction;
  limit?: number;
  ids?: string[];
  success?: boolean;
};
export type WorkerResponse =
  | { action: 'peek'; count: number; items: QueueItem[] }
  | { action: 'claimed'; count: number; items: QueueItem[] }
  | { action: 'completed'; count: number }
  | { action: 'complete'; retried: number; failed: number }
  | ApiError;
