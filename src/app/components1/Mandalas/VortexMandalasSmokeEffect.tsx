"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TriangleMandalas from "./TriangleMandalas";

// import VaryingShapeMandalas from "./VaryingShapeMandalas";

// Type definitions
interface BaseParticle {
  id: string;
  size: number;
  startX: number;
  startY: number;
  whiteColor: string;
  purpleColor: string;
  duration: number;
  delay: number;
  expiry: number;
}

interface LargeParticle extends BaseParticle {
  mid1X: number;
  mid1Y: number;
  mid2X: number;
  mid2Y: number;
  endX: number;
  endY: number;
}

interface SmallParticle extends BaseParticle {
  midX: number;
  midY: number;
  endX: number;
  endY: number;
}

interface VortexShape {
  id: string;
  centerX: number;
  centerY: number;
  size: number;
  duration: number;
  rotations: number;
  arms: number;
  color1: string;
  color2: string;
  delay: number;
  expiry: number;
}

interface MandalaShape {
  id: string;
  centerX: number;
  centerY: number;
  size: number;
  duration: number;
  elements: number;
  rings: number;
  color1: string;
  color2: string;
  delay: number;
  expiry: number;
}

// Bright white colors
const smokeColors: string[] = [
  "rgba(255, 255, 255, 0.85)",
  "rgba(255, 255, 255, 0.8)",
  "rgba(255, 255, 255, 0.75)",
  "rgba(254, 254, 254, 0.9)",
  "rgba(253, 253, 253, 0.95)",
];

// Purple fade colors
const purpleColors: string[] = [
  "rgba(31, 4, 58, 0.85)",
  "rgb(34, 4, 66)",
  "rgba(12, 1, 22, 0.75)",
  "rgba(110, 38, 187, 0.9)",
  "rgba(27, 24, 191, 0.95)",
];

// Blue colors for mandalas
const blueColors: string[] = [
  "rgba(25, 25, 112, 0.85)", // Midnight blue
  "rgba(65, 105, 225, 0.9)", // Royal blue
  "rgba(0, 0, 255, 0.8)", // Blue
  "rgba(30, 144, 255, 0.85)", // Dodger blue
  "rgba(0, 191, 255, 0.8)", // Deep sky blue
];

