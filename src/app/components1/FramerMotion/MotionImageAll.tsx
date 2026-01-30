"use client"; // Ensures this component runs on the client side

import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";

interface MotionImageProps {
  src?: string; // Make src optional for cases with children
  alt?: string; // Make alt optional for cases with children
  width?: number;
  height?: number;
  className?: string;
  children?: ReactNode; // Add children prop
}

const MotionImageAll: React.FC<MotionImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  children,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }} // Scale effect on hover
      whileTap={{ scale: 1.2 }} // Scale effect on tap
      transition={{ type: "spring", stiffness: 300 }} // Spring transition
      className={`w-full flex justify-center items-center ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || ""}
          width={width}
          height={height}
          className="max-w-full max-h-[600px] object-contain rounded-md"
        />
      ) : (
        children
      )}
    </motion.div>
  );
};

export default MotionImageAll;
