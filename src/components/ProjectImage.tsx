import { motion } from 'motion/react';

interface ProjectImageProps {
  src: string;
  alt: string;
}

const ProjectImage = ({ src, alt }: ProjectImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className='w-80 aspect-3/4 rounded-2xl shadow-2xl overflow-hidden'
    >
      <img src={src} alt={alt} className='w-full h-full object-cover' />
    </motion.div>
  );
};

export default ProjectImage;
