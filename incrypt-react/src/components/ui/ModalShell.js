import React from "react";
import clsx from "clsx";

const ModalShell = ({ open, onClose, title, children, footer, className }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={clsx(
          "w-full max-w-md rounded-lg bg-bg-surface shadow-card-md border border-border-subtle",
          "px-6 py-5",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-h3 font-semibold text-text-main">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-main"
          >
            ×
          </button>
        </div>
        <div className="text-body text-text-main">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

export default ModalShell;

