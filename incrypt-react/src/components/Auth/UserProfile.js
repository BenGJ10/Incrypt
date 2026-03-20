import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useMyContext } from "../../store/ContextApi";
import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import Switch from "@mui/material/Switch";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import Errors from "../Errors";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Alert from "../ui/Alert";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const UserProfile = () => {
  // Access the currentUser and token hook using the useMyContext custom hook from the ContextProvider
  const { currentUser, token, setToken, setCurrentUser } = useMyContext();
  const navigate = useNavigate();
  //set the loggin session from the token
  const [loginSession, setLoginSession] = useState(null);

  const [credentialExpireDate, setCredentialExpireDate] = useState(null);
  const [pageError, setPageError] = useState(false);

  const [accountExpired, setAccountExpired] = useState();
  const [accountLocked, setAccountLock] = useState();
  const [accountEnabled, setAccountEnabled] = useState();
  const [credentialExpired, setCredentialExpired] = useState();

  const [openAccount, setOpenAccount] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enable, Step 2: Verify

  //loading state
  const [loading, setLoading] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [disabledLoader, setDisbledLoader] = useState(false);
  const [twofaCodeLoader, settwofaCodeLoader] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      password: "",
    },
    mode: "onTouched",
  });

  //fetching the 2fa sttaus

  useEffect(() => {
    setPageLoader(true);

    const fetch2FAStatus = async () => {
      try {
        const response = await api.get(`/auth/user/2fa-status`);
        const enabled =
          response?.data?.is2faEnabled ?? response?.data?.is2FAEnabled ?? false;
        setIs2faEnabled(Boolean(enabled));
      } catch (error) {
        setPageError(error?.response?.data?.message);
        toast.error("Error fetching 2FA status");
      } finally {
        setPageLoader(false);
      }
    };
    fetch2FAStatus();
  }, []);

  //enable the 2fa
  const enable2FA = async () => {
    setDisbledLoader(true);
    try {
      const response = await api.post(`/auth/enable-2fa`);
      setQrCodeUrl(response.data);
      setStep(2);
    } catch (error) {
      toast.error("Error enabling 2FA");
    } finally {
      setDisbledLoader(false);
    }
  };

  //diable the 2fa

  const disable2FA = async () => {
    setDisbledLoader(true);
    try {
      await api.post(`/auth/disable-2fa`);
      setIs2faEnabled(false);
      setQrCodeUrl("");
    } catch (error) {
      toast.error("Error disabling 2FA");
    } finally {
      setDisbledLoader(false);
    }
  };

  //verify the 2fa
  const verify2FA = async () => {
    if (!code || code.trim().length === 0)
      return toast.error("Please Enter The Code To Verify");

    settwofaCodeLoader(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);

      await api.post(`/auth/verify-2fa`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("2FA verified successful");

      setIs2faEnabled(true);
      setStep(1);
    } catch (error) {
      console.error("Error verifying 2FA", error);
      toast.error("Invalid 2FA Code");
    } finally {
      settwofaCodeLoader(false);
    }
  };

  //update the credentials
  const handleUpdateCredential = async (data) => {
    const newUsername = data.username;
    const newPassword = data.password;
    const usernameChanged =
      newUsername?.trim() && currentUser?.username
        ? newUsername.trim() !== currentUser.username
        : false;

    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newUsername", newUsername);
      formData.append("newPassword", newPassword);
      await api.post("/auth/update-credentials", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      if (usernameChanged) {
        localStorage.removeItem("JWT_TOKEN");
        localStorage.removeItem("USER");
        localStorage.removeItem("IS_ADMIN");
        setToken(null);
        setCurrentUser(null);
        toast.success("Credentials updated. Please log in with your new username.");
        navigate("/login");
      } else {
        toast.success("Update Credential successful");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Credential update failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  //set the status of (credentialsNonExpired, accountNonLocked, enabled and credentialsNonExpired) current user
  useEffect(() => {
    if (currentUser?.id) {
      setValue("username", currentUser.username);
      setValue("email", currentUser.email);
      setAccountExpired(!currentUser.accountNonExpired);
      setAccountLock(!currentUser.accountNonLocked);
      setAccountEnabled(currentUser.enabled);
      setCredentialExpired(!currentUser.credentialsNonExpired);

      //moment npm package is used to format the date
      const expiredFormatDate = moment(
        currentUser?.credentialsExpiryDate
      ).format("D MMMM YYYY");
      setCredentialExpireDate(expiredFormatDate);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);

      const lastLoginSession = moment
        .unix(decodedToken.iat)
        .format("dddd, D MMMM YYYY, h:mm A");
      //set the loggin session from the token
      setLoginSession(lastLoginSession);
    }
  }, [token]);

  //update the AccountExpiryStatus
  const handleAccountExpiryStatus = async (event) => {
    setAccountExpired(event.target.checked);

    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);

      await api.put("/auth/update-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      toast.success("Update Account Expirey Status");
    } catch (error) {
      toast.error("Update expirey status failed");
    } finally {
      setLoading(false);
    }
  };

  //update the AccountLockStatus
  const handleAccountLockStatus = async (event) => {
    setAccountLock(event.target.checked);

    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("lock", event.target.checked);

      await api.put("/auth/update-lock-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      toast.success("Update Account Lock Status");
    } catch (error) {
      toast.error("Update Account Lock status failed");
    } finally {
      setLoading(false);
    }
  };

  //update the AccountEnabledStatus
  const handleAccountEnabledStatus = async (event) => {
    setAccountEnabled(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("enabled", event.target.checked);

      await api.put("/auth/update-enabled-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      toast.success("Update Account Enabled Status");
    } catch (error) {
      toast.error("Update Account Enabled status failed");
    } finally {
      setLoading(false);
    }
  };

  //update the CredentialExpiredStatus
  const handleCredentialExpiredStatus = async (event) => {
    setCredentialExpired(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);

      await api.put("/auth/update-credentials-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      toast.success("Update Credentials Expiry Status");
    } catch (error) {
      toast.error("Credentials Expiry Status Failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageError) {
    return <Errors message={pageError} />;
  }

  //two function for opening and closing the according
  const onOpenAccountHandler = () => {
    setOpenAccount(!openAccount);
    setOpenSetting(false);
  };
  const onOpenSettingHandler = () => {
    setOpenSetting(!openSetting);
    setOpenAccount(false);
  };

  const roleLabel = currentUser?.roles?.[0] || "USER";
  const roleBadgeVariant =
    roleLabel === "ROLE_ADMIN" ? "warning" : roleLabel === "ROLE_USER" ? "info" : "default";

  const accountHealth =
    accountEnabled && !accountLocked && !accountExpired
      ? { label: "Healthy", variant: "success" }
      : { label: "Needs Attention", variant: "warning" };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-bg-subtle bg-[radial-gradient(circle_at_top_left,rgba(0,82,204,0.10),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(0,82,204,0.06),transparent_40%)] py-8">
      {pageLoader ? (
        <motion.div
          className="mx-auto w-[92%] max-w-5xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="overflow-hidden px-0 py-0 transition-shadow duration-300 hover:shadow-custom">
            <div className="border-b border-border-subtle bg-bg-surface px-6 py-5">
              <div className="h-6 w-44 animate-pulse rounded-md bg-bg-subtle" />
              <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-bg-subtle" />
            </div>

            <div className="grid gap-4 p-6 lg:grid-cols-3">
              <div className="space-y-3 lg:col-span-2">
                <div className="h-14 animate-pulse rounded-lg border border-border-subtle bg-bg-surface" />
                <div className="h-14 animate-pulse rounded-lg border border-border-subtle bg-bg-surface" />
                <div className="h-14 animate-pulse rounded-lg border border-border-subtle bg-bg-surface" />
              </div>
              <div className="space-y-3">
                <div className="h-24 animate-pulse rounded-lg border border-border-subtle bg-bg-surface" />
                <div className="h-24 animate-pulse rounded-lg border border-border-subtle bg-bg-surface" />
              </div>
            </div>

            <div className="border-t border-border-subtle px-6 py-4">
              <Badge variant="info">Loading your profile workspace...</Badge>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="mx-auto w-[92%] max-w-6xl space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden px-0 py-0">
            <div className="grid gap-4 border-b border-border-subtle bg-bg-surface px-6 py-5 lg:grid-cols-3">
              <div className="flex items-center gap-4 lg:col-span-2">
                <Avatar
                  alt={currentUser?.username}
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 62, height: 62 }}
                />
                <div>
                  <h1 className="text-h2 font-semibold text-text-main">{currentUser?.username}</h1>
                  <p className="text-body text-text-muted">Manage your account security, credentials and access settings.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Badge variant={roleBadgeVariant}>{roleLabel}</Badge>
                <Badge variant={accountHealth.variant}>{accountHealth.label}</Badge>
                <Badge variant={is2faEnabled ? "success" : "danger"}>
                  MFA {is2faEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>

            <div className="grid gap-3 px-6 py-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-border-subtle bg-bg-surface px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-text-muted">Username</p>
                <p className="mt-1 text-body font-semibold text-text-main">{currentUser?.username}</p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-bg-surface px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-text-muted">Role</p>
                <p className="mt-1 text-body font-semibold text-text-main">{roleLabel}</p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-bg-surface px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-text-muted">Credential Expiry</p>
                <p className="mt-1 text-body font-semibold text-text-main">{credentialExpireDate || "N/A"}</p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-bg-surface px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-text-muted">Last Session</p>
                <p className="mt-1 text-body font-semibold text-text-main">{loginSession || "N/A"}</p>
              </div>
            </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-2">
            <Card className="space-y-5 px-5 py-6 transition-shadow duration-300 hover:shadow-custom">
              <div className="space-y-2 border-b border-border-subtle pb-4">
                <h2 className="text-h3 font-semibold text-text-main">Identity & Credentials</h2>
                <p className="text-body text-text-muted">Keep your sign-in identity updated and secure.</p>
              </div>

              <Accordion expanded={openAccount} className="!rounded-md !border !border-border-subtle !shadow-none">
                <AccordionSummary
                  className="!bg-bg-subtle"
                  onClick={onOpenAccountHandler}
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <h3 className="text-h3 font-semibold text-text-main">Update User Credentials</h3>
                </AccordionSummary>
                <AccordionDetails className="!border-t !border-border-subtle !pt-4">
                  <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit(handleUpdateCredential)}
                  >
                    <InputField
                      label="UserName"
                      required
                      id="username"
                      className="text-sm"
                      type="text"
                      message="*Username is required"
                      placeholder="Enter your username"
                      register={register}
                      errors={errors}
                    />
                    <InputField
                      label="Email"
                      required
                      id="email"
                      className="text-sm"
                      type="email"
                      message="*Email is required"
                      placeholder="Enter your email"
                      register={register}
                      errors={errors}
                      readOnly
                    />
                    <InputField
                      label="Enter New Password"
                      id="password"
                      className="text-sm"
                      type="password"
                      message="*Password is required"
                      placeholder="Type your password"
                      register={register}
                      errors={errors}
                      min={6}
                    />
                    <Button
                      disabled={loading}
                      className="my-2 w-full justify-center rounded-md py-2 text-body font-semibold"
                      type="submit"
                    >
                      {loading ? <span>Saving changes...</span> : "Update Credentials"}
                    </Button>
                  </form>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={openSetting} className="!rounded-md !border !border-border-subtle !shadow-none">
                <AccordionSummary
                  className="!bg-bg-subtle"
                  onClick={onOpenSettingHandler}
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <h3 className="text-h3 font-semibold text-text-main">Account Setting</h3>
                </AccordionSummary>
                <AccordionDetails className="!border-t !border-border-subtle !pt-4">
                  <div className="flex flex-col gap-4 text-text-main">
                    <div className="flex items-center justify-between">
                      <h3 className="text-body font-medium">Account Expired</h3>
                      <Switch
                        checked={accountExpired}
                        onChange={handleAccountExpiryStatus}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-body font-medium">Account Locked</h3>
                      <Switch
                        checked={accountLocked}
                        onChange={handleAccountLockStatus}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-body font-medium">Account Enabled</h3>
                      <Switch
                        checked={accountEnabled}
                        onChange={handleAccountEnabledStatus}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </div>
                    <div className="rounded-md border border-border-subtle bg-bg-subtle px-4 py-3">
                      <p className="text-body text-text-main">
                        Your credential expires on <span className="font-medium">{credentialExpireDate}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-body font-medium">Credential Expired</h3>
                      <Switch
                        checked={credentialExpired}
                        onChange={handleCredentialExpiredStatus}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <div>
                <h3 className="mb-2 text-h3 font-semibold text-text-main">Last Login Session</h3>
                <div className="rounded-md border border-border-subtle bg-bg-surface px-4 py-3">
                  <p className="text-body text-text-muted">
                    Your last login session was on <span className="font-medium text-text-main">{loginSession}</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="space-y-5 px-5 py-6 transition-shadow duration-300 hover:shadow-custom">
              <div className="space-y-2 border-b border-border-subtle pb-4">
                <h2 className="flex items-center gap-2 text-h2 font-semibold text-text-main">
                  <span>Authentication (MFA)</span>
                  <Badge variant={is2faEnabled ? "success" : "danger"}>
                    {is2faEnabled ? "Activated" : "Deactivated"}
                  </Badge>
                </h2>
                <p className="text-body text-text-muted">
                  Two-factor authentication adds an additional layer of protection to your account.
                </p>
              </div>

              <Alert variant={is2faEnabled ? "success" : "warning"}>
                {is2faEnabled
                  ? "Your account is protected with two-factor authentication."
                  : "MFA is currently disabled. Enable it to improve account security."}
              </Alert>

              <div>
                <Button
                  disabled={disabledLoader}
                  onClick={is2faEnabled ? disable2FA : enable2FA}
                  variant={is2faEnabled ? "danger" : "primary"}
                  className="rounded-md px-5 py-2 text-body font-semibold"
                >
                  {disabledLoader
                    ? "Processing..."
                    : is2faEnabled
                    ? "Disable Two Factor Authentication"
                    : "Enable Two Factor Authentication"}
                </Button>
              </div>

              {step === 2 && (
                <Accordion className="!rounded-md !border !border-border-subtle !shadow-none">
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                    className="!bg-bg-subtle"
                  >
                    <h3 className="text-h3 font-semibold uppercase text-text-main">QR Code To Scan</h3>
                  </AccordionSummary>
                  <AccordionDetails className="!border-t !border-border-subtle !pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-center rounded-lg border border-dashed border-border-subtle bg-bg-surface p-4">
                        <img src={qrCodeUrl} alt="QR Code" className="max-w-full" />
                    </div>
                      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <input
                          type="text"
                          placeholder="Enter 2FA code"
                          value={code}
                          required
                          className="w-full rounded-md border border-border-subtle bg-bg-surface px-3 py-2 text-body text-text-main outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <Button
                          className="h-[42px] rounded-md px-4 text-body font-semibold"
                          onClick={verify2FA}
                          type="button"
                        >
                          {twofaCodeLoader ? "Verifying..." : "Verify 2FA"}
                        </Button>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
