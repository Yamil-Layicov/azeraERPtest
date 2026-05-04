import { useEffect, type RefObject } from "react";

type Event = MouseEvent | TouchEvent;

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  handler: (event: Event) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: Event) => {
      const el = ref?.current;
      
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
};