/**
 * Custom Hook สำหรับ Scroll-triggered Animations
 * ใช้สำหรับทำ animations เมื่อ scroll ถึง element
 */

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface UseScrollAnimationOptions {
  threshold?: number;
  once?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, once = true } = options;
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once,
    amount: threshold 
  });

  return { ref, isInView };
}

/**
 * Custom Hook สำหรับ Parallax Effect
 */
export function useParallax(speed: number = 0.5) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * speed);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  return offsetY;
}
