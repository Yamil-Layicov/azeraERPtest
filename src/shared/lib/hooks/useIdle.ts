import { useState, useEffect } from 'react';

const DEFAULT_IDLE_TIME = 1000 * 60 * 30; 

export const useIdle = (timeout: number = DEFAULT_IDLE_TIME) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timer);
      
      timer = setTimeout(() => {
        setIsIdle(true);
      }, timeout);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout]);

  return isIdle;
};