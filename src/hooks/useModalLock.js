import { useEffect } from "react";

// Shared by every full-screen overlay (ProductDetailSheet, SendModal,
// PartyModal): Escape closes it, and the page behind can't scroll while
// it's open — restored the instant it unmounts, whichever way it closed.
export function useModalLock(onClose) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);
}
