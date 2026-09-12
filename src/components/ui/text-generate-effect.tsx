"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  trigger = true,
  style,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  trigger?: boolean;
  style?: React.CSSProperties;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!scope.current) return;
    if (trigger) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration || 0.6,
          delay: stagger(0.08),
        }
      );
    } else {
      animate(
        "span",
        {
          opacity: 0,
          filter: filter ? "blur(10px)" : "none",
        },
        { duration: 0.2 }
      );
    }
  }, [scope.current, trigger, filter, duration]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-white opacity-0 inline-block mr-[0.28em] will-change-transform"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)} style={style}>
      <div className="mt-2">
        <div className="text-white leading-[1.12] tracking-tight">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

export default TextGenerateEffect;
