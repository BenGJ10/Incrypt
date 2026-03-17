import React from "react";
import { motion } from "framer-motion";

const BrandItem = ({ text, icon: Icon, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border-subtle bg-bg-surface px-5 py-7 shadow-card-md"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="text-xl" />
      </div>
      <h3 className="text-lg font-semibold text-text-main">{title}</h3>
      <p className="text-center text-body text-text-muted">{text}</p>
    </motion.div>
  );
};

export default BrandItem;
