"use client";

import React, { useMemo, useState } from "react";
import useJukeboxStore from "../lib/jukeboxStore";
import SetGenreModal from "./SetGenreModal";
import TransferAdminModal from "./TransferAdminModal";

export default function GenreAdminBar() {
  const user = useJukeboxStore((s) => s.user);
  const currentGenre = useJukeboxStore((s) => s.currentGenre);
  const adminUser = useJukeboxStore((s) => s.adminUser);
  const activeUsers = useJukeboxStore((s) => s.activeUsers);
  const setGenre = useJukeboxStore((s) => s.setGenre);
  const transferAdmin = useJukeboxStore((s) => s.transferAdmin);

  const [showGenreModal, setShowGenreModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const isAdmin = Boolean(user && adminUser && user === adminUser);
  const canTransfer = useMemo(
    () => activeUsers.some((active) => active.username !== adminUser),
    [activeUsers, adminUser]
  );

  return (
    <section className="genre-admin-bar">
      <div className="genre-info">
        <div className="genre-label">Genre</div>
        <div className="genre-value">
          {currentGenre ? currentGenre : "No genre set"}
        </div>
      </div>
      <div className="genre-admin">
        <div className="genre-label">Admin</div>
        <div className="genre-value">
          {adminUser ? adminUser : "None"}
        </div>
      </div>
      <div className="genre-actions">
        <button
          className="button-primary"
          onClick={() => setShowGenreModal(true)}
          disabled={!user}
        >
          Set Genre
        </button>
        <button
          className="button-ghost"
          onClick={() => setShowTransferModal(true)}
          disabled={!isAdmin || !canTransfer}
        >
          Transfer Admin
        </button>
      </div>

      <SetGenreModal
        isOpen={showGenreModal}
        onClose={() => setShowGenreModal(false)}
        currentGenre={currentGenre}
        onSave={(genre) => {
          setGenre(genre);
          setShowGenreModal(false);
        }}
      />
      <TransferAdminModal
        isOpen={showTransferModal}
        targets={activeUsers}
        onClose={() => setShowTransferModal(false)}
        onTransfer={(username) => {
          transferAdmin(username);
          setShowTransferModal(false);
        }}
      />
    </section>
  );
}
