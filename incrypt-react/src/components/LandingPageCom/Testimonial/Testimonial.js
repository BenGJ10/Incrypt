import React from "react";
import TestimonialItem from "./TestimonialItem";

const Testimonial = () => {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 px-5 md:grid-cols-2 lg:grid-cols-3 md:px-0">
      <TestimonialItem
        title="Keeps everything secured"
        text="Incrypt is where I keep project ideas, personal notes, and sensitive details. It feels like a private workspace that&apos;s always there when I need it."
        name="Jordan"
        status="Product Manager"
      />
      <TestimonialItem
        title="Simple, calm, and reliable"
        text="I like that Incrypt doesn&apos;t try to be a social feed or a task app. It&apos;s just a clean place to write, and I trust that my notes stay private."
        name="Amira"
        status="Designer"
      />
      <TestimonialItem
        title="Great fit for sensitive work"
        text="We use Incrypt for internal notes that shouldn&apos;t live in chat or email. The roles and access controls behind the scenes gives peace of mind."
        name="Ravi"
        status="Engineering Lead"
      />
    </div>
  );
};

export default Testimonial;
