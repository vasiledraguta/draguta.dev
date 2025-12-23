import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HoverImageProps {
  text: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

export default function HoverImage({
  text,
  imageSrc,
  imageAlt = '',
  className = '',
}: HoverImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={`relative inline-block cursor-default overflow-visible ${className}`}
      style={{ overflow: 'visible' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
      <AnimatePresence>
        {isHovered && (
          <span
            className='absolute bottom-full left-1/2 flex flex-col items-center'
            style={{ transform: 'translateX(-50%)' }}
          >
            <motion.div
              initial={{
                opacity: 0,
                filter: 'blur(8px)',
                rotate: -8,
                scale: 0.9,
                y: 10,
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
                rotate: 3,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                filter: 'blur(8px)',
                rotate: -8,
                scale: 0.9,
                y: 10,
              }}
              transition={{
                opacity: { duration: 0.2, ease: 'easeOut' },
                filter: { duration: 0.2, ease: 'easeOut' },
                rotate: {
                  duration: 0.2,
                  ease: 'easeOut',
                  type: 'spring',
                  stiffness: 100,
                  damping: 10,
                },
                scale: {
                  duration: 0.2,
                  ease: 'easeOut',
                  type: 'spring',
                  stiffness: 100,
                  damping: 10,
                },
                y: {
                  duration: 0.2,
                  ease: 'easeOut',
                  type: 'spring',
                  stiffness: 100,
                  damping: 10,
                },
              }}
              style={{
                width: 160,
                height: 160,
                marginBottom: 8,
                willChange: 'transform, opacity, filter',
              }}
              className='relative rounded-xl shadow-2xl overflow-hidden bg-zinc-800'
            >
              <img
                src={imageSrc}
                alt={imageAlt}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </motion.div>
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}
