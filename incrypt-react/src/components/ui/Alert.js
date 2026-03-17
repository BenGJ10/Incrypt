import React from "react";
import clsx from "clsx";
import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

const variantStyles = {
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-900",
    icon: <FiInfo className="mr-2 h-5 w-5" />,
  },
  success: {
    container: "bg-green-50 border-green-200 text-green-900",
    icon: <FiCheckCircle className="mr-2 h-5 w-5" />,
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-900",
    icon: <FiAlertCircle className="mr-2 h-5 w-5" />,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-900",
    icon: <FiAlertCircle className="mr-2 h-5 w-5" />,
  },
};

const Alert = ({ variant = "info", children, className }) => {
  const styles = variantStyles[variant] || variantStyles.info;

  return (
    <div
      className={clsx(
        "flex items-start rounded-md border px-4 py-3 text-sm",
        styles.container,
        className
      )}
    >
      <span className="mt-0.5">{styles.icon}</span>
      <div>{children}</div>
    </div>
  );
};

export default Alert;

