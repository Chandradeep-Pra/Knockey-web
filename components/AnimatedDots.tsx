"use client";

import { dotDrop } from "@/lib/animations";
import { motion } from "framer-motion";

const COLORS = ["#6C63FF", "#9ED8DB", "#FFD6A5"];

export default function AnimatedDots() {
  return (
    <div className="flex flex-col items-center gap-2 pt-2">

      {COLORS.map((color, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={dotDrop}
          initial="hidden"
          animate="visible"
          style={{
            width: 10,
            height: 10,
            borderRadius: "999px",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
