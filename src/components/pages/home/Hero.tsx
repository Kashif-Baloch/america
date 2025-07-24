"use client";

import React from "react";
import Searchbar from "./components/Searchbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import CountUp from "react-countup";
import { useTranslations } from "next-intl";
const sliderImages = [
  "/images/hero-slider-1.jpg",
  "/images/hero-slider-2.jpg",
  "/images/hero-slider-3.jpg",
  "/images/hero-slider-4.jpg",
  "/images/hero-slider-5.jpg",
  "/images/hero-slider-6.jpg",
  "/images/hero-slider-7.jpg",
  "/images/hero-slider-8.jpg",
  "/images/hero-slider-9.jpg",
];

export default function HeroSection() {
  const t = useTranslations("home");
  return (
    <div className="relative">
      <div className="relative min-h-[519px] flex flex-col items-center font-sf">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={1700}
            noSwiping={true}
            allowTouchMove={false}
            simulateTouch={false}
            preventClicks={false}
            preventClicksPropagation={true}
            keyboard={false}
            mousewheel={false}
            className="h-full w-full"
          >
            {sliderImages.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <Image
                    src={item}
                    alt={`Hero background ${index + 1}`}
                    fill
                    className="object-cover   size-full"
                    priority={index === 0}
                  />
                  {/* Overlay Effect */}
                  <div className="absolute inset-0 bg-black/70" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-24 mt-14 md:w-full w-[90%] md:min-w-[749px] max-w-[920px]  px-4 flex flex-col justify-center  mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-5  w-full">
            <h1 className="md:!text-[48px] w-full sm:text-4xl text-3xl font-bold text-white leading-[1.2] mb-6">
              {t.rich("headline", {
                count: () => (
                  <span className="relative inline-block bg-primary-blue text-white px-4 rounded-sm min-w-[110px] text-center font-mono">
                    <span className="invisible">+240,000</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <CountUp
                        start={100}
                        end={240000}
                        duration={4}
                        separator=","
                        prefix="+"
                      />
                    </span>
                  </span>
                ),
              })}
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-12 max-w-[749px] mx-auto">
            <p className="text-white/90 w-full mx-auto leading-relaxed">
              {t("subtext")}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar For Tablet,Desktop */}
      <div className="">
        <Searchbar />
      </div>

      {/* For Extra Space */}
      <div className="h-10 md:block hidden bg-white"></div>
    </div>
  );
}
