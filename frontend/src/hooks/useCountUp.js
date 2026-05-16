import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

/**
 * Hook: count up from 0 to `to` when the element is in view.
 * Returns [value, ref]. Attach the ref to the element you want to observe.
 */
export default function useCountUp(to, { duration = 1.8, delay = 0, decimals = 0, suffix = "", prefix = "" } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            const controls = animate(0, to, {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
              onUpdate: (v) => setValue(v),
            });
            return () => controls.stop();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, delay]);

  const formatted = `${prefix}${decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}${suffix}`;
  return [formatted, ref];
}
