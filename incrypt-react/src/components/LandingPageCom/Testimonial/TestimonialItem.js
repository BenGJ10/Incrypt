import React from "react";
import Avatar from "@mui/material/Avatar";
import { motion } from "framer-motion";

const TestimonialItem = ({ title, text, name, status, imgurl, variants }) => {
  return (
    <motion.div
      variants={variants}
      className="group flex flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-custom"
    >
      <h1 className="pb-3 text-h3 font-semibold text-text-main transition-colors duration-300 group-hover:text-primary">
        {title}
      </h1>

      <p className="text-body leading-6 text-text-muted">{text}</p>

      <div className="pt-5 flex gap-2 items-center">
        <Avatar alt={name} src={imgurl} sx={{ width: 40, height: 40 }} />
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
