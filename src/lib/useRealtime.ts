"use client";

import { useEffect, useRef } from "react";
import type { ActiveUser } from "./jukeboxStore";
import { getSupabaseClient } from "./supabaseClient";

const HEARTBEAT_MS = 30000;
const PRESENCE_ROOM = "jukebox";

type PresencePayload = {
  username: string;
  isAdmin: boolean;
  lastSeen: number;
  sessionId: string;
};

type PresenceOptions = {
  enabled?: boolean;
  username: string;
  sessionId: string;
  isAdmin: boolean;
  onUsers: (users: ActiveUser[]) => void;
};

export const usePresenceRealtime = ({
  enabled = true,
  username,
  sessionId,
  isAdmin,
  onUsers,
}: PresenceOptions) => {
  const heartbeatRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !username || !sessionId) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel(`presence:${PRESENCE_ROOM}`, {
      config: { presence: { key: sessionId } },
    });

    const syncUsers = () => {
      const state = channel.presenceState() as Record<string, PresencePayload[]>;
      const users: ActiveUser[] = [];

      Object.values(state).forEach((presences) => {
        presences.forEach((presence) => {
          if (!presence?.username) return;
          users.push({
            username: presence.username,
            isAdmin: Boolean(presence.isAdmin),
            lastSeen: presence.lastSeen ?? Date.now(),
            sessionId: presence.sessionId ?? sessionId,
          });
        });
      });

      onUsers(users);
    };

    const trackPresence = () => {
      void channel.track({
        username,
        isAdmin,
        lastSeen: Date.now(),
        sessionId,
      });
    };

    channel.on("presence", { event: "sync" }, syncUsers);

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        trackPresence();
        heartbeatRef.current = window.setInterval(trackPresence, HEARTBEAT_MS);
      }
    });

    return () => {
      if (heartbeatRef.current) {
        window.clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      channel.unsubscribe();
    };
  }, [enabled, isAdmin, onUsers, sessionId, username]);
};
