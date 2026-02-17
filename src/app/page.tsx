import React from "react";
import UsernameEntry from "../components/UsernameEntry";
import SearchPanel from "../components/SearchPanel";
import QueuePanel from "../components/QueuePanel";

export default function Page() {
  return (
    <main className="page-main">
      <UsernameEntry />
      <div className="page-grid">
        <SearchPanel />
        <QueuePanel />
      </div>
    </main>
  );
}
