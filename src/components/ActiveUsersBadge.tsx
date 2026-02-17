"use client";

import { useEffect, useState } from "react";
import useJukeboxStore, { ActiveUser } from "../lib/jukeboxStore";

const HEARTBEAT_MS = 30000;

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

  return (
    <div className="active-users">
      {user ? `${count} active` : "Guest"}
    </div>
  );
}
