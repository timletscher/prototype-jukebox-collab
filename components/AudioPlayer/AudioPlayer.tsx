"use client"
import React from 'react'

export default function AudioPlayer(){
  return (
    <div className="panel player" style={{ marginTop: "var(--spacing-md)" }}>
      <div className="player-row">
        <div className="player-art" />
        <div style={{ flex: 1 }}>
          <div className="player-label">Now Playing</div>
          <div className="player-title" style={{ marginTop: "var(--spacing-xs)" }}>
            No song playing
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}>
            <div className="progress-track">
              <div className="progress-fill is-paused" style={{ width: "0%" }} />
            </div>
            <div className="time-label">0:00 / 0:00</div>
          </div>
        </div>
      </div>
    </div>
  )
}
