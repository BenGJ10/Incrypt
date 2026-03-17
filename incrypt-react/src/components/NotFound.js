import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-bg-subtle px-4">
      <div className="mx-auto w-full max-w-lg text-center rounded-2xl border border-border-subtle bg-bg-surface p-8 shadow-card-md">

        <h1 className="text-[80px] font-extrabold leading-none text-primary">
          404
        </h1>

        <p className="mt-2 text-h2 font-semibold text-text-main">
          Page not found
        </p>

        <p className="mt-2 text-body text-text-muted">
          The page you're looking for doesn't exist or may have been moved.
          You can return to the homepage to continue exploring Incrypt.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-body font-semibold text-white shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:bg-primary-hover"
          >
            Back to homepage
          </Link>
        </div>

      </div>
    </section>
  );
};

export default NotFound;