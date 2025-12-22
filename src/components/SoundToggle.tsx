import * as React from 'react';
import {
  SpeakerSimpleHighIcon,
  SpeakerSimpleSlashIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

const SoundToggle = () => {
  const [isMuted, setIsMuted] = React.useState(true);

  React.useEffect(() => {
    const handleSoundToggle = (e: CustomEvent<{ muted: boolean }>) => {
      setIsMuted(e.detail.muted);
    };
    window.addEventListener('sound-toggle', handleSoundToggle as EventListener);
    return () => {
      window.removeEventListener(
        'sound-toggle',
        handleSoundToggle as EventListener
      );
    };
  }, []);

  const toggleSound = () => {
    const video = document.querySelector('video');
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  return (
    <button
      onClick={toggleSound}
      className='relative flex items-center justify-center size-10 rounded-full bg-button-bg backdrop-blur-sm border border-border hover:bg-button-hover transition-colors text-foreground active:scale-95 overflow-hidden'
    >
      <AnimatePresence mode='wait' initial={false}>
        <motion.span
          key={isMuted ? 'muted' : 'unmuted'}
          initial={{ opacity: 0.8, scale: 0.8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0.8, scale: 0.8, filter: 'blur(4px)' }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
          className='flex items-center justify-center'
        >
          {isMuted ? <SpeakerSimpleSlashIcon /> : <SpeakerSimpleHighIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default SoundToggle;