// Unique ID generator
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.floor(
    Math.random() * 1000
  )}`;
};

function VortexMandalaSmokeEffect(): React.ReactElement {
  const [particles, setParticles] = useState<LargeParticle[]>([]);
  const [smallParticles, setSmallParticles] = useState<SmallParticle[]>([]);
  const [vortexShapes, setVortexShapes] = useState<VortexShape[]>([]);
  const [mandalaShapes, setMandalaShapes] = useState<MandalaShape[]>([]);

  // Create new particles at regular intervals
  useEffect(() => {
    // Generate initial particles
    generateParticles();
    generateSmallParticles();
    generateVortexShapes();
    generateMandalaShapes();

    // Set up intervals for continuous generation
    const largeInterval = setInterval(() => {
      generateParticles();
    }, 2000); // Create new large particles every 2 seconds

    const smallInterval = setInterval(() => {
      generateSmallParticles();
    }, 1500); // Create new small particles every 1.5 seconds

    const vortexInterval = setInterval(() => {
      generateVortexShapes();
    }, 3000); // Create new vortex shapes every 3 seconds

    const mandalaInterval = setInterval(() => {
      generateMandalaShapes();
    }, 4000); // Create new mandala shapes every 4 seconds

    return () => {
      clearInterval(largeInterval);
      clearInterval(smallInterval);
      clearInterval(vortexInterval);
      clearInterval(mandalaInterval);
    };
  }, []);

  // Function to generate large particles
  const generateParticles = (): void => {
    const newParticles: LargeParticle[] = Array(5)
      .fill(0)
      .map(() => ({
        id: generateUniqueId(),
        size: Math.random() * 120 + 60,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        whiteColor: smokeColors[Math.floor(Math.random() * smokeColors.length)],
        purpleColor:
          purpleColors[Math.floor(Math.random() * purpleColors.length)],
        duration: 3.5 + Math.random() * 2,
        mid1X: (Math.random() - 0.5) * 100,
        mid1Y: (Math.random() - 0.5) * 100 - 50,
        mid2X: (Math.random() - 0.5) * 100 + (Math.random() - 0.5) * 80,
        mid2Y: (Math.random() - 0.5) * 100 - 50 + (Math.random() - 0.5) * 80,
        endX:
          (Math.random() - 0.5) * 100 +
          (Math.random() - 0.5) * 80 +
          (Math.random() - 0.5) * 60,
        endY:
          (Math.random() - 0.5) * 100 -
          50 +
          (Math.random() - 0.5) * 80 +
          (Math.random() - 0.5) * 60,
        delay: Math.random() * 0.5,
        expiry: Date.now() + (3.5 + Math.random() * 2) * 1000 + 500, // Duration + delay + buffer
      }));

    setParticles((current) => [...current, ...newParticles]);

    // Clean up expired particles
    setParticles((current) => current.filter((p) => p.expiry > Date.now()));
  };

  // Function to generate small particles
  const generateSmallParticles = (): void => {
    const newParticles: SmallParticle[] = Array(4)
      .fill(0)
      .map(() => ({
        id: generateUniqueId(),
        size: Math.random() * 50 + 20,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        whiteColor: smokeColors[Math.floor(Math.random() * smokeColors.length)],
        purpleColor:
          purpleColors[Math.floor(Math.random() * purpleColors.length)],
        duration: 2.5 + Math.random() * 1.5,
        midX: (Math.random() - 0.5) * 60,
        midY: (Math.random() - 0.5) * 60 - 30,
        endX: (Math.random() - 0.5) * 60 + (Math.random() - 0.5) * 40,
        endY: (Math.random() - 0.5) * 60 - 30 + (Math.random() - 0.5) * 40,
        delay: Math.random() * 0.3,
        expiry: Date.now() + (2.5 + Math.random() * 1.5) * 1000 + 500, // Duration + delay + buffer
      }));

    setSmallParticles((current) => [...current, ...newParticles]);

    // Clean up expired particles
    setSmallParticles((current) =>
      current.filter((p) => p.expiry > Date.now())
    );
  };

  // Function to generate vortex shapes
  const generateVortexShapes = (): void => {
    const newVortexes: VortexShape[] = Array(2)
      .fill(0)
      .map(() => {
        const centerX = Math.random() * 80 + 10; // Keep away from extreme edges
        const centerY = Math.random() * 80 + 10;
        const size = Math.random() * 150 + 100;
        const duration = 6 + Math.random() * 3;
        const rotations = 2 + Math.random() * 3;
        const arms = Math.floor(Math.random() * 3) + 3; // 3-5 arms
        const color1 =
          purpleColors[Math.floor(Math.random() * purpleColors.length)];
        const color2 =
          blueColors[Math.floor(Math.random() * blueColors.length)];

        return {
          id: generateUniqueId(),
          centerX,
          centerY,
          size,
          duration,
          rotations,
          arms,
          color1,
          color2,
          delay: Math.random() * 0.5,
          expiry: Date.now() + duration * 1000 + 500, // Duration + buffer
        };
      });

    setVortexShapes((current) => [...current, ...newVortexes]);

    // Clean up expired vortexes
    setVortexShapes((current) => current.filter((v) => v.expiry > Date.now()));
  };

  // Function to generate mandala shapes
  const generateMandalaShapes = (): void => {
    const newMandalas: MandalaShape[] = Array(1)
      .fill(0)
      .map(() => {
        const centerX = Math.random() * 80 + 10; // Keep away from extreme edges
        const centerY = Math.random() * 80 + 10;
        const size = Math.random() * 120 + 80;
        const duration = 7 + Math.random() * 4;
        const elements = Math.floor(Math.random() * 4) + 6; // 6-9 elements
        const rings = Math.floor(Math.random() * 2) + 2; // 2-3 rings
        const color1 =
          purpleColors[Math.floor(Math.random() * purpleColors.length)];
        const color2 =
          blueColors[Math.floor(Math.random() * blueColors.length)];

        return {
          id: generateUniqueId(),
          centerX,
          centerY,
          size,
          duration,
          elements,
          rings,
          color1,
          color2,
          delay: Math.random() * 0.8,
          expiry: Date.now() + duration * 1000 + 800, // Duration + buffer
        };
      });

    setMandalaShapes((current) => [...current, ...newMandalas]);

    // Clean up expired mandalas
    setMandalaShapes((current) => current.filter((m) => m.expiry > Date.now()));
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <TriangleMandalas />
      <div className="absolute w-full h-full">
        <AnimatePresence>
          {/* Large particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                filter: `blur(${particle.size / 3}px) brightness(1.5)`,
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
                mixBlendMode: "lighten",
                pointerEvents: "none",
              }}
              initial={{
                scale: 0.3,
                opacity: 0,
                backgroundColor: particle.whiteColor,
                boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.5)",
                x: 0,
                y: 0,
              }}
              animate={{
                scale: [0.3, 0.7, 1.1, 1.3],
                opacity: [0, 0.8, 0.6, 0],
                x: [0, particle.mid1X, particle.mid2X, particle.endX],
                y: [0, particle.mid1Y, particle.mid2Y, particle.endY],
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
              }}
              transition={{
                duration: particle.duration,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
                delay: particle.delay,
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{
                  backgroundColor: particle.whiteColor,
                  boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.5)",
                }}
                animate={{
                  backgroundColor: particle.purpleColor,
                  boxShadow: "0 0 20px 5px rgba(160, 100, 220, 0.5)",
                }}
                transition={{
                  duration: 1,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ))}

          {/* Small particles */}
          {smallParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                filter: `blur(${particle.size / 4}px) brightness(1.6)`,
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
                mixBlendMode: "lighten",
                pointerEvents: "none",
              }}
              initial={{
                scale: 0.2,
                opacity: 0,
                backgroundColor: particle.whiteColor,
                boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.6)",
                x: 0,
                y: 0,
              }}
              animate={{
                scale: [0.2, 0.5, 0.8, 1],
                opacity: [0, 0.7, 0.5, 0],
                x: [0, particle.midX, particle.endX],
                y: [0, particle.midY, particle.endY],
              }}
              exit={{
                opacity: 0,
                scale: 0.3,
              }}
              transition={{
                duration: particle.duration,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
                delay: particle.delay,
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{
                  backgroundColor: particle.whiteColor,
                  boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.6)",
                }}
                animate={{
                  backgroundColor: particle.purpleColor,
                  boxShadow: "0 0 15px 5px rgba(160, 100, 220, 0.6)",
                }}
                transition={{
                  duration: 0.9,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ))}

          {/* Vortex shapes (placeholder for now) */}
          {vortexShapes.map((vortex) => (
            <motion.div
              key={vortex.id}
              className="absolute"
              style={{
                width: vortex.size,
                height: vortex.size,
                left: `${vortex.centerX}%`,
                top: `${vortex.centerY}%`,
                pointerEvents: "none",
              }}
              initial={{
                opacity: 0,
                scale: 0.5,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 1.2],
                rotate: [0, vortex.rotations * 360],
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
              }}
              transition={{
                duration: vortex.duration,
                delay: vortex.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Mandala shapes (placeholder for now) */}
          {mandalaShapes.map((mandala) => (
            <motion.div
              key={mandala.id}
              className="absolute"
              style={{
                width: mandala.size,
                height: mandala.size,
                left: `${mandala.centerX}%`,
                top: `${mandala.centerY}%`,
                pointerEvents: "none",
              }}
              initial={{
                opacity: 0,
                scale: 0.3,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.3, 1, 1.1],
                rotate: [0, 180],
              }}
              exit={{
                opacity: 0,
                scale: 0.3,
              }}
              transition={{
                duration: mandala.duration,
                delay: mandala.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VortexMandalaSmokeEffect;
