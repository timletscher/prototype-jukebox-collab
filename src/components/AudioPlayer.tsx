"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { QueueItem } from "../lib/jukeboxStore";
import useJukeboxStore from "../lib/jukeboxStore";
import { useVoteRealtime } from "../lib/useRealtime";

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
  const votesBySongId = useJukeboxStore((s) => s.votesBySongId);
  const userVotesBySongId = useJukeboxStore((s) => s.userVotesBySongId);
  const setCurrentItem = useJukeboxStore((s) => s.setCurrentItem);
  const setIsPlaying = useJukeboxStore((s) => s.setIsPlaying);
  const setPositionMs = useJukeboxStore((s) => s.setPositionMs);
  const setDurationMs = useJukeboxStore((s) => s.setDurationMs);
  const setVolume = useJukeboxStore((s) => s.setVolume);
  const applyVoteChange = useJukeboxStore((s) => s.applyVoteChange);
  const castVoteOptimistic = useJukeboxStore((s) => s.castVoteOptimistic);
  const user = useJukeboxStore((s) => s.user);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const oscilloscopeRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const visRafRef = useRef<number | null>(null);
  const autoPlayNextRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const existing = window.localStorage.getItem("jukebox.sessionId");
      if (existing) {
        setSessionId(existing);
        return;
      }
      const generated = crypto.randomUUID();
      window.localStorage.setItem("jukebox.sessionId", generated);
      setSessionId(generated);
    } catch {
      try {
        setSessionId(crypto.randomUUID());
      } catch {
        setSessionId(null);
      }
    }
  }, []);

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
    const audio = audioRef.current;
    const ctx = audioCtxRef.current;

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
      }
      setIsPlaying(false);
      setPositionMs(0);
      if (visRafRef.current) {
        cancelAnimationFrame(visRafRef.current);
        visRafRef.current = null;
      }
      if (ctx) {
        ctx.close();
        audioCtxRef.current = null;
      }
      analyserRef.current = null;
      sourceRef.current = null;
    };
  }, [setIsPlaying, setPositionMs]);

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
    const oscilloscopeCanvas = oscilloscopeRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !oscilloscopeCanvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    const oscCtx = oscilloscopeCanvas.getContext("2d");
    if (!ctx || !oscCtx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const oscRect = oscilloscopeCanvas.getBoundingClientRect();
      oscilloscopeCanvas.width = Math.max(1, Math.floor(oscRect.width * dpr));
      oscilloscopeCanvas.height = Math.max(1, Math.floor(oscRect.height * dpr));
      oscCtx.setTransform(1, 0, 0, 1, 0, 0);
      oscCtx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const bufferLength = analyser.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(analyser.fftSize);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const draw = () => {
      analyser.getByteFrequencyData(freqData);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      const barWidth = width / bufferLength;
      for (let i = 0; i < bufferLength; i += 1) {
        const value = freqData[i] / 255;
        const barHeight = value * height;
        ctx.fillStyle = `rgba(0, 240, 255, ${0.2 + value * 0.8})`;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
      }

      analyser.getByteTimeDomainData(timeData);
      const oscWidth = oscilloscopeCanvas.clientWidth;
      const oscHeight = oscilloscopeCanvas.clientHeight;
      oscCtx.clearRect(0, 0, oscWidth, oscHeight);
      oscCtx.lineWidth = 2;
      oscCtx.strokeStyle = "rgba(255, 16, 240, 0.9)";
      oscCtx.beginPath();
      const sliceWidth = oscWidth / timeData.length;
      let x = 0;
      for (let i = 0; i < timeData.length; i += 1) {
        const value = timeData[i] / 128.0;
        const y = (value * oscHeight) / 2;
        if (i === 0) {
          oscCtx.moveTo(x, y);
        } else {
          oscCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      oscCtx.stroke();

      visRafRef.current = requestAnimationFrame(draw);
    };

    const startVisualization = () => {
      if (!isPlaying || prefersReducedMotion.matches) return;
      visRafRef.current = requestAnimationFrame(draw);
    };

    const stopVisualization = () => {
      if (visRafRef.current) {
        cancelAnimationFrame(visRafRef.current);
        visRafRef.current = null;
      }
    };

    const handleMotionChange = () => {
      stopVisualization();
      startVisualization();
    };

    startVisualization();
    if (prefersReducedMotion.addEventListener) {
      prefersReducedMotion.addEventListener("change", handleMotionChange);
    } else if (prefersReducedMotion.addListener) {
      prefersReducedMotion.addListener(handleMotionChange);
    }

    return () => {
      window.removeEventListener("resize", resize);
      stopVisualization();
      if (prefersReducedMotion.removeEventListener) {
        prefersReducedMotion.removeEventListener("change", handleMotionChange);
      } else if (prefersReducedMotion.removeListener) {
        prefersReducedMotion.removeListener(handleMotionChange);
      }
    };
  }, [currentItem, isPlaying]);

  const progressPct = durationMs > 0 ? Math.min((positionMs / durationMs) * 100, 100) : 0;
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const timeLabel = `${formatTime(positionMs)} / ${formatTime(durationMs)}`;
  const volumeLabel = volume === 0 ? "Mute" : volume < 0.5 ? "Low" : "High";
  const currentSongId = currentItem?.id ?? null;
  const voteCounts = useMemo(() => {
    if (!currentSongId) return { thumbsDown: 0, thumbsUp: 0, doubleThumbsUp: 0 };
    return votesBySongId[currentSongId] ?? { thumbsDown: 0, thumbsUp: 0, doubleThumbsUp: 0 };
  }, [currentSongId, votesBySongId]);
  const userVote = currentSongId ? userVotesBySongId[currentSongId] : undefined;

  useVoteRealtime({
    sessionId,
    onVote: (payload) => {
      if (!payload?.songId) return;
      applyVoteChange(payload.songId, payload.previousVote ?? null, payload.voteType);
    },
  });

  const handleVote = (voteType: "thumbsDown" | "thumbsUp" | "doubleThumbsUp") => {
    if (!currentSongId || !user) return;
    castVoteOptimistic(currentSongId, voteType, sessionId ?? null);
  };

  return (
    <section className="panel player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
      />
      <div className="player-row">
        <div className="player-art" />
        <div style={{ flex: 1 }}>
          <div className="player-label">Now Playing</div>
          <div className="player-title" style={{ marginTop: "var(--spacing-xs)" }}>
            {currentItem ? currentItem.title : "No song selected"}
          </div>
          <div className="player-meta" style={{ marginTop: "var(--spacing-xs)" }}>
            {currentItem?.addedBy ? `Added by ${currentItem.addedBy}` : "Demo tone"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}>
            <div className="progress-track">
              <div
                className={`progress-fill${isPlaying ? "" : " is-paused"}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="time-label">
              {timeLabel}
            </div>
          </div>
        </div>
        <div className="player-controls" role="group" aria-label="player controls">
          <button onClick={handlePlayPause} className="button-primary">
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={stopPlayback} className="button-ghost">
            Stop
          </button>
          <button onClick={handleLoadFromQueue} disabled={queue.length === 0}>
            Load first
          </button>
        </div>
      </div>
      <div className="visualizer-stack">
        <canvas ref={canvasRef} className="visualizer" />
        <canvas
          ref={oscilloscopeRef}
          className={`visualizer oscilloscope${isPlaying ? " oscilloscope-playing" : ""}`}
        />
      </div>
      <div className="volume-row">
        <div className="volume-icon" aria-hidden="true">
          {volumeLabel}
        </div>
        <label className="volume-label">Volume</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="volume"
          style={{ flex: 1 }}
          className="range"
        />
        <div className="time-label">
          {Math.round(volume * 100)}%
        </div>
      </div>
      <div
        className="vote-row"
        style={{
          marginTop: "var(--spacing-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--spacing-sm)",
        }}
      >
        <div className="player-label">Votes</div>
        <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
          <button
            onClick={() => handleVote("thumbsDown")}
            className="button-ghost"
            disabled={!currentSongId || !user}
            aria-pressed={userVote === "thumbsDown"}
          >
            👎 {voteCounts.thumbsDown}
          </button>
          <button
            onClick={() => handleVote("thumbsUp")}
            className="button-ghost"
            disabled={!currentSongId || !user}
            aria-pressed={userVote === "thumbsUp"}
          >
            👍 {voteCounts.thumbsUp}
          </button>
          <button
            onClick={() => handleVote("doubleThumbsUp")}
            className="button-ghost"
            disabled={!currentSongId || !user}
            aria-pressed={userVote === "doubleThumbsUp"}
          >
            👍👍 {voteCounts.doubleThumbsUp}
          </button>
        </div>
      </div>
    </section>
  );
}
