import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";
import Button from "../ui/Button";
import AuthLayout from "./AuthLayout";

const Signup = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  // Access the token and setToken function using the useMyContext hook from the ContextProvider
  const { token } = useMyContext();
  const navigate = useNavigate();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    setRole("ROLE_USER");
  }, []);

  const onSubmitHandler = async (data) => {
    const { username, email, password } = data;
    const sendData = {
      username,
      email,
      password,
      role: [role],
    };

    try {
      setLoading(true);
      const response = await api.post("/auth/public/signup", sendData);
      toast.success("Reagister Successful");
      reset();
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      // Add an error programmatically by using the setError function provided by react-hook-form
      //setError(keyword,message) => keyword means the name of the field where I want to show the error

      if (
        error?.response?.data?.message === "Error: Username is already taken!"
      ) {
        setError("username", { message: "username is already taken" });
      } else if (
        error?.response?.data?.message === "Error: Email is already in use!"
      ) {
        setError("email", { message: "Email is already in use" });
      }
    } finally {
      setLoading(false);
    }
  };

  //if there is token  exist navigate to the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <AuthLayout
      title="Create your Incrypt account"
      subtitle="Sign up to start capturing and protecting your notes."
      footer={
        <p className="text-center text-[12px] text-text-muted">
          Already have an account?{" "}
          <Link
            className="font-semibold text-primary hover:text-primary-hover"
            to="/login"
          >
            Login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mt-1 flex items-center justify-between gap-2 pb-4">
          <a
            href={`${apiUrl}/oauth2/authorization/google`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-3 py-2 text-[11px] font-medium text-text-main shadow-sm transition-colors hover:bg-bg-subtle"
          >
            <span>
              <FcGoogle className="text-xl" />
            </span>
            <span>Continue with Google</span>
          </a>
          <a
            href={`${apiUrl}/oauth2/authorization/github`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-3 py-2 text-[11px] font-medium text-text-main shadow-sm transition-colors hover:bg-bg-subtle"
          >
            <span>
              <FaGithub className="text-xl" />
            </span>
            <span>Continue with GitHub</span>
          </a>
        </div>

        <div className="mb-4 flex items-center gap-3 text-[11px] text-text-muted">
          <div className="h-px flex-1 bg-border-subtle" />
          <span>or use your email</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <div className="flex flex-col gap-3">
          <InputField
            label="Username"
            required
            id="username"
            type="text"
            message="*UserName is required"
            placeholder="Choose a username"
            register={register}
            errors={errors}
          />{" "}
          <InputField
            label="Email"
            required
            id="email"
            type="email"
            message="*Email is required"
            placeholder="Enter your email"
            register={register}
            errors={errors}
          />
          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="*Password is required"
            placeholder="Create a password"
            register={register}
            errors={errors}
            min={6}
          />
        </div>
        <Button
          disabled={loading}
          className="mt-5 flex w-full justify-center rounded-full py-2.5 text-body font-semibold"
          type="submit"
        >
          {loading ? <span>Creating account…</span> : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
