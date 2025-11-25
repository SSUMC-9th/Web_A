// hooks/useInfiniteScroll.ts
import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (callback: () => void) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observerRef.current.observe(currentTarget);
    }

    return () => {
      if (currentTarget && observerRef.current) {
        observerRef.current.unobserve(currentTarget);
      }
    };
  }, [callback]);

  return { ref: targetRef };
};