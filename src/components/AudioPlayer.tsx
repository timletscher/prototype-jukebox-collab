"use client";

import React, { useCallback, useEffect, useRef } from "react";
import type { QueueItem } from "../lib/jukeboxStore";
import useJukeboxStore from "../lib/jukeboxStore";

const DEFAULT_DURATION_MS = 30000;
const DEMO_AUDIO_SRC =
  "data:audio/wav;base64," +
  "UklGRlIAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YY4AAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const visRafRef = useRef<number | null>(null);
  const autoPlayNextRef = useRef(false);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPositionMs(0);
  }, [setIsPlaying, setPositionMs]);

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

  const resolveAudioSrc = useCallback((item?: QueueItem) => {
    if (item?.url) return item.url;
    return DEMO_AUDIO_SRC;
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioRef.current) {
        audioRef.current.src = "";
      }
      if (visRafRef.current) {
        cancelAnimationFrame(visRafRef.current);
        visRafRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      analyserRef.current = null;
      sourceRef.current = null;
    };
  }, [stopPlayback]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }
    if (!currentItem && queue.length > 0) {
      setCurrentItem(queue[0]);
      autoPlayNextRef.current = true;
      return;
    }
    if (!audioRef.current) return;
    if (audioCtxRef.current) {
      audioCtxRef.current.resume().catch(() => {});
    }
    try {
      await audioRef.current.play();
    } catch {
      // ignore
    }
  };

  const handleLoadFromQueue = () => {
    if (queue.length === 0) return;
    setCurrentItem(queue[0]);
    setPositionMs(0);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx && !sourceRef.current) {
      sourceRef.current = ctx.createMediaElementSource(audio);
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = 256;
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(ctx.destination);
    }
    if (!currentItem) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setDurationMs(DEFAULT_DURATION_MS);
      return;
    }
    const nextSrc = resolveAudioSrc(currentItem);
    if (audio.src !== nextSrc) {
      audio.src = nextSrc;
    }
    audio.load();
    setPositionMs(0);
    if (autoPlayNextRef.current) {
      autoPlayNextRef.current = false;
      audio.play().catch(() => {});
    }
  }, [currentItem, resolveAudioSrc, setDurationMs, setPositionMs]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setPositionMs(audioRef.current.currentTime * 1000);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const duration = Number.isFinite(audioRef.current.duration)
      ? Math.max(audioRef.current.duration * 1000, DEFAULT_DURATION_MS)
      : DEFAULT_DURATION_MS;
    setDurationMs(duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    const advanced = advanceToNext();
    if (advanced) {
      autoPlayNextRef.current = true;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(data);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      const barWidth = width / bufferLength;
      for (let i = 0; i < bufferLength; i += 1) {
        const value = data[i] / 255;
        const barHeight = value * height;
        ctx.fillStyle = `rgba(59, 130, 246, ${0.2 + value * 0.8})`;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
      }
      visRafRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      visRafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (visRafRef.current) {
        cancelAnimationFrame(visRafRef.current);
        visRafRef.current = null;
      }
    };
  }, [currentItem, isPlaying]);

  const progressPct = durationMs > 0 ? Math.min((positionMs / durationMs) * 100, 100) : 0;

  return (
    <section style={{ padding: 12, border: "1px solid #eee" }}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
      />
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
      <div style={{ marginTop: 10 }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: 60, background: "#0b1320", borderRadius: 6 }}
        />
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
