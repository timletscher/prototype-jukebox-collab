"use client";

import React, { useState } from "react";
import useJukeboxStore from "../lib/jukeboxStore";

export default function UsernameEntry() {
  const [name, setName] = useState("");
  const setUser = useJukeboxStore((s) => s.setUser);
  const user = useJukeboxStore((s) => s.user);

  if (user) return null;

  return (
    <div className="panel" style={{ maxWidth: 480 }} aria-labelledby="welcome-title">
      <div className="panel-title" id="welcome-title">Welcome</div>
      <h3 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--spacing-sm)" }}>
        Enter a display name
      </h3>
      <label htmlFor="username-input" className="sr-only">
        Display name
      </label>
      <input
        id="username-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="input"
      />
      <div style={{ marginTop: "var(--spacing-sm)" }}>
        <button
          type="button"
          onClick={() => {
            if (name.trim().length > 0) setUser(name.trim());
          }}
          className="button-primary"
        >
          Save
        </button>
      </div>
    </div>
  );
}
