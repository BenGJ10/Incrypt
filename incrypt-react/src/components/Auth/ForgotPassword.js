import React, { useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../InputField/InputField";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMyContext } from "../../store/ContextApi";
import Button from "../ui/Button";
import AuthLayout from "./AuthLayout";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Access the token  using the useMyContext hook from the ContextProvider
  const { token } = useMyContext();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const onPasswordForgotHandler = async (data) => {
    //destructuring email from the data object
    const { email } = data;

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("email", email);
      await api.post("/auth/public/forgot-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //reset the field by using reset() function provided by react hook form after submit
      reset();

      //showing success message
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error("Error sending password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //if there is token  exist navigate  the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter the email linked to your Incrypt account and we'll send you a reset link."
      footer={
        <p className="text-[12px] text-text-muted">
          <Link
            className="font-medium text-primary hover:text-primary-hover"
            to="/login"
          >
            Back to login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onPasswordForgotHandler)}>
        <div className="mb-4 flex items-center gap-3 text-[11px] text-text-muted">
          <div className="h-px flex-1 bg-border-subtle" />
          <span>Password recovery</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <div className="mt-2 flex flex-col gap-3">
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
        </div>
        <Button
          disabled={loading}
          className="mt-5 w-full rounded-full py-2.5 text-body font-semibold"
          type="submit"
        >
          {loading ? <span>Sending link…</span> : "Send reset link"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
