import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import React, { useRef } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export default function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = text.split("");

  return (
    <p ref={containerRef} className={`${className} relative flex flex-wrap leading-relaxed`}>
      {chars.map((char, index) => {
        const start = index / chars.length;
        // overlap characters slightly for a smoother wave effect
        const end = Math.min(1, (index + 4) / chars.length);

        return (
          <Character
            key={index}
            char={char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
  key?: React.Key;
}

function Character({ char, progress, range }: CharacterProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  if (char === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }

  return (
    <span className="relative inline-block">
      {/* Invisible placeholder for exact layout/sizing */}
      <span className="opacity-0">{char}</span>
      {/* Absolute positioned animated character */}
      <motion.span style={{ opacity }} className="absolute left-0 top-0 text-[#0C0C0C]">
        {char}
      </motion.span>
    </span>
  );
}
