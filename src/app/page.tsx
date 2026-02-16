import React from "react";
import UsernameEntry from "../components/UsernameEntry";
import SearchPanel from "../components/SearchPanel";
import QueuePanel from "../components/QueuePanel";

export default function Page() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <UsernameEntry />

      <div style={{ display: "flex", gap: 16, marginTop: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <SearchPanel />
        </div>
        <div style={{ width: 360 }}>
          <QueuePanel />
        </div>
      </div>
    </main>
  );
}
