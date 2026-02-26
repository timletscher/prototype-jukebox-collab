import React from "react";
import UsernameEntry from "../components/UsernameEntry";
import SearchPanel from "../components/SearchPanel";
import QueuePanel from "../components/QueuePanel";
import ActiveUsersBadge from "../components/ActiveUsersBadge";
import GenreAdminBar from "../components/GenreAdminBar";

export default function Page() {
  return (
    <main className="page-main">
      <UsernameEntry />
      <ActiveUsersBadge />
      <GenreAdminBar />
      <div className="page-grid">
        <SearchPanel />
        <QueuePanel />
      </div>
    </main>
  );
}
