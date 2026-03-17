import React from "react";
import { Link } from "react-router-dom";
import Buttons from "../utils/Buttons";
import { motion } from "framer-motion";
import Brands from "./LandingPageCom/Brands/Brands";
import State from "./LandingPageCom/State";
import Testimonial from "./LandingPageCom/Testimonial/Testimonial";
import { useMyContext } from "../store/ContextApi";

const fadeInFromTop = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
const fadeInFromBotom = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LandingPage = () => {
  // Access the token  state by using the useMyContext hook from the ContextProvider
  const { token } = useMyContext();

  return (
    <div className="min-h-[calc(100vh-74px)] bg-bg-subtle">
      <div className="mx-auto flex w-[92%] max-w-6xl flex-col gap-12 py-10 lg:py-14">
        {/* Hero section */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInFromTop}
            className="space-y-5"
          >
            <p className="inline-flex rounded-full bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary">
              Incrypt · Secure notes that stay yours
            </p>
            <h1 className="text-h1 font-semibold leading-tight text-text-main md:text-[36px]">
              Turn your thoughts into{" "}
              <span className="text-primary">encrypted, organized notes</span>{" "}
              with Incrypt.
            </h1>
            <p className="text-body text-text-muted md:max-w-lg">
              Incrypt gives you a private space for everything that matters.
              Capture ideas, store sensitive information, and come back to your
              notes from any device without worrying who else can see them.
            </p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInFromBotom}
              className="flex flex-wrap items-center gap-3 pt-4"
            >
              {token ? (
                <>
                  <Link to="/create-note">
                    <Buttons className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-body font-semibold text-white shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:bg-primary-hover">
                      Create note
                    </Buttons>
                  </Link>
                  <Link to="/notes">
                    <Buttons className="inline-flex items-center justify-center rounded-full border border-border-subtle bg-bg-surface px-7 py-2.5 text-body font-semibold text-text-main shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:bg-bg-subtle">
                      View my notes
                    </Buttons>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <Buttons className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-body font-semibold text-white shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:bg-primary-hover">
                      Get started
                    </Buttons>
                  </Link>
                  <Link to="/login">
                    <Buttons className="inline-flex items-center justify-center rounded-full border border-border-subtle bg-bg-surface px-7 py-2.5 text-body font-semibold text-text-main shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:bg-bg-subtle">
                      Sign in
                    </Buttons>
                  </Link>
                </>
              )}
            </motion.div>

            <p className="pt-2 text-[11px] text-text-muted">
              No clutter, no timelines—just you and your encrypted notes.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInFromBotom}
            className="rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-card-md"
          >
            <h2 className="mb-3 text-h3 font-semibold text-text-main">
              A calm space for your notes
            </h2>
            <p className="mb-5 text-body text-text-muted">
              See a snapshot of how Incrypt keeps your information organized and
              secure at a glance.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-primary">
                  Private by default
                </p>
                <p className="mt-2 text-body text-text-main">
                  Every note lives in your account and stays tied to you.
                </p>
              </div>
              <div className="rounded-xl bg-bg-subtle p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                  Simple to use
                </p>
                <p className="mt-2 text-body text-text-main">
                  A writing experience that feels light, focused, and familiar.
                </p>
              </div>
              <div className="rounded-xl bg-bg-subtle p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                  Built for focus
                </p>
                <p className="mt-2 text-body text-text-main">
                  No feeds or distractions—just your content in a clean layout.
                </p>
              </div>
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-primary">
                  Backed by Incrypt
                </p>
                <p className="mt-2 text-body text-text-main">
                  A secure backend handles auth, roles, and protection for you.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary sections */}
        <div className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-center text-h2 font-semibold text-text-main">
              Why teams and individuals choose Incrypt
            </h2>
            <p className="mx-auto max-w-2xl text-center text-body text-text-muted">
              Incrypt keeps important information close and secure, whether
              you&apos;re planning projects, keeping personal records, or
              storing details you can&apos;t afford to lose.
            </p>
            <Brands />
          </section>

          <section>
            <State />
          </section>

          <section className="pb-10">
            <h2 className="mb-10 text-center text-h2 font-semibold text-text-main">
              What people are saying
            </h2>
            <Testimonial />
          </section>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
