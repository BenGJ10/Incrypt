import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../InputField/InputField";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import Errors from "../Errors";
import Card from "../ui/Card";

const UserDetails = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const [loading, setLoading] = useState(false);
  const [updateRoleLoader, setUpdateRoleLoader] = useState(false);
  const [passwordLoader, setPasswordLoader] = useState(false);

  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/user/${userId}`);
      setUser(response.data);

      setSelectedRole(response.data.role?.roleName || "");
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching user details", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    //if user exist set the value by using the setValue function provided my react-hook-form
    if (user && Object.keys(user).length > 0) {
      setValue("username", user.userName);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get("/admin/roles");
      setRoles(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching roles", err);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchRoles();
  }, [fetchUserDetails, fetchRoles]);

  //set the selected role
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  //handle update role
  const handleUpdateRole = async () => {
    setUpdateRoleLoader(true);
    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("roleName", selectedRole);

      await api.put(`/admin/update-role`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      fetchUserDetails();
      toast.success("Update role successful");
    } catch (err) {
      console.log(err);
      toast.error("Update Role Failed");
    } finally {
      setUpdateRoleLoader(false);
    }
  };

  //handle update the password
  const handleSavePassword = async (data) => {
    setPasswordLoader(true);
    const newPassword = data.password;

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("password", newPassword);

      await api.put(`/admin/update-password`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      setIsEditingPassword(false);
      setValue("password", "");
      //fetchUserDetails();
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error("Error updating password " + err.response.data);
    } finally {
      setPasswordLoader(false);
    }
  };

  const handleCheckboxChange = async (e, updateUrl) => {
    const { name, checked } = e.target;

    let message = null;
    if (name === "lock") {
      message = "Update Account Lock status Successful";
    } else if (name === "expire") {
      message = "Update Account Expiry status Successful";
    } else if (name === "enabled") {
      message = "Update Account Enabled status Successful";
    } else if (name === "credentialsExpire") {
      message = "Update Account Credentials Expired status Successful";
    }

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);

      formData.append(name, checked);

      await api.put(updateUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      fetchUserDetails();
      toast.success(message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(`Error updating ${name}:`);
    } finally {
      message = null;
    }
  };

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="px-4 py-6 sm:px-6">
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
            <span className="text-body text-text-muted">Loading users details</span>
          </Card>
        ) : (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <section className="rounded-md border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
            <h2 className="text-h3 font-semibold text-text-main">Profile Information</h2>
            <p className="mt-1 text-body text-text-muted">
              Review account identity and update password when needed.
            </p>

            <form
              className="mt-5 flex flex-col gap-3"
              onSubmit={handleSubmit(handleSavePassword)}
            >
              <InputField
                label="UserName"
                required
                id="username"
                className="w-full"
                type="text"
                message="*UserName is required"
                placeholder="Enter your UserName"
                register={register}
                errors={errors}
                readOnly
              />
              <InputField
                label="Email"
                required
                id="email"
                className="w-full"
                type="text"
                message="*Email is required"
                placeholder="Enter your Email"
                register={register}
                errors={errors}
                readOnly
              />
              <InputField
                label="Password"
                required
                autoFocus={isEditingPassword}
                id="password"
                className="w-full"
                type="password"
                message="*Password is required"
                placeholder="Enter your Password"
                register={register}
                errors={errors}
                readOnly={!isEditingPassword}
                min={6}
              />

              {!isEditingPassword ? (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="w-fit"
                  onClick={() => setIsEditingPassword(!isEditingPassword)}
                >
                  Edit Password
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button type="submit" size="sm" className="w-fit">
                    {passwordLoader ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-fit"
                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </section>

          <section className="rounded-md border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
            <h2 className="text-h3 font-semibold text-text-main">Admin Actions</h2>
            <p className="mt-1 text-body text-text-muted">
              Manage role and account-level security flags.
            </p>

            <div className="mt-5 flex flex-col gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-body font-medium text-text-main">Role</label>
                <select
                  className="h-10 rounded-md border border-border-subtle bg-bg-surface px-3 text-sm font-medium uppercase text-text-main outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  {roles.map((role) => (
                    <option className="uppercase" key={role.roleId} value={role.roleName}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <Button size="sm" className="w-fit" onClick={handleUpdateRole}>
                {updateRoleLoader ? "Updating..." : "Update Role"}
              </Button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-subtle px-3 py-3">
                <span className="text-sm font-semibold uppercase text-text-main">Lock Account</span>
                <input
                  className="h-4 w-4 accent-primary"
                  type="checkbox"
                  name="lock"
                  checked={!user?.accountNonLocked}
                  onChange={(e) => handleCheckboxChange(e, "/admin/update-lock-status")}
                />
              </label>

              <label className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-subtle px-3 py-3">
                <span className="text-sm font-semibold uppercase text-text-main">Account Expiry</span>
                <input
                  className="h-4 w-4 accent-primary"
                  type="checkbox"
                  name="expire"
                  checked={!user?.accountNonExpired}
                  onChange={(e) => handleCheckboxChange(e, "/admin/update-expiry-status")}
                />
              </label>

              <label className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-subtle px-3 py-3">
                <span className="text-sm font-semibold uppercase text-text-main">Account Enabled</span>
                <input
                  className="h-4 w-4 accent-primary"
                  type="checkbox"
                  name="enabled"
                  checked={user?.enabled}
                  onChange={(e) => handleCheckboxChange(e, "/admin/update-enabled-status")}
                />
              </label>

              <label className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-subtle px-3 py-3">
                <span className="text-sm font-semibold uppercase text-text-main">
                  Credentials Expired
                </span>
                <input
                  className="h-4 w-4 accent-primary"
                  type="checkbox"
                  name="credentialsExpire"
                  checked={!user?.credentialsNonExpired}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      `/admin/update-credentials-expiry-status?userId=${userId}&expire=${user?.credentialsNonExpired}`
                    )
                  }
                />
              </label>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
