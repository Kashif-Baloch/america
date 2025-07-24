"use client";

import { useState, useEffect } from "react";

export const useCenterScrollTrigger = () => {
  const [hasReachedCenter, setHasReachedCenter] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isTriggered) return; // Don't do anything if already triggered

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY + windowHeight / 2;
      const pageCenter = documentHeight / 2;
      const buffer = 100;

      const isCenter =
        scrollPosition >= pageCenter - buffer &&
        scrollPosition <= pageCenter + buffer;

      if (isCenter && !hasReachedCenter) {
        setHasReachedCenter(true);
        setIsTriggered(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasReachedCenter, isTriggered]);

  return hasReachedCenter;
};
