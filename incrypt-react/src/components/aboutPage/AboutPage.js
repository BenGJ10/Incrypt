import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { FiLock, FiLayers, FiSmartphone, FiZap, FiShield } from "react-icons/fi";
import { RiSparklingLine } from "react-icons/ri";
import Card from "../ui/Card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const productHighlights = [
  {
    icon: FiLock,
    title: "Private By Design",
    text: "Your notes stay tied to your account with protected access baked into the experience.",
  },
  {
    icon: FiLayers,
    title: "Clean, Focused Workspace",
    text: "Write, organize, and revisit important thoughts without noisy, distracting UI patterns.",
  },
  {
    icon: FiSmartphone,
    title: "Ready Across Devices",
    text: "Keep momentum whether you are at your desk or on the move with a responsive interface.",
  },
  {
    icon: FiZap,
    title: "Fast Daily Flow",
    text: "From sign-in to note retrieval, interactions are optimized for speed and consistency.",
  },
];

const AboutPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-74px)] overflow-hidden bg-bg-subtle py-8 sm:py-10">
      <div className="pointer-events-none absolute -left-24 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />

      <motion.div
        className="mx-auto flex w-[92%] max-w-6xl flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-bg-surface via-bg-surface to-blue-50/60 px-6 py-7 sm:px-8">
            <div className="absolute right-5 top-5 hidden rounded-full border border-border-subtle bg-bg-surface/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary sm:inline-flex">
              Product Story
            </div>
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                <RiSparklingLine className="text-primary" />
                Secure. Focused. Practical.
              </div>
              <h1 className="text-h1 font-semibold leading-tight text-text-main sm:text-[36px]">
                Incrypt is your private product workspace for notes that matter.
              </h1>
              <p className="text-body leading-6 text-text-muted sm:text-[15px]">
                Capture ideas, store sensitive information, and revisit important details in a calm interface designed for trust and clarity. Incrypt helps you move fast while keeping control of your data.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {productHighlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <Card
                key={highlight.title}
                className="group h-full rounded-xl border-border-subtle/90 px-5 py-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-custom"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                  <Icon className="text-xl" />
                </div>
                <h2 className="text-h3 font-semibold text-text-main">{highlight.title}</h2>
                <p className="mt-2 text-body text-text-muted">{highlight.text}</p>
              </Card>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <motion.div variants={itemVariants}>
            <Card className="h-full space-y-5 rounded-xl">
              <h2 className="text-h2 font-semibold text-text-main">What You Get With Incrypt</h2>
              <p className="text-body leading-6 text-text-muted">
                Incrypt is built as a product you can rely on every day. It gives individuals and teams a secure note workflow with clarity, speed, and confidence.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border-subtle bg-bg-subtle p-4">
                  <h3 className="text-body font-semibold text-text-main">Protected Access</h3>
                  <p className="mt-1 text-[13px] text-text-muted">
                    Sign in securely and keep your notes scoped to your account.
                  </p>
                </div>
                <div className="rounded-lg border border-border-subtle bg-bg-subtle p-4">
                  <h3 className="text-body font-semibold text-text-main">Complete Note Flow</h3>
                  <p className="mt-1 text-[13px] text-text-muted">
                    Create, edit, view, and manage notes in a single smooth experience.
                  </p>
                </div>
                <div className="rounded-lg border border-border-subtle bg-bg-subtle p-4">
                  <h3 className="text-body font-semibold text-text-main">Visibility Controls</h3>
                  <p className="mt-1 text-[13px] text-text-muted">
                    Role-based permissions keep user and admin experiences clearly separated.
                  </p>
                </div>
                <div className="rounded-lg border border-border-subtle bg-bg-subtle p-4">
                  <h3 className="text-body font-semibold text-text-main">Operational Confidence</h3>
                  <p className="mt-1 text-[13px] text-text-muted">
                    Auditability and consistent UI patterns support reliable daily usage.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <Card className="w-full rounded-xl border-primary/20 bg-gradient-to-b from-blue-50/80 to-bg-surface px-5 py-5">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white">
                <FiShield className="text-xl" />
              </div>
              <h2 className="text-h3 font-semibold text-text-main">Trusted Product Experience</h2>
              <p className="mt-2 text-body text-text-muted">
                Incrypt is designed to feel lightweight while handling important information with serious care.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-surface px-3 py-2">
                  <span className="text-[12px] font-medium text-text-muted">Privacy-first design</span>
                  <span className="text-[12px] font-semibold text-primary">Enabled</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-surface px-3 py-2">
                  <span className="text-[12px] font-medium text-text-muted">Role-aware access</span>
                  <span className="text-[12px] font-semibold text-primary">Enabled</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-surface px-3 py-2">
                  <span className="text-[12px] font-medium text-text-muted">Reliable note workflow</span>
                  <span className="text-[12px] font-semibold text-primary">Enabled</span>
                </div>
              </div>
            </Card>

            <Card className="w-full space-y-3 rounded-xl">
              <h2 className="text-h3 font-semibold text-text-main">Stay Connected</h2>
              <p className="text-body text-text-main">
                Follow product updates, usage tips, and release improvements.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-white transition-all duration-200 hover:scale-110 hover:bg-primary hover:shadow-md"
                >
                  <FaFacebookF
                    size={18}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-white transition-all duration-200 hover:scale-110 hover:bg-primary hover:shadow-md"
                >
                  <FaTwitter
                    size={18}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-white transition-all duration-200 hover:scale-110 hover:bg-primary hover:shadow-md"
                >
                  <FaLinkedinIn
                    size={18}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-white transition-all duration-200 hover:scale-110 hover:bg-primary hover:shadow-md"
                >
                  <FaInstagram
                    size={18}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
