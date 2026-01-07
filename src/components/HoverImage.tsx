import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface HoverImageProps {
  text: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

const HoverImage = ({
  text,
  imageSrc,
  imageAlt = "",
  className = "",
}: HoverImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const hasHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  const handleMouseEnter = useCallback(() => {
    if (hasHover) setIsOpen(true);
  }, [hasHover]);

  const handleMouseLeave = useCallback(() => {
    if (hasHover) setIsOpen(false);
  }, [hasHover]);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (hasHover) return;
      e.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
        const closeOnOutsideTouch = (event: TouchEvent) => {
          if (!containerRef.current?.contains(event.target as Node)) {
            setIsOpen(false);
            document.removeEventListener("touchstart", closeOnOutsideTouch);
          }
        };
        setTimeout(() => {
          document.addEventListener("touchstart", closeOnOutsideTouch);
        }, 50);
      }
    },
    [hasHover, isOpen]
  );

  return (
    <span
      ref={containerRef}
      className={`relative inline-block cursor-default overflow-visible ${className}`}
      style={{ overflow: "visible" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleTouchEnd}
    >
      {text}
      <AnimatePresence>
        {isOpen && (
          <span
            className="absolute bottom-full left-1/2 flex flex-col items-center"
            style={{ transform: "translateX(-50%)" }}
          >
            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      filter: "blur(8px)",
                      rotate: -8,
                      scale: 0.9,
                      y: 10,
                    }
              }
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                rotate: prefersReducedMotion ? 0 : 3,
                scale: 1,
                y: 0,
                transition: prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      duration: 0.2,
                    },
              }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: 0,
                      filter: "blur(8px)",
                      rotate: -8,
                      scale: 0.9,
                      y: 10,
                      transition: {
                        duration: 0.2,
                        ease: "easeOut",
                      },
                    }
              }
              style={{
                width: 160,
                height: 160,
                marginBottom: 8,
                willChange: prefersReducedMotion
                  ? "auto"
                  : "transform, opacity, filter",
              }}
              className="relative rounded-xl shadow-2xl overflow-hidden bg-zinc-800"
            >
              <img
                src={imageSrc}
                alt={imageAlt}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </motion.div>
          </span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default HoverImage;
