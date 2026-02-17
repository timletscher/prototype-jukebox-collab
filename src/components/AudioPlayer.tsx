"use client";

import React, { useCallback, useEffect, useRef } from "react";
import useJukeboxStore from "../lib/jukeboxStore";

const DEFAULT_DURATION_MS = 30000;

export default function AudioPlayer() {
  const queue = useJukeboxStore((s) => s.queue);
  const currentItem = useJukeboxStore((s) => s.currentItem);
  const isPlaying = useJukeboxStore((s) => s.isPlaying);
  const positionMs = useJukeboxStore((s) => s.positionMs);
  const durationMs = useJukeboxStore((s) => s.durationMs);
  const volume = useJukeboxStore((s) => s.volume);
  const setCurrentItem = useJukeboxStore((s) => s.setCurrentItem);
  const setIsPlaying = useJukeboxStore((s) => s.setIsPlaying);
  const setPositionMs = useJukeboxStore((s) => s.setPositionMs);
  const setDurationMs = useJukeboxStore((s) => s.setDurationMs);
  const setVolume = useJukeboxStore((s) => s.setVolume);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopOscillator = useCallback(() => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch {
        // ignore
      }
      oscRef.current.disconnect();
      oscRef.current = null;
    }
  }, []);

  const stopPlayback = useCallback(() => {
    stopOscillator();
    setIsPlaying(false);
    setPositionMs(0);
    startRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [setIsPlaying, setPositionMs, stopOscillator]);

  const advanceToNext = useCallback(() => {
    if (queue.length === 0) {
      setCurrentItem(undefined);
      return false;
    }
    if (!currentItem) {
      setCurrentItem(queue[0]);
      return true;
    }
    const currentIndex = queue.findIndex((item) => item.id === currentItem.id);
    const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
    if (nextIndex >= queue.length) {
      setCurrentItem(undefined);
      return false;
    }
    setCurrentItem(queue[nextIndex]);
    return true;
  }, [currentItem, queue, setCurrentItem]);

  const tick = useCallback(() => {
    if (!audioCtxRef.current || startRef.current === null) return;
    const elapsed = (audioCtxRef.current.currentTime - startRef.current) * 1000;
    const next = Math.min(elapsed, durationMs);
    setPositionMs(next);
    if (next >= durationMs) {
      stopPlayback();
      const advanced = advanceToNext();
      if (advanced) {
        startPlayback();
      }
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [advanceToNext, durationMs, setPositionMs, startPlayback, stopPlayback]);

  const startPlayback = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const gainNode = gainRef.current ?? ctx.createGain();
    gainNode.gain.value = volume;
    gainRef.current = gainNode;
    gainNode.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 440;
    osc.connect(gainNode);
    osc.start();
    oscRef.current = osc;

    const duration = currentItem ? durationMs : DEFAULT_DURATION_MS;
    setDurationMs(duration);
    startRef.current = ctx.currentTime;
    setIsPlaying(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [currentItem, durationMs, setDurationMs, setIsPlaying, tick, volume]);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (gainRef.current) {
        gainRef.current.disconnect();
        gainRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [stopPlayback]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }
    try {
      await audioCtxRef.current?.resume();
    } catch {
      // ignore
    }
    startPlayback();
  };

  const handleLoadFromQueue = () => {
    if (queue.length === 0) return;
    setCurrentItem(queue[0]);
    setPositionMs(0);
  };

  const progressPct = durationMs > 0 ? Math.min((positionMs / durationMs) * 100, 100) : 0;

  return (
    <section style={{ padding: 12, border: "1px solid #eee" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 64, height: 64, background: "#0e1a22", borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>
            {currentItem ? currentItem.title : "No song selected"}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {currentItem?.addedBy ? `Added by ${currentItem.addedBy}` : "Demo tone"}
          </div>
          <div style={{ height: 6, background: "#e9e9e9", borderRadius: 4, marginTop: 8 }}>
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                background: "#3b82f6",
                borderRadius: 4,
                transition: "width 100ms linear",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
          <button onClick={stopPlayback}>Stop</button>
          <button onClick={handleLoadFromQueue} disabled={queue.length === 0}>
            Load first
          </button>
        </div>
      </div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ fontSize: 12, color: "#666" }}>Volume</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="volume"
          style={{ flex: 1 }}
        />
        <div style={{ fontSize: 12, color: "#666", width: 48, textAlign: "right" }}>
          {Math.round(volume * 100)}%
        </div>
      </div>
    </section>
  );
}
