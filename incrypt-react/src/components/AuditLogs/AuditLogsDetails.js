import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import Errors from "../Errors.js";
import moment from "moment";
import Card from "../ui/Card";

//importing the the columns from the auditlogs
import { auditLogscolumn } from "../../utils/tableColumn.js";

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

const AuditLogsDetails = () => {
  //access the notid
  const { noteId } = useParams();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSingleAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/audit-logs/note/${noteId}`);

      setAuditLogs(data);
    } catch (err) {
      setError(err?.response?.data?.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    if (noteId) {
      fetchSingleAuditLogs();
    }
  }, [noteId, fetchSingleAuditLogs]);

  const rows = auditLogs.map((item) => {
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
      <div className="mb-4 rounded-md border border-border-subtle bg-bg-subtle px-4 py-3">
        <h2 className="text-h3 font-semibold text-text-main">
          Audit Log for Note ID: {noteId}
        </h2>
        <p className="text-body text-text-muted">
          Detailed event history for this specific note.
        </p>
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
          <span className="text-body text-text-muted">Loading note activity...</span>
        </Card>
      ) : (
        <>
          {auditLogs.length === 0 ? (
            <Errors message="Invalid NoteId" />
          ) : (
            <div className="w-full overflow-x-auto rounded-md border border-border-subtle bg-bg-surface">
              <DataGrid
                autoHeight
                className="min-w-[980px]"
                rows={rows}
                columns={auditLogscolumn}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 6,
                    },
                  },
                }}
                disableRowSelectionOnClick
                pageSizeOptions={[6, 10]}
                disableColumnResize
                sx={gridSx}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuditLogsDetails;
