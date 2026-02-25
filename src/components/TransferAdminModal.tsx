"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type TransferTarget = {
  username: string;
  isAdmin: boolean;
  sessionId: string;
};

type TransferAdminModalProps = {
  isOpen: boolean;
  targets: TransferTarget[];
  onClose: () => void;
  onTransfer: (username: string) => void;
};

export default function TransferAdminModal({
  isOpen,
  targets,
  onClose,
  onTransfer,
}: TransferAdminModalProps) {
  const [selected, setSelected] = useState<string>("");
  const firstOptionRef = useRef<HTMLInputElement | null>(null);

  const validTargets = useMemo(
    () => targets.filter((target) => !target.isAdmin),
    [targets]
  );

  useEffect(() => {
    if (!isOpen) return;
    firstOptionRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transfer-admin-title"
      aria-describedby="transfer-admin-copy"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <div className="modal-card" role="document">
        <div className="modal-title" id="transfer-admin-title">
          Transfer Admin
        </div>
        <p className="modal-copy" id="transfer-admin-copy">
          Select a user to transfer admin rights.
        </p>
        <div className="transfer-list">
          {validTargets.length === 0 ? (
            <div className="panel-subtitle">No other active users yet.</div>
          ) : (
            validTargets.map((target) => (
              <label key={target.sessionId} className="transfer-option">
                <input
                  type="radio"
                  name="transfer-target"
                  value={target.username}
                  checked={selected === target.username}
                  onChange={() => setSelected(target.username)}
                  ref={index === 0 ? firstOptionRef : null}
                />
                <span>{target.username}</span>
              </label>
            ))
          )}
        </div>
        <div className="modal-actions">
          <button className="button-ghost" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="button-primary"
            onClick={() => {
              if (!selected) return;
              onTransfer(selected);
              setSelected("");
            }}
            disabled={!selected}
            type="button"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
