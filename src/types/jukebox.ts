export type QueueItem = {
  id: string;
  title: string;
  url?: string | null;
  addedBy?: string | null;
  createdAt: string; // ISO date string
  order?: number | null;
};
