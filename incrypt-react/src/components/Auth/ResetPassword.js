import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../InputField/InputField";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import AuthLayout from "./AuthLayout";

const ResetPassword = () => {
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

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleResetPassword = async (data) => {
    const { password } = data;

    const token = searchParams.get("token");

    setLoading(true);
    try {
      const formData = new URLSearchParams();

      formData.append("token", token);
      formData.append("newPassword", password);
      await api.post("/auth/public/reset-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("Password reset successful! You can now log in.");
      reset();
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password to protect your Incrypt account."
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
      <form onSubmit={handleSubmit(handleResetPassword)}>
        <div className="mb-4 flex items-center gap-3 text-[11px] text-text-muted">
          <div className="h-px flex-1 bg-border-subtle" />
          <span>Reset credentials</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <div className="mt-2 flex flex-col gap-3">
          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="*Password is required"
            placeholder="Enter a new password"
            register={register}
            errors={errors}
            min={6}
          />{" "}
        </div>
        <Button
          disabled={loading}
          className="mt-5 w-full rounded-full py-2.5 text-body font-semibold"
          type="submit"
        >
          {loading ? <span>Updating…</span> : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
