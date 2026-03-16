import { useEffect, useState } from 'react';
import { getIsDark } from '../utils/get-is-dark.util';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => getIsDark());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDark(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  return isDark;
};
