import { NextResponse } from "next/server";

type ActiveUser = {
  username: string;
  sessionId: string;
  lastSeen: number;
  isAdmin: boolean;
};

const ACTIVE_WINDOW_MS = 30 * 60 * 1000;

const getStore = () => {
  const globalWithStore = globalThis as typeof globalThis & {
    __presenceStore?: Map<string, ActiveUser>;
  };
  if (!globalWithStore.__presenceStore) {
    globalWithStore.__presenceStore = new Map();
  }
  return globalWithStore.__presenceStore;
};

const pruneExpired = (store: Map<string, ActiveUser>) => {
  const cutoff = Date.now() - ACTIVE_WINDOW_MS;
  for (const [key, value] of store.entries()) {
    if (value.lastSeen < cutoff) {
      store.delete(key);
    }
  }
};

export async function GET() {
  const store = getStore();
  pruneExpired(store);
  const users = Array.from(store.values()).sort((a, b) => b.lastSeen - a.lastSeen);
  return NextResponse.json({ users, count: users.length, now: Date.now() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
  const isAdmin = Boolean(body?.isAdmin);

  if (!username || !sessionId) {
    return NextResponse.json({ error: "username and sessionId are required" }, { status: 400 });
  }

  const store = getStore();
  store.set(sessionId, {
    username,
    sessionId,
    lastSeen: Date.now(),
    isAdmin,
  });
  pruneExpired(store);

  const users = Array.from(store.values()).sort((a, b) => b.lastSeen - a.lastSeen);
  return NextResponse.json({ users, count: users.length, now: Date.now() });
}
