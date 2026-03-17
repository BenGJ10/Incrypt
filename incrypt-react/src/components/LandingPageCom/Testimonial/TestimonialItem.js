import React from "react";
import Avatar from "@mui/material/Avatar";
import { motion } from "framer-motion";

const TestimonialItem = ({ title, text, name, status, imgurl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card-md"
    >
      <h1 className="pb-3 text-h3 font-semibold text-text-main">
        {title}
      </h1>

      <p className="text-body text-text-muted">{text}</p>

      <div className="pt-5 flex gap-2 items-center">
        <Avatar alt={name} src={imgurl} />
        <div className="flex flex-col">
          <span className="text-body font-semibold text-text-main">
            {name}
          </span>
          <span className="-mt-0.5 text-[11px] text-text-muted">
            {status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialItem;
