"use client";

import React, { useState } from "react";
import useJukeboxStore from "../lib/jukeboxStore";

export default function UsernameEntry() {
  const [name, setName] = useState("");
  const setUser = useJukeboxStore((s) => s.setUser);
  const user = useJukeboxStore((s) => s.user);

  if (user) return null;

  return (
    <div style={{ padding: 16, maxWidth: 480 }}>
      <h3>Enter a display name</h3>
      <input
        aria-label="username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        style={{ padding: 8, width: "100%", boxSizing: "border-box" }}
      />
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => {
            if (name.trim().length > 0) setUser(name.trim());
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
