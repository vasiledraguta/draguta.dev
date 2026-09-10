import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { Transition, Variants } from "motion/react";

export type SwapDirection = "up" | "down";

interface AnimatedTextProps {
  value: string;
  direction?: SwapDirection;
  ready?: boolean;
}

const EXIT: Transition = { duration: 0.13, ease: [0.32, 0, 0.67, 0] };
const ENTER: Transition = { duration: 0.28, ease: [0.16, 1, 0.3, 1] };

const variants: Variants = {
  initial: (travel: number) => ({
    opacity: 0,
    y: travel,
    filter: "blur(3px)",
  }),
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: ENTER,
  },
  exit: (travel: number) => ({
    opacity: 0,
    y: -travel,
    filter: "blur(3px)",
    transition: EXIT,
  }),
};

const AnimatedText = ({
  value,
  direction = "up",
  ready = true,
}: AnimatedTextProps) => {
  if (!ready) return <span className="inline-block">{value}</span>;

  const travel = direction === "up" ? 5 : -5;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false} custom={travel}>
        <motion.span
          key={value}
          custom={travel}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </MotionConfig>
  );
};

export default AnimatedText;
