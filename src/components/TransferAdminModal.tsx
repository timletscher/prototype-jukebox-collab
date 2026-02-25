"use client";

import React, { useMemo, useState } from "react";

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

  const validTargets = useMemo(
    () => targets.filter((target) => !target.isAdmin),
    [targets]
  );

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="transfer-admin-title">
      <div className="modal-card">
        <div className="modal-title" id="transfer-admin-title">
          Transfer Admin
        </div>
        <p className="modal-copy">Select a user to transfer admin rights.</p>
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
