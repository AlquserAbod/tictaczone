import { useState, useEffect } from 'react';

const useTimer = (initialSeconds, onComplete) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
      if (onComplete) {
        onComplete();
      }
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  return {
    seconds,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer
  };
};

export default useTimer;
