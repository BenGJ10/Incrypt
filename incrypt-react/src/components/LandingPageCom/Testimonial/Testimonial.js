import React from "react";
import TestimonialItem from "./TestimonialItem";
import { motion } from "framer-motion";

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
    transition: { duration: 0.5 },
  },
};

const Testimonial = () => {
  return (
    <motion.div
      className="grid grid-cols-1 gap-x-4 gap-y-8 px-5 md:grid-cols-2 lg:grid-cols-3 md:px-0"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <TestimonialItem
        variants={itemVariants}
        title="Secure without slowing me down"
        text="I moved strategic planning notes to Incrypt and immediately felt the difference. The interface is clean, and the security feels robust without getting in the way."
        name="Clarie Blake"
        status="Product Manager"
        imgurl="https://i.pravatar.cc/120?img=32"
      />
      <TestimonialItem
        variants={itemVariants}
        title="A calm writing experience"
        text="Most tools distract me with too much noise. Incrypt feels intentionally focused, and that helps me capture ideas faster with confidence and help my team do the same."
        name="Amira Noor"
        status="Senior Designer"
        imgurl="https://i.pravatar.cc/120?img=47"
      />
      <TestimonialItem
        variants={itemVariants}
        title="Strong fit for sensitive workflows"
        text="For architecture decisions and incident notes, Incrypt gives our team a safer home for our most important documentation. The security features are a game-changer for us."
        name="Jordan Henderson"
        status="Engineering Lead"
        imgurl="https://i.pravatar.cc/120?img=12"
      />
    </motion.div>
  );
};

export default Testimonial;
