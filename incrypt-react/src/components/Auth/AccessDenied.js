import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";

const AccessDenied = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-bg-subtle px-4 py-8">
      <Card className="mx-4 flex w-full max-w-md flex-col items-center rounded-2xl px-6 py-7 text-center sm:px-8">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50 text-yellow-500">
          <FaExclamationTriangle className="text-2xl" />
        </div>
        <h1 className="mb-2 text-h2 font-semibold text-text-main">
          Access denied
        </h1>
        <p className="mb-4 text-body text-text-muted">
          You don&apos;t have permission to view this page. If you think this is
          a mistake, try returning to the dashboard.
        </p>
        <Button
          onClick={goHome}
          className="mt-2 rounded-full px-5 py-2 text-body font-semibold"
        >
          Go back home
        </Button>
      </Card>
    </div>
  );
};

export default AccessDenied;
