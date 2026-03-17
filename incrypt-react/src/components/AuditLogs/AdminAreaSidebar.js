import React from "react";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { LiaBlogSolid } from "react-icons/lia";
import { FaUsers } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { useMyContext } from "../../store/ContextApi";

const Sidebar = () => {
  // Access the openSidebar and setOpenSidebar function using the useMyContext hook from the ContextProvider
  const { openSidebar, setOpenSidebar } = useMyContext();

  //access the current path
  const pathName = useLocation().pathname;

  const navItems = [
    {
      to: "/admin/users",
      label: "All Users",
      icon: <FaUsers className="text-[17px]" />,
      isActive: pathName.startsWith("/admin/users"),
    },
    {
      to: "/admin/audit-logs",
      label: "Audit Logs",
      icon: <LiaBlogSolid className="text-xl" />,
      isActive: pathName.startsWith("/admin/audit-logs"),
    },
  ];

  return (
    <div
      className={`fixed left-0 top-[74px] z-20 min-h-[calc(100vh-74px)] max-h-[calc(100vh-74px)] overflow-y-auto border-r border-border-subtle bg-bg-surface px-2 py-3 shadow-sm transition-all duration-200 ${
        openSidebar ? "w-64" : "w-16"
      }`}
    >
      <div className="mb-4 flex min-h-11 items-center">
        <div
          className={`overflow-hidden transition-all duration-200 ${
            openSidebar ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        >
          <p className="text-sm font-semibold text-text-main">Navigation</p>
        </div>

        <Tooltip title={openSidebar ? "Collapse" : "Expand"} placement="right">
          <button
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-subtle text-text-muted transition-colors hover:bg-bg-subtle hover:text-text-main"
            onClick={() => setOpenSidebar(!openSidebar)}
            aria-label={openSidebar ? "Collapse sidebar" : "Expand sidebar"}
          >
            {openSidebar ? (
              <FiChevronsLeft className="text-base" />
            ) : (
              <FiChevronsRight className="text-base" />
            )}
          </button>
        </Tooltip>
      </div>

      <div className="mt-1 flex flex-col gap-1.5">
        {navItems.map((item) => (
          <Tooltip
            key={item.to}
            title={!openSidebar ? item.label : ""}
            placement="right"
          >
            <Link
              to={item.to}
              className={`group flex min-h-11 items-center rounded-lg border px-2 py-2 transition-all duration-150 ${
                item.isActive
                  ? "border-primary/25 bg-bg-subtle text-primary shadow-sm"
                  : "border-transparent text-text-muted hover:border-border-subtle hover:bg-bg-subtle hover:text-text-main"
              } ${!openSidebar ? "justify-center" : "gap-2.5"}`}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                  item.isActive
                    ? "bg-white text-primary"
                    : "bg-bg-subtle text-text-muted group-hover:bg-white group-hover:text-text-main"
                }`}
              >
                {item.icon}
              </span>

              <span
                className={`whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                  openSidebar ? "w-auto opacity-100" : "w-0 opacity-0"
                }`}
              >
                {item.label}
              </span>

              {item.isActive && openSidebar && (
                <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </Link>
          </Tooltip>
        ))}
      </div>

      {openSidebar && (
        <div className="mt-6 rounded-lg border border-border-subtle bg-bg-subtle p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Security
          </p>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            Administrative actions are monitored and protected.
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
