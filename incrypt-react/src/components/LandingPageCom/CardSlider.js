import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards";

import { EffectCards } from "swiper/modules";

const slides = [
  {
    title: "Secure Workspace",
    value: "End-to-end account protection",
    detail: "Role-aware controls and private note ownership.",
    tone: "from-primary to-blue-500",
  },
  {
    title: "Fast Retrieval",
    value: "2x quicker access",
    detail: "Designed for high-frequency daily note usage.",
    tone: "from-teal-500 to-cyan-500",
  },
  {
    title: "Operational Stability",
    value: "99.9% uptime",
    detail: "Consistent availability for teams and individuals.",
    tone: "from-slate-800 to-slate-600",
  },
  {
    title: "Scalable Trust",
    value: "10k+ active users",
    detail: "Growing adoption without compromising privacy.",
    tone: "from-indigo-700 to-violet-600",
  },
  {
    title: "Focused UX",
    value: "Low-noise writing flow",
    detail: "No timeline clutter, just productive note work.",
    tone: "from-amber-500 to-orange-500",
  },
];

export default function CardSlider() {
  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      modules={[EffectCards]}
      className="mySwiper h-[320px] w-[250px] sm:w-[270px]"
    >
      {slides.map((slide) => (
        <SwiperSlide
          key={slide.title}
          className="overflow-hidden rounded-xl border border-white/20 text-white"
        >
          <div className={`flex h-full flex-col justify-between bg-gradient-to-br ${slide.tone} p-5`}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/80">Incrypt Insight</p>
              <h5 className="mt-2 text-xl font-semibold leading-tight">{slide.title}</h5>
            </div>

            <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
              <p className="text-sm font-semibold">{slide.value}</p>
              <p className="mt-1 text-xs text-white/90">{slide.detail}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}