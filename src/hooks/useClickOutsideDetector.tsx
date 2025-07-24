import { useEffect, RefObject } from "react";

function useClickOutsideDetector(
  ref: RefObject<HTMLElement | null>,
  onClickOutside: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside, {
      capture: true,
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
    };
  }, [ref, onClickOutside]);
}

export default useClickOutsideDetector;
