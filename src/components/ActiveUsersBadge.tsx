"use client";

import { useEffect, useState } from "react";
import useJukeboxStore, { ActiveUser } from "../lib/jukeboxStore";
import { usePresenceRealtime } from "../lib/useRealtime";

const HEARTBEAT_MS = 30000;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const getSessionId = () => {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem("jukebox.sessionId");
    if (existing) return existing;
    const generated = crypto.randomUUID();
    window.localStorage.setItem("jukebox.sessionId", generated);
    return generated;
  } catch {
    return null;
  }
};

export default function ActiveUsersBadge() {
  const user = useJukeboxStore((s) => s.user);
  const setActiveUsers = useJukeboxStore((s) => s.setActiveUsers);
  const count = useJukeboxStore((s) => s.activeUserCount);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) return;
    if (HAS_SUPABASE) return;
    const sessionId = getSessionId();
    if (!sessionId) return;

    let stopped = false;

    const sendHeartbeat = async () => {
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user, sessionId, isAdmin: false }),
        });
        if (!res.ok) return;
        const json = (await res.json()) as { users?: ActiveUser[] };
        if (!stopped && Array.isArray(json.users)) {
          setActiveUsers(json.users);
        }
      } catch {
        // ignore
      }
    };

    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, HEARTBEAT_MS);

    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, [ready, setActiveUsers, user]);

  usePresenceRealtime({
    enabled: HAS_SUPABASE,
    username: user ?? "",
    sessionId: getSessionId() ?? "",
    isAdmin: false,
    onUsers: setActiveUsers,
  });

  return (
    <div className="active-users">
      {user ? `${count} active` : "Guest"}
    </div>
  );
}
