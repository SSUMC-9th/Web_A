import { useEffect, useRef } from "react";

type Opt = {
  root?: HTMLElement | null;
  rootMargin?: string;
  enabled: boolean;
  onHit: () => void;
};

export function usePagingSentinel<T extends Element>({
  root,
  rootMargin = "0px 0px 200px 0px",
  enabled,
  onHit,
}: Opt) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!enabled) return;
        if (entries[0]?.isIntersecting) onHit();
      },
      {
        root: root ?? undefined,
        rootMargin,
        threshold: 0,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, enabled, onHit]);

  return ref;
}