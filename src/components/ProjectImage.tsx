import { motion, useReducedMotion } from 'motion/react';

interface ProjectImageProps {
  src: string;
  alt: string;
}

const ProjectImage = ({ src, alt }: ProjectImageProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, scale: 0.98, filter: 'blur(8px)' }
      }
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={
        prefersReducedMotion
          ? undefined
          : { opacity: 0, scale: 0.98, filter: 'blur(8px)' }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.15, ease: 'easeOut' }
      }
      className='w-80 aspect-3/4 rounded-2xl shadow-2xl overflow-hidden'
    >
      <img src={src} alt={alt} className='w-full h-full object-cover' />
    </motion.div>
  );
};

export default ProjectImage;
