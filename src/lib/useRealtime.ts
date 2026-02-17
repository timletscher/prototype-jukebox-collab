"use client";

import { useEffect, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { ActiveUser } from "./jukeboxStore";
import { getSupabaseClient } from "./supabaseClient";

const HEARTBEAT_MS = 30000;
const PRESENCE_ROOM = "jukebox";
const QUEUE_CHANNEL = "queue";
const QUEUE_EVENT = "queue:changed";

let queueChannel: RealtimeChannel | null = null;
let queueChannelReady: Promise<void> | null = null;

const getQueueChannel = () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  if (!queueChannel) {
    queueChannel = supabase.channel(QUEUE_CHANNEL, {
      config: { broadcast: { ack: true } },
    });
  }

  if (!queueChannelReady) {
    queueChannelReady = new Promise((resolve) => {
      queueChannel?.subscribe((status) => {
        if (status === "SUBSCRIBED") resolve();
      });
    });
  }

  return { channel: queueChannel, ready: queueChannelReady };
};

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

type QueueRealtimeOptions = {
  enabled?: boolean;
  onChange: () => void;
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

export const useQueueRealtime = ({ enabled = true, onChange }: QueueRealtimeOptions) => {
  useEffect(() => {
    if (!enabled) return;
    const channelInfo = getQueueChannel();
    if (!channelInfo) return;

    const { channel } = channelInfo;
    const handler = () => onChange();

    channel.on("broadcast", { event: QUEUE_EVENT }, handler);

    return () => {
      channel.off("broadcast", { event: QUEUE_EVENT }, handler);
    };
  }, [enabled, onChange]);
};

export const broadcastQueueChange = async () => {
  const channelInfo = getQueueChannel();
  if (!channelInfo) return;
  const { channel, ready } = channelInfo;
  await ready;
  await channel.send({ type: "broadcast", event: QUEUE_EVENT, payload: { ts: Date.now() } });
};
