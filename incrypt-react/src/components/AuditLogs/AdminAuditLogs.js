import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { getAuditActionBadgeClasses } from "../../utils/auditLogActionStyle.js";
import Errors from "../Errors.js";
import moment from "moment";
import { MdDateRange } from "react-icons/md";
import Card from "../ui/Card";

const getPrivacySafeNoteLabel = (action) => {
  const actionUpper = String(action || "").toUpperCase();

  if (actionUpper === "CREATE") return "Created Note";
  if (actionUpper === "UPDATE") return "Updated Note";
  if (actionUpper === "DELETE") return "Deleted Note";
  return "Note Activity";
};

const gridSx = {
  border: 0,
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#F4F5F7",
    borderBottom: "1px solid #DFE1E6",
  },
  "& .MuiDataGrid-row": {
    backgroundColor: "#FFFFFF !important",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid #DFE1E6",
    color: "#172B4D",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid #DFE1E6",
    backgroundColor: "#FFFFFF",
  },
};

//Material ui data grid has used for the table
//initialize the columns for the tables and (field) value is used to show data in a specific column dynamically
export const auditLogcolumns = [
  {
    field: "actions",
    headerName: "Action",
    width: 160,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center",
    editable: false,
    renderHeader: () => <span>Action</span>,
    renderCell: (params) => {
      const action = params?.value;

      return (
        <span
          className={`inline-flex min-w-[90px] justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getAuditActionBadgeClasses(
            action
          )}`}
        >
          {action}
        </span>
      );
    },
  },

  {
    field: "username",
    headerName: "UserName",
    width: 180,
    editable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderHeader: () => <span>UserName</span>,
  },

  {
    field: "timestamp",
    headerName: "TimeStamp",
    disableColumnMenu: true,
    width: 220,
    editable: false,
    headerAlign: "center",
    align: "center",
    renderHeader: () => <span>TimeStamp</span>,
    renderCell: (params) => {
      return (
        <div className="flex items-center justify-center gap-1 text-text-main">
          <span>
            <MdDateRange className="text-base" />
          </span>
          <span>{params?.row?.timestamp}</span>
        </div>
      );
    },
  },
  {
    field: "noteid",
    headerName: "NoteId",
    disableColumnMenu: true,
    width: 150,
    editable: false,
    headerAlign: "center",
    align: "center",
    renderHeader: () => <span>NoteId</span>,
  },
  {
    field: "note",
    headerName: "Note Content",
    width: 220,
    editable: false,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center",
    renderHeader: () => <span>Note Content</span>,
    renderCell: (params) => {
      const response = getPrivacySafeNoteLabel(params?.row?.actions);
      return <p className="text-center text-text-main">{response}</p>;
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    editable: false,
    headerAlign: "center",
    align: "center",
    sortable: false,

    renderHeader: () => <span>Action</span>,
    renderCell: (params) => {
      return (
        <Link
          to={`/admin/audit-logs/${params.row.noteId}`}
          className="flex h-full items-center justify-center"
        >
          <button className="inline-flex h-8 items-center justify-center rounded-md border border-transparent bg-primary px-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
            View
          </button>
        </Link>
      );
    },
  },
];

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/audit-logs");
      setAuditLogs(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error("Error fetching audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const rows = auditLogs.map((item) => {
    //format the time bu using moment npm package

    const formattedDate = moment(item.timestamp).format(
      "MMMM DD, YYYY, hh:mm A"
    );

    //set the data for each rows in the table according to the field name in columns
    //Example: username is the keyword in row it should matche with the field name in column so that the data will show on that column dynamically
    return {
      id: item.id,
      noteId: item.noteId,
      actions: item.action,
      username: item.username,
      timestamp: formattedDate,
      noteid: item.noteId,
      note: item.noteContent,
    };
  });

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between rounded-md border border-border-subtle bg-bg-subtle px-4 py-3">
        <div>
          <h2 className="text-h3 font-semibold text-text-main">Audit Logs</h2>
          <p className="text-body text-text-muted">
            Track note actions and system activity history.
          </p>
        </div>
        <span className="rounded-full border border-border-subtle bg-bg-surface px-3 py-1 text-xs font-semibold text-text-main">
          {rows.length} Events
        </span>
      </div>

      {loading ? (
        <Card className="m-3 flex min-h-[18rem] flex-col justify-center gap-5 border-0 shadow-none">
          <div className="space-y-3 rounded-xl border border-border-subtle bg-bg-surface p-4">
            <div className="h-4 w-1/5 animate-pulse rounded-full bg-bg-subtle" />
            <div className="h-3 w-full animate-pulse rounded-full bg-bg-subtle" />
          </div>
          <div className="space-y-3 rounded-xl border border-border-subtle bg-bg-surface p-4">
            <div className="h-4 w-1/6 animate-pulse rounded-full bg-bg-subtle" />
            <div className="h-3 w-full animate-pulse rounded-full bg-bg-subtle" />
          </div>
          <div className="space-y-3 rounded-xl border border-border-subtle bg-bg-surface p-4">
            <div className="h-4 w-1/4 animate-pulse rounded-full bg-bg-subtle" />
            <div className="h-3 w-full animate-pulse rounded-full bg-bg-subtle" />
          </div>
          <span className="text-body text-text-muted">Loading audit events...</span>
        </Card>
      ) : (
        <div className="w-full overflow-x-auto rounded-md border border-border-subtle bg-bg-surface">
          <DataGrid
            autoHeight
            className="min-w-[980px]"
            rows={rows}
            columns={auditLogcolumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 6,
                },
              },
            }}
            pageSizeOptions={[6, 10]}
            disableRowSelectionOnClick
            disableColumnResize
            sx={gridSx}
          />
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
