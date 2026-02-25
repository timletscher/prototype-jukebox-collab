"use client";

import React, { useMemo, useState } from "react";

const QUICK_GENRES = ["Synthwave", "Chill", "House", "Hip Hop", "Jazz", "Focus"];

type SetGenreModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (genre: string) => void;
  currentGenre?: string | null;
};

export default function SetGenreModal({
  isOpen,
  onClose,
  onSave,
  currentGenre,
}: SetGenreModalProps) {
  const [value, setValue] = useState("");
  const [confirming, setConfirming] = useState(false);

  const canSave = useMemo(() => value.trim().length > 0, [value]);
  const trimmedValue = useMemo(() => value.trim(), [value]);
  const needsConfirm = Boolean(currentGenre && trimmedValue && trimmedValue !== currentGenre);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="set-genre-title">
      <div className="modal-card">
        <div className="modal-title" id="set-genre-title">
          Set Genre
        </div>
        <p className="modal-copy">Setting the genre makes you the admin for this room.</p>
        {!confirming ? (
          <>
            <input
              className="input"
              placeholder="Type a genre"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="genre-quick-list">
              {QUICK_GENRES.map((genre) => (
                <button
                  key={genre}
                  className="button-ghost"
                  onClick={() => setValue(genre)}
                  type="button"
                >
                  {genre}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="modal-warning">
            <div className="modal-copy">
              You are about to switch the genre from
              {currentGenre ? ` "${currentGenre}"` : " the current selection"} to
              {trimmedValue ? ` "${trimmedValue}".` : " your new selection."}
            </div>
            <div className="modal-copy">The queue order stays the same.</div>
          </div>
        )}
        <div className="modal-actions">
          <button className="button-ghost" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="button-primary"
            onClick={() => {
              if (!canSave) return;
              if (needsConfirm && !confirming) {
                setConfirming(true);
                return;
              }
              onSave(trimmedValue);
              setValue("");
              setConfirming(false);
            }}
            disabled={!canSave}
            type="button"
          >
            {confirming ? "Confirm" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
