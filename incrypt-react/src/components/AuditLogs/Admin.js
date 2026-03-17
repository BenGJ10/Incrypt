import React from "react";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./AdminAreaSidebar";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
import { useMyContext } from "../../store/ContextApi";
import AuditLogsDetails from "./AuditLogsDetails";
import AdminAuditLogs from "./AdminAuditLogs";

const Admin = () => {
  // Access the openSidebar hook using the useMyContext hook from the ContextProvider
  const { openSidebar } = useMyContext();
  const pathName = useLocation().pathname;

  const sectionMeta = pathName.includes("/admin/audit-logs")
    ? {
        title: "Audit Logs",
        description: "Review system activity and audit events across user actions.",
      }
    : {
        title: "Users",
        description: "Manage user accounts and review profile and status details.",
      };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-bg-subtle">
      <AdminSidebar />
      <main
        className={`transition-all duration-200 min-h-[calc(100vh-74px)] ${
          openSidebar ? "lg:ml-64 ml-16" : "ml-16"
        }`}
      >
        <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="rounded-lg border border-border-subtle bg-bg-surface px-4 py-4 shadow-sm sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Admin Console
              </p>
              <h1 className="mt-1 text-h2 font-semibold text-text-main">
                {sectionMeta.title}
              </h1>
              <p className="mt-1 text-body text-text-muted">
                {sectionMeta.description}
              </p>
            </div>

            <section className="mt-4 overflow-hidden rounded-lg border border-border-subtle bg-bg-surface shadow-card-md">
              <Routes>
                <Route path="audit-logs" element={<AdminAuditLogs />} />
                <Route path="audit-logs/:noteId" element={<AuditLogsDetails />} />
                <Route path="users" element={<UserList />} />
                <Route path="users/:userId" element={<UserDetails />} />
                {/* Add other routes as necessary */}
              </Routes>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
