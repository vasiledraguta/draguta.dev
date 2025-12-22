export function initVideo() {
  const video = document.getElementById('bg-video') as HTMLVideoElement | null;
  if (!video) return;

  const savedTime = localStorage.getItem('video-time');
  if (savedTime) {
    video.currentTime = parseFloat(savedTime);
  }

  setInterval(() => {
    localStorage.setItem('video-time', video.currentTime.toString());
  }, 500);

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('video-time', video.currentTime.toString());
  });
}
