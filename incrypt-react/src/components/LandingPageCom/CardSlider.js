import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards";

import { EffectCards } from "swiper/modules";

export default function CardSlider() {
  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      modules={[EffectCards]}
      className="mySwiper w-[240px] h-[320px]"
    >
      <SwiperSlide className="rounded-md overflow-hidden text-white font-semibold text-lg">
        <div className="flex h-full items-center justify-center bg-primary">
          Incrypt
        </div>
      </SwiperSlide>

      <SwiperSlide className="rounded-md overflow-hidden text-white font-semibold text-lg">
        <div className="flex h-full items-center justify-center bg-teal-500">
          More Faster
        </div>
      </SwiperSlide>

      <SwiperSlide className="rounded-md overflow-hidden text-white font-semibold text-lg">
        <div className="flex h-full items-center justify-center bg-slate-800">
          Faster Impression
        </div>
      </SwiperSlide>

      <SwiperSlide className="rounded-md overflow-hidden text-white font-semibold text-lg">
        <div className="flex h-full items-center justify-center bg-indigo-700">
          Higher Lead Quality
        </div>
      </SwiperSlide>

      <SwiperSlide className="rounded-md overflow-hidden text-white font-semibold text-lg">
        <div className="flex h-full items-center justify-center bg-fuchsia-600 text-center px-4">
          Higher Conversion Rate
        </div>
      </SwiperSlide>
    </Swiper>
  );
}