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
import { Blocks } from "react-loader-spinner";
import moment from "moment";
import Errors from "../Errors";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const UserProfile = () => {
  // Access the currentUser and token hook using the useMyContext custom hook from the ContextProvider
  const { currentUser, token } = useMyContext();
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
        setIs2faEnabled(response.data.is2faEnabled);
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
      toast.success("Update Credential successful");
    } catch (error) {
      toast.error("Update Credential failed");
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

  return (
    <div className="min-h-[calc(100vh-74px)] bg-bg-subtle py-8">
      {pageLoader ? (
        <div className="mx-auto flex h-72 w-[92%] max-w-2xl items-center justify-center">
          <Card className="flex w-full flex-col items-center justify-center gap-2 py-10 text-text-main">
            <span>
              <Blocks
                height="70"
                width="70"
                color="#0052CC"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
              />
            </span>
            <span className="text-body text-text-muted">Please wait...</span>
          </Card>
        </div>
      ) : (
        <div className="mx-auto grid w-[92%] max-w-6xl gap-4 lg:grid-cols-2">
          <Card className="space-y-5 px-5 py-6">
            <div className="flex flex-col items-center gap-2 border-b border-border-subtle pb-4">
              <Avatar alt={currentUser?.username} src="/static/images/avatar/1.jpg" />
              <h3 className="text-h3 font-semibold text-text-main">
                {currentUser?.username}
              </h3>
              <Badge variant="info">{currentUser?.roles?.[0] || "USER"}</Badge>
            </div>

            <div className="space-y-2 rounded-md border border-border-subtle bg-bg-surface p-4">
              <p className="text-body text-text-main">
                <span className="font-semibold">Username:</span>{" "}
                <span className="text-text-muted">{currentUser?.username}</span>
              </p>
              <p className="text-body text-text-main">
                <span className="font-semibold">Role:</span>{" "}
                <span className="text-text-muted">{currentUser?.roles?.[0]}</span>
              </p>
            </div>

            <Accordion expanded={openAccount} className="!rounded-md !border !border-border-subtle !shadow-none">
              <AccordionSummary
                className="!bg-bg-subtle"
                onClick={onOpenAccountHandler}
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <h3 className="text-h3 font-semibold text-text-main">
                  Update User Credentials
                </h3>
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
                  />{" "}
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
                  />{" "}
                  <InputField
                    label="Enter New Password"
                    id="password"
                    className="text-sm"
                    type="password"
                    message="*Password is required"
                    placeholder="type your password"
                    register={register}
                    errors={errors}
                    min={6}
                  />
                  <Button
                    disabled={loading}
                    className="my-2 w-full justify-center rounded-md py-2 text-body font-semibold"
                    type="submit"
                  >
                    {loading ? <span>Loading...</span> : "Update"}
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
                      Your credential expires on{" "}
                      <span className="font-medium">{credentialExpireDate}</span>
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
                  Your last login session was on <span>{loginSession}</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="space-y-5 px-5 py-6">
            <div className="space-y-2 border-b border-border-subtle pb-4">
              <h1 className="flex items-center gap-2 text-h2 font-semibold text-text-main">
                <span>Authentication (MFA)</span>
                <Badge variant={is2faEnabled ? "success" : "danger"}>
                  {is2faEnabled ? "Activated" : "Deactivated"}
                </Badge>
              </h1>
              <h3 className="text-h3 font-semibold text-text-main">Multi Factor Authentication</h3>
              <p className="text-body text-text-muted">
                Two-factor authentication adds an additional layer of security to your account.
              </p>
            </div>

            <div>
              <Button
                disabled={disabledLoader}
                onClick={is2faEnabled ? disable2FA : enable2FA}
                variant={is2faEnabled ? "danger" : "primary"}
                className="rounded-md px-5 py-2 text-body font-semibold"
              >
                {disabledLoader
                  ? "Loading..."
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
                  <div>
                    <img src={qrCodeUrl} alt="QR Code" />
                    <div className="mt-4 flex items-center gap-2">
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
                        {twofaCodeLoader ? "Loading..." : "Verify 2FA"}
                      </Button>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
