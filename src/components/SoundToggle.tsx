import * as React from 'react';
import {
  SpeakerSimpleHighIcon,
  SpeakerSimpleSlashIcon,
} from '@phosphor-icons/react';

const SoundToggle = () => {
  const [isMuted, setIsMuted] = React.useState(true);

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
      className='flex items-center justify-center size-10 rounded-full bg-button-bg backdrop-blur-sm border border-border hover:bg-button-hover transition-colors text-foreground'
    >
      {isMuted ? <SpeakerSimpleSlashIcon /> : <SpeakerSimpleHighIcon />}
    </button>
  );
};

export default SoundToggle;
