"use client"
import React from 'react'

export default function UsernameEntry(){
  return (
    <div style={{ marginTop: "var(--spacing-sm)" }}>
      <label className="panel-title" style={{ display: "block" }}>
        Enter a display name
      </label>
      <input placeholder="your name" className="input" />
    </div>
  )
}
