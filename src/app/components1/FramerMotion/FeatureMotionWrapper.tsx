"use client";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface FeatureMotionWrapperProps {
  children: ReactNode;
  index: number;
}

export default function FeatureMotionWrapper({
  children,
  index,
}: FeatureMotionWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Use a consistent seeded random function to generate deterministic animations
  const seedRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const getRandomDirection = (
    index: number,
    min: number,
    max: number
  ): number => {
    // Use the index as a seed to generate consistent "random" values
    const seed = seedRandom(index + 42);
    return Math.floor(seed * (max - min + 1)) + min;
  };

  useEffect(() => {
    const currentRef = ref.current; // Local variable to capture current ref

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Optional: reset visibility when element leaves viewport
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup observer on component unmount
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // Empty dependency array as we're using a local variable for the ref

  return (
    <motion.div
      ref={ref}
      initial={{
        x: getRandomDirection(index, -200, 200),
        y: getRandomDirection(index, -200, 200),
        opacity: 0,
      }}
      animate={
        isVisible
          ? { x: 0, y: 0, opacity: 1 }
          : {
              x: getRandomDirection(index, -200, 200),
              y: getRandomDirection(index, -200, 200),
              opacity: 0,
            }
      }
      transition={{
        duration: 0.3 + index * 0.1,
        delay: 0.1 + index * 0.05,
        ease: "linear", // or "easeOut" for a slightly smoother feel
      }}
    >
      {children}
    </motion.div>
  );
}
