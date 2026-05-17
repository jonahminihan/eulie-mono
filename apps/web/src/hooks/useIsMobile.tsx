import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Create event listener
    const handleResize = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Listen for changes
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return isMobile;
};
