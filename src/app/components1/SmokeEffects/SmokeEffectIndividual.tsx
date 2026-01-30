import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Type definitions
interface Particle {
    id: string;
    size: number;
    startX: number;
    startY: number;
    whiteColor: string;
    purpleColor: string;
    duration: number;
    delay: number;
}

interface LargeParticle extends Particle {
    mid1X: number;
    mid1Y: number;
    mid2X: number;
    mid2Y: number;
    endX: number;
    endY: number;
}

interface SmallParticle extends Particle {
    midX: number;
    midY: number;
    endX: number;
    endY: number;
}

interface SmokeEffectIndividualProps {
    isVisible: boolean;
}

// Bright white colors for the smoke effect
const smokeColors: string[] = [
    "rgba(255, 255, 255, 0.85)",
    "rgba(255, 255, 255, 0.8)",
    "rgba(255, 255, 255, 0.75)",
    "rgba(254, 254, 254, 0.9)",
    "rgba(253, 253, 253, 0.95)",
];

// Purple fade colors for the smoke effect
const purpleColors: string[] = [
    "rgba(31, 4, 58, 0.85)",
    "rgb(34, 4, 66)",
    "rgba(12, 1, 22, 0.75)",
    "rgba(110, 38, 187, 0.9)",
    "rgba(27, 24, 191, 0.95)",
];

// Function to generate particle data for the smoke effect
const generateParticles = (count: number, isSmall: boolean = false): (LargeParticle | SmallParticle)[] => {
    return [...Array(count)].map((_, i: number) => {
        const size: number = isSmall ? 20 + (i % 5) * 10 : 60 + (i % 12) * 10;
        const startX: number = (i * 7) % 100;
        const startY: number = (i * 11) % 100;
        const whiteColor: string = smokeColors[i % smokeColors.length];
        const purpleColor: string = purpleColors[i % purpleColors.length];
        const duration: number = isSmall ? 2.5 + (i % 3) * 0.5 : 3.5 + (i % 4) * 0.5;

        const mid1X: number = ((i * 17) % 100) - 50;
        const mid1Y: number = ((i * 13) % 100) - 50;
        const mid2X: number = mid1X + ((i * 7) % 80) - 40;
        const mid2Y: number = mid1Y + ((i * 11) % 80) - 40;
        const endX: number = mid2X + ((i * 5) % 60) - 30;
        const endY: number = mid2Y + ((i * 9) % 60) - 30;

        if (isSmall) {
            return {
                id: `small-${i}`,
                size,
                startX,
                startY,
                whiteColor,
                purpleColor,
                duration,
                midX: ((i * 17) % 60) - 30,
                midY: ((i * 13) % 60) - 30,
                endX: ((i * 7) % 40) - 20,
                endY: ((i * 11) % 40) - 20,
                delay: (i % 6) * 0.05,
            } as SmallParticle;
        }

        return {
            id: `smoke-${i}`,
            size,
            startX,
            startY,
            whiteColor,
            purpleColor,
            duration,
            mid1X,
            mid1Y,
            mid2X,
            mid2Y,
            endX,
            endY,
            delay: (i % 10) * 0.05,
        } as LargeParticle;
    });
};

const SmokeEffectIndividual: React.FC<SmokeEffectIndividualProps> = ({ isVisible }) => {
    const [showSmoke, setShowSmoke] = useState < boolean > (false);
    const [isClient, setIsClient] = useState < boolean > (false);

    // Handle client-side rendering
    useEffect(() => {
        setIsClient(true);
        if (isVisible) {
            setShowSmoke(true);
            const timer: NodeJS.Timeout = setTimeout(() => setShowSmoke(false), 7000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!isClient || !showSmoke) return null;

    // Generate particles only on the client side
    const largeParticles: LargeParticle[] = generateParticles(30) as LargeParticle[];
    const smallParticles: SmallParticle[] = generateParticles(20, true) as SmallParticle[];

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="relative w-full h-full">
                {largeParticles.map((particle: LargeParticle) => (
                    <motion.div
                        key={particle.id}
                        style={{
                            position: "absolute",
                            borderRadius: "9999px",
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
                        transition={{
                            duration: particle.duration,
                            ease: "easeInOut",
                            times: [0, 0.3, 0.7, 1],
                            delay: particle.delay,
                        }}
                    >
                        <motion.div
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "9999px",
                            }}
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
                {/* Smaller detailed particles for subtle depth */}
                {smallParticles.map((particle: SmallParticle) => (
                    <motion.div
                        key={particle.id}
                        style={{
                            width: particle.size,
                            height: particle.size,
                            filter: `blur(${particle.size / 4}px) brightness(1.6)`,
                            left: `${particle.startX}%`,
                            top: `${particle.startY}%`,
                            mixBlendMode: "lighten",
                            pointerEvents: "none",
                            position: "absolute",
                            borderRadius: "9999px",
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
                        transition={{
                            duration: particle.duration,
                            ease: "easeInOut",
                            times: [0, 0.3, 0.7, 1],
                            delay: particle.delay,
                        }}
                    >
                        <motion.div
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "9999px",
                            }}
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
            </div>
        </div>
    );
};

export default SmokeEffectIndividual;