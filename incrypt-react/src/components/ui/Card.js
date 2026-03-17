import React from "react";
import clsx from "clsx";

const Card = ({ className, children }) => {
  return (
    <div
      className={clsx(
        "bg-bg-surface border border-border-subtle rounded-lg shadow-card-md",
        "px-6 py-5",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;

