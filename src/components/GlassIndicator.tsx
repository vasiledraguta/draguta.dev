import { motion } from 'motion/react';

interface GlassIndicatorProps {
  style: {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
  };
}

const GlassIndicator = ({ style }: GlassIndicatorProps) => {
  return (
    <motion.span
      className='absolute rounded-2xl -z-10 pointer-events-none'
      initial={{ opacity: 0, ...style }}
      animate={{
        opacity: 1,
        ...style,
      }}
      exit={{ opacity: 0 }}
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: `
          inset 0 1px 1px 0 rgba(255,255,255,0.2),
          inset 0 -1px 1px 0 rgba(255,255,255,0.1),
          0 4px 12px -4px rgba(0,0,0,0.2),
          0 8px 24px -8px rgba(0,0,0,0.15)
        `,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
    />
  );
};

export default GlassIndicator;
