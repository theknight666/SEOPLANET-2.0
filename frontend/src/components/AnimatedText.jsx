import React from "react";
import { motion } from "framer-motion";

/**
 * Animated text — splits text into words & letters and reveals
 * each letter with a staggered "rise" animation, gated by viewport.
 */
export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  stagger = 0.025,
  as = "h1",
  once = true,
  ariaLabel,
  testId,
}) {
  const Tag = motion[as] || motion.h1;
  const words = text.split(" ");

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10%" }}
      aria-label={ariaLabel || text}
      className={className}
      data-testid={testId}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          className="inline-block whitespace-nowrap"
          style={{ marginRight: "0.25em" }}
        >
          {word.split("").map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              variants={{
                hidden: { y: "110%", opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.7,
                    delay: delay + (wi * 0.05) + ci * stagger,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              className="inline-block"
              style={{ willChange: "transform, opacity" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
