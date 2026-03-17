import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import Errors from "../Errors.js";
import moment from "moment";
import { Link } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import Card from "../ui/Card";

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
export const userListsColumns = [
  {
    field: "username",
    headerName: "UserName",
    minWidth: 220,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center",
    editable: false,
    renderHeader: () => <span className="text-center">UserName</span>,
  },

  {
    field: "email",
    headerName: "Email",
    aligh: "center",
    width: 260,
    editable: false,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderHeader: () => <span>Email</span>,
    renderCell: (params) => {
      return (
        <div className="flex items-center justify-center gap-1 text-text-main">
          <span>
            <MdOutlineEmail className="text-base" />
          </span>
          <span>{params?.row?.email}</span>
        </div>
      );
    },
  },
  {
    field: "created",
    headerName: "Created At",
    headerAlign: "center",
    width: 220,
    editable: false,
    align: "center",
    disableColumnMenu: true,
    renderHeader: () => <span>Created At</span>,
    renderCell: (params) => {
      return (
        <div className="flex items-center justify-center gap-1 text-text-main">
          <span>
            <MdDateRange className="text-base" />
          </span>
          <span>{params?.row?.created}</span>
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    disableColumnMenu: true,
    renderHeader: () => <span>Status</span>,
    renderCell: (params) => {
      const isActive = params?.value === "Active";
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {params?.value}
        </span>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    sortable: false,
    width: 180,
    renderHeader: () => <span>Action</span>,
    renderCell: (params) => {
      return (
        <Link
          to={`/admin/users/${params.id}`}
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

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/getUsers");
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      } catch (err) {
        setError(err?.response?.data?.message);

        toast.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const rows = users.map((item) => {
    const formattedDate = moment(item.createdDate).format(
      "MMMM DD, YYYY, hh:mm A"
    );

    //set the data for each rows in the table according to the field name in columns
    //Example: username is the keyword in row it should matche with the field name in column so that the data will show on that column dynamically
    return {
      id: item.userId,
      username: item.userName,
      email: item.email,
      created: formattedDate,
      status: item.enabled ? "Active" : "Inactive",
    };
  });

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between rounded-md border border-border-subtle bg-bg-subtle px-4 py-3">
        <div>
          <h2 className="text-h3 font-semibold text-text-main">All Users</h2>
          <p className="text-body text-text-muted">
            Browse and manage registered user accounts.
          </p>
        </div>
        <span className="rounded-full bg-bg-surface px-3 py-1 text-xs font-semibold text-text-main border border-border-subtle">
          {rows.length} Total
        </span>
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-border-subtle bg-bg-surface">
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
            <span className="text-body text-text-muted">Loading users...</span>
          </Card>
        ) : (
          <DataGrid
            autoHeight
            className="min-w-[900px]"
            rows={rows}
            columns={userListsColumns}
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
        )}
      </div>
    </div>
  );
};

export default UserList;
