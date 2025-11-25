import { useEffect, useRef, useState } from "react";
import useThrottle from "./useThrottle";

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

  // intersectionObserver가 닿앗다는 이벤트를 카운트로 표현
  const [hitCount, setHitCount] = useState(0);

  // hitCount를 쓰로틀해서 일정 주기마다 한 번만 onHit 호출
  const throttledHitCount = useThrottle(hitCount, 3000);

  // throttledHitCount가 변할 때만 실행
  const prevThrottledRef = useRef(throttledHitCount);

  useEffect(() => {
    if (!enabled) return;

    // 초기 렌더 또는 값 변화 없으면 패스
    if (throttledHitCount === prevThrottledRef.current) return;

    prevThrottledRef.current = throttledHitCount;
    onHit();
  }, [throttledHitCount, enabled, onHit]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!enabled) return;
        const entry = entries[0];
        if (entry?.isIntersecting) {
          // 닿을 때마다 카운트 +1
          setHitCount((c) => c+1);
        }
      },
      {
        root: root ?? undefined,
        rootMargin,
        threshold: 0,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, enabled]);

  return ref;
}