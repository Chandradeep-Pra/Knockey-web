"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const COLORS = ["#6C63FF", "#9ED8DB", "#FFD6A5"];

export default function GlobalDots() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // vertical → horizontal
  const rotate = useTransform(scrollYProgress, [0.7, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div ref={ref} className="relative h-[120vh]">
      <motion.div
        style={{ rotate, opacity, y }}
        className="sticky top-32"
      >
        <div className="flex flex-col gap-2">
          {COLORS.map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
