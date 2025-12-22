import * as React from 'react';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const getThemePreference = (): 'light' | 'dark' => {
      if (
        typeof localStorage !== 'undefined' &&
        localStorage.getItem('theme')
      ) {
        return localStorage.getItem('theme') as 'light' | 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    };
    setTheme(getThemePreference());

    const handleThemeToggle = (e: CustomEvent<{ theme: 'light' | 'dark' }>) => {
      setTheme(e.detail.theme);
    };
    window.addEventListener('theme-toggle', handleThemeToggle as EventListener);
    return () => {
      window.removeEventListener(
        'theme-toggle',
        handleThemeToggle as EventListener
      );
    };
  }, []);

  React.useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const audio = new Audio('/light-switch.mp3');
    audio.volume = 0.5;
    audio.play();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className='relative flex items-center justify-center size-10 rounded-full bg-button-bg backdrop-blur-sm border border-border hover:bg-button-hover transition-colors text-foreground active:scale-95 overflow-hidden'
    >
      <AnimatePresence mode='wait' initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0.8, scale: 0.8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0.8, scale: 0.8, filter: 'blur(4px)' }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
          className='flex items-center justify-center'
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
