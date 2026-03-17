import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import InputField from "../InputField/InputField";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";
import Button from "../ui/Button";
import AuthLayout from "./AuthLayout";

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  // Step 1: Login method and Step 2: Verify 2FA
  const [step, setStep] = useState(1);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  // Access the token and setToken function using the useMyContext hook from the ContextProvider
  const { setToken, token } = useMyContext();
  const navigate = useNavigate();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
    mode: "onTouched",
  });

  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));

    //store the token on the context state  so that it can be shared any where in our application by context provider
    setToken(token);

    navigate("/notes");
  };

  //function for handle login with credentials
  const onLoginHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/public/login", data);

      //showing success message with react hot toast
      toast.success("Login Successful");

      //reset the input field by using reset() function provided by react hook form after submission
      reset();

      if (response.status === 200 && response.data.jwtToken) {
        setJwtToken(response.data.jwtToken);
        const decodedToken = jwtDecode(response.data.jwtToken);
        if (decodedToken.is2faEnabled) {
          setStep(2); // Move to 2FA verification step
        } else {
          handleSuccessfulLogin(response.data.jwtToken, decodedToken);
        }
      } else {
        toast.error(
          "Login failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      if (error) {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  //function for verify 2fa authentication
  const onVerify2FaHandler = async (data) => {
    const code = data.code;
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

      await api.post("/auth/public/verify-2fa-login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const decodedToken = jwtDecode(jwtToken);
      handleSuccessfulLogin(jwtToken, decodedToken);
    } catch (error) {
      console.error("2FA verification error", error);
      toast.error("Invalid 2FA code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //if there is token  exist navigate  the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  //step1 will render the login form and step-2 will render the 2fa verification form
  return (
    <div>
      {step === 1 ? (
        <AuthLayout
          title="Sign in to Incrypt"
          subtitle="Enter your details to access your secure notes."
          footer={
            <p className="text-center text-[12px] text-text-muted">
              Don&apos;t have an account?{" "}
              <Link
                className="font-semibold text-primary hover:text-primary-hover"
                to="/signup"
              >
                Sign up
              </Link>
            </p>
          }
        >
          <form onSubmit={handleSubmit(onLoginHandler)}>
            <div className="flex items-center justify-between gap-2 pb-4">
              <Link
                to={`${apiUrl}/oauth2/authorization/google`}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-3 py-2 text-[11px] font-medium text-text-main shadow-sm transition-colors hover:bg-bg-subtle"
              >
                <FcGoogle className="text-xl" />
                <span>Continue with Google</span>
              </Link>
              <Link
                to={`${apiUrl}/oauth2/authorization/github`}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-3 py-2 text-[11px] font-medium text-text-main shadow-sm transition-colors hover:bg-bg-subtle"
              >
                <FaGithub className="text-xl" />
                <span>Continue with GitHub</span>
              </Link>
            </div>

            <div className="mb-4 flex items-center gap-3 text-[11px] text-text-muted">
              <div className="h-px flex-1 bg-border-subtle" />
              <span>or use your account</span>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>

            <div className="flex flex-col gap-3">
              <InputField
                label="Username"
                required
                id="username"
                type="text"
                message="*UserName is required"
                placeholder="Enter your username"
                register={register}
                errors={errors}
              />
              <InputField
                label="Password"
                required
                id="password"
                type="password"
                message="*Password is required"
                placeholder="Enter your password"
                register={register}
                errors={errors}
              />
            </div>

            <Button
              disabled={loading}
              className="mt-5 w-full rounded-full py-2.5 text-body font-semibold"
              type="submit"
            >
              {loading ? <span>Signing in…</span> : "Sign in"}

            </Button>
            <p className="mt-3 text-left text-[12px] text-text-muted">
              <Link
                className="font-medium text-primary hover:text-primary-hover"
                to="/forgot-password"
              >
                Forgot your password?
              </Link>
            </p>
          </form>
        </AuthLayout>
      ) : (
        <AuthLayout
          title="Verify 2FA"
          subtitle="Enter the code from your authenticator app to continue."
        >
          <form onSubmit={handleSubmit(onVerify2FaHandler)}>
            <div className="mb-4 flex items-center gap-3 text-[11px] text-text-muted">
              <div className="h-px flex-1 bg-border-subtle" />
              <span>Two-factor authentication</span>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>

            <div className="mt-2 flex flex-col gap-3">
              <InputField
                label="Authentication code"
                required
                id="code"
                type="text"
                message="*Code is required"
                placeholder="Enter your 2FA code"
                register={register}
                errors={errors}
              />
            </div>

            <Button
              disabled={loading}
              className="mt-5 w-full rounded-full py-2.5 text-body font-semibold"
              type="submit"
            >
              {loading ? <span>Verifying…</span> : "Verify code"}

            </Button>
          </form>
        </AuthLayout>
      )}
    </div>
  );
};

export default Login;
