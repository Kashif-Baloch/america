"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import "flag-icons/css/flag-icons.min.css";
import { LucideQuote } from "lucide-react";

// Infinite smooth horizontal carousel that resumes from where it was paused
function InfiniteHorizontalCarousel({
  children,
  speed = 1.4,
}: {
  children: React.ReactNode;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Infinite seamless: duplicate set of children
  const childArray = React.Children.toArray(children);
  const items = [...childArray, ...childArray];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;

    // Animation loop
    const animate = () => {
      if (!container) return;

      if (!paused) {
        if (container.scrollLeft >= container.scrollWidth / 2) {
          // Instead of jump, subtract half length to loop seamlessly
          container.scrollLeft =
            container.scrollLeft - container.scrollWidth / 2;
        }
        container.scrollLeft += speed;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [paused, speed, childArray.length]);

  // Pause/resume on user intent
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pause = () => setPaused(true);
    const resume = () => setPaused(false);
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    container.addEventListener("touchstart", pause);
    container.addEventListener("touchend", resume);
    container.addEventListener("focusin", pause);
    container.addEventListener("focusout", resume);

    return () => {
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
      container.removeEventListener("focusin", pause);
      container.removeEventListener("focusout", resume);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar overflow-x-auto pl-4 py-10 pr-4"
      tabIndex={0}
      style={{
        display: "flex",
        flexWrap: "nowrap",
        gap: "2.5rem",
        scrollBehavior: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}
      aria-label="Testimonials carousel"
    >
      {items.map((child, idx) => (
        <div
          aria-hidden={idx >= items.length / 2}
          tabIndex={-1}
          key={idx}
          style={{ flex: "0 0 auto" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// --- TestimonialCard & Testimonials remains the same ---

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: {
    name: string;
    country: string;
    flag: string;
    text: string;
    image: string;
  };
}) => (
  <div className="bg-white border border-border min-h-full rounded-[32px] font-sf px-8 py-2 pt-10 pb-9 shadow-xs max-w-[370px] text-center flex flex-col items-center relative w-full min-w-[340px]">
    <div className="absolute top-8 left-8 flex flex-col items-center">
      <span
        className={`fi fi-${testimonial.flag} rounded-sm flex text-4xl flex-shrink-0`}
      />
      <span className=" mt-2">{testimonial.country}</span>
    </div>
    <div className="relative mb-5">
      <span className="block rounded-full border-4 border-primary-blue shadow-lg">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          width={110}
          height={110}
          className="rounded-full object-cover object-center size-32"
        />
      </span>
      <span className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-primary-blue text-white w-12 h-12 flex items-center justify-center rounded-full text-3xl">
        <LucideQuote />
      </span>
    </div>
    <p className="text-gray-500 mb-8 font-inter min-h-[210px] md:min-h-[180px]">
      {testimonial.text}
    </p>
    <div className="flex items-center justify-center gap-2 mt-2">
      <span className="text-xl font-sf font-semibold">{testimonial.name}</span>
    </div>
  </div>
);

export default function Testimonials() {
  const t = useTranslations("home.testimonials");
  const testimonials = t.raw("testimonials") as {
    name: string;
    country: string;
    flag: string;
    text: string;
    image: string;
  }[];
  const showcaseCountryNames = t.raw("showcaseCountryNames") as string[];
  const flagKeys = testimonials.map((testimonial) => testimonial.flag);

  return (
    <div className=" my-16 font-sf helmet">
      <h1 className="md:text-5xl  sm:text-4xl text-3xl font-bold leading-[1.2] text-center mb-10">
        {t.rich("title", {
          flags: () => (
            <>
              {flagKeys.map((flag, idx) => (
                <span key={flag} className="inline-flex items-center">
                  {idx > 0 && (
                    <span>
                      {idx === flagKeys.length - 1
                        ? t("and", { default: "y" })
                        : ", "}
                    </span>
                  )}
                  <span className={`fi fi-${flag} size-7 align-middle mx-1`} />
                  {showcaseCountryNames[idx]}
                </span>
              ))}
            </>
          ),
        })}
        <span className="bg-primary-blue inline-flex w-max text-white  px-2 ml-2 rounded-xs py-1">
          America Working!
        </span>
      </h1>
      <InfiniteHorizontalCarousel>
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </InfiniteHorizontalCarousel>
    </div>
  );
}
