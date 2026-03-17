import React from "react";
import Card from "../ui/Card";

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-[calc(100vh-74px)] bg-bg-subtle px-4 py-8">
      <div className="mx-auto flex w-full max-w-md items-center justify-center">
        <Card className="w-full rounded-2xl px-6 py-7 sm:px-8">
          <div className="mb-5 text-center">
            <h1 className="text-h2 font-semibold text-text-main">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-body text-text-muted">{subtitle}</p>
            ) : null}
          </div>

          {children}

          {footer ? <div className="mt-5">{footer}</div> : null}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;